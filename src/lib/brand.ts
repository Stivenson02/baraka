import {
  BadgeCheck,
  Building2,
  Gamepad2,
  Handshake,
  Home,
  Laptop,
  PackageCheck,
  Refrigerator,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Truck,
  Users,
  WashingMachine,
} from "lucide-react";

export const brandAssets = {
  logo: "/brand/logo.png",
  logoFull: "/brand/logoFull.png",
  apilada: "/brand/apilada.png",
  isotipo: "/brand/isotipo.png",
  wordmark: "/brand/wordmark.png",
};

export const navItems = [
  { label: "Nosotros", href: "/baraka" },
  { label: "Empresas", href: "/empresas" },
  { label: "Contactanos", href: "/#contacto" },
];

export const commerceCategories = [
  { name: "Electrohogar", icon: Refrigerator },
  { name: "Tecnologia", icon: Laptop },
  { name: "Lavado", icon: WashingMachine },
  { name: "Hogar", icon: Home },
  { name: "Ofertas", icon: Tag },
  { name: "Juegos y premios", icon: Gamepad2 },
];

export const ecommerceProducts = [
  {
    name: "Combo cocina inteligente",
    category: "Hogar",
    price: 489900,
    beforePrice: 629900,
    badge: "Mas vendido",
    color: "bg-[#FDF2F8]",
  },
  {
    name: "Freidora digital familiar",
    category: "Cocina",
    price: 319900,
    beforePrice: 399900,
    badge: "20% OFF",
    color: "bg-[#FFF7ED]",
  },
  {
    name: "Set organizador premium",
    category: "Hogar",
    price: 159900,
    beforePrice: 219900,
    badge: "Oferta BARAKA",
    color: "bg-[#F5F0FF]",
  },
  {
    name: "Licuadora alto rendimiento",
    category: "Electro",
    price: 249900,
    beforePrice: 329900,
    badge: "Nuevo",
    color: "bg-[#ECFEFF]",
  },
];

export const promoBanners = [
  {
    title: "Ofertas de lanzamiento",
    description: "Precios especiales para activar las primeras compras del marketplace.",
    cta: "Ver ofertas",
    href: "/#ofertas",
  },
  {
    title: "Vende con BARAKA",
    description: "Abre tu solicitud y prepara tu catalogo para vender con respaldo.",
    cta: "Quiero vender",
    href: "#quiero-vender",
  },
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
