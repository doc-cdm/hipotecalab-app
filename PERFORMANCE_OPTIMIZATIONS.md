# Optimización y calidad técnica

Este documento resume las decisiones vigentes de rendimiento y calidad de HipotecaLab. Debe actualizarse cuando cambien el proceso de compilación, la carga de módulos o las comprobaciones automatizadas.

## Estrategia actual

- Las áreas principales se cargan bajo demanda mediante `React.lazy` y `Suspense`.
- Los exportadores PDF y Excel usan importaciones dinámicas; sus dependencias no forman parte del JavaScript inicial.
- Vite separa React, iconos, PDF y Excel en chunks específicos.
- Terser elimina llamadas de depuración durante la compilación de producción.
- Los assets con hash se sirven con caché inmutable.
- El service worker y el manifest tienen políticas de caché independientes.
- La aplicación no precarga todas las funcionalidades en segundo plano, evitando consumo innecesario en conexiones móviles.

## Comprobación local

La validación completa se ejecuta con:

```bash
npm run check
```

Este comando incluye:

1. ESLint.
2. Comprobación estática de TypeScript.
3. Pruebas automatizadas con Vitest.
4. Compilación de producción con Vite.

Para inspeccionar manualmente la compilación:

```bash
npm run build
npm run preview
```

## División del bundle

Los módulos pesados se mantienen detrás de importaciones dinámicas:

- `features/simulator/exporters/pdf.ts`
- `features/simulator/exporters/excel.ts`
- `features/simulator/Simulator.tsx`
- `features/viability/Viability.tsx`
- `features/resources/Resources.tsx`
- `features/learning/Learning.tsx`

## Validación antes de publicar

- Ejecutar `npm run check`.
- Probar instalación y actualización de la PWA.
- Revisar navegación directa mediante `?section=simulator`, `viability`, `resources` y `learning`.
- Ejecutar Lighthouse móvil sobre una URL desplegada, no sobre el servidor de desarrollo.
- Revisar el informe de dependencias con `npm audit` antes de actualizar paquetes; evitar correcciones forzadas sin comprobar incompatibilidades.

Las métricas de Lighthouse deben documentarse a partir de mediciones reales. No se incluyen estimaciones sin una ejecución reproducible.
