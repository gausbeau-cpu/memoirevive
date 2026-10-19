import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const VIEWPORTS = [320, 360, 390, 412, 768, 1024, 1280];
const HERO_VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
];

const PAGES_TO_TEST = [
  { name: 'Accueil', path: '/' },
  { name: 'Conditions Générales', path: '/conditions-generales' },
  { name: 'Politique de Confidentialité', path: '/politique-de-confidentialite' },
  { name: 'Aperçu Commande', path: '/apercu/10377dac-4648-4038-9187-e4a573a95bd0' },
  { name: 'Admin Login', path: '/wendclass/login' },
  { name: 'Admin Dashboard', path: '/wendclass', authRequired: true },
  { name: 'Admin Commandes', path: '/wendclass/commandes', authRequired: true },
  { name: 'Admin Clients', path: '/wendclass/clients', authRequired: true },
  { name: 'Admin Commande Détail', path: '/wendclass/commandes/7bd12c47-a61b-4523-a994-7b6d2b00a9bc', authRequired: true },
];

interface AuditFinding {
  type: 'horizontal_scroll' | 'overflow_element' | 'touch_target_small' | 'font_input_small' | 'font_text_small' | 'cls' | 'hero_visibility';
  page: string;
  width: number;
  height?: number;
  element?: string;
  details: string;
  selector?: string;
  rect?: { x: number; y: number; width: number; height: number };
  value?: number;
}

const allFindings: AuditFinding[] = [];
let adminCookieToken = '';

test.describe('Audit Mobile-First — Mémoire Vive', () => {
  test.beforeAll(async ({ request }) => {
    try {
      const loginRes = await request.post('/api/wendclass/auth/login', {
        data: {
          email: 'wendclasss@gmail.com',
          password: 'MemoireVive2026!Securise',
        },
      });
      const headers = loginRes.headers();
      const setCookie = headers['set-cookie'] || '';
      const match = setCookie.match(/mv_admin_session=([^;]+)/);
      if (match) {
        adminCookieToken = match[1];
        console.log('Admin session cookie retrieved successfully.');
      } else {
        console.warn('Could not extract admin cookie token from headers:', setCookie);
      }
    } catch (err) {
      console.error('Failed to pre-authenticate admin:', err);
    }
  });

  test.afterAll(() => {
    const reportPath = path.join(__dirname, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(allFindings, null, 2), 'utf-8');
    console.log(`\n=== AUDIT RESULTS SAVED: ${allFindings.length} findings recorded in ${reportPath} ===\n`);
  });

  for (const pageDef of PAGES_TO_TEST) {
    for (const width of VIEWPORTS) {
      test(`Audit ${pageDef.name} @ ${width}px`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width, height: 800 },
        });

        if (pageDef.authRequired && adminCookieToken) {
          await context.addCookies([
            {
              name: 'mv_admin_session',
              value: adminCookieToken,
              domain: 'localhost',
              path: '/',
            },
          ]);
        }

        const page = await context.newPage();

        // Setup CLS listener before navigation
        await page.addInitScript(() => {
          (window as any).__cls = 0;
          try {
            const observer = new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  (window as any).__cls += (entry as any).value;
                }
              }
            });
            observer.observe({ type: 'layout-shift', buffered: true });
          } catch (e) {}
        });

        await page.goto(pageDef.path, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(600); // Allow animations & layout to settle

        const auditData = await page.evaluate(({ pagePath, currentWidth }) => {
          const findings: any[] = [];
          const winWidth = window.innerWidth;
          const docScrollWidth = document.documentElement.scrollWidth;

          // 1. Horizontal Scroll
          if (docScrollWidth > winWidth) {
            findings.push({
              type: 'horizontal_scroll',
              page: pagePath,
              width: currentWidth,
              details: `document.scrollWidth (${docScrollWidth}px) > window.innerWidth (${winWidth}px). Débordement de ${docScrollWidth - winWidth}px.`,
              value: docScrollWidth - winWidth,
            });
          }

          // Helper to get descriptive selector
          const getSelector = (el: Element): string => {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? `#${el.id}` : '';
            const cls = typeof el.className === 'string' && el.className.trim()
              ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
              : '';
            return `${tag}${id}${cls}`;
          };

          const isVisible = (el: HTMLElement) => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          };

          // 2. Elements overflowing viewport bounds
          const allElements = Array.from(document.querySelectorAll('body *')) as HTMLElement[];
          const seenOverflows = new Set<string>();

          for (const el of allElements) {
            if (!isVisible(el)) continue;
            // Ignore SVG inner shapes
            if (['svg', 'path', 'g', 'circle', 'line', 'rect', 'defs'].includes(el.tagName.toLowerCase())) continue;
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              const sel = getSelector(el);
              const snippet = (el.innerText || el.getAttribute('aria-label') || '').slice(0, 40).replace(/\n/g, ' ');
              const key = `${sel}_${Math.round(rect.right)}`;
              if (!seenOverflows.has(key)) {
                seenOverflows.add(key);
                findings.push({
                  type: 'overflow_element',
                  page: pagePath,
                  width: currentWidth,
                  selector: sel,
                  element: snippet ? `"${snippet}"` : sel,
                  details: `Élément déborde: right=${Math.round(rect.right)}px, left=${Math.round(rect.left)}px (viewport=${winWidth}px)`,
                  rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                });
              }
            }
          }

          // 3. Interactive Touch Targets < 44x44px
          const interactives = Array.from(
            document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]')
          ) as HTMLElement[];

          const seenTargets = new Set<string>();
          for (const el of interactives) {
            if (!isVisible(el)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width < 43.5 || rect.height < 43.5) {
              const sel = getSelector(el);
              const text = (el.innerText || el.getAttribute('aria-label') || (el as HTMLInputElement).placeholder || (el as HTMLInputElement).value || '').slice(0, 35).replace(/\n/g, ' ');
              const key = `${sel}_${Math.round(rect.x)}_${Math.round(rect.y)}`;
              if (!seenTargets.has(key)) {
                seenTargets.add(key);
                findings.push({
                  type: 'touch_target_small',
                  page: pagePath,
                  width: currentWidth,
                  selector: sel,
                  element: text ? `"${text}"` : sel,
                  details: `Cible tactile trop petite: ${Math.round(rect.width)}x${Math.round(rect.height)}px (attendu >= 44x44px)`,
                  rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                });
              }
            }
          }

          // 4. Typography sizes
          // 4a. Form fields < 16px
          const formInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea')) as HTMLElement[];
          for (const input of formInputs) {
            if (!isVisible(input)) continue;
            const style = window.getComputedStyle(input);
            const size = parseFloat(style.fontSize);
            if (size < 15.5) {
              const sel = getSelector(input);
              const placeholder = (input as HTMLInputElement).placeholder || input.getAttribute('name') || '';
              findings.push({
                type: 'font_input_small',
                page: pagePath,
                width: currentWidth,
                selector: sel,
                element: placeholder ? `Champ "${placeholder}"` : sel,
                details: `Taille police champ: ${size}px (< 16px requis pour éviter zoom iOS)`,
                value: size,
              });
            }
          }

          // 4b. Legitimate small text < 12px (captions/mentions)
          const leafNodes: HTMLElement[] = [];
          for (const el of allElements) {
            if (!isVisible(el)) continue;
            if (el.children.length === 0 && el.innerText && el.innerText.trim().length > 0) {
              leafNodes.push(el);
            }
          }

          const seenTexts = new Set<string>();
          for (const el of leafNodes) {
            const style = window.getComputedStyle(el);
            const size = parseFloat(style.fontSize);
            if (size < 11.5) { // less than 12px
              const text = el.innerText.trim().slice(0, 35);
              if (!seenTexts.has(text)) {
                seenTexts.add(text);
                findings.push({
                  type: 'font_text_small',
                  page: pagePath,
                  width: currentWidth,
                  selector: getSelector(el),
                  element: `"${text}"`,
                  details: `Taille police texte: ${size}px (< 12px minimum)`,
                  value: size,
                });
              }
            }
          }

          // 5. CLS
          const cls = (window as any).__cls || 0;
          if (cls > 0.05) {
            findings.push({
              type: 'cls',
              page: pagePath,
              width: currentWidth,
              details: `CLS cumulatif trop élevé: ${cls.toFixed(3)} (> 0.05)`,
              value: cls,
            });
          }

          return findings;
        }, { pagePath: pageDef.path, currentWidth: width });

        for (const f of auditData) {
          allFindings.push(f);
        }

        await context.close();
      });
    }
  }

  // 6. Test Hero Visibility at 360x640 and 390x844
  for (const vp of HERO_VIEWPORTS) {
    test(`Hero visibility @ ${vp.width}x${vp.height}px`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();
      await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(600);

      const heroCheck = await page.evaluate(({ vh }) => {
        const issues: any[] = [];
        const h1 = document.querySelector('h1');
        // Main CTA button in hero:
        const cta = document.querySelector('main a[href="#offres"], main a[href="#formats"], main button, [data-hero-cta]');

        if (h1) {
          const r = h1.getBoundingClientRect();
          if (r.bottom > vh) {
            issues.push({
              target: 'Titre H1 du Hero',
              bottom: Math.round(r.bottom),
              vh,
              overflow: Math.round(r.bottom - vh),
            });
          }
        } else {
          issues.push({ target: 'Titre H1', error: 'Non trouvé' });
        }

        if (cta) {
          const r = cta.getBoundingClientRect();
          if (r.bottom > vh) {
            issues.push({
              target: 'Bouton principal du Hero',
              bottom: Math.round(r.bottom),
              vh,
              overflow: Math.round(r.bottom - vh),
            });
          }
        } else {
          issues.push({ target: 'Bouton Hero CTA', error: 'Non trouvé' });
        }

        return issues;
      }, { vh: vp.height });

      for (const issue of heroCheck) {
        allFindings.push({
          type: 'hero_visibility',
          page: '/',
          width: vp.width,
          height: vp.height,
          element: issue.target,
          details: issue.overflow
            ? `${issue.target} dépasse la hauteur visible: bas à ${issue.bottom}px pour un écran de ${vp.height}px (+${issue.overflow}px sous la ligne de flottaison)`
            : (issue.error || 'Visibilité non conforme'),
        });
      }

      await context.close();
    });
  }
});
