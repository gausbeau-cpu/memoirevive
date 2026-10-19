import { test, expect } from '@playwright/test';

test.describe('Admin Password Change API & Security', () => {
  const originalPassword = 'MemoireVive2026!Securise';
  const temporaryPassword = 'NouveauCodeTest2026!Securise';

  test('1. Rejette la modification sans session authentifiée (401)', async ({ request }) => {
    const res = await request.post('/api/wendclass/auth/change-password', {
      data: {
        currentPassword: 'any',
        newPassword: 'any',
      },
    });
    expect(res.status()).toBe(401);
  });

  test('2. Cycle complet de modification, rejet d’ancien code et connexion avec le nouveau code', async ({
    request,
  }) => {
    // Étape A: Connexion avec le mot de passe initial
    const loginRes = await request.post('/api/wendclass/auth/login', {
      data: {
        email: 'wendclasss@gmail.com',
        password: originalPassword,
      },
    });
    expect(loginRes.ok()).toBeTruthy();

    const cookieHeader = loginRes.headers()['set-cookie'] || '';
    const match = cookieHeader.match(/mv_admin_session=([^;]+)/);
    expect(match).toBeTruthy();
    const sessionToken = match![1];

    // Étape B: Rejet si mot de passe actuel erroné (400)
    const wrongCurrentRes = await request.post('/api/wendclass/auth/change-password', {
      headers: {
        Cookie: `mv_admin_session=${sessionToken}`,
      },
      data: {
        currentPassword: 'WrongPassword123',
        newPassword: temporaryPassword,
        confirmPassword: temporaryPassword,
      },
    });
    expect(wrongCurrentRes.status()).toBe(400);

    // Étape C: Rejet si confirmation ne correspond pas (400)
    const mismatchRes = await request.post('/api/wendclass/auth/change-password', {
      headers: {
        Cookie: `mv_admin_session=${sessionToken}`,
      },
      data: {
        currentPassword: originalPassword,
        newPassword: temporaryPassword,
        confirmPassword: 'DifferentPassword123',
      },
    });
    expect(mismatchRes.status()).toBe(400);

    // Étape D: Succès de la mise à jour vers le nouveau mot de passe
    const successChangeRes = await request.post('/api/wendclass/auth/change-password', {
      headers: {
        Cookie: `mv_admin_session=${sessionToken}`,
      },
      data: {
        currentPassword: originalPassword,
        newPassword: temporaryPassword,
        confirmPassword: temporaryPassword,
      },
    });
    expect(successChangeRes.ok()).toBeTruthy();

    // Étape E: L’ancien mot de passe ne permet plus de se connecter (401)
    const oldLoginFail = await request.post('/api/wendclass/auth/login', {
      data: {
        email: 'wendclasss@gmail.com',
        password: originalPassword,
      },
    });
    expect(oldLoginFail.status()).toBe(401);

    // Étape F: Le nouveau mot de passe permet de se connecter avec succès
    const newLoginSuccess = await request.post('/api/wendclass/auth/login', {
      data: {
        email: 'wendclasss@gmail.com',
        password: temporaryPassword,
      },
    });
    expect(newLoginSuccess.ok()).toBeTruthy();
    const newCookie = newLoginSuccess.headers()['set-cookie'] || '';
    const newSessionToken = newCookie.match(/mv_admin_session=([^;]+)/)![1];

    // Étape G: Rétablissement propre du mot de passe d’origine pour préserver l’état
    const restoreRes = await request.post('/api/wendclass/auth/change-password', {
      headers: {
        Cookie: `mv_admin_session=${newSessionToken}`,
      },
      data: {
        currentPassword: temporaryPassword,
        newPassword: originalPassword,
        confirmPassword: originalPassword,
      },
    });
    expect(restoreRes.ok()).toBeTruthy();

    // Étape H: Vérification finale que le mot de passe d’origine est à nouveau fonctionnel
    const finalLogin = await request.post('/api/wendclass/auth/login', {
      data: {
        email: 'wendclasss@gmail.com',
        password: originalPassword,
      },
    });
    expect(finalLogin.ok()).toBeTruthy();
  });
});
