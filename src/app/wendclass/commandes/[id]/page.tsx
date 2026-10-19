"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Layers,
  Truck,
  Image as ImageIcon,
  AlertCircle,
  Save,
  Maximize2,
  X,
  Download,
  Copy,
  Check,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice, formatBurkinaWhatsAppPhone } from "@/lib/utils";
import { AdminOrder, OrderStatus } from "@/lib/admin-db";

const ALL_STATUSES: {
  id: OrderStatus;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { id: "nouvelle", label: "Nouvelle", icon: Clock, color: "text-amber-400" },
  {
    id: "apercu_envoye",
    label: "Aperçu envoyé",
    icon: Send,
    color: "text-sky-400",
  },
  {
    id: "validee_payee",
    label: "Validée & Payée",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    id: "en_impression",
    label: "En fabrication",
    icon: Layers,
    color: "text-purple-400",
  },
  { id: "livree", label: "Livrée", icon: Truck, color: "text-pink-400" },
  { id: "refusee", label: "Refusée", icon: XCircle, color: "text-rose-400" },
];

export default function OrderDetailPage() {

  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status modification state
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("nouvelle");
  const [statusComment, setStatusComment] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Preview upload state
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrlInput, setPreviewUrlInput] = useState("");
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy link and copy text state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Lightbox Modal for full image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleCopyText = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/wendclass/commandes/${orderId}`);
      if (!res.ok) {
        setError("Impossible de trouver cette commande.");
        return;
      }
      const data = await res.json();
      setOrder(data.order);
      setSelectedStatus(data.order.statut);
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/wendclass/commandes/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statut: newStatus,
          commentaire: statusComment.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSelectedStatus(data.order.statut);
        setStatusComment("");
      }
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePreviewUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewFile && !previewUrlInput.trim()) return;

    setUploadingPreview(true);
    try {
      const formData = new FormData();
      if (previewFile) {
        formData.append("file", previewFile);
      } else if (previewUrlInput.trim()) {
        formData.append("url", previewUrlInput.trim());
      }

      const res = await fetch(
        `/api/wendclass/commandes/${orderId}/preview`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setSelectedStatus(data.order.statut);
        setPreviewFile(null);
        setPreviewUrlInput("");
      }
    } catch (err) {
      console.error("Erreur upload aperçu:", err);
    } finally {
      setUploadingPreview(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#150F1B] flex items-center justify-center text-stone-400 text-sm">
        Chargement de la commande {orderId}...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 min-h-screen bg-[#150F1B] p-8 flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="text-stone-300 text-base">{error || "Commande introuvable."}</p>
        <Link
          href="/wendclass/commandes"
          className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  const publicToken = order.lienPublic || order.id;
  const siteBaseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || "https://memoirevive.bf");
  const publicPreviewUrl = `${siteBaseUrl}/apercu/${publicToken}`;

  const formattedPhone = formatBurkinaWhatsAppPhone(order.clientTelephone);
  const firstName = order.clientNom.trim().split(" ")[0] || order.clientNom;

  const whatsappGeneralUrl = `https://wa.me/${formattedPhone}?text=Bonjour%20${encodeURIComponent(
    firstName
  )}%20%F0%9F%91%8B%20C%27est%20M%C3%A9moire%20Vive%20concernant%20ton%20tableau%20photo%20(${order.id}).`;

  const whatsappSendPreviewMessage = `Bonjour ${firstName} 👋 Ton tableau photo d’anniversaire chez Mémoire Vive est prêt ! Découvre ton aperçu ici : ${publicPreviewUrl}\n\nTu ne paies que si le résultat te plaît. 0 FCFA d'avance, aucun risque 💜`;

  const whatsappSendPreviewUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    whatsappSendPreviewMessage
  )}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(publicPreviewUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#150F1B]">
      <AdminHeader
        title={`Commande ${order.id}`}
        subtitle={`${order.clientNom} · ${order.clientQuartier}`}
        actions={
          <Link
            href="/wendclass/commandes"
            className="flex items-center gap-1.5 px-3.5 min-h-[44px] rounded-xl bg-[#241B2E] border border-purple-500/20 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux commandes</span>
          </Link>
        }
      />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Summary Bar */}
        <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge statut={order.statut} size="lg" />
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Créée le{" "}
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Download original button */}
            <a
              href={`/api/wendclass/commandes/${order.id}/download?type=originale`}
              download
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#150F1B] border border-white/10 hover:border-purple-500/30 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
              title="Télécharger la photo originale client sur ton ordinateur"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger l'originale</span>
            </a>

            {/* WhatsApp Send Preview (visible when preview is ready) */}
            {order.photoApercuUrl && (
              <a
                href={whatsappSendPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-hover text-white font-bold text-xs shadow-glow-purple transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Envoyer l'aperçu par WhatsApp</span>
              </a>
            )}

            {/* General WhatsApp client message */}
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Client</span>
            </a>
          </div>
        </div>

        {/* 2-Column Grid: Left (Photos & Retouch), Right (Workflow & Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Creation instructions, Photos comparison & Upload aperçu) - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bloc « Création du tableau » pour le retoucheur */}
            <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-brand-purple/30 shadow-[0_4px_25px_rgba(124,58,237,0.15)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <h2 className="font-heading text-base font-bold text-white">
                    Création du tableau · Consignes studio
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-purple/20 text-[#A78BFA] border border-brand-purple/40">
                    {order.forfaitFormat} · {order.forfaitNom}
                  </span>
                  {order.echeance === "cette_semaine" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      ⚡ Cette semaine
                    </span>
                  ) : order.echeance === "ce_mois" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-stone-300 border border-white/10">
                      Ce mois
                    </span>
                  ) : order.echeance === "plus_tard" ? (
                    <span className="text-xs text-stone-400">Plus tard</span>
                  ) : null}
                </div>
              </div>

              {/* Message à écrire sur la photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Texte à intégrer sur la photo :
                  </span>
                  {order.texteAEcrire && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(order.texteAEcrire!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#150F1B] hover:bg-white/10 text-brand-purple hover:text-white text-xs font-bold transition-colors border border-purple-500/30"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Texte copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le texte</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {order.texteAEcrire ? (
                  <div className="p-4 rounded-2xl bg-[#150F1B] border border-white/10 text-[#F5F0FA] font-medium text-sm sm:text-base leading-relaxed select-all">
                    « {order.texteAEcrire} »
                  </div>
                ) : order.laisserProposerTexte ? (
                  <div className="p-4 rounded-2xl bg-[#150F1B] border border-purple-500/30 text-[#A78BFA] text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Le studio propose un texte : le client souhaite une suggestion personnalisée.</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#150F1B] text-stone-500 text-xs italic">
                    Aucun texte spécifié.
                  </div>
                )}
              </div>

              {/* Note d'occasion client si renseignée */}
              {order.occasionNote && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Précisions ou occasion :
                  </span>
                  <p className="text-xs text-stone-300 italic">
                    « {order.occasionNote} »
                  </p>
                </div>
              )}
            </div>

            {/* Photos Viewer Card */}
            <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
              <h2 className="font-heading text-base font-bold text-[#F5F0FA] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-purple" />
                <span>Photos de la Commande</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Original Client Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                    <span>Photo Originale Client</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/wendclass/commandes/${order.id}/download?type=originale`}
                        download
                        className="text-stone-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                        title="Télécharger l'image originale client"
                      >
                        <Download className="w-3 h-3" />
                        <span>Télécharger</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setLightboxImage(order.photoOriginaleUrl)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px]"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Agrandir</span>
                      </button>
                    </div>
                  </div>
                  <div
                    onClick={() => setLightboxImage(order.photoOriginaleUrl)}
                    className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 cursor-pointer group shadow-sm"
                  >
                    <img
                      src={order.photoOriginaleUrl}
                      alt="Originale"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      <span>Cliquer pour voir plein écran</span>
                    </div>
                  </div>
                </div>

                {/* 2. Retouched Preview Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                    <span>Aperçu Retouché (Studio)</span>
                    {order.photoApercuUrl && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`/api/wendclass/commandes/${order.id}/download?type=apercu`}
                          download
                          className="text-stone-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                          title="Télécharger l'aperçu retouché studio"
                        >
                          <Download className="w-3 h-3" />
                          <span>Télécharger</span>
                        </a>
                        <a
                          href={`/apercu/${publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px]"
                          title="Voir la page publique client"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Page client</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setLightboxImage(order.photoApercuUrl!)}
                          className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px]"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Agrandir</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-900 border border-purple-500/20 shadow-sm flex items-center justify-center">
                    {order.photoApercuUrl ? (
                      <div
                        onClick={() => setLightboxImage(order.photoApercuUrl!)}
                        className="w-full h-full cursor-pointer group relative"
                      >
                        <img
                          src={order.photoApercuUrl}
                          alt="Aperçu Studio"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-brand-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Prêt
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-xs text-stone-400">
                          Aucun aperçu retouché n'a encore été téléversé.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Public Preview Link Card (When Preview is Ready) */}
              {order.photoApercuUrl && (
                <div className="p-4 rounded-2xl bg-[#150F1B] border border-purple-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      <span>Lien d'aperçu public sécurisé (sans compte)</span>
                    </span>
                    <a
                      href={`/apercu/${publicToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <span>Tester la vue client</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={publicPreviewUrl}
                      className="flex-1 bg-[#1F1728] border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le lien</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={whatsappSendPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-hover hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple transition-transform hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                    <span>Ouvrir WhatsApp avec le message d'aperçu pré-rempli</span>
                  </a>
                </div>
              )}

              {/* Upload Dropzone for Retouched Image */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Uploader un nouvel aperçu retouché
                </h3>

                <form onSubmit={handlePreviewUpload} className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-500/30 hover:border-brand-purple bg-[#150F1B] rounded-2xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-brand-purple mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-[#F5F0FA]">
                      {previewFile
                        ? `Fichier sélectionné : ${previewFile.name}`
                        : "Cliquez pour choisir le fichier HD retouché"}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      JPG, PNG, WebP (Portrait retouché avec message intégré)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      value={previewUrlInput}
                      onChange={(e) => setPreviewUrlInput(e.target.value)}
                      placeholder="Ou collez directement une URL d'image (ex: Unsplash / Cloudinary)..."
                      className="flex-1 bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-2.5 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple"
                    />
                    <button
                      type="submit"
                      disabled={
                        uploadingPreview ||
                        (!previewFile && !previewUrlInput.trim())
                      }
                      className="px-4 py-2.5 min-h-[48px] rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold shadow-sm transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      <span>{uploadingPreview ? "Envoi..." : "Enregistrer"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column (Workflow Status Transitions, Details, Timeline) - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Workflow Progression & Actions */}
            <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
              <h2 className="font-heading text-base font-bold text-[#F5F0FA]">
                Workflow & Changement de Statut
              </h2>

              <p className="text-xs text-stone-400">
                Faites progresser la commande à l'étape suivante :
              </p>

              {/* Quick Status Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {ALL_STATUSES.map((st) => {
                  const isCurrent = order.statut === st.id;
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleStatusUpdate(st.id)}
                      className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-brand-purple text-white border-brand-purple shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                          : "bg-[#150F1B] border-white/10 hover:border-purple-500/30 text-stone-300 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isCurrent ? "text-white" : st.color
                        }`}
                      />
                      <span className="truncate">{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Comment for Timeline */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Note d'historique <span className="text-stone-600">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Ex: Validation accord client par téléphone..."
                  className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-2.5 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>

            {/* 2. Order & Client Details */}
            <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
              <h2 className="font-heading text-base font-bold text-[#F5F0FA]">
                Détails du Forfait & Livraison
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Forfait choisi :</span>
                  <span className="font-bold text-[#A78BFA]">
                    {order.forfaitNom}
                  </span>
                </div>

                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Format & Support :</span>
                  <span className="font-semibold text-stone-200">
                    {order.forfaitFormat} · Panneau PVC rigide
                  </span>
                </div>

                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Prix total :</span>
                  <span className="font-bold text-amber-400 text-sm font-heading">
                    {formatPrice(order.forfaitPrix)}
                  </span>
                </div>

                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Client :</span>
                  <span className="font-bold text-[#F5F0FA]">
                    {order.clientNom}
                  </span>
                </div>

                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Téléphone WhatsApp :</span>
                  <a
                    href={`tel:${order.clientTelephone}`}
                    className="font-mono font-bold text-emerald-400 hover:underline"
                  >
                    {order.clientTelephone}
                  </a>
                </div>

                <div className="flex justify-between pb-2.5 border-b border-white/5">
                  <span className="text-stone-400">Quartier :</span>
                  <span className="font-semibold text-stone-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-magenta" />
                    <span>{order.clientQuartier}, Ouagadougou</span>
                  </span>
                </div>

                {order.clientAdresseDetails && (
                  <div className="flex justify-between pb-2.5 border-b border-white/5">
                    <span className="text-stone-400">Repère livraison :</span>
                    <span className="font-medium text-stone-300 text-right max-w-xs">
                      {order.clientAdresseDetails}
                    </span>
                  </div>
                )}

                {order.modePaiement && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Paiement :</span>
                    <span className="font-bold text-emerald-400 capitalize">
                      {order.modePaiement.replace("_", " ")}{" "}
                      {order.referencePaiement && `(${order.referencePaiement})`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Timeline / Status History */}
            <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
              <h2 className="font-heading text-base font-bold text-[#F5F0FA]">
                Historique & Horodatage
              </h2>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {order.historique?.map((h, i) => (
                  <div key={h.id || i} className="relative group">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-purple ring-4 ring-[#241B2E] shadow-sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge statut={h.nouveauStatut} size="sm" />
                        <span className="text-xs text-stone-400 font-mono">
                          {new Date(h.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {h.commentaire && (
                        <p className="text-xs text-stone-300 mt-1 leading-snug">
                          {h.commentaire}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer l'image"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Agrandissement"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
}
