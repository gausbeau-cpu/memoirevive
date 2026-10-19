"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  MapPin,
  Calendar,
  X,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { ClientSummary, AdminOrder } from "@/lib/admin-db";

export default function AdminClientsPage() {

  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(
    null
  );

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wendclass/stats");
      if (res.ok) {
        // En alternative directe, on peut appeler stats ou un endpoint dédié
        const ordersRes = await fetch("/api/wendclass/commandes");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const allOrders: AdminOrder[] = ordersData.orders || [];

          const map = new Map<string, ClientSummary>();
          allOrders.forEach((order) => {
            const phone = order.clientTelephone.trim();
            if (!map.has(phone)) {
              map.set(phone, {
                telephone: phone,
                nom: order.clientNom,
                quartierPrincipal: order.clientQuartier,
                totalCommandes: 0,
                totalDepense: 0,
                derniereCommandeDate: order.createdAt,
                commandes: [],
              });
            }
            const c = map.get(phone)!;
            c.totalCommandes += 1;
            if (
              ["validee_payee", "en_impression", "livree"].includes(
                order.statut
              )
            ) {
              c.totalDepense += order.forfaitPrix;
            }
            if (new Date(order.createdAt) > new Date(c.derniereCommandeDate)) {
              c.derniereCommandeDate = order.createdAt;
              c.nom = order.clientNom;
              c.quartierPrincipal = order.clientQuartier;
            }
            c.commandes.push(order);
          });

          setClients(
            Array.from(map.values()).sort(
              (a, b) => b.totalDepense - a.totalDepense
            )
          );
        }
      }
    } catch (err) {
      console.error("Erreur chargement clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.telephone.toLowerCase().includes(search.toLowerCase()) ||
      c.quartierPrincipal.toLowerCase().includes(search.toLowerCase())
  );

  const totalClients = clients.length;
  const totalRevenueAllClients = clients.reduce(
    (sum, c) => sum + c.totalDepense,
    0
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#150F1B]">
      <AdminHeader
        title="Historique Clients"
        subtitle="Suivi des clients fidèles regroupés par numéro WhatsApp"
        actions={
          <button
            onClick={fetchClients}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#241B2E] border border-purple-500/20 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Summary & Search */}
        <div className="bg-[#241B2E] rounded-3xl p-4 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, téléphone (+226...), quartier..."
                className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-3 pl-10 min-h-[48px] text-base text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
              />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-stone-400">
                <strong className="text-[#F5F0FA] font-heading text-sm font-bold">
                  {totalClients}
                </strong>{" "}
                clients uniques
              </span>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-stone-400">
                Total CA clients :{" "}
                <strong className="text-amber-400 font-heading text-sm font-bold">
                  {formatPrice(totalRevenueAllClients)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-[#241B2E] rounded-3xl border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Mobile Cards View (< 768px) */}
          <div className="block md:hidden divide-y divide-white/5">
            {filteredClients.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                Aucun client trouvé.
              </div>
            ) : (
              filteredClients.map((client) => {
                const cleanPhone = client.telephone.replace(/[^0-9]/g, "");
                const whatsappUrl = `https://wa.me/${cleanPhone}`;
                return (
                  <div
                    key={client.telephone}
                    className="p-4 space-y-3 bg-[#241B2E]"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#F5F0FA] text-base">
                        {client.nom}
                      </div>
                      <span className="font-heading font-black text-amber-400 text-sm">
                        {formatPrice(client.totalDepense)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-300">
                      <span className="font-mono text-emerald-400 font-bold">
                        {client.telephone}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-magenta shrink-0" />
                        <span>{client.quartierPrincipal}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-purple/20 text-[#C4B5FD] text-xs font-bold border border-brand-purple/30">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>
                          {client.totalCommandes} commande
                          {client.totalCommandes > 1 ? "s" : ""}
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-colors"
                          title="Contacter sur WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                          }}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-bold transition-all border border-brand-purple/30"
                        >
                          Historique
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#1A1322] text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Téléphone WhatsApp</th>
                  <th className="py-4 px-4">Quartier Principal</th>
                  <th className="py-4 px-4">Commandes</th>
                  <th className="py-4 px-4">Total Dépensé</th>
                  <th className="py-4 px-4">Dernière Demande</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-stone-400 text-sm"
                    >
                      Aucun client trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const cleanPhone = client.telephone.replace(/[^0-9]/g, "");
                    const whatsappUrl = `https://wa.me/${cleanPhone}`;

                    return (
                      <tr
                        key={client.telephone}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => setSelectedClient(client)}
                      >
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#F5F0FA]">
                            {client.nom}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-mono text-emerald-400 font-bold">
                            {client.telephone}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-stone-300">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-magenta shrink-0" />
                            <span>{client.quartierPrincipal}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-purple/20 text-[#C4B5FD] text-xs font-bold border border-brand-purple/30">
                            <ShoppingBag className="w-3 h-3" />
                            <span>
                              {client.totalCommandes} commande
                              {client.totalCommandes > 1 ? "s" : ""}
                            </span>
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-heading font-black text-amber-400 text-sm">
                            {formatPrice(client.totalDepense)}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-xs text-stone-400 whitespace-nowrap">
                          {new Date(
                            client.derniereCommandeDate
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 flex items-center justify-center transition-colors"
                              title="Contacter sur WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => setSelectedClient(client)}
                              className="px-3 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-bold transition-all border border-brand-purple/30"
                            >
                              Historique
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Client Detail History Modal */}
      {selectedClient && (
        <div
          onClick={() => setSelectedClient(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#241B2E] border border-purple-500/30 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#150F1B]/70">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F5F0FA]">
                  {selectedClient.nom}
                </h3>
                <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                  {selectedClient.telephone} · {selectedClient.quartierPrincipal}
                </p>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Fermer l'historique client"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Client's Orders */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#150F1B] p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[11px] text-stone-400 block font-semibold">
                    Total Commandes
                  </span>
                  <span className="text-lg font-heading font-bold text-[#F5F0FA]">
                    {selectedClient.totalCommandes}
                  </span>
                </div>
                <div className="bg-[#150F1B] p-3.5 rounded-2xl border border-white/5">
                  <span className="text-[11px] text-stone-400 block font-semibold">
                    Total Dépensé (Payé)
                  </span>
                  <span className="text-lg font-heading font-bold text-amber-400">
                    {formatPrice(selectedClient.totalDepense)}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Commandes passées
              </h4>

              <div className="space-y-3">
                {selectedClient.commandes.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#150F1B] border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {order.photoOriginaleUrl && (
                        <img
                          src={order.photoOriginaleUrl}
                          alt="Photo"
                          className="w-12 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-300">
                            {order.id}
                          </span>
                          <StatusBadge statut={order.statut} size="sm" />
                        </div>
                        <p className="font-bold text-xs text-[#A78BFA] mt-1">
                          {order.forfaitNom} ({order.forfaitFormat})
                        </p>
                        <span className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-heading font-bold text-xs text-amber-400 block mb-1">
                        {formatPrice(order.forfaitPrix)}
                      </span>
                      <Link
                        href={`/wendclass/commandes/${order.id}`}
                        onClick={() => setSelectedClient(null)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-purple hover:underline"
                      >
                        <span>Voir</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
