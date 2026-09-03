"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { AdminOrder, OrderStatus } from "@/lib/admin-db";

const STATUS_FILTERS: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "nouvelle", label: "Nouvelles" },
  { id: "apercu_envoye", label: "Aperçu envoyé" },
  { id: "validee_payee", label: "Validées & Payées" },
  { id: "en_impression", label: "En impression" },
  { id: "livree", label: "Livrées" },
  { id: "refusee", label: "Refusées" },
];

export default function AdminOrdersListPage() {

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/wendclass/commandes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Erreur chargement commandes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(orders.length / pageSize) || 1;
  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#150F1B]">
      <AdminHeader
        title="Gestion des Commandes"
        subtitle="Visualisez, traitez et suivez l'avancement de toutes les commandes"
        actions={
          <button
            onClick={fetchOrders}
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
        {/* Filter and Search Bar */}
        <div className="bg-[#241B2E] rounded-3xl p-4 sm:p-6 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-md"
            >
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher nom, téléphone (+226...), quartier, réf..."
                className="w-full bg-[#150F1B] border border-purple-500/20 rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#F5F0FA] placeholder:text-stone-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
              />
            </form>

            <div className="text-xs text-stone-400 font-semibold flex items-center gap-1">
              <ShoppingBag className="w-4 h-4 text-brand-purple" />
              <span>
                {orders.length} commande{orders.length > 1 ? "s" : ""} trouvée
                {orders.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1 border-t border-white/5">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1 hidden sm:block" />
            {STATUS_FILTERS.map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                      : "bg-[#150F1B] text-stone-400 hover:text-white border border-white/5 hover:border-purple-500/20"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#241B2E] rounded-3xl border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#1A1322] text-stone-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Photo & Réf</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Forfait</th>
                  <th className="py-4 px-4">Quartier & Note</th>
                  <th className="py-4 px-4">Statut</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-stone-400 text-sm"
                    >
                      Aucune commande ne correspond aux filtres sélectionnés.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                            {order.photoOriginaleUrl ? (
                              <img
                                src={order.photoOriginaleUrl}
                                alt="Photo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-600">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            {order.photoApercuUrl && (
                              <div
                                title="Aperçu prêt"
                                className="absolute bottom-0 inset-x-0 bg-brand-purple text-[8px] font-bold text-center text-white py-0.5"
                              >
                                HD
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-stone-300 block">
                              {order.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-[#F5F0FA]">
                          {order.clientNom}
                        </div>
                        <div className="text-xs text-stone-400 font-mono mt-0.5">
                          {order.clientTelephone}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#A78BFA] block">
                          {order.forfaitNom}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-400">
                          {formatPrice(order.forfaitPrix)}
                        </span>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-stone-300 font-semibold truncate">
                          {order.clientQuartier}
                        </div>
                        {order.occasionNote && (
                          <div
                            className="text-[11px] text-stone-400 truncate italic mt-0.5"
                            title={order.occasionNote}
                          >
                            « {order.occasionNote} »
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge statut={order.statut} size="sm" />
                      </td>

                      <td className="py-4 px-4 text-xs text-stone-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/wendclass/commandes/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-bold transition-all border border-brand-purple/30 group-hover:scale-105"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Gérer</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-400">
              <span>
                Page {currentPage} sur {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-[#150F1B] border border-white/10 hover:border-purple-500/30 text-stone-300 disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#150F1B] border border-white/10 hover:border-purple-500/30 text-stone-300 disabled:opacity-30 flex items-center gap-1"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
