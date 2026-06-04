# 📋 NovaTask — Plataforma Profesional de Gestión de Tareas

Una **Single Page Application (SPA)** moderna y responsiva para gestión de tareas con autenticación de usuarios y notificaciones por email.**NovaTask** combina seguridad, rendimiento y una experiencia de usuario fluida, integrando servicios en la nube para sincronización en tiempo real y disponibilidad 24/7.Construida con las tecnologías **React 19 + TypeScript + Vite**, autenticada mediante **Firebase** y desplegada en **Vercel**.  

---
---

**Vercel Live Demo:** 
👉 https://proyecto-m4-katy-tejada.vercel.app

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación

- Registro de usuario con email y contraseña
- Inicio de sesión con Google
- Cierre de sesión
- Rutas protegidas por rol
- Manejo profesional de excepciones

### 📋 Gestión de Tareas

- Crear tarea con título, descripción, prioridad, categoría y fecha
- Listar, editar y eliminar tareas del usuario
- Marcar tareas como completadas
- Filtros: Todas / Pendientes / Completadas
- Búsqueda en tiempo real por título o descripción 

### ☁️ Persistencia en la Nube

- Datos sincronizados en **Cloud Firestore**
- Aislamiento por usuario mediante `userId`
- Infraestructura serverless y escalable

### 📧 Notificaciones por Email con AWS SES

- Resumen personalizado del estado de tareas vía **AWS SES** a usuarios autenticados
- Template HTML responsivo con estadísticas integradas
- **Estadísticas Integradas:** Contadores de tareas pendientes y completadas
- Envío seguro autenticado

⚠️IMPORTANTE > 
La app opera en modo sandbox de AWS SES. El email destino debe estar verificado en la consola de AWS para que el usuario recibir notificaciones‼️

---

## 🏗 Decisiones Arquitectónicas

### 1. **Separación de Capas (Layers Architecture)**

- Componentes enfocados solo en presentación
- Lógica reutilizable mediante hooks
- Services desacoplados de la UI
- Fácil testing de cada capa

### 2. **Context API + Hooks**

**Por qué:**
- ✅ Menor complejidad
- ✅ Integración nativa con React 19
- ✅ Excelente rendimiento 

### 3. **Autenticación Híbrida**

- Firebase + Google Auth
- Mejor experiencia de usuario

### 4. **Serverless Functions**

- No requiere servidor dedicado
- Escalado automático
- Variables de entorno seguras

### 5. **Patrón de Capa de servicios**

- 🔄 Fácil de ejecutar pruebas
- 🧪 Mockeable para pruebas
- 📚 API clara y consistente 

### 6. **TypeScript Strict Mode**

- Menos bugs en tiempo de ejecución
- Mejor autocompletado en IDEs 

### 7. **Estrategia de Testing**

- ✅ Validators y helpers (100%)
- ✅ Task service (100%)
- ✅ Filtros (100%)

---

## 🛠 Stack de Tecnología

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 19.2.6 | Librería de UI con hooks y JSX |
| **TypeScript** | ~6.0.2 | Type safety y mejor DX |
| **React Router** | 7.16.0 | Enrutamiento tipo SPA |
| **Vite** | 8.0.12 | Bundler ultrarrápido y dev server |

### Backend & Servicios
| Servicio | Propósito |
|---------|----------|
| **Firebase Auth** | Autenticación y gestión de usuarios |
| **Cloud Firestore** | Base de datos NoSQL en tiempo real |
| **AWS SES** | Servicio de envío de emails transaccionales |
| **Vercel Functions** | API serverless para procesamiento de emails |

### Deployment y Testing
| Plataforma | Rol |
|-----------|-----|
| **Vercel** | Hosting, Functions, Environment Variables |
| **GitHub** | Control de versiones |
| **Vitest** | Testing unitario e integración |

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0 o **yarn** ≥ 3.0.0
- **Git** para control de versiones
- Cuenta de **Firebase** (gratuita)
- Cuenta de **AWS** para SES (opcional para desarrollo local)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ProyectoM4_KatyTejada.git
cd ProyectoM4_KatyTejada
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias (ver sección [Variables de Entorno](#variables-de-entorno)):

```bash
cp .env.example .env
# Editar .env.local con tus valores reales
```

### Paso 4: Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Paso 5: Build para Producción

```bash
npm run build
npm run preview  # Previsualizar la build
```
### 🧪 Testing

Ejecutar todas las pruebas:
```bash
npm test
```

Modo Watch (se re-ejecuta automatica despues de hacer cambios):
```bash
npm run test:watch
```

### Paso 6 Deploy en Vercel

**Opcion 1 - Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option 2 - Integracion con GitHub (Deploys Automaticos)**
1. Has git push a GitHub
2. Ve a <https://vercel.com> e importa el repositorio
3. Agrega las variables de entorno **Settings → Environment Variables**
4. Has click en **Deploy** — futuros push a GitHub en `main` se van a deployar automaticamente 

---

## 📁 Estructura del Proyecto

```
ProyectoM4_KatyTejada/
│
├── api/
│   └── send-email.ts       # Vercel Function para envío de emails
│
├── src/
│   ├── __tests__/
│   │   ├── FilterTaskList.test.ts  # Tests del filtrado
│   │   ├── helpers.test.ts         # Tests de utilidades
│   │   ├── setupTests.ts           # Configuración de Vitest
│   │   ├── taskService.test.ts     # Tests del servicio
│   │   └── validators.test.ts      # Tests de validación
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx          # Barra de navegación
│   │   │
│   │   └── tasks/
│   │       ├── TaskCard.tsx        # Card individual de tarea
│   │       ├── TaskForm.tsx        # Formulario crear/editar
│   │       └── TaskList.tsx        # Listado de tareas
│   │
│   ├── features/
│   │   ├── AuthContext.tsx         # Context global de auth
│   │   └── authTypes.ts            # Tipos de autenticación
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Hook de autenticación
│   │   └── useTasks.ts             # Hook de gestión de tareas
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx           # Página de login
│   │   ├── RegisterPage.tsx        # Página de registro
│   │   └── TaskPage.tsx            # Página principal de tareas
│   │
│   ├── routes/
│   │   ├── ProtectedRoutes.tsx     # Rutas privadas
│   │   └── PublicOnlyRoute.tsx     # Rutas públicas
│   │
│   ├── services/
│   │   ├── authService.ts          # Servicio de autenticación
│   │   ├── emailService.ts         # Servicio de emails
│   │   ├── firebase.ts             # Configuración Firebase
│   │   └── taskService.ts          # Servicio de tareas
│   │
│   ├── types/
│   │   └── index.ts                # Tipos TypeScript globales
│   │
│   ├── utils/
│   │   ├── authErrors.ts           # Mapeo de errores auth
│   │   ├── helpers.ts              # Funciones de utilidad
│   │   └── validators.ts           # Validadores de campos
│   │
│   ├── App.tsx                     # Componente raíz
│   ├── App.css                     # Estilos globales
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Estilos iniciales
│
├── .env 
├── .env.example
├── .gitignore 
├── index.html                      # Punto de entrada principal
├── eslint.config.js 
├── tsconfig.json 
├── tsconfig.app.json 
├── tsconfig.node.json 
├── vite.config.ts 
├── vercel.json 
├── package.json 
└── README.md 
```

---

## 🔐 Variables de Entorno / Seguridad

Las variables necesarias están en .env.example. Incluyen configuración de Firebase y AWS SES.

**⚠️ Importante: Nunca publiques tus claves reales en GitHub.**
---

## 📧 Flujo de Envío de Emails

```

- Usuario solicita envío
- Frontend prepara datos
- Vercel Function procesa
- AWS SES envía email con template HTML

Email incluye:

```html
📊 Sección de Estadísticas
├── Conteo de tareas pendientes
└── Conteo de tareas completadas

📋 Tabla de Tareas Pendientes
├── Columna: Título
├── Columna: Prioridad (Alta/Media/Baja)
├── Columna: Fecha de vencimiento
└── Columna: Descripción

✅ Tabla de Tareas Completadas
├── Mismo formato que pendientes
└── Con estilos diferenciados

```
---

## 🤖 Integración de IA en el Desarrollo

### Introducción

Durante el desarrollo de NovaTask, **Claude Haiku 4.5** se integró como asistente de programación principal, demostrando ser una herramienta transformadora en múltiples aspectos del ciclo de desarrollo. 
El siguiente registro son puntos claves donde la asistencia de la IA (Claude) fue de gran utilidad para resolver desafíos específicos que surgieron durante el desarrollo del gestionador de tareas NovaTask. Esta sección documenta cómo, cuándo y por qué la IA fue efectiva.

1. Estylos de CSS
2. Separacion de Archivos correspondientes
3. Desabilitar fechar pasadas para crear nuevas tareas
4. Test
5. Reorganizacion de Readme

---

## 👤 Author

**Katy Tejada** - [@Katy-T20](https://github.com/Katy-T20)

**Version**: 1.0.0 | **Status**: ✅ Production Ready | **Updated**: June 2026
