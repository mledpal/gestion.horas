import { useRef, useState } from "react";

const Configuration = ({ projects, timeEntries, onImportData, onAddProject, onSaveTimeEntry }) => {
	const fileInputRef = useRef(null);
	const [quickImportText, setQuickImportText] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

	const exportData = () => {
		const data = {
			projects,
			timeEntries,
			exportDate: new Date().toISOString(),
			version: "1.0",
		};

		const dataStr = JSON.stringify(data, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `gestion_horas_backup_${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleImportFile = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		if (file.type !== "application/json") {
			alert("Por favor, selecciona un archivo JSON válido.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target.result);

				// Validar estructura del archivo
				if (!importedData.projects || !importedData.timeEntries) {
					alert("El archivo no tiene el formato correcto. Debe contener 'projects' y 'timeEntries'.");
					return;
				}

				// Confirmar importación
				const confirmImport = window.confirm(
					`¿Estás seguro de que quieres importar estos datos?\n\n` +
						`Proyectos: ${importedData.projects.length}\n` +
						`Entradas de tiempo: ${Object.keys(importedData.timeEntries).length} días\n` +
						`Fecha de exportación: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleDateString() : "No disponible"}\n\n` +
						`ADVERTENCIA: Esto sobrescribirá todos los datos actuales.`
				);

				if (confirmImport) {
					onImportData(importedData);
					alert("Datos importados exitosamente.");
				}
			} catch (error) {
				alert("Error al leer el archivo: " + error.message);
			}
		};
		reader.readAsText(file);

		// Limpiar el input para permitir seleccionar el mismo archivo de nuevo
		event.target.value = "";
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const clearAllData = () => {
		const confirmClear = window.confirm(
			"¿ESTÁS SEGURO de que quieres eliminar TODOS los datos?\n\n" + "Esta acción no se puede deshacer.\n" + "Se recomienda exportar los datos primero como respaldo."
		);

		if (confirmClear) {
			const doubleConfirm = window.confirm(
				"ÚLTIMA CONFIRMACIÓN:\n\n" +
					"Se eliminarán permanentemente:\n" +
					`• ${projects.length} proyectos\n` +
					`• ${Object.keys(timeEntries).length} días de registros\n\n` +
					"¿Continuar?"
			);

			if (doubleConfirm) {
				onImportData({ projects: [], timeEntries: {} });
				alert("Todos los datos han sido eliminados.");
			}
		}
	};

	const getTotalHours = () => {
		return Object.values(timeEntries).reduce((total, dayEntries) => {
			return (
				total +
				Object.values(dayEntries).reduce((dayTotal, entry) => {
					const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
					return dayTotal + (parseFloat(hours) || 0);
				}, 0)
			);
		}, 0);
	};

	const getTotalDays = () => {
		return Object.keys(timeEntries).length;
	};

	// Función para procesar importación rápida de texto
	const processQuickImport = () => {
		if (!quickImportText.trim()) {
			alert("Por favor, introduce el texto a procesar.");
			return;
		}

		const lines = quickImportText
			.trim()
			.split("\n")
			.filter((line) => line.trim());
		const entries = [];
		const errors = [];

		lines.forEach((line, index) => {
			// Buscar patrones como: PROYECTO\t\tHH:MM\tHH:MM o PROYECTO   HH:MM   HH:MM
			const patterns = [
				// Patrón con tabs: PROYECTO\t\tHH:MM\tHH:MM
				/^(.+?)\s*\t+\s*(\d{1,2}:\d{2})\s*\t+\s*(\d{1,2}:\d{2})\s*$/,
				// Patrón con espacios múltiples: PROYECTO    HH:MM    HH:MM
				/^(.+?)\s{2,}(\d{1,2}:\d{2})\s{2,}(\d{1,2}:\d{2})\s*$/,
				// Patrón flexible: PROYECTO [espacios/tabs] HH:MM [espacios/tabs] HH:MM
				/^(.+?)\s+(\d{1,2}:\d{2})\s+(\d{1,2}:\d{2})\s*$/,
			];

			let match = null;
			for (const pattern of patterns) {
				match = line.match(pattern);
				if (match) break;
			}

			if (match) {
				const [, projectName, startTime, endTime] = match;
				const cleanProjectName = projectName.trim();

				// Validar formato de horas
				const timePattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
				if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
					errors.push(`Línea ${index + 1}: Formato de hora inválido - ${line}`);
					return;
				}

				// Calcular horas
				const start = new Date(`1970-01-01T${startTime}:00`);
				const end = new Date(`1970-01-01T${endTime}:00`);
				let diffMs = end - start;

				// Si la hora de fin es menor que la de inicio, asumimos que pasa al día siguiente
				if (diffMs < 0) {
					diffMs += 24 * 60 * 60 * 1000;
				}

				const hours = diffMs / (1000 * 60 * 60);

				entries.push({
					projectName: cleanProjectName,
					startTime,
					endTime,
					hours: hours.toFixed(2),
				});
			} else {
				errors.push(`Línea ${index + 1}: Formato no reconocido - ${line}`);
			}
		});

		if (errors.length > 0) {
			alert("Errores encontrados:\n\n" + errors.join("\n") + "\n\n¿Deseas continuar con las entradas válidas?");
		}

		if (entries.length === 0) {
			alert("No se encontraron entradas válidas para procesar.");
			return;
		}

		// Mostrar resumen antes de importar
		const summary = entries.map((e) => `${e.projectName}: ${e.startTime}-${e.endTime} (${e.hours}h)`).join("\n");
		const confirmImport = window.confirm(`Se procesarán ${entries.length} entradas para la fecha ${selectedDate}:\n\n${summary}\n\n¿Continuar?`);

		if (!confirmImport) return;

		// Procesar cada entrada
		const selectedDateObj = new Date(selectedDate + "T12:00:00"); // Mediodía para evitar problemas de zona horaria
		const newProjects = [];

		entries.forEach((entry) => {
			// Buscar proyecto existente
			let project = projects.find((p) => p.name.toLowerCase().trim() === entry.projectName.toLowerCase().trim());

			if (!project) {
				// Buscar en proyectos recién creados en esta sesión
				project = newProjects.find((p) => p.name.toLowerCase().trim() === entry.projectName.toLowerCase().trim());
			}

			if (!project) {
				// Crear nuevo proyecto
				const newProject = {
					id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
					name: entry.projectName,
					description: `Proyecto creado automáticamente desde importación rápida`,
					active: true,
				};

				// Agregarlo a la lista de nuevos proyectos
				newProjects.push(newProject);

				// Agregarlo al sistema
				onAddProject(newProject.name, newProject.description, newProject.active);
				project = newProject;
			}

			// Guardar entrada de tiempo
			onSaveTimeEntry(selectedDateObj, project.id, entry.hours, entry.startTime, entry.endTime);
		});

		const newProjectsCount = newProjects.length;
		const message =
			newProjectsCount > 0
				? `¡Importación completada! Se procesaron ${entries.length} entradas y se crearon ${newProjectsCount} proyectos nuevos:\n${newProjects
						.map((p) => `• ${p.name}`)
						.join("\n")}`
				: `¡Importación completada! Se procesaron ${entries.length} entradas.`;

		alert(message);
		setQuickImportText(""); // Limpiar el texto
	};

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<h2 className='text-2xl font-bold text-blue-soft-800 mb-6'>Configuración</h2>

			{/* Estadísticas */}
			<div className='bg-blue-soft-50 rounded-lg p-4 mb-6'>
				<h3 className='text-lg font-semibold text-blue-soft-800 mb-3'>Resumen de Datos</h3>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-blue-soft-600'>{projects.length}</div>
						<div className='text-sm text-blue-soft-700'>Proyectos</div>
					</div>
					<div className='text-center'>
						<div className='text-2xl font-bold text-blue-soft-600'>{getTotalDays()}</div>
						<div className='text-sm text-blue-soft-700'>Días registrados</div>
					</div>
					<div className='text-center'>
						<div className='text-2xl font-bold text-blue-soft-600'>{getTotalHours().toFixed(1)}</div>
						<div className='text-sm text-blue-soft-700'>Horas totales</div>
					</div>
				</div>
			</div>

			{/* Importación Rápida de Texto */}
			<div className='bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6'>
				<h3 className='text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2'>
					<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
					</svg>
					Importación Rápida de Texto
				</h3>

				<div className='mb-4'>
					<p className='text-sm text-purple-700 mb-3'>
						Pega texto con formato: <code className='bg-purple-100 px-1 rounded'>PROYECTO HH:MM HH:MM</code>
					</p>
					<div className='bg-purple-100 p-3 rounded text-xs text-purple-800 mb-3'>
						<strong>Ejemplo:</strong>
						<br />
						BEKLUB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8:00&nbsp;&nbsp;&nbsp;&nbsp;10:00
						<br />
						API GYM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10:00&nbsp;&nbsp;&nbsp;11:00
						<br />
						ASPERGER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11:30&nbsp;&nbsp;&nbsp;15:00
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
					<div className='md:col-span-2'>
						<label className='block text-sm font-medium text-purple-700 mb-2'>Texto a procesar:</label>
						<textarea
							value={quickImportText}
							onChange={(e) => setQuickImportText(e.target.value)}
							placeholder='Pega aquí tu texto con los horarios...'
							className='w-full h-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-purple-700 mb-2'>Fecha de aplicación:</label>
						<input
							type='date'
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className='w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4'
						/>

						<button
							onClick={processQuickImport}
							disabled={!quickImportText.trim()}
							className='w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2'
						>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' />
							</svg>
							Procesar Texto
						</button>
					</div>
				</div>
			</div>

			{/* Sección de Importar/Exportar */}
			<div className='space-y-6'>
				<div>
					<h3 className='text-lg font-semibold text-blue-soft-800 mb-4'>Gestión de Datos</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Exportar */}
						<div className='border border-blue-soft-200 rounded-lg p-4'>
							<h4 className='font-medium text-blue-soft-700 mb-2'>Exportar Datos</h4>
							<p className='text-sm text-gray-600 mb-4'>Descarga todos tus proyectos y registros de tiempo en un archivo JSON.</p>
							<button
								onClick={exportData}
								className='w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2'
							>
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
									/>
								</svg>
								Exportar Datos
							</button>
						</div>

						{/* Importar */}
						<div className='border border-blue-soft-200 rounded-lg p-4'>
							<h4 className='font-medium text-blue-soft-700 mb-2'>Importar Datos</h4>
							<p className='text-sm text-gray-600 mb-4'>Carga datos desde un archivo JSON exportado previamente.</p>
							<button
								onClick={triggerFileInput}
								className='w-full px-4 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors font-medium flex items-center justify-center gap-2'
							>
								<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' />
								</svg>
								Importar Datos
							</button>
							<input ref={fileInputRef} type='file' accept='.json,application/json' onChange={handleImportFile} className='hidden' />
						</div>
					</div>
				</div>

				{/* Sección de Peligro */}
				<div className='border border-red-200 rounded-lg p-4 bg-red-50'>
					<h3 className='text-lg font-semibold text-red-800 mb-4'>Zona de Peligro</h3>
					<div>
						<h4 className='font-medium text-red-700 mb-2'>Eliminar Todos los Datos</h4>
						<p className='text-sm text-red-600 mb-4'>
							Esta acción eliminará permanentemente todos los proyectos y registros de tiempo. Se recomienda exportar los datos antes de continuar.
						</p>
						<button onClick={clearAllData} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2'>
							<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
							Eliminar Todos los Datos
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Configuration;
