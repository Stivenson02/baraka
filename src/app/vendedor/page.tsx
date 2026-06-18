import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getSellerMe } from "@/services/seller-auth.service";
import { mockFeaturedProducts, mockMetrics } from "@/lib/seller-dashboard-mock";
import { brandAssets } from "@/lib/brand";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function VendedorPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_seller_access")?.value;

  if (!accessToken) redirect("/login/vendedor");

  const { data } = await getSellerMe(accessToken);
  const { user } = data;

  const displayName = user.profile
    ? `${user.profile.firstName ?? ""} ${user.profile.lastName ?? ""}`.trim() || user.username
    : user.username;

  const lastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-brand-text">
          Bienvenido, {displayName.split(" ")[0]}
        </h1>
        <p className="text-sm text-brand-muted mt-0.5">
          {user.sellerCode && <>Código {user.sellerCode} · </>}
          {user.email}
          {lastLogin && <> · Último ingreso: {lastLogin}</>}
        </p>
      </div>

      {/* Construction banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#4B1677]/8 border border-[#4B1677]/15 px-4 py-3">
        <Zap className="size-5 text-brand-purple-dark shrink-0" />
        <p className="text-sm text-brand-purple-dark font-medium">
          Dashboard en preparación — pronto verás tus ventas, comisiones y metas en tiempo real.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Ventas del mes"
          value={formatCOP(mockMetrics.monthSales)}
          icon={ShoppingCart}
          accentClass="text-brand-purple-dark"
          bgClass="bg-accent"
          note="En preparación"
        />
        <MetricCard
          label="Comisión estimada"
          value={formatCOP(mockMetrics.monthCommission)}
          icon={BarChart3}
          accentClass="text-brand-orange"
          bgClass="bg-orange-50"
          note="En preparación"
        />
        <MetricCard
          label="Pedidos referidos"
          value={String(mockMetrics.referredOrders)}
          icon={TrendingUp}
          accentClass="text-brand-purple-dark"
          bgClass="bg-accent"
          note="En preparación"
        />
        <MetricCard
          label="Meta mensual"
          value={formatCOP(mockMetrics.monthGoalTarget)}
          icon={Target}
          accentClass="text-brand-orange"
          bgClass="bg-orange-50"
          note="En preparación"
        />
      </div>

      {/* Goal progress */}
      <div className="mb-6 bg-white rounded-xl border border-black/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-brand-text">Meta del mes</h2>
          <span className="text-xs text-brand-muted">
            {mockMetrics.goalProgress}% completado
          </span>
        </div>
        <div className="h-2 bg-brand-soft rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-orange rounded-full transition-all"
            style={{ width: `${mockMetrics.goalProgress}%` }}
          />
        </div>
        <p className="text-xs text-brand-muted mt-2">
          Meta: {formatCOP(mockMetrics.monthGoalTarget)} · Tus resultados se actualizarán cuando
          tengas ventas registradas.
        </p>
      </div>

      {/* Featured products */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-brand-text">Productos para vender</h2>
          <span className="text-xs text-brand-muted bg-brand-soft px-2 py-0.5 rounded-full">
            Próximamente catálogo completo
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockFeaturedProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-xl border border-black/5 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted">{product.category}</span>
                <span className="text-xs bg-accent text-brand-purple-dark px-2 py-0.5 rounded-full font-medium">
                  {product.badge}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                  <Package className="size-5 text-brand-muted" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{product.name}</p>
                  <p className="text-sm text-brand-orange font-medium">{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-black/5 p-5">
        <h2 className="text-sm font-semibold text-brand-text mb-3">Actividad reciente</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="relative h-10 w-28 mb-4 opacity-20">
            <Image src={brandAssets.isotipo} alt="" fill className="object-contain" />
          </div>
          <p className="text-sm text-brand-muted">Sin actividad registrada aún.</p>
          <p className="text-xs text-brand-muted/70 mt-1">
            Aquí verás tus ventas y pedidos referidos.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accentClass,
  bgClass,
  note,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accentClass: string;
  bgClass: string;
  note?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-4 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center`}>
        <Icon className={`size-5 ${accentClass}`} />
      </div>
      <div>
        <p className="text-xs text-brand-muted">{label}</p>
        <p className="text-lg font-bold text-brand-text mt-0.5">{value}</p>
        {note && <p className="text-xs text-brand-muted/60 mt-0.5">{note}</p>}
      </div>
    </div>
  );
}
