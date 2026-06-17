import {
  BadgeCheck,
  Building2,
  Handshake,
  Home,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Truck,
  Users,
} from "lucide-react";

export const brandAssets = {
  logo: "/brand/logo.png",
  logoFull: "/brand/logoFull.png",
  apilada: "/brand/apilada.png",
  isotipo: "/brand/isotipo.png",
  wordmark: "/brand/wordmark.png",
};

export const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Aliadas BARAKA", href: "/#aliadas" },
  { label: "Para empresas", href: "/empresas" },
  { label: "Contacto", href: "/#contacto" },
];

export const benefits = [
  {
    title: "Fácil de comprar",
    description: "Una experiencia clara para descubrir, comparar y elegir productos de valor.",
    icon: ShoppingBag,
  },
  {
    title: "Productos confiables",
    description: "Marcas aliadas, selección cuidada y una propuesta comercial con respaldo.",
    icon: BadgeCheck,
  },
  {
    title: "Precios competitivos",
    description: "Ofertas activas y condiciones pensadas para hogares, negocios y aliadas.",
    icon: Tag,
  },
  {
    title: "Entrega rápida",
    description: "Un modelo preparado para proveer fácil, rápido y seguro.",
    icon: Truck,
  },
  {
    title: "Aliadas BARAKA",
    description: "Una red organizada para vender mejor, cumplir metas y crecer con compañía.",
    icon: Users,
  },
];

export const categories = [
  { name: "Hogar", description: "Soluciones útiles para vivir mejor.", icon: Home },
  { name: "Cocina", description: "Productos prácticos para todos los días.", icon: Store },
  { name: "Electrodomésticos", description: "Equipos confiables para el hogar.", icon: PackageCheck },
  { name: "Ofertas", description: "Descuentos y oportunidades comerciales.", icon: Tag },
  { name: "Productos para emprender", description: "Selección pensada para vender y rotar.", icon: Handshake },
];

export const featuredProducts = [
  {
    title: "Producto destacado",
    label: "En tendencia",
    price: "$189.900",
    description: "Artículo premium para el hogar con alta intención de compra.",
  },
  {
    title: "Precio especial",
    label: "15% OFF",
    price: "$129.900",
    description: "Oferta comercial ideal para campañas B2C y venta por aliadas.",
  },
  {
    title: "Nuevo en BARAKA",
    label: "Nuevo",
    price: "$249.900",
    description: "Producto aspiracional con respaldo de marca aliada.",
  },
];

export const commercePillars = [
  { title: "B2C cercano", description: "Compra fácil para hogares colombianos.", icon: Sparkles },
  { title: "B2B sólido", description: "Disponibilidad y respaldo para empresas.", icon: Building2 },
  { title: "Venta guiada", description: "Aliadas internas con metas y beneficios.", icon: Handshake },
];
