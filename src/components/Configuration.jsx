import { useRef } from "react";

const Configuration = ({ projects, timeEntries, onImportData }) => {
	const fileInputRef = useRef(null);

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
