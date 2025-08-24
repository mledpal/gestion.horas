import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import ProjectManager from "./components/ProjectManager";
import TimeEntryModal from "./components/TimeEntryModal";
import Configuration from "./components/Configuration";
import dataStorage from "./data/data.json";

function App() {
	const [projects, setProjects] = useState([]);
	const [timeEntries, setTimeEntries] = useState({});
	const [selectedDate, setSelectedDate] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState("calendar"); // 'calendar', 'projects', or 'config'

	useEffect(() => {
		// Cargar datos desde localStorage (simulando archivo JSON)
		loadDataFromStorage();
	}, []);

	const handleDateClick = (date) => {
		setSelectedDate(date);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedDate(null);
	};

	const handleSaveTimeEntry = (date, projectId, hours, startTime, endTime) => {
		const dateStr = date.toISOString().split("T")[0];

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
		const dateStr = date.toISOString().split("T")[0];

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
		const dateStr = date.toISOString().split("T")[0];

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

	const handleAddProject = (name, description) => {
		const newProject = {
			id: Date.now().toString(),
			name,
			description,
			active: true, // Nuevo campo activo por defecto
			createdAt: new Date().toISOString(),
		};
		setProjects((prev) => {
			const updatedProjects = [...prev, newProject];
			saveProjectsToFile(updatedProjects);
			return updatedProjects;
		});

		console.log("Guardando proyecto:", newProject);
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
			saveProjectsToFile(updatedProjects);
			return updatedProjects;
		});

		console.log("Editando proyecto:", { projectId, name, description, active });
	};

	const handleDeleteProject = (projectId) => {
		setProjects((prev) => {
			const updatedProjects = prev.filter((p) => p.id !== projectId);
			saveProjectsToFile(updatedProjects);
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
					</div>
				</header>

				<main>
					{viewMode === "calendar" ? (
						<Calendar timeEntries={timeEntries} projects={projects} onDateClick={handleDateClick} />
					) : viewMode === "projects" ? (
						<ProjectManager projects={projects} onAddProject={handleAddProject} onEditProject={handleEditProject} onDeleteProject={handleDeleteProject} />
					) : (
						<Configuration projects={projects} timeEntries={timeEntries} onImportData={handleImportData} />
					)}
				</main>

				{isModalOpen && (
					<TimeEntryModal
						date={selectedDate}
						projects={projects.filter((p) => p.active !== false)} // Solo proyectos activos
						allProjects={projects} // Todos los proyectos para mostrar nombres de eliminados
						existingEntries={selectedDate ? timeEntries[selectedDate.toISOString().split("T")[0]] : {}}
						onSave={handleSaveTimeEntry}
						onEdit={handleEditTimeEntry}
						onDelete={handleDeleteTimeEntry}
						onClose={handleCloseModal}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
