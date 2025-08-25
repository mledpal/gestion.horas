# Gestión de Horas

Una aplicación web moderna y sencilla para gestionar proyectos y registrar horas de trabajo, desarrollada con React y Tailwind CSS.

## Características

### 🚀 Funcionalidades Principales

- **Gestión Completa de Proyectos**: Crear, editar, activar/desactivar y eliminar proyectos
- **Estados de Proyectos**: Sistema de activación/desactivación con indicadores visuales
- **Guardado Automático**: Los datos se guardan automáticamente en localStorage tras cualquier cambio
- **Calendario Interactivo**: Visualiza y gestiona las horas trabajadas en un calendario mensual que inicia en lunes
- **Registro por Horarios**: Sistema intuitivo para registrar horas usando hora de inicio y fin (calcula automáticamente la duración)
- **Edición Avanzada**: Modificar registros existentes incluyendo la posibilidad de cambiar el proyecto
- **Modal Inteligente**: Ventana modal que se adapta según el tipo de fecha y permite múltiples acciones
- **Resumen Detallado**: Visualización del total de horas trabajadas por día con horarios específicos ordenados alfabéticamente
- **Cálculo Automático**: Las horas se calculan automáticamente basándose en hora de inicio y fin
- **Importación Rápida**: Procesar texto con múltiples horarios de manera automática
- **Exportación/Importación**: Respaldo completo de datos en formato JSON
- **Configuración Avanzada**: Panel de configuración con estadísticas y herramientas de gestión
- **Zona Horaria Local**: Manejo correcto de fechas evitando problemas de zona horaria
- **Ordenamiento Alfabético**: Todos los proyectos aparecen ordenados alfabéticamente
- **Diseño Responsivo**: Interfaz adaptable a diferentes tamaños de pantalla

### ✨ Nuevas Funcionalidades

#### 🔄 **Importación Rápida de Texto**

- **Formato Reconocido**: `PROYECTO    HH:MM    HH:MM`
- **Múltiples Formatos**: Soporta tabs, espacios múltiples y formato flexible
- **Creación Automática**: Crea proyectos nuevos si no existen
- **Validación Inteligente**: Verifica formatos y muestra errores específicos
- **Vista Previa**: Confirma antes de procesar con resumen detallado

#### 📊 **Panel de Configuración**

- **Estadísticas en Tiempo Real**: Número de proyectos, días registrados, horas totales
- **Exportación Completa**: Descarga respaldo JSON con fecha automática
- **Importación Segura**: Carga datos desde archivo con validaciones
- **Limpieza de Datos**: Eliminación completa con doble confirmación
- **Interfaz Intuitiva**: Secciones organizadas con colores diferenciados

#### 🎯 **Edición Mejorada**

- **Cambio de Proyecto**: Al editar, puedes cambiar la entrada a otro proyecto
- **Múltiples Acciones**: Editar, eliminar y agregar en el mismo día
- **Sin Restricciones**: Permite agregar entradas en días con registros existentes
- **Ordenamiento Visual**: Proyectos siempre ordenados alfabéticamente

### 🎨 Diseño

- **Colores Azulados Suaves**: Paleta de colores profesional y relajante
- **Interfaz Intuitiva**: Navegación sencilla entre calendario, proyectos y configuración
- **Componentes Modernos**: UI/UX moderna con Tailwind CSS
- **Indicadores Visuales**: Colores específicos para diferentes estados y acciones

### 💾 Almacenamiento

- **Guardado Automático**: Los datos se guardan automáticamente tras cada cambio
- **Persistencia Garantizada**: Sin riesgo de pérdida de datos al recargar
- **Formato JSON**: Estructura de datos exportable e importable
- **Compatibilidad**: Mantiene compatibilidad con versiones anteriores de datos

## Estructura del Proyecto

```
src/
├── components/
│   ├── Calendar.jsx          # Componente del calendario principal
│   ├── ProjectManager.jsx    # Gestión de proyectos
│   ├── TimeEntryModal.jsx    # Modal para registrar/ver/editar horas
│   └── Configuration.jsx     # Panel de configuración y herramientas
├── data/
│   └── data.json            # Archivo de datos inicial
├── App.jsx                  # Componente principal con lógica de estado
├── main.jsx                 # Punto de entrada
└── index.css               # Estilos con Tailwind
```

## Instalación y Uso

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construir para Producción

```bash
npm run build
```

## Uso de la Aplicación

### 1. Gestionar Proyectos

#### Crear un nuevo proyecto:

- Ve a la sección "Proyectos"
- Haz clic en "+ Nuevo Proyecto"
- Completa el nombre (obligatorio) y descripción (opcional)
- **Marca la casilla "Proyecto activo"** si quieres que esté disponible para registro de horas
- Haz clic en "Guardar"

#### Editar un proyecto existente:

- En la lista de proyectos, haz clic en el **botón de editar** (ícono de lápiz)
- Modifica el nombre, descripción y/o estado activo
- Haz clic en "Actualizar" para guardar los cambios

#### Activar/Desactivar proyectos:

- **Proyectos activos**: Aparecen en color normal y están disponibles para registro de horas
- **Proyectos inactivos**: Aparecen en **color rojo** con la etiqueta "INACTIVO"
- Los proyectos inactivos no aparecen en la lista de selección al registrar nuevas horas
- Los registros existentes de proyectos inactivos se mantienen visibles con la etiqueta "(INACTIVO)"

#### Eliminar un proyecto:

- Haz clic en el **botón de eliminar** (ícono de basura)
- **⚠️ Advertencia**: Esto eliminará también todos los registros de tiempo asociados

### 2. Registrar Horas

#### Para el día actual:

- Haz clic en "Registrar Horas Hoy" en la barra superior
- Selecciona un proyecto del menú desplegable
- **Ingresa la hora de inicio** (formato 24h: ej. 09:00)
- **Ingresa la hora de fin** (formato 24h: ej. 17:30)
- El sistema **calculará automáticamente las horas trabajadas**
- Verás un resumen con las horas calculadas antes de confirmar
- Haz clic en "Registrar Horas"

#### Para cualquier día:

- En el calendario, haz clic en el día deseado
- Sigue el mismo proceso de selección de proyecto y horarios

### 3. Editar y Eliminar Registros

#### Editar una entrada existente:

- Haz clic en cualquier día con horas registradas
- En la lista de entradas, haz clic en el **botón de editar** (ícono de lápiz)
- **🆕 Cambiar Proyecto**: Selecciona un proyecto diferente del menú desplegable
- Modifica la hora de inicio y/o fin según necesites
- Las horas se recalcularán automáticamente
- Haz clic en "Guardar" para confirmar los cambios o "Cancelar" para descartar

#### Eliminar una entrada:

- En la lista de entradas del día, haz clic en el **botón de eliminar** (ícono de basura)
- Confirma la eliminación en el cuadro de diálogo
- La entrada se eliminará permanentemente

#### Agregar más entradas en días existentes:

- **🆕 Sin Restricciones**: Ahora puedes agregar nuevas entradas en días que ya tienen registros
- El formulario aparece siempre disponible en la parte inferior del modal
- Útil para corregir olvidos o agregar tiempo adicional

### 4. 🚀 **Importación Rápida de Texto**

#### Usar la función de importación rápida:

1. Ve a la sección **"Configuración"**
2. Encuentra la sección **"Importación Rápida de Texto"** (color morado)
3. **Pega tu texto** en el formato reconocido:
   ```
   BEKLUB		8:00	10:00
   API GYM		10:00	11:00
   ASPERGER	11:30	15:00
   ```
4. **Selecciona la fecha** donde aplicar estos horarios
5. Haz clic en **"Procesar Texto"**

#### Formatos soportados:

- **Con tabs**: `PROYECTO\t\t8:00\t10:00`
- **Con espacios múltiples**: `PROYECTO    8:00    10:00`
- **Formato flexible**: `PROYECTO 8:00 10:00`

#### Características automáticas:

- **✨ Creación de Proyectos**: Si el proyecto no existe, lo crea automáticamente
- **🔍 Validaciones**: Verifica formato de horas y muestra errores específicos
- **📋 Vista Previa**: Confirma antes de procesar con resumen completo
- **💾 Guardado Automático**: Todo se guarda automáticamente al procesar

### 5. 🛠️ **Panel de Configuración**

#### Acceder al panel:

- Haz clic en **"Configuración"** en la barra de navegación superior

#### Funcionalidades disponibles:

##### **📊 Estadísticas en Tiempo Real**

- Número total de proyectos
- Días con registros
- Horas totales trabajadas

##### **📤 Exportación de Datos**

- Haz clic en **"Exportar Datos"** (botón verde)
- Descarga automática de archivo JSON con formato: `gestion_horas_backup_YYYY-MM-DD.json`
- Incluye todos los proyectos, entradas de tiempo, fecha de exportación y versión

##### **📥 Importación de Datos**

- Haz clic en **"Importar Datos"** (botón azul)
- Selecciona un archivo JSON exportado previamente
- **Validación automática** del formato
- **Confirmación con resumen** antes de importar
- ⚠️ **Advertencia**: Sobrescribe todos los datos actuales

##### **🗑️ Eliminación Completa**

- Sección de **"Zona de Peligro"** (color rojo)
- **Doble confirmación** antes de eliminar
- Elimina permanentemente todos los proyectos y registros
- **Recomendación**: Exportar datos antes de usar esta función

### 6. Funciones Especiales

#### Cálculo Automático:

- Las horas se calculan automáticamente: hora_fin - hora_inicio
- Si la hora de fin es menor que la de inicio, asume que pasa al día siguiente (turnos nocturnos)
- Ejemplo: inicio 22:00, fin 06:00 = 8 horas

#### Validaciones:

- Aviso automático cuando se registran más de 12 horas (verificar posibles errores)
- Campos obligatorios para hora de inicio y fin
- Confirmación antes de eliminar registros

#### **🆕 Zona Horaria Local**:

- **Fechas Correctas**: El calendario maneja las fechas en zona horaria local
- **Sin Desfases**: Los registros aparecen en el día correcto sin importar la hora
- **Precisión**: Evita problemas comunes de conversión UTC

#### **🔤 Ordenamiento Alfabético**:

- **Proyectos Ordenados**: Todas las listas de proyectos aparecen ordenadas alfabéticamente
- **Localización Española**: Ordenamiento correcto para caracteres especiales y acentos
- **Consistencia**: Mismo orden en calendario, modales y formularios

### 7. Visualizar Registros

- **En el Calendario**: Los días con horas registradas muestran:
  - Un indicador visual (anillo azul)
  - Total de horas en la esquina superior derecha
  - **🆕 Hasta 2 proyectos ordenados alfabéticamente** con sus horas específicas
  - **🆕 Calendario que inicia en lunes** (estándar europeo)
- **Al hacer clic en un día**: Se muestra un resumen completo con:
  - **🆕 Horas trabajadas por proyecto ordenadas alfabéticamente**
  - **Horarios específicos** (hora de inicio - hora de fin) cuando están disponibles
  - **Botones de edición y eliminación** para cada entrada
  - **🆕 Posibilidad de agregar más entradas** en días con registros existentes
  - Total de horas del día actualizado automáticamente

### 8. Gestión Avanzada

#### Modificar múltiples entradas:

- Puedes tener varias entradas del mismo proyecto en un día
- Cada entrada mantiene sus horarios específicos
- El total se calcula automáticamente sumando todas las entradas

#### **🆕 Cambio de Proyecto en Edición**:

- **Flexibilidad Total**: Al editar una entrada, puedes cambiar el proyecto asignado
- **Movimiento Automático**: El sistema mueve la entrada del proyecto anterior al nuevo
- **Preservación de Datos**: Mantiene los horarios y horas calculadas durante el cambio
- **Lista Completa**: Muestra todos los proyectos activos disponibles para el cambio

#### Retrocompatibilidad:

- La aplicación funciona con datos antiguos (solo números) y nuevos (con horarios)
- Las entradas sin horarios específicos se muestran solo con las horas totales
- **🆕 Migración Automática**: Los datos se actualizan automáticamente al nuevo formato

#### **🆕 Respaldo y Migración**:

- **Exportación Completa**: Crea respaldos completos con un solo clic
- **Importación Segura**: Restaura datos con validaciones automáticas
- **Formato Estándar**: JSON compatible con otras herramientas y sistemas
- **Migración de Dispositivos**: Transfiere datos fácilmente entre dispositivos

## 🆕 Casos de Uso Avanzados

### Importación Masiva de Horarios

**Escenario**: Tienes una lista de horarios en texto plano y necesitas ingresarlos rápidamente.

**Solución**:

1. Copia el texto desde tu fuente (email, documento, etc.)
2. Ve a **Configuración** → **Importación Rápida**
3. Pega el texto y selecciona la fecha
4. El sistema creará automáticamente los proyectos que no existan
5. **Resultado**: Múltiples entradas procesadas en segundos

### Corrección de Errores Masivos

**Escenario**: Te das cuenta que registraste las horas en el proyecto equivocado.

**Solución**:

1. Haz clic en el día con el error
2. Edita la entrada problemática
3. **Cambia el proyecto** en el menú desplegable de edición
4. Guarda los cambios
5. **Resultado**: La entrada se mueve al proyecto correcto automáticamente

### Migración de Datos

**Escenario**: Cambias de dispositivo o necesitas compartir datos.

**Solución**:

1. **Dispositivo origen**: Ve a Configuración → Exportar Datos
2. Transfiere el archivo JSON generado
3. **Dispositivo destino**: Ve a Configuración → Importar Datos
4. Selecciona el archivo JSON
5. **Resultado**: Todos los datos migrados perfectamente

## Tecnologías Utilizadas

- **React 18**: Framework de JavaScript para la interfaz de usuario
- **Vite**: Herramienta de construcción rápida y moderna
- **Tailwind CSS**: Framework CSS utilitario para estilos
- **PostCSS**: Procesador de CSS
- **ESLint**: Linter para mantener la calidad del código

## Funcionalidades Futuras

- [ ] Integración con base de datos remota
- [ ] Exportar reportes en PDF/Excel
- [ ] Filtros por proyecto y rango de fechas
- [ ] Gráficos y estadísticas avanzadas
- [ ] Notificaciones y recordatorios
- [ ] Modo oscuro
- [ ] Sincronización entre dispositivos
- [ ] API REST para integraciones
- [ ] Plantillas de horarios
- [ ] Categorización de proyectos
- [ ] Facturación automática
- [ ] Seguimiento de objetivos

## 📋 Changelog - Nuevas Funcionalidades

### Versión 2.0 (Agosto 2025)

#### 🆕 **Importación Rápida de Texto**

- Procesamiento automático de texto con horarios
- Soporte para múltiples formatos (tabs, espacios)
- Creación automática de proyectos inexistentes
- Validaciones y vista previa antes de procesar

#### 🛠️ **Panel de Configuración Completo**

- Estadísticas en tiempo real de la aplicación
- Exportación e importación de datos completa
- Herramientas de limpieza y mantenimiento
- Interfaz organizada por secciones

#### ✏️ **Edición Avanzada**

- Cambio de proyecto al editar entradas existentes
- Posibilidad de agregar entradas en días con registros
- Eliminación de restricciones de edición por fecha

#### 🗓️ **Mejoras del Calendario**

- Calendario que inicia en lunes (estándar europeo)
- Manejo correcto de zona horaria local
- Ordenamiento alfabético en todas las visualizaciones

#### 💾 **Persistencia Mejorada**

- Guardado automático tras cada cambio
- Eliminación del riesgo de pérdida de datos
- Sistema de respaldo y restauración completo

#### 🔤 **Ordenamiento y UX**

- Ordenamiento alfabético consistente en toda la aplicación
- Localización española para caracteres especiales
- Mejoras en la interfaz y experiencia de usuario

## Contribuir

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ usando React y Tailwind CSS
