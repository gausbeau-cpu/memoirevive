const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [320, 360, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 640 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Click the hero button or card button to open modal
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await b.innerText().catch(() => '');
      if (text.includes('Choisir ce format') || text.includes('Aperçu gratuit')) {
        await b.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(500);

    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (!modal) return null;
      const inputs = Array.from(modal.querySelectorAll('input, textarea, select')).map(i => ({
        tag: i.tagName,
        fontSize: window.getComputedStyle(i).fontSize,
        height: Math.round(i.getBoundingClientRect().height),
        placeholder: i.placeholder || i.name || '',
      }));
      const btnList = Array.from(modal.querySelectorAll('button')).map(b => ({
        text: (b.innerText || '').slice(0, 30).replace(/\n/g, ' '),
        width: Math.round(b.getBoundingClientRect().width),
        height: Math.round(b.getBoundingClientRect().height),
      }));
      const texts = Array.from(modal.querySelectorAll('*')).filter(el => {
        return el.children.length === 0 && el.innerText && el.innerText.trim();
      }).map(el => ({
        text: el.innerText.trim().slice(0, 30),
        fontSize: window.getComputedStyle(el).fontSize,
      })).filter(t => parseFloat(t.fontSize) < 11.5);
      return { inputs, btnList, texts };
    });

    console.log(`=== MODAL @ ${width}px ===`);
    console.log(JSON.stringify(modalInfo, null, 2));
    await page.close();
  }
  await browser.close();
})();
