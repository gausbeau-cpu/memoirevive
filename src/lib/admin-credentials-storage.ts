import fs from "fs";
import path from "path";
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "./admin-auth";

const CONFIG_FILE_PATH = path.resolve(process.cwd(), ".admin-auth.json");
const ENV_LOCAL_PATH = path.resolve(process.cwd(), ".env.local");

export interface AdminCredentials {
  email: string;
  password: string;
  updatedAt?: string;
}

/**
 * Récupère les identifiants administrateur actuels (mot de passe / code de connexion).
 * Priorité :
 * 1. Fichier de persistance local (.admin-auth.json)
 * 2. Variables d'environnement (process.env.ADMIN_PASSWORD / ADMIN_EMAIL)
 * 3. Valeurs par défaut sécurisées
 */
export function getStoredAdminCredentials(): AdminCredentials {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.password === "string" && parsed.password.length > 0) {
        return {
          email: (parsed.email || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(),
          password: String(parsed.password),
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (err) {
    console.error("[admin-credentials-storage] Erreur lecture .admin-auth.json:", err);
  }

  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(),
    password: String(process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD),
  };
}

/**
 * Met à jour le code de connexion administrateur et synchronise la persistance.
 */
export function saveStoredAdminCredentials(newPassword: string, newEmail?: string): void {
  const current = getStoredAdminCredentials();
  const updatedEmail = (newEmail || current.email).trim().toLowerCase();
  const updatedPassword = String(newPassword);
  const now = new Date().toISOString();

  // 1. Sauvegarder dans .admin-auth.json
  const data: AdminCredentials = {
    email: updatedEmail,
    password: updatedPassword,
    updatedAt: now,
  };

  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[admin-credentials-storage] Erreur écriture .admin-auth.json:", err);
  }

  // 2. Mettre à jour process.env en mémoire
  process.env.ADMIN_PASSWORD = updatedPassword;
  process.env.ADMIN_EMAIL = updatedEmail;

  // 3. Mettre à jour .env.local si existant pour rechargement pérenne
  try {
    if (fs.existsSync(ENV_LOCAL_PATH)) {
      let envContent = fs.readFileSync(ENV_LOCAL_PATH, "utf8");

      if (envContent.includes("ADMIN_PASSWORD=")) {
        envContent = envContent.replace(
          /ADMIN_PASSWORD=.*/g,
          `ADMIN_PASSWORD=${updatedPassword}`
        );
      } else {
        envContent += `\nADMIN_PASSWORD=${updatedPassword}\n`;
      }

      if (newEmail) {
        if (envContent.includes("ADMIN_EMAIL=")) {
          envContent = envContent.replace(
            /ADMIN_EMAIL=.*/g,
            `ADMIN_EMAIL=${updatedEmail}`
          );
        } else {
          envContent += `\nADMIN_EMAIL=${updatedEmail}\n`;
        }
      }

      fs.writeFileSync(ENV_LOCAL_PATH, envContent, "utf8");
    }
  } catch (err) {
    console.error("[admin-credentials-storage] Erreur mise à jour .env.local:", err);
  }
}
