# Business Context

Sinergia es una plataforma para el onbarding de empleados para que tengan todos los activo, oficinas, activos, etc para que comiencen a trabajar y organizar mejor el proceso

## Para vistas:

- debes programar un componente por cada funcionalidad, si es un componente complejo debes programar los subcomponentes (en diferentes archivos) e invocarlos donde sea necesario
- debes usar typescript, evitar any
- debes usar tailwindcss, evitar escribir css directamente
- debes usar el design system de la carpeta "ds"
- no debes crear mocks, toda los componentes deben llamar rutas y APIS
- debes hacer componentes visualmente atractivos, con la linea grafica de empresas como Mobbbin
- No debes editar componentes generales como el Header o Footer o el design system, solo editalos si explicitamente se solicita
- no debes invocar apis directamente, debes registrar el servicio y llamarlo con el hook useApi

## Para APIS

- debes usar la funcion withUser
- debes validar las entradas de datos
- debes solo crear metodos post y recibir todo dentro de { data: X }

## Recomendaciones visuales

Stripe-like
Linear.app style
modern SaaS UI
high whitespace UI

- Debes mantener solo negros o grises

Use a minimalist modern SaaS design system: large bold sans-serif typography, lots of whitespace, soft rounded components, subtle shadows, neutral colors with a single accent color, clean hierarchy and simple layouts.

- Trata de no instalar ninguna libreria, pero si las necesitas, debes usar pnpm
