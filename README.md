# HipotecaLab

HipotecaLab es una app para entender, calcular y planificar una hipoteca de forma sencilla. Permite probar distintos escenarios de financiación, evaluar qué vivienda puede encajar en el presupuesto y aprender los conceptos esenciales antes de tomar una decisión.

La aplicación está disponible como web y PWA, y cuenta con proyectos nativos para Android e iOS mediante Capacitor.

## Funcionalidades

- **Simulador hipotecario:** configura el precio de la vivienda, la entrada, el tipo de interés y el plazo.
- **Análisis de pagos:** consulta la cuota mensual y estudia el efecto de aportaciones extraordinarias.
- **Costes de compra:** estima los gastos asociados a la operación.
- **Tabla de amortización:** revisa la evolución del capital, los intereses y la deuda pendiente.
- **Resumen y exportación:** genera informes en PDF y hojas de cálculo.
- **Análisis de viabilidad:** estima qué vivienda puede ajustarse a la situación financiera indicada.
- **Aprende:** explica conceptos hipotecarios mediante contenido educativo y preguntas prácticas.
- **Recursos:** reúne guías y referencias útiles para preparar la compra de una vivienda.

> Los resultados son estimaciones orientativas y no sustituyen una oferta bancaria ni asesoramiento financiero profesional.

## Plataformas

- Aplicación web responsive
- Progressive Web App (PWA)
- Android
- iOS

## Tecnologías

- React 18 y TypeScript
- Vite
- Tailwind CSS
- Capacitor 8
- jsPDF y `write-excel-file`
- Lucide React

## Instalación

### Requisitos

- Node.js 22.12 o posterior y npm
- Android Studio para ejecutar la app Android
- Xcode para ejecutar la app iOS

### Preparar el proyecto

```bash
git clone https://github.com/doc-cdm/hipotecalab-app.git
cd hipotecalab-app
git switch feature/android-app
npm install
```

### Desarrollo web

```bash
npm run dev
```

### Compilación de producción

```bash
npm run build
```

La salida se genera en `dist/`.

## Aplicaciones nativas

Antes de abrir un proyecto nativo, compila la web y sincroniza Capacitor:

```bash
npm run build
npm run cap:sync
```

### Android

```bash
npx cap open android
```

### iOS

```bash
npm run cap:open:ios
```

También puedes compilar, sincronizar y abrir iOS con un único comando:

```bash
npm run ios
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Genera la compilación web de producción. |
| `npm run preview` | Sirve localmente la compilación de producción. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm run typecheck` | Comprueba los tipos TypeScript sin generar archivos. |
| `npm run test` | Ejecuta las pruebas automatizadas con Vitest. |
| `npm run check` | Ejecuta lint, tipos, pruebas y compilación. |
| `npm run cap:sync` | Sincroniza la web y los plugins con Android e iOS. |
| `npm run cap:open:ios` | Abre el proyecto nativo en Xcode. |
| `npm run ios` | Compila, sincroniza y abre la app iOS. |

## Estructura del proyecto

```text
hipotecalab-app/
├── android/                 # Proyecto nativo Android
├── ios/                     # Proyecto nativo iOS
├── public/                  # Manifest, service worker y recursos PWA
├── resources/               # Recursos fuente de iconos y splash
├── src/
│   ├── app/                 # Navegación y composición de la aplicación
│   ├── features/            # Funcionalidades agrupadas por dominio
│   │   ├── learning/        # Quiz, progreso, preguntas y logros
│   │   ├── resources/       # Diccionario y guía de compra
│   │   ├── simulator/       # Simulador, estado, pestañas y exportadores
│   │   └── viability/       # Análisis de viabilidad y modelo fiscal
│   ├── shared/              # Componentes y utilidades reutilizables
│   ├── types/               # Tipos del dominio
│   └── utils/               # Cálculos y formatos financieros
├── capacitor.config.ts      # Configuración de la app nativa
└── vite.config.ts           # Configuración de la aplicación web
```

## Privacidad

Los cálculos se realizan en el dispositivo. Consulta la política de privacidad y los términos de uso incluidos en la propia aplicación para conocer todos los detalles.

## Autor

Desarrollado por [doc-cdm](https://github.com/doc-cdm).
