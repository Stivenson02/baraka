---
name: baraka-backend
description: Arquitectura backend para BARAKA con Next.js App Router, rutas API server-side, seguridad de formularios, Cloudflare Turnstile y llamadas firmadas a Lukran. Usar cuando se creen o modifiquen endpoints en `src/app/api`, servicios en `src/services`, clientes de integracion en `src/lib`, validaciones de formularios o flujos que comuniquen BARAKA con Lukran.
---

# Baraka Backend

## Principios

Mantener BARAKA como frontend publico con una capa backend propia en Next.js. No llamar Lukran desde componentes cliente ni exponer `LUKRAN_SECRET_KEY`, `LUKRAN_PUBLIC_KEY` o secretos de formulario al navegador.

Antes de editar codigo backend, revisar la guia local de Next.js indicada por `AGENTS.md` en `node_modules/next/dist/docs/` para confirmar convenciones vigentes de Route Handlers en esta version.

## Estructura Esperada

Crear backend con esta separacion:

- `src/app/api/**/route.ts`: recibe requests publicos de Baraka, valida seguridad, normaliza errores y responde JSON.
- `src/services/*.service.ts`: encapsula operaciones contra Lukran o logica de caso de uso.
- `src/lib/lukranClient.ts`: cliente unico para HMAC, timeout, headers y parseo de errores.
- `src/lib/errors/AppError.ts` y `src/lib/errors/handleApiError.ts`: errores tipados y respuesta consistente.
- `src/lib/turnstile.ts`: validacion server-side contra Cloudflare Turnstile.
- `src/lib/contact-security.ts`: origen permitido, honeypot, token de intencion y timing anti-bot.
- `src/types/*.type.ts`: contratos compartidos si el payload crece.

Usar el patron de QFS como referencia de arquitectura, no copiar texto a ciegas. El flujo debe quedar adaptado a nombres y rutas de BARAKA.

## Integracion Lukran

Lukran local vive en `http://localhost:3000` y BARAKA en `http://localhost:3003`.

Variables esperadas:

- `URL_API_LK`
- `LUKRAN_PUBLIC_KEY`
- `LUKRAN_SECRET_KEY`
- `TURNSTILE_SECRET_KEY`
- `CONTACT_FORM_SECRET`
- `CONTACT_FORM_ALLOWED_ORIGINS`

Firmar requests a Lukran con:

- `x-lukran-public`: public key.
- `x-lukran-timestamp`: epoch en segundos.
- `x-lukran-signature`: HMAC SHA-256 de `${timestamp}.${bodyString}` usando `LUKRAN_SECRET_KEY`.
- `x-lukran-client-ip`: solo cuando aplique para rate limit o trazabilidad.

El cliente debe usar `cache: "no-store"`, timeout con `AbortController` y transformar errores de Lukran a `AppError`.

## Solicitudes De Asociadas

Para "Quiero vender", BARAKA debe exponer una ruta propia, por ejemplo:

- `POST /api/seller-applications`

La ruta de BARAKA debe validar:

- origen permitido con `CONTACT_FORM_ALLOWED_ORIGINS`;
- token Turnstile obligatorio;
- honeypot (`website`) vacio;
- `formStartedAt` con minimo aproximado de 2.5 segundos;
- token de intencion firmado con `CONTACT_FORM_SECRET`;
- rate limit simple por IP;
- payload requerido antes de llamar Lukran.

Despues de validar, llamar a Lukran:

- `POST /api/connect/v1/external-users/applications`

Payload aceptado por Lukran:

- `firstName` requerido.
- `middleName` opcional.
- `lastName` requerido.
- `secondLastName` opcional.
- `documentType` requerido, uno de `NIT`, `CC`, `CE`, `PASSPORT`, `DNI`, `RUT`, `PPT`, `PEP`, `OTHER`.
- `documentNumber` requerido.
- `email` requerido y valido.
- `phone` requerido, normalizable a 7-15 digitos.
- `address` requerido.
- `cityId` opcional.

Lukran rechaza duplicados activos por correo o documento y responde `409` con codigos como `EXTERNAL_APPLICATION_DUPLICATED` o `EXTERNAL_USER_ALREADY_EXISTS`.

## Seguridad

No confiar en validacion de cliente. El captcha, origen, honeypot, timing y payload se validan en server.

No guardar secretos en componentes cliente. Solo `NEXT_PUBLIC_TURNSTILE_SITE_KEY` puede llegar al browser.

Mantener mensajes de error utiles para UI, pero sin filtrar secretos, headers firmados ni detalles internos de Lukran.

## Validacion

Despues de cambios backend ejecutar:

- `npm run lint`
- `npm run build`

No levantar servidor automaticamente; el usuario lo maneja en puerto `3003`.
