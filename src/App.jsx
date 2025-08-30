import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import ProjectManager from "./components/ProjectManager";
import TimeEntryModal from "./components/TimeEntryModal";
import QuickProjectModal from "./components/QuickProjectModal";
import Configuration from "./components/Configuration";
import dataStorage from "./data/data.json";

function App() {
	const [projects, setProjects] = useState([]);
	const [timeEntries, setTimeEntries] = useState({});
	const [selectedDate, setSelectedDate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState("calendar"); // 'calendar', 'projects', or 'config'
	const [isQuickProjectModalOpen, setIsQuickProjectModalOpen] = useState(false);

	useEffect(() => {
		// Cargar datos desde localStorage (simulando archivo JSON)
		loadDataFromStorage();
	}, []);

	// Efecto para guardar automáticamente cuando cambien los datos
	useEffect(() => {
		// Solo guardar si ya hay datos cargados (evitar guardar datos vacíos en la carga inicial)
		if (projects.length > 0 || Object.keys(timeEntries).length > 0) {
			saveDataToStorage(projects, timeEntries);
		}
	}, [projects, timeEntries]);

	// Función para obtener fecha en formato local (evita problemas de zona horaria)
	const getLocalDateString = (date) => {
		const localYear = date.getFullYear();
		const localMonth = String(date.getMonth() + 1).padStart(2, "0");
		const localDay = String(date.getDate()).padStart(2, "0");
		return `${localYear}-${localMonth}-${localDay}`;
	};

	const handleDateClick = (date) => {
		setSelectedDate(date);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedDate(null);
	};

	const handleSaveTimeEntry = (date, projectId, hours, startTime, endTime) => {
		const dateStr = getLocalDateString(date);

		// Crear un objeto con toda la información de la entrada
		const timeEntry = {
			hours: parseFloat(hours),
			startTime: startTime || null,
			endTime: endTime || null,
			timestamp: new Date().toISOString(),
		};

		setTimeEntries((prev) => {
			const existingEntry = prev[dateStr]?.[projectId];

			if (existingEntry && typeof existingEntry === "object" && existingEntry.hours !== undefined) {
				// Si ya existe una entrada estructurada, sumar las horas
				return {
					...prev,
					[dateStr]: {
						...prev[dateStr],
						[projectId]: {
							...existingEntry,
							hours: existingEntry.hours + parseFloat(hours),
							// Mantener el primer startTime y actualizar el último endTime si aplica
							endTime: endTime || existingEntry.endTime,
							lastUpdate: new Date().toISOString(),
						},
					},
				};
			} else {
				// Para compatibilidad con datos antiguos o nueva entrada
				const oldHours = typeof existingEntry === "number" ? existingEntry : 0;
				return {
					...prev,
					[dateStr]: {
						...prev[dateStr],
						[projectId]: {
							hours: oldHours + parseFloat(hours),
							startTime,
							endTime,
							timestamp: new Date().toISOString(),
						},
					},
				};
			}
		});

		// Aquí podrías guardar en el archivo JSON
		console.log("Guardando entrada de tiempo:", { date: dateStr, projectId, hours, startTime, endTime });
	};

	const handleEditTimeEntry = (date, projectId, hours, startTime, endTime) => {
		const dateStr = getLocalDateString(date);

		setTimeEntries((prev) => ({
			...prev,
			[dateStr]: {
				...prev[dateStr],
				[projectId]: {
					hours: parseFloat(hours),
					startTime: startTime || null,
					endTime: endTime || null,
					timestamp: new Date().toISOString(),
				},
			},
		}));

		console.log("Editando entrada de tiempo:", { date: dateStr, projectId, hours, startTime, endTime });
	};

	const handleDeleteTimeEntry = (date, projectId) => {
		const dateStr = getLocalDateString(date);

		setTimeEntries((prev) => {
			const updated = { ...prev };
			if (updated[dateStr]) {
				delete updated[dateStr][projectId];
				// Si no quedan entradas en esa fecha, eliminar la fecha también
				if (Object.keys(updated[dateStr]).length === 0) {
					delete updated[dateStr];
				}
			}
			return updated;
		});

		console.log("Eliminando entrada de tiempo:", { date: dateStr, projectId });
	};

	const handleAddProject = (name, description, active = true) => {
		const newProject = {
			id: Date.now().toString(),
			name,
			description,
			active, // Usar el parámetro pasado o true por defecto
			createdAt: new Date().toISOString(),
		};
		setProjects((prev) => {
			const updatedProjects = [...prev, newProject];
			return updatedProjects;
		});

		console.log("Guardando proyecto:", newProject);
		return newProject; // Devolver el proyecto creado
	};

	const handleEditProject = (projectId, name, description, active) => {
		setProjects((prev) => {
			const updatedProjects = prev.map((project) =>
				project.id === projectId
					? {
							...project,
							name,
							description,
							active,
							updatedAt: new Date().toISOString(),
					  }
					: project
			);
			return updatedProjects;
		});

		console.log("Editando proyecto:", { projectId, name, description, active });
	};

	const handleDeleteProject = (projectId) => {
		setProjects((prev) => {
			const updatedProjects = prev.filter((p) => p.id !== projectId);
			return updatedProjects;
		});

		// También eliminar las entradas de tiempo asociadas
		setTimeEntries((prev) => {
			const updated = { ...prev };
			Object.keys(updated).forEach((date) => {
				delete updated[date][projectId];
				if (Object.keys(updated[date]).length === 0) {
					delete updated[date];
				}
			});
			return updated;
		});

		console.log("Eliminando proyecto:", projectId);
	};

	// Función para guardar proyectos en archivo JSON
	const saveProjectsToFile = async (projects) => {
		try {
			const data = JSON.stringify({ projects, timeEntries }, null, 2);
			// En una aplicación real, aquí harías una llamada a una API o usarías File System API
			console.log("Guardando en data.json:", data);

			// Simular guardado (en producción, esto sería una llamada a un servidor)
			localStorage.setItem("gestionHorasData", data);
		} catch (error) {
			console.error("Error guardando proyectos:", error);
		}
	};

	// Función para guardar todos los datos en localStorage
	const saveDataToStorage = (updatedProjects = projects, updatedTimeEntries = timeEntries) => {
		try {
			const data = JSON.stringify({ projects: updatedProjects, timeEntries: updatedTimeEntries }, null, 2);
			localStorage.setItem("gestionHorasData", data);
			console.log("Datos guardados en localStorage");
		} catch (error) {
			console.error("Error guardando datos:", error);
		}
	};

	// Función para cargar datos del almacenamiento local (simulando el archivo JSON)
	const loadDataFromStorage = () => {
		try {
			const savedData = localStorage.getItem("gestionHorasData");
			if (savedData) {
				const parsedData = JSON.parse(savedData);
				setProjects(parsedData.projects || []);
				setTimeEntries(parsedData.timeEntries || {});
				return;
			}
		} catch (error) {
			console.error("Error cargando datos:", error);
		}

		// Fallback a datos iniciales
		setProjects(dataStorage.projects);
		setTimeEntries(dataStorage.timeEntries);
	};

	// Función para importar datos desde archivo JSON
	const handleImportData = (importedData) => {
		try {
			setProjects(importedData.projects || []);
			setTimeEntries(importedData.timeEntries || {});

			// Guardar en localStorage
			const data = JSON.stringify(
				{
					projects: importedData.projects || [],
					timeEntries: importedData.timeEntries || {},
				},
				null,
				2
			);
			localStorage.setItem("gestionHorasData", data);

			console.log("Datos importados exitosamente");
		} catch (error) {
			console.error("Error al importar datos:", error);
			alert("Error al importar los datos: " + error.message);
		}
	};

	const openTodayModal = () => {
		setSelectedDate(new Date());
		setIsModalOpen(true);
	};

	const openQuickProjectModal = () => {
		setIsQuickProjectModalOpen(true);
	};

	const closeQuickProjectModal = () => {
		setIsQuickProjectModalOpen(false);
	};

	const handleQuickProjectSubmit = (projectText) => {
		const trimmedText = projectText.trim();
		if (!trimmedText) return;

		// Verificar formato obligatorio: PROYECTO  8:00  10:00
		const hourPattern = /^(.+?)\s+(\d{1,2}:\d{2})\s+(\d{1,2}:\d{2})$/;
		const match = trimmedText.match(hourPattern);

		if (!match) {
			alert("Formato inválido. Debe incluir: PROYECTO		8:00		10:00");
			return;
		}

		// Extraer proyecto y horas
		const projectName = match[1].trim();
		const startTime = match[2];
		const endTime = match[3];

		// Calcular horas trabajadas
		const [startHour, startMinute] = startTime.split(":").map(Number);
		const [endHour, endMinute] = endTime.split(":").map(Number);

		const startMinutes = startHour * 60 + startMinute;
		const endMinutes = endHour * 60 + endMinute;

		let diffMinutes = endMinutes - startMinutes;
		if (diffMinutes < 0) {
			diffMinutes += 24 * 60; // Agregar 24 horas si cruza medianoche
		}

		const hours = diffMinutes / 60;

		// Buscar o crear proyecto
		let project = projects.find((p) => p.name.toLowerCase().trim() === projectName.toLowerCase().trim());

		if (!project) {
			// Crear nuevo proyecto
			project = handleAddProject(projectName, "Proyecto creado desde registro rápido", true);
		}

		if (project) {
			// Guardar entrada de tiempo para hoy
			const today = new Date();
			handleSaveTimeEntry(today, project.id, hours, startTime, endTime);
			alert(`Proyecto "${project.name}" registrado con ${hours} horas (${startTime} - ${endTime}) para hoy`);
			closeQuickProjectModal();
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-soft-50 to-blue-soft-100'>
			<div className='container mx-auto px-4 py-8'>
				<header className='mb-8'>
					<h1 className='text-4xl font-bold text-blue-soft-800 mb-4'>Gestión de Horas</h1>

					<div className='flex flex-wrap gap-4'>
						<button
							onClick={() => setViewMode("calendar")}
							className={`px-6 py-2 rounded-lg font-medium transition-colors ${
								viewMode === "calendar" ? "bg-blue-soft-600 text-white" : "bg-white text-blue-soft-600 hover:bg-blue-soft-50"
							}`}
						>
							Calendario
						</button>

						<button
							onClick={() => setViewMode("projects")}
							className={`px-6 py-2 rounded-lg font-medium transition-colors ${
								viewMode === "projects" ? "bg-blue-soft-600 text-white" : "bg-white text-blue-soft-600 hover:bg-blue-soft-50"
							}`}
						>
							Proyectos
						</button>

						<button
							onClick={() => setViewMode("config")}
							className={`px-6 py-2 rounded-lg font-medium transition-colors ${
								viewMode === "config" ? "bg-blue-soft-600 text-white" : "bg-white text-blue-soft-600 hover:bg-blue-soft-50"
							}`}
						>
							Configuración
						</button>

						<button onClick={openTodayModal} className='px-6 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors font-medium'>
							Registrar Horas Hoy
						</button>

						<button onClick={openQuickProjectModal} className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'>
							Registro Rápido
						</button>
					</div>
				</header>

				<main>
					{viewMode === "calendar" ? (
						<Calendar timeEntries={timeEntries} projects={projects} onDateClick={handleDateClick} />
					) : viewMode === "projects" ? (
						<ProjectManager projects={projects} onAddProject={handleAddProject} onEditProject={handleEditProject} onDeleteProject={handleDeleteProject} />
					) : (
						<Configuration projects={projects} timeEntries={timeEntries} onImportData={handleImportData} onAddProject={handleAddProject} onSaveTimeEntry={handleSaveTimeEntry} />
					)}
				</main>

				{isModalOpen && (
					<TimeEntryModal
						date={selectedDate}
						projects={projects.filter((p) => p.active !== false)} // Solo proyectos activos
						allProjects={projects} // Todos los proyectos para mostrar nombres de eliminados
						existingEntries={selectedDate ? timeEntries[getLocalDateString(selectedDate)] : {}}
						onSave={handleSaveTimeEntry}
						onEdit={handleEditTimeEntry}
						onDelete={handleDeleteTimeEntry}
						onClose={handleCloseModal}
					/>
				)}

				{isQuickProjectModalOpen && <QuickProjectModal onSubmit={handleQuickProjectSubmit} onClose={closeQuickProjectModal} />}
			</div>
		</div>
	);
}

export default App;
