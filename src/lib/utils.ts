import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
}

/**
 * Normalise un numéro de téléphone burkinabè pour l'API WhatsApp (wa.me).
 * Supprime espaces, tirets, symboles et assure le préfixe 226 sans le signe + ni indicatif 00.
 * Exemple: "+226 70 12 34 56" -> "22670123456"
 * Exemple: "76 98 76 54" -> "22676987654"
 */
export function formatBurkinaWhatsAppPhone(rawPhone: string): string {
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("00226")) {
    digits = digits.slice(2);
  } else if (!digits.startsWith("226")) {
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    digits = `226${digits}`;
  }
  return digits;
}

