# Gestión de Horas

Una aplicación web moderna y sencilla para gestionar proyectos y registrar horas de trabajo, desarrollada con React y Tailwind CSS.

## Características

### 🚀 Funcionalidades Principales

- **Gestión Completa de Proyectos**: Crear, editar, activar/desactivar y eliminar proyectos
- **Estados de Proyectos**: Sistema de activación/desactivación con indicadores visuales
- **Guardado Automático**: Los proyectos se guardan automáticamente en localStorage (simulando archivo JSON)
- **Calendario Interactivo**: Visualiza y gestiona las horas trabajadas en un calendario mensual
- **Registro por Horarios**: Sistema intuitivo para registrar horas usando hora de inicio y fin (calcula automáticamente la duración)
- **Edición de Entradas**: Modificar y eliminar registros de horas existentes con confirmación
- **Modal Inteligente**: Ventana modal que se adapta según el tipo de fecha (actual, pasada, futura)
- **Resumen Detallado**: Visualización del total de horas trabajadas por día con horarios específicos
- **Cálculo Automático**: Las horas se calculan automáticamente basándose en hora de inicio y fin
- **Validación de Horarios**: Aviso cuando se registran más de 12 horas (posible error)
- **Interfaz de Edición**: Formulario en línea para modificar entradas directamente en el modal
- **Confirmación de Eliminación**: Protección contra eliminación accidental de registros
- **Indicadores Visuales**: Proyectos inactivos mostrados en rojo con etiquetas claras
- **Filtrado Inteligente**: Solo proyectos activos disponibles para nuevos registros de tiempo
- **Diseño Responsivo**: Interfaz adaptable a diferentes tamaños de pantalla

### 🎨 Diseño

- **Colores Azulados Suaves**: Paleta de colores profesional y relajante
- **Interfaz Intuitiva**: Navegación sencilla entre el calendario y la gestión de proyectos
- **Componentes Modernos**: UI/UX moderna con Tailwind CSS

### 💾 Almacenamiento

- **Guardado Automático**: Los datos se guardan automáticamente en localStorage (simulando archivo JSON)
- **Persistencia de Datos**: Los proyectos y registros de tiempo se mantienen entre sesiones
- **Formato JSON**: Estructura de datos lista para migrar a archivo JSON en disco
- **Preparado para Base de Datos**: Arquitectura lista para migrar a una base de datos en el futuro

## Estructura del Proyecto

```
src/
├── components/
│   ├── Calendar.jsx          # Componente del calendario principal
│   ├── ProjectManager.jsx    # Gestión de proyectos
│   └── TimeEntryModal.jsx    # Modal para registrar/ver horas
├── data/
│   └── data.json            # Archivo de datos (proyectos y horas)
├── App.jsx                  # Componente principal
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
- Modifica la hora de inicio y/o fin según necesites
- Las horas se recalcularán automáticamente
- Haz clic en "Guardar" para confirmar los cambios o "Cancelar" para descartar

#### Eliminar una entrada:

- En la lista de entradas del día, haz clic en el **botón de eliminar** (ícono de basura)
- Confirma la eliminación en el cuadro de diálogo
- La entrada se eliminará permanentemente

### 4. Funciones Especiales

#### Cálculo Automático:

- Las horas se calculan automáticamente: hora_fin - hora_inicio
- Si la hora de fin es menor que la de inicio, asume que pasa al día siguiente (turnos nocturnos)
- Ejemplo: inicio 22:00, fin 06:00 = 8 horas

#### Validaciones:

- Aviso automático cuando se registran más de 12 horas (verificar posibles errores)
- Campos obligatorios para hora de inicio y fin
- Confirmación antes de eliminar registros

### 5. Visualizar Registros

- **En el Calendario**: Los días con horas registradas muestran:
  - Un indicador visual (anillo azul)
  - Total de horas en la esquina superior derecha
  - Hasta 2 proyectos con sus horas específicas
- **Al hacer clic en un día**: Se muestra un resumen completo con:
  - Horas trabajadas por proyecto
  - **Horarios específicos** (hora de inicio - hora de fin) cuando están disponibles
  - **Botones de edición y eliminación** para cada entrada
  - Total de horas del día

### 6. Gestión Avanzada

#### Modificar múltiples entradas:

- Puedes tener varias entradas del mismo proyecto en un día
- Cada entrada mantiene sus horarios específicos
- El total se calcula automáticamente sumando todas las entradas

#### Retrocompatibilidad:

- La aplicación funciona con datos antiguos (solo números) y nuevos (con horarios)
- Las entradas sin horarios específicos se muestran solo con las horas totales

## Tecnologías Utilizadas

- **React 18**: Framework de JavaScript para la interfaz de usuario
- **Vite**: Herramienta de construcción rápida y moderna
- **Tailwind CSS**: Framework CSS utilitario para estilos
- **PostCSS**: Procesador de CSS
- **ESLint**: Linter para mantener la calidad del código

## Funcionalidades Futuras

- [ ] Integración con base de datos
- [ ] Exportar reportes en PDF/Excel
- [ ] Filtros por proyecto y rango de fechas
- [ ] Gráficos y estadísticas
- [ ] Notificaciones y recordatorios
- [ ] Modo oscuro

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
