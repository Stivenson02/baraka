---
name: plans
description: "Crea planes de desarrollo estructurados para BARAKA en `plans/` antes de implementar cambios. Usar cuando el desarrollador escriba `/plan`, `/plans`, `plan`, `plans`, crea un plan, haz un plan, planea esto o pida planificar una mejora de landing, ecommerce, B2C, B2B, Aliadas BARAKA, branding, UI o arquitectura. Solo planifica: no implementa codigo de aplicacion."
---

# Plans

Convierte una descripcion de tarea en una carpeta de plan para BARAKA. La skill solo crea o actualiza Markdown dentro de `plans/<slug>/`; no modifica `src/`, `public/`, configuracion, componentes ni codigo de aplicacion.

## Contexto BARAKA

BARAKA es un ecommerce / marketplace colombiano con enfoque B2C y B2B. Vende productos de marcas reconocidas, principalmente hogar, cocina, electrodomesticos, productos utiles, aspiracionales y de buena calidad. Tambien tiene una red controlada de Aliadas BARAKA para vender productos, cumplir metas y ganar beneficios.

Propuesta comercial:

- "BARAKA provee facil, rapido y seguro."
- "Todo lo que buscas, mas cerca de ti."
- "Productos de valor para hogares, negocios y aliadas."
- "Compra facil. Vende mejor. Crece con respaldo."

## Flujo

1. Capturar la descripcion de la tarea. Si falta objetivo, audiencia o seccion afectada, preguntar antes de planear.
2. Leer contexto real del repo antes de escribir: `src/app`, `src/components`, `src/components/sections`, `src/components/layout`, `src/components/ui`, `src/lib`, `public/brand`, `app/globals.css` o `src/app/globals.css` segun aplique.
3. Revisar rama con `git rev-parse --abbrev-ref HEAD` y estado con `git status --short`.
4. No crear rama automaticamente. Si el usuario pide rama, sugerir `feature/<slug>` o `fix/<slug>` segun la tarea.
5. Nombrar carpeta del plan en kebab-case: `plans/<slug>/`.
6. Si la carpeta existe con contenido, no sobrescribir. Preguntar si se debe agregar archivo, usar sufijo o reemplazar.
7. Generar plan dividido por investigacion, ejecucion y validacion.
8. Dejar validacion final obligatoria con `npm run build`.

## Estructura del plan

Todo plan debe incluir:

- `README.md`: objetivo, alcance, referencias y convenciones BARAKA.
- `01-investigation.md`: archivos a revisar y decisiones a confirmar.
- `02-execution.md`: pasos de implementacion por UI, datos mockup, componentes y estilos.
- `03-validation.md`: build, revision visual y checklist.
- `EXECUTION-LOG.md`: bitacora append-only vacia con encabezado.

Para tareas grandes, dividir `02-execution.md` en archivos como `02-design-system.md`, `03-sections.md`, `04-commerce-ui.md`, `05-validation.md`.

## Reglas visuales de marca

Usar la paleta oficial:

- Morado principal: `#6D28D9`.
- Morado oscuro premium: `#4B1677`.
- Morado hover / botones: `#7C3AED`.
- Naranja comercial: `#F59E0B`.
- Rosado moderno: `#EC4899`.
- Texto principal: `#111827`.
- Texto secundario: `#6B7280`.
- Fondo suave: `#F6F7F9`.
- Blanco: `#FFFFFF`.

Gradiente permitido para hero, banners y botones premium:

```css
linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #EC4899 100%)
```

Principios:

- Usar mucho blanco, aire y jerarquia clara.
- Usar morado como protagonista, sin saturar toda la pagina.
- Usar naranja para CTAs comerciales, descuentos, promociones, badges y "Comprar ahora".
- Usar rosado solo como acento B2C moderno.
- Mantener cards blancas, bordes limpios y sombras suaves.
- Evitar paginas recargadas, genericas o con apariencia de marketplace barato.

## Uso de logos e imagenes

Assets esperados en `public/brand`:

- `logo.png`: header/navbar.
- `favicon.ico`: favicon del proyecto.
- `apilada.png`: secciones institucionales o centradas.
- `isotipo.png`: icono de marca, badges, cards y elementos visuales.
- `logoFull.png`: hero, footer o presentacion completa de marca.
- `wordmark.png`: nombre BARAKA sin isotipo.

No deformar logos. Usar `next/image`, `object-contain`, espacios generosos y fondos que mantengan contraste.

## Componentes y estructura

Estructura recomendada:

- `src/app`: rutas App Router, layout y estilos globales.
- `src/components/ui`: componentes shadcn/ui.
- `src/components/layout`: header, footer, navegacion y estructuras persistentes.
- `src/components/sections`: secciones de landing y paginas comerciales.
- `src/lib`: constantes de marca, mock data y utilidades.
- `public/brand`: recursos graficos BARAKA.

Usar shadcn/ui para botones, cards, badges, inputs, sheet, dropdown-menu, navigation-menu y separator. Usar `lucide-react` para iconos. Mantener TypeScript estricto, componentes pequenos y datos mockup centralizados cuando sea razonable.

## Reglas para landing y ecommerce

- La primera pantalla debe presentar BARAKA como marketplace confiable y nacional.
- Header con logo horizontal, links simulados y CTAs "Comprar ahora" y "Quiero vender".
- Hero con frase fuerte, subtitulo comercial y CTAs sin redireccionamientos hasta que exista funcionalidad.
- Beneficios claros: facil compra, productos confiables, precios competitivos, entrega rapida y aliadas.
- Categorias destacadas: hogar, cocina, electrodomesticos, ofertas y productos para emprender.
- Productos destacados pueden ser mockup; no inventar backend, checkout, auth ni base de datos.
- Badges de descuento y promociones deben usar naranja.

## Futuras secciones B2C, B2B y Aliadas

- B2C: cercano, aspiracional sin exagerar, enfocado en confianza y valor.
- B2B: sobrio, solido, con mensajes de disponibilidad, respaldo y volumen.
- Aliadas BARAKA: red interna controlada, organizada, con metas, beneficios y acompanamiento.
- Dashboard de aliadas futuro: morado oscuro dominante, barras de progreso en naranja y gradientes suaves.

## Tono de comunicacion

Usar tono claro, cercano, comercial, confiable, aspiracional sin exagerar y profesional. Evitar exageraciones vacias, urgencia agresiva, lenguaje de tienda improvisada o copy que suene a marketplace chino barato.

## Checklist antes de entregar cambios planificados

- [ ] El plan reviso archivos reales antes de proponer cambios.
- [ ] Mantiene BARAKA premium, moderna, confiable y comercial.
- [ ] Usa blanco y fondos suaves como base visual.
- [ ] No satura de morado.
- [ ] Usa naranja solo para activadores comerciales.
- [ ] Usa rosado solo como acento.
- [ ] Respeta logos y assets en `public/brand`.
- [ ] No propone backend, auth, checkout ni base de datos si no fue pedido.
- [ ] Mantiene estructura `src/components/layout`, `src/components/sections`, `src/components/ui`, `src/lib`.
- [ ] Cierra con validacion `npm run build`.

## Reporte final al usar la skill

Responder con:

- Carpeta creada: `plans/<slug>/`.
- Archivos generados y objetivo de cada uno.
- Referencias revisadas.
- Siguiente paso recomendado para ejecutar el plan.

## Reglas duras

- Nunca escribir codigo de aplicacion desde esta skill.
- Nunca copiar reglas de otros proyectos como Lukran o QFS.
- Nunca omitir investigacion, ejecucion, validacion ni `EXECUTION-LOG.md`.
- Nunca crear backend, auth, checkout, base de datos, seed o integraciones desde un plan visual inicial.
- Nunca sobrescribir planes existentes sin confirmacion.
- Nunca cerrar sin incluir `npm run build` como validacion final obligatoria.
