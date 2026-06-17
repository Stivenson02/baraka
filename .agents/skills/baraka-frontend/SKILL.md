---
name: baraka-frontend
description: Diseno frontend, UX y componentes de BARAKA en Next.js con identidad visual de marca, shadcn/ui, lucide-react y assets en `public/brand`. Usar cuando se creen o modifiquen secciones, modales, formularios, header, landing, ecommerce, flujo "Quiero vender", login de clientes/asociadas o cualquier UI publica de Baraka.
---

# Baraka Frontend

## Identidad

BARAKA debe sentirse moderno, confiable, comercial y colombiano. Priorizar claridad, aire, buen contraste y una experiencia premium sin recargar la pantalla.

Usar los tokens ya definidos en `src/app/globals.css`:

- Morado principal: `#6D28D9` / `brand-purple`.
- Morado oscuro: `#4B1677` / `brand-purple-dark`.
- Hover morado: `#7C3AED` / `brand-purple-hover`.
- Naranja comercial: `#F59E0B` / `brand-orange`.
- Rosado acento: `#EC4899` / `brand-pink`.
- Texto: `#111827` / `brand-text`.
- Texto secundario: `#6B7280` / `brand-muted`.
- Fondo suave: `#F6F7F9` / `brand-soft`.

Usar el gradiente solo en CTAs premium, hero o acentos fuertes:

```css
linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)
```

## Assets De Marca

Los assets viven en `public/brand` y estan centralizados en `src/lib/brand.ts`:

- `logo.png`: header/navbar.
- `logoFull.png`: hero o presentacion principal.
- `apilada.png`: secciones institucionales.
- `isotipo.png`: iconos de marca, badges o bloques visuales.
- `wordmark.png`: footer, bloques oscuros o marca horizontal.

Usar `next/image`, `object-contain`, tamanos estables y no deformar logos.

## Componentes

Respetar la estructura actual:

- `src/components/layout`: header, footer y elementos persistentes.
- `src/components/sections`: bloques de landing y ecommerce.
- `src/components/ui`: shadcn/ui.
- `src/lib/brand.ts`: textos, iconos y datos mockup reutilizables.

Usar `lucide-react` para iconos. Preferir componentes pequenos y enfocados. Mantener cards con radio sobrio (`rounded-lg` o menor) y evitar secciones completas metidas dentro de cards anidadas.

## Flujo Quiero Vender

El CTA `Quiero vender`, `Ser aliada BARAKA` o `Quiero vender con BARAKA` debe abrir un modal o dialog de solicitud, no navegar a una pagina muerta.

El formulario debe pedir, como minimo:

- nombres y apellidos;
- tipo y numero de documento;
- correo;
- celular;
- direccion;
- ciudad si existe selector real o `cityId` opcional si todavia no hay catalogo;
- Turnstile visible cuando exista `NEXT_PUBLIC_TURNSTILE_SITE_KEY`;
- honeypot oculto `website`;
- `formStartedAt` seteado al montar el formulario.

Estados esperados:

- idle;
- enviando con spinner;
- exito con mensaje claro de revision de solicitud;
- error duplicado o validacion;
- captcha expirado/error.

El cliente solo debe enviar a una ruta propia de BARAKA, por ejemplo `POST /api/seller-applications`. No llamar Lukran directamente desde UI.

## Login Separado

BARAKA tendra flujos distintos:

- clientes: login de comprador/cliente.
- asociadas/vendedoras: login externo asociado a Lukran.
- usuarios internos con usuario y contrasena: login operativo separado.

No mezclar labels ni endpoints entre estos flujos. Si una pantalla todavia no tiene backend, dejar la UI preparada con copy honesto y sin simular autenticacion real.

## Validacion Visual

Despues de cambios frontend ejecutar:

- `npm run lint`
- `npm run build`

No ejecutar `npm run dev`; el usuario levanta BARAKA en el puerto `3003`.
