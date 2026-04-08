# Documento de Ingeniería de Software
# Sistema de Gestión de Onboarding — Sinergia Financiera

---

| Campo              | Detalle                                    |
| ------------------ | ------------------------------------------ |
| **Proyecto**       | Sinergia — Onboarding Management           |
| **Cliente**        | Sinergia Financiera                        |
| **Empresa**        | WeCoding                                   |
| **Líder Técnico**  | Juan David Restrepo Montoya                |
| **Fecha**          | Abril 2026                                 |
| **Estado**         | **Finalizado — Aprobado por el cliente**   |

---

## 1. Descripción General del Sistema

Sinergia es una plataforma web interna, **desarrollada y entregada en su totalidad**, que centraliza y automatiza el proceso de incorporación (onboarding) de nuevos colaboradores. Reemplaza la coordinación manual entre áreas operativas por flujos digitales que garantizan que el empleado disponga de todos los activos, accesos y formación necesarios desde su primer día.

El sistema articula cuatro áreas operativas (TI, Dotación, Servicios Generales y Formación), permite el seguimiento del estado de cada solicitud, genera un Acta de Entrega firmada digitalmente, y produce reportes de eficiencia por área.

---

## 2. Arquitectura del Sistema

### 2.1 Patrón arquitectónico

El sistema sigue una arquitectura **full-stack monorepo** basada en Next.js 15 con App Router. La separación de responsabilidades se organiza en capas:

```
Capa de Vista       → app/dashboard/*  (React Client Components)
Capa de Servicios   → app/services/*   (funciones de llamada al API)
Capa de API         → app/api/*        (Route Handlers de Next.js)
Capa de Datos       → db/models/*      (modelos Sequelize / MySQL)
```

Cada petición desde el cliente fluye así:

```
Componente React
  └─► useApi(serviceFn)        ← hook genérico con loading/error
       └─► postRequest(path)   ← serializa y envía la petición HTTP
            └─► API Route      ← withUser() valida la sesión JWT
                 └─► Modelo Sequelize → MySQL
```

### 2.2 Decisiones de diseño clave

- **Todas las rutas API son `POST`**. El payload viaja dentro de `{ data: {...} }` para mantener una interfaz uniforme.
- **Autenticación por cookie HTTP-only** con JWT firmado. El middleware de Next.js protege las rutas del dashboard.
- **Soft-delete en usuarios** (`paranoid: true` en Sequelize): el campo `deletedAt` preserva la integridad referencial sin eliminar registros físicamente.
- **Validación con Zod** en el servidor para cada endpoint.

---

## 3. Stack Tecnológico

| Capa                 | Tecnología                                    |
| -------------------- | --------------------------------------------- |
| Framework            | Next.js 15.4 (App Router) + React 19          |
| Lenguaje             | TypeScript (strict mode)                      |
| Estilos              | Tailwind CSS 3.4 + Framer Motion              |
| ORM                  | Sequelize 6.37                                |
| Base de datos        | MySQL 8 (hosteada en servidor GCP)            |
| Autenticación        | JWT (`jsonwebtoken`) + bcryptjs               |
| Email                | Resend API                                    |
| Generación de PDF    | Puppeteer                                     |
| Inteligencia Artif.  | Google Gemini API                             |
| Almacenamiento       | AWS SDK (archivos multimedia)                 |
| Gestor de paquetes   | pnpm                                          |
| Despliegue           | Vercel                                        |

---

## 4. Módulos Implementados

### 4.1 Módulo de Autenticación

- Login con email y contraseña; la contraseña se almacena hasheada con bcrypt.
- La sesión se mantiene mediante una cookie HTTP-only con JWT.
- El middleware de Next.js intercepta todas las rutas `/dashboard/*` y redirige al login si la sesión es inválida.
- Los endpoints de API están protegidos con los wrappers `withUser()` y `withAdmin()`.

**Rutas:**

| Ruta                | Función                                            |
| ------------------- | -------------------------------------------------- |
| `POST /api/auth/login`  | Valida credenciales, crea cookie JWT           |
| `POST /api/auth/logout` | Elimina la cookie de sesión                    |

---

### 4.2 Módulo de Procesos de Onboarding

Es el módulo central del sistema. Permite crear y gestionar el ciclo de vida completo de un proceso de incorporación.

**Funcionalidades:**

- Crear un proceso con datos del nuevo empleado (nombre, documento, cargo, área, fecha de ingreso, jefe inmediato).
- Al crear el proceso, el sistema dispara automáticamente solicitudes a las áreas operativas según las responsabilidades configuradas.
- El proceso pasa por estados: `Pendiente → En Proceso → Finalizado / Cancelado`.
- La fecha de ingreso puede postergarse, nunca adelantarse.
- Un administrador puede cancelar el proceso si ningún área ha completado sus tareas.

**Rutas:**

| Ruta                               | Función                                         |
| ---------------------------------- | ----------------------------------------------- |
| `POST /api/onboarding/create`      | Crea proceso y dispara solicitudes por área     |
| `POST /api/onboarding/list`        | Lista procesos con filtros                      |
| `POST /api/onboarding/get`         | Detalle completo de un proceso                  |
| `POST /api/onboarding/update`      | Edita datos del proceso                         |
| `POST /api/onboarding/changeStatus`| Cambia estado del proceso                       |
| `POST /api/onboarding/postponeDate`| Posterga la fecha de ingreso                    |
| `POST /api/onboarding/acta`        | Genera el Acta de Entrega                       |

---

### 4.3 Módulo de Solicitudes por Área

Cada área operativa gestiona sus propias solicitudes de forma independiente.

**Funcionalidades:**

- **TI — Requerimientos Técnicos**: el jefe inmediato completa el perfil tecnológico del empleado (tipo de equipo, licencias de software). Los operadores de TI gestionan el aprovisionamiento.
- **Servicios Generales — Puestos de Trabajo**: asignación de puestos físicos de la oficina (estación de trabajo) con estado `Disponible / Asignado`.
- **Dotación — Activos y Uniformes**: seguimiento ítem a ítem de los activos a entregar (equipos, uniformes, útiles, software) con número de serie, talla y estado de entrega.
- **Formación — Plan de Capacitación**: asignación de cursos (virtuales o presenciales) vinculados al cargo del empleado.

**Rutas:**

| Ruta                                   | Función                                    |
| -------------------------------------- | ------------------------------------------ |
| `POST /api/onboarding/workstations`    | Lista puestos disponibles                  |
| `POST /api/onboarding/courses`         | Lista cursos disponibles                   |
| `POST /api/onboarding/positions`       | Lista cargos con requerimientos asociados  |
| `POST /api/onboarding/areas`           | Lista áreas con responsabilidades          |

---

### 4.4 Módulo de Seguimiento y Acta de Entrega

- Consolida la recepción de todos los activos el día de ingreso.
- Genera un **Acta de Entrega en PDF** mediante Puppeteer, con los datos del empleado, los ítems entregados y firma digital.
- Genera un **Carnet de empleado** en formato visual imprimible.

---

### 4.5 Módulo de Usuarios y Áreas

**Usuarios:**

| Ruta                    | Función                              |
| ----------------------- | ------------------------------------ |
| `POST /api/users/create` | Crea usuario (con hash de contraseña) |
| `POST /api/users/list`   | Lista usuarios con área y rol        |
| `POST /api/users/get`    | Obtiene un usuario por ID            |
| `POST /api/users/edit`   | Edita nombre y área                  |
| `POST /api/users/delete` | Soft-delete por ID                   |

**Áreas:**

| Ruta                    | Función                                      |
| ----------------------- | -------------------------------------------- |
| `POST /api/areas/create` | Crea área con director y responsabilidades  |
| `POST /api/areas/list`   | Lista áreas                                 |
| `POST /api/areas/edit`   | Edita área                                  |
| `POST /api/areas/delete` | Elimina área                                |

---

### 4.6 Módulo de Reportes

- Gráficas de eficiencia por área (cumplimiento vs. retrasos).
- Distribución de procesos por estado.
- Métricas de tiempo de respuesta.
- Accesible desde `/dashboard/report`.

---

## 5. Modelo de Base de Datos

```
roles ──────────────┐
                    ├──► users ──────────────────────► onboarding_processes
areas ──────────────┘         └──► areas (director)          │
                                                             ├──► area_requests
positions ──────────────────────────────────────────────────┤
                                                             ├──► technical_requirements
workstations ───────────────────────────────────────────────┤
                                                             ├──► assets_deliveries
courses ────────────────────────────────────────────────────┤
                                                             └──► training_plans
```

**Entidades principales:**

| Tabla                     | Descripción                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `roles`                   | Roles del sistema (Root, Administrador, Jefe Inmediato, Operador)                   |
| `areas`                   | Áreas organizacionales con director asignado                                         |
| `users`                   | Colaboradores con área, rol, contraseña hasheada y soft-delete                      |
| `positions`               | Cargos con cursos sugeridos y jefe inmediato de referencia                          |
| `onboarding_processes`    | Proceso central: datos del empleado, estado, fechas y responsable                   |
| `area_requests`           | Solicitudes generadas automáticamente hacia cada área operativa                     |
| `technical_requirements`  | Especificaciones tecnológicas (equipo, licencias, tallas de dotación)               |
| `workstations`            | Puestos de trabajo físicos con estado Disponible/Asignado                           |
| `assets_deliveries`       | Ítems a entregar (equipos, uniformes, software, papelería) con seguimiento unitario |
| `training_plans`          | Cursos asignados al proceso de onboarding                                           |
| `courses`                 | Catálogo de cursos (virtual/presencial)                                             |

---

## 6. Roles del Sistema

| Rol               | Permisos                                                                             |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Root**          | Crea y gestiona administradores. Acceso total al sistema.                            |
| **Administrador** | Crea, edita y cancela procesos de onboarding. Gestiona usuarios y áreas.            |
| **Jefe Inmediato**| Completa los requerimientos técnicos y de dotación del nuevo empleado.              |
| **Operador**      | Visualiza y actualiza el estado de solicitudes de su área.                          |

---

## 7. Design System

El sistema cuenta con una librería de componentes propia ubicada en `ds/`, inspirada en el estilo visual de Linear y Stripe.

**Componentes disponibles:**

| Componente        | Descripción                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `DS.Button`       | Botón con variantes `primary`, `secondary`, `third`, `neutral`, con loading |
| `DS.Input`        | Campo de texto con label y manejo de error                                  |
| `DS.Select`       | Selector con opciones `{ value, label }[]`                                  |
| `DS.Textarea`     | Área de texto extendida                                                     |
| `DS.Checkbox`     | Control booleano                                                             |
| `DS.File`         | Campo de carga de archivos                                                  |
| `DS.Modal`        | Diálogo con `ref` imperativo (`showModal`, `hideModal`, `putError`)         |
| `DS.Loader`       | Indicador de carga                                                          |

**Principios visuales:**

- Paleta neutral: negros, grises y blancos. Sin colores decorativos.
- Tipografía sans-serif grande y bold para jerarquía clara.
- Alto nivel de espacio en blanco (whitespace) para reducir la carga cognitiva.
- Componentes redondeados con sombras sutiles.
- Un único color de acento por sección.

---

## 8. Estructura de Carpetas

```
sinergia/
├── app/
│   ├── (auth)/login/           # Página de inicio de sesión
│   ├── api/                    # Route Handlers del API
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── users/
│   │   └── areas/
│   ├── dashboard/              # Páginas del panel de administración
│   │   ├── page.tsx            # Listado de procesos de onboarding
│   │   ├── onboarding/[id]/    # Detalle de proceso
│   │   │   ├── components/     # TrainingPlan, Workstation, AssetsDelivery, TechnicalRequirement
│   │   │   ├── acta/[id]/      # Acta de entrega en PDF
│   │   │   └── carnet/[id]/    # Carnet de empleado
│   │   ├── users/              # CRUD de usuarios
│   │   ├── areas/              # CRUD de áreas
│   │   └── report/             # Reportes y métricas
│   ├── services/               # Funciones de llamada al API (cliente)
│   ├── hooks/                  # useApi, useSession
│   ├── components/UI/          # Header, ConfirmToast, Filters
│   └── providers/              # SessionProvider
├── db/
│   ├── conn.ts                 # Instancia de Sequelize
│   └── models/                 # Modelos de datos
├── ds/                         # Design System propio
├── lib/
│   ├── withUser.ts             # Middleware de autenticación
│   ├── response.ts             # Helpers de respuesta HTTP
│   └── sessionServer.ts        # Lectura de sesión en servidor
└── public/                     # Recursos estáticos
```

---

## 9. Cierre del Proyecto

El sistema fue presentado formalmente al cliente **Sinergia Financiera** en abril de 2026. Durante la sesión de entrega, se validaron en vivo la totalidad de los módulos desarrollados:

- Autenticación y control de acceso por roles
- Creación y gestión de procesos de onboarding
- Solicitudes automáticas por área (TI, Dotación, Servicios Generales, Formación)
- Seguimiento de activos y generación del Acta de Entrega en PDF
- Generación del Carnet de empleado
- Panel de reportes y métricas de eficiencia

**El cliente aprobó el 100% de las funcionalidades comprometidas** sin observaciones pendientes. El proyecto se da por concluido en su fase de desarrollo e implementación.

---

## 10. Metodología de Trabajo

- **Marco ágil**: Scrum con sprints de dos semanas.
- **Control de versiones**: Git + GitHub. Rama principal `main`.
- **Gestor de paquetes**: pnpm (para evitar conflictos de dependencias).
- **Servidor de desarrollo**: `next dev --turbo --port 8082`.
- **Despliegue continuo**: Vercel conectado al repositorio GitHub. Cada push a `main` genera un despliegue automático.
- **Variables de entorno**: gestionadas en `.env.local` (local) y en el panel de Vercel (producción). Nunca se versiona este archivo.

---

## 11. Integraciones Externas

| Servicio          | Uso                                                             |
| ----------------- | --------------------------------------------------------------- |
| **Resend**        | Envío de correos al crear un proceso o notificar a áreas       |
| **Google Gemini** | Sugerencias de plan de capacitación e insumos según el cargo   |
| **AWS S3**        | Almacenamiento de archivos multimedia del proceso              |
| **Puppeteer**     | Generación del Acta de Entrega y Carnet en PDF                 |
