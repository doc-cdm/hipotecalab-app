# Ficha de Google Play — HipotecaLab

Material preparado el 6 de septiembre de 2026 para la ficha principal en español de España (`es-ES`). No se ha subido a Play Console ni se ha solicitado acceso a producción.

## Material para subir

| Campo de Play Console | Archivo | Validación |
| --- | --- | --- |
| Nombre | `es-ES/title.txt` | 11 caracteres; máximo 30 |
| Descripción breve | `es-ES/short-description.txt` | 74 caracteres; máximo 80 |
| Descripción completa | `es-ES/full-description.txt` | 1721 caracteres; máximo 4000 |
| Correo de soporte | `es-ES/contact-email.txt` | Contacto ya utilizado en la app |
| Icono | `es-ES/images/icon.png` | PNG RGBA, 512 × 512; derivado del icono existente |
| Gráfico de funciones | `es-ES/images/feature-graphic.png` | PNG RGB sin alfa, 1024 × 500 |
| Capturas de teléfono | `es-ES/images/phone-screenshots/*.png` | Cinco capturas reales, 1080 × 1920, relación 9:16 |

Los archivos de texto contienen únicamente el contenido que debe copiarse en cada campo. La categoría sugerida es **Finanzas** y el tipo es **Aplicación**. Países, precio y datos del titular deben decidirse y completarse en la cuenta; no se han establecido desde el repositorio.

En Play Console, abre **Aumentar usuarios → Presencia en Google Play Store → Ficha de Play Store principal**, selecciona español de España y carga estos materiales. Usa las capturas en el orden numérico de sus nombres. El icono de la ficha es independiente de los recursos del launcher Android.

## Descripciones alternativas de las imágenes

| Archivo | Texto alternativo |
| --- | --- |
| `icon.png` | Logotipo HLab con la H naranja sobre fondo azul oscuro. |
| `feature-graphic.png` | HipotecaLab: tu próxima casa, con las cuentas claras. Una casa representa la planificación de tu hipoteca. |
| `01-herramientas.png` | Menú de HipotecaLab con las herramientas Simulador, Viabilidad, Recursos y Aprende. |
| `02-simulador.png` | Simulador hipotecario con una vivienda de ejemplo de 250.000 euros y los pasos de cálculo. |
| `03-viabilidad.png` | Formulario para estimar el presupuesto de compra según ingresos, endeudamiento, interés y plazo. |
| `04-recursos.png` | Diccionario hipotecario con buscador y conceptos como TIN, TAE y euríbor. |
| `05-aprende.png` | Preguntas de aprendizaje hipotecario con progreso, nivel, rendimiento y logros. |

## Procedencia y reproducción

Las capturas proceden de HipotecaLab instalada en el emulador `Pixel_9_Pro`, Android 16/API 36. Se utilizó un APK de depuración con el build web de producción generado por Vite, sincronizado con Capacitor; no son capturas de navegador ni de iPhone. Se introdujeron datos ficticios en el simulador. No se modificó visualmente la interfaz de las capturas.

Secuencia utilizada desde la raíz del repositorio:

```sh
npm run check
npx cap sync android
cd android
./gradlew :app:assembleDebug --offline
```

Se requiere Java 21 y el SDK Android configurado. Después se instaló `android/app/build/outputs/apk/debug/app-debug.apk` mediante `adb install -r`. Para reproducir el formato, configura el emulador con `adb shell wm size 1080x1920` y `adb shell wm density 360`, navega hasta cada pantalla y utiliza `adb exec-out screencap -p > captura.png`. Restaura después con `adb shell wm size reset` y `adb shell wm density reset`. Especifica `-s SERIAL` si hay varios dispositivos.

El gráfico conserva una fuente editable en `artwork/feature-graphic.html`, construida con HTML/CSS/SVG y la paleta de la app. Renderízala con un viewport de 1024 × 500 y exporta el PNG en RGB, sin transparencia. El icono reutiliza `public/icons/icon-512x512.png`, exportado como RGBA. No se han añadido fuentes ni imágenes remotas.

Antes de subir la ficha, compara estas pantallas con el AAB firmado definitivo. Regenera las capturas si cambia la interfaz. La captura en depuración no sustituye la validación funcional del release.

## Acceso a producción: pendiente de comprobar en la cuenta

No hay acceso conectado a Play Console en esta sesión. No se conoce el tipo/fecha de creación de la cuenta, su estado de verificación ni si tiene acceso a producción. Estos estados no pueden confirmarse desde el repositorio.

1. Completa las verificaciones de identidad y contacto que solicite Play Console, y la verificación de dispositivo si corresponde.
2. Si la cuenta es personal y se creó después del 13 de noviembre de 2023, realiza una prueba cerrada con al menos 12 testers inscritos durante 14 días consecutivos antes de solicitar acceso a producción. Una prueba interna no sustituye este requisito.
3. Publica el AAB firmado en el canal cerrado, configura la lista de testers o el grupo y comparte personalmente el enlace de inscripción. Conserva evidencia real del uso, las incidencias y las mejoras realizadas.
4. Comprueba en el panel que se ha cumplido el requisito y solicita acceso a producción. Responde con los resultados reales de las pruebas, el público de la app y las razones por las que está preparada. Cumplir el plazo no concede acceso automáticamente.
5. Si la cuenta no está sujeta a ese requisito, comprueba igualmente que el canal de producción esté habilitado y que las tareas de configuración de la cuenta estén completas.

Para la prueba cerrada, cubre el cálculo hipotecario con varios importes y plazos, PDF/Excel y cancelación del selector, viabilidad, navegación Atrás, progreso de Aprende, teclado, tamaños de pantalla, arranque sin conexión y actualización de una instalación anterior. Registra dispositivo/Android, pasos, resultado esperado, resultado observado y corrección. No se han reclutado testers ni realizado estas pruebas de 14 días.

La firma del AAB, la URL pública de privacidad y las declaraciones de contenido siguen siendo pasos separados del material de ficha preparado aquí.

## Comprobaciones realizadas

- `npm run check`: lint, TypeScript, 13 pruebas y build correctos tras eliminar el import sin usar `ShieldCheck`.
- `:app:assembleDebug --offline`: correcto; APK instalado y abierto en Android 16.
- Inspección visual de las cinco capturas y del gráfico.
- Longitudes de textos, dimensiones, modos de color y tamaños de los PNG verificados localmente.

## Fuentes oficiales

- [Recursos gráficos y textos de la ficha](https://support.google.com/googleplay/android-developer/answer/9866151?hl=es).
- [Crear y configurar una aplicación](https://support.google.com/googleplay/android-developer/answer/9859152?hl=es).
- [Pruebas para nuevas cuentas personales](https://support.google.com/googleplay/android-developer/answer/14151465?hl=es).
