"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Send,
  CheckCircle2,
  Layers,
  Truck,
  XCircle,
  ArrowRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import OrdersChart from "@/components/admin/OrdersChart";
import { formatPrice } from "@/lib/utils";
import { AdminOrder } from "@/lib/admin-db";

export default function AdminDashboardPage() {

  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wendclass/stats");
      if (res.ok) {
        const data = await res.json();
        setStatsData(data.stats);
      }
    } catch (err) {
      console.error("Erreur chargement stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#150F1B]">
      <AdminHeader
        title="Tableau de bord"
        subtitle="Aperçu des performances, encaissements et commandes en cours"
        actions={
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#241B2E] border border-purple-500/20 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
            title="Actualiser les données"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Financial & Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Chiffre d'Affaires Total"
            value={formatPrice(statsData?.totalRevenue ?? 0)}
            subtitle="Commandes validées, en impression & livrées"
            icon={DollarSign}
            accentColor="gold"
          />

          <StatCard
            title="CA du Mois en Cours"
            value={formatPrice(statsData?.currentMonthRevenue ?? 0)}
            subtitle="Encaissements Mobile Money du mois"
            icon={TrendingUp}
            accentColor="emerald"
            trend="+100% après aperçu"
          />

          <StatCard
            title="Total Commandes Reçues"
            value={statsData?.totalOrdersCount ?? 0}
            subtitle="Toutes finitions et statuts confondus"
            icon={Layers}
            accentColor="purple"
          />
        </div>

        {/* 6 Status Overview Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-base sm:text-lg font-bold text-[#F5F0FA]">
              Commandes par Statut
            </h2>
            <Link
              href="/wendclass/commandes"
              className="text-xs font-semibold text-brand-purple hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#241B2E] p-4 rounded-2xl border border-amber-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-400">
                  Nouvelle
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.nouvelle ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">À retoucher</span>
            </div>

            <div className="bg-[#241B2E] p-4 rounded-2xl border border-sky-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-sky-400">
                  Aperçu envoyé
                </span>
                <Send className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.apercu_envoye ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">
                Attente accord client
              </span>
            </div>

            <div className="bg-[#241B2E] p-4 rounded-2xl border border-emerald-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400">
                  Validée & Payée
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.validee_payee ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">Paiement reçu</span>
            </div>

            <div className="bg-[#241B2E] p-4 rounded-2xl border border-purple-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#A78BFA]">
                  En impression
                </span>
                <Layers className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.en_impression ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">Atelier cadre</span>
            </div>

            <div className="bg-[#241B2E] p-4 rounded-2xl border border-pink-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-pink-400">
                  Livrée
                </span>
                <Truck className="w-4 h-4 text-pink-400" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.livree ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">
                Ouagadougou livrée
              </span>
            </div>

            <div className="bg-[#241B2E] p-4 rounded-2xl border border-rose-500/20 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-400">
                  Refusée
                </span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-2xl font-bold font-heading text-[#F5F0FA]">
                {statsData?.statusCounts?.refusee ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 mt-1">
                0F facturé (garantie)
              </span>
            </div>
          </div>
        </div>

        {/* 30-Day Activity Chart */}
        <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-7 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-[#F5F0FA]">
                Activité des 30 Derniers Jours
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Volume de commandes quotidiennes reçues sur le site
              </p>
            </div>
          </div>

          <OrdersChart data={statsData?.chartData || []} />
        </div>

        {/* 5 Most Recent Orders */}
        <div className="bg-[#241B2E] rounded-3xl p-5 sm:p-7 border border-purple-500/15 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-[#F5F0FA]">
                Dernières Commandes Reçues
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Les 5 demandes les plus récentes en attente ou en cours
              </p>
            </div>

            <Link
              href="/wendclass/commandes"
              className="text-xs font-semibold text-brand-purple hover:text-purple-300 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#150F1B] border border-purple-500/20 transition-all hover:scale-105"
            >
              <span>Toutes les commandes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Réf</th>
                  <th className="pb-3 px-3">Client</th>
                  <th className="pb-3 px-3">Forfait</th>
                  <th className="pb-3 px-3">Quartier</th>
                  <th className="pb-3 px-3">Statut</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {statsData?.recentOrders?.map((order: AdminOrder) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-3.5 px-3 font-mono text-xs text-stone-400 font-bold">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#F5F0FA]">
                      <div>{order.clientNom}</div>
                      <div className="text-[11px] text-stone-400 font-normal">
                        {order.clientTelephone}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#A78BFA]">
                        {order.forfaitNom}
                      </span>
                      <span className="block text-[11px] text-stone-400">
                        {formatPrice(order.forfaitPrix)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-300">
                      {order.clientQuartier}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge statut={order.statut} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/wendclass/commandes/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-semibold transition-all border border-brand-purple/30"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ouvrir</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
