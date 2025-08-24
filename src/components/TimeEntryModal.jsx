import { useState, useEffect } from "react";

const TimeEntryModal = ({ date, projects, allProjects, existingEntries, onSave, onEdit, onDelete, onClose }) => {
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [calculatedHours, setCalculatedHours] = useState(0);
	const [editingProjectId, setEditingProjectId] = useState(null);
	const [editStartTime, setEditStartTime] = useState("");
	const [editEndTime, setEditEndTime] = useState("");
	const [editCalculatedHours, setEditCalculatedHours] = useState(0);

	// Calcular horas automáticamente cuando cambian las horas de inicio o fin
	useEffect(() => {
		if (startTime && endTime) {
			const start = new Date(`1970-01-01T${startTime}:00`);
			const end = new Date(`1970-01-01T${endTime}:00`);

			let diffMs = end - start;

			// Si la hora de fin es menor que la de inicio, asumimos que pasa al día siguiente
			if (diffMs < 0) {
				diffMs += 24 * 60 * 60 * 1000; // Añadir 24 horas en milisegundos
			}

			const diffHours = diffMs / (1000 * 60 * 60);
			setCalculatedHours(diffHours);
		} else {
			setCalculatedHours(0);
		}
	}, [startTime, endTime]);

	// Calcular horas para la edición
	useEffect(() => {
		if (editStartTime && editEndTime) {
			const start = new Date(`1970-01-01T${editStartTime}:00`);
			const end = new Date(`1970-01-01T${editEndTime}:00`);

			let diffMs = end - start;

			if (diffMs < 0) {
				diffMs += 24 * 60 * 60 * 1000;
			}

			const diffHours = diffMs / (1000 * 60 * 60);
			setEditCalculatedHours(diffHours);
		} else {
			setEditCalculatedHours(0);
		}
	}, [editStartTime, editEndTime]);

	const isPastDate = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const selectedDate = new Date(date);
		selectedDate.setHours(0, 0, 0, 0);
		return selectedDate < today;
	};

	const formatDate = (date) => {
		return date.toLocaleDateString("es-ES", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedProjectId && startTime && endTime && calculatedHours > 0) {
			onSave(date, selectedProjectId, calculatedHours.toFixed(2), startTime, endTime);
			setSelectedProjectId("");
			setStartTime("");
			setEndTime("");
			setCalculatedHours(0);
		}
	};

	const handleEdit = (projectId) => {
		const entry = existingEntries[projectId];
		if (entry) {
			const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
			const startTime = typeof entry === "object" ? entry.startTime : null;
			const endTime = typeof entry === "object" ? entry.endTime : null;

			setEditingProjectId(projectId);
			setEditStartTime(startTime || "");
			setEditEndTime(endTime || "");
			setEditCalculatedHours(parseFloat(hours) || 0);
		}
	};

	const handleSaveEdit = (e) => {
		e.preventDefault();
		if (editingProjectId && editStartTime && editEndTime && editCalculatedHours > 0) {
			onEdit(date, editingProjectId, editCalculatedHours.toFixed(2), editStartTime, editEndTime);
			setEditingProjectId(null);
			setEditStartTime("");
			setEditEndTime("");
			setEditCalculatedHours(0);
		}
	};

	const handleCancelEdit = () => {
		setEditingProjectId(null);
		setEditStartTime("");
		setEditEndTime("");
		setEditCalculatedHours(0);
	};

	const handleDelete = (projectId) => {
		if (window.confirm("¿Estás seguro de que quieres eliminar esta entrada?")) {
			onDelete(date, projectId);
		}
	};

	const getProjectName = (projectId) => {
		// Primero buscar en proyectos activos
		let project = projects.find((p) => p.id === projectId);

		// Si no se encuentra y tenemos allProjects, buscar ahí
		if (!project && allProjects) {
			project = allProjects.find((p) => p.id === projectId);
			if (project) {
				return project.active === false ? `${project.name} (INACTIVO)` : project.name;
			}
		}

		return project ? project.name : "Proyecto eliminado";
	};

	const totalHours = Object.values(existingEntries || {}).reduce((sum, entry) => {
		// Compatibilidad con datos antiguos (números) y nuevos (objetos)
		const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
		return sum + (parseFloat(hours) || 0);
	}, 0);

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'>
				<div className='p-6'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-bold text-blue-soft-800'>{isPastDate() ? "Registro de" : "Registrar horas"}</h2>
						<button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					</div>

					<div className='mb-4 p-3 bg-blue-soft-50 rounded-lg'>
						<p className='text-blue-soft-700 font-medium capitalize'>{formatDate(date)}</p>
					</div>

					{/* Mostrar entradas existentes */}
					{existingEntries && Object.keys(existingEntries).length > 0 && (
						<div className='mb-6'>
							<h3 className='text-lg font-semibold text-blue-soft-800 mb-3'>{isPastDate() ? "Horas trabajadas:" : "Horas registradas hoy:"}</h3>
							<div className='space-y-2'>
								{Object.entries(existingEntries)
									.sort(([projectIdA], [projectIdB]) => {
										// Obtener nombres de proyectos para ordenar
										const projectA = (allProjects || projects).find((p) => p.id === projectIdA);
										const projectB = (allProjects || projects).find((p) => p.id === projectIdB);
										const nameA = projectA?.name || "Proyecto eliminado";
										const nameB = projectB?.name || "Proyecto eliminado";
										return nameA.localeCompare(nameB, "es", { sensitivity: "base" });
									})
									.map(([projectId, entry]) => {
										// Compatibilidad con datos antiguos (números) y nuevos (objetos)
										const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
										const startTime = typeof entry === "object" ? entry.startTime : null;
										const endTime = typeof entry === "object" ? entry.endTime : null;
										const displayHours = parseFloat(hours) || 0;

										// Si estamos editando esta entrada, mostrar formulario de edición
										if (editingProjectId === projectId) {
											return (
												<form key={projectId} onSubmit={handleSaveEdit} className='p-3 bg-blue-soft-50 rounded-lg border-2 border-blue-soft-300'>
													<div className='mb-2'>
														<span className='text-blue-soft-700 font-medium text-sm'>Editando: {getProjectName(projectId)}</span>
													</div>

													<div className='grid grid-cols-2 gap-2 mb-2'>
														<div>
															<label className='block text-xs font-medium text-blue-soft-700 mb-1'>Hora inicio</label>
															<input
																type='time'
																value={editStartTime}
																onChange={(e) => setEditStartTime(e.target.value)}
																className='w-full px-2 py-1 text-sm border border-blue-soft-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-soft-500'
																required
															/>
														</div>
														<div>
															<label className='block text-xs font-medium text-blue-soft-700 mb-1'>Hora fin</label>
															<input
																type='time'
																value={editEndTime}
																onChange={(e) => setEditEndTime(e.target.value)}
																className='w-full px-2 py-1 text-sm border border-blue-soft-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-soft-500'
																required
															/>
														</div>
													</div>

													{editCalculatedHours > 0 && <div className='mb-2 text-xs text-blue-soft-600'>Horas calculadas: {editCalculatedHours.toFixed(2)}</div>}

													<div className='flex gap-1'>
														<button type='submit' className='px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors'>
															Guardar
														</button>
														<button type='button' onClick={handleCancelEdit} className='px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors'>
															Cancelar
														</button>
													</div>
												</form>
											);
										}

										// Vista normal de la entrada
										return (
											<div key={projectId} className='p-3 bg-blue-soft-100 rounded-lg'>
												<div className='flex justify-between items-start mb-1'>
													<div className='flex-1'>
														<span className='text-blue-soft-700 font-medium'>{getProjectName(projectId)}</span>
														<div className='text-blue-soft-800 font-bold'>
															{displayHours.toFixed(2)} {displayHours === 1 ? "hora" : "horas"}
														</div>
														{startTime && endTime && (
															<div className='text-xs text-blue-soft-600'>
																Horario: {startTime} - {endTime}
															</div>
														)}
													</div>
													<div className='flex gap-1 ml-2'>
														<button onClick={() => handleEdit(projectId)} className='p-1 text-blue-500 hover:bg-blue-100 rounded transition-colors' title='Editar entrada'>
															<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={2}
																	d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
																/>
															</svg>
														</button>
														<button onClick={() => handleDelete(projectId)} className='p-1 text-red-500 hover:bg-red-100 rounded transition-colors' title='Eliminar entrada'>
															<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	strokeWidth={2}
																	d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
																/>
															</svg>
														</button>
													</div>
												</div>
											</div>
										);
									})}
								<div className='border-t border-blue-soft-300 pt-2 mt-3'>
									<div className='flex justify-between items-center font-bold text-blue-soft-800'>
										<span>Total:</span>
										<span>
											{totalHours.toFixed(2)} {totalHours === 1 ? "hora" : "horas"}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Formulario para agregar nuevas horas - siempre disponible */}
					{projects.length === 0 ? (
						<div className='text-center py-4'>
							<p className='text-gray-500 mb-4'>No hay proyectos disponibles. Primero debes crear un proyecto.</p>
						</div>
					) : (
						<>
							{/* Separador visual si hay entradas existentes */}
							{existingEntries && Object.keys(existingEntries).length > 0 && (
								<div className='border-t border-blue-soft-200 my-6'>
									<h3 className='text-lg font-semibold text-blue-soft-800 mt-4 mb-3'>Agregar nueva entrada:</h3>
								</div>
							)}

							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-blue-soft-700 mb-2'>Proyecto *</label>
									<select
										value={selectedProjectId}
										onChange={(e) => setSelectedProjectId(e.target.value)}
										className='w-full px-3 py-2 border border-blue-soft-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-soft-500'
										required
									>
										<option value=''>Seleccionar proyecto</option>
										{projects
											.slice() // Crear copia para no mutar el array original
											.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" })) // Ordenar alfabéticamente
											.map((project) => (
												<option key={project.id} value={project.id}>
													{project.name}
												</option>
											))}
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-blue-soft-700 mb-2'>Hora de inicio *</label>
									<input
										type='time'
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
										className='w-full px-3 py-2 border border-blue-soft-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-soft-500'
										required
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-blue-soft-700 mb-2'>Hora de fin *</label>
									<input
										type='time'
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
										className='w-full px-3 py-2 border border-blue-soft-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-soft-500'
										required
									/>
								</div>

								{calculatedHours > 0 && (
									<div className='p-3 bg-blue-soft-50 rounded-lg border border-blue-soft-200'>
										<div className='flex justify-between items-center'>
											<span className='text-sm font-medium text-blue-soft-700'>Horas calculadas:</span>
											<span className='text-lg font-bold text-blue-soft-800'>
												{calculatedHours.toFixed(2)} {calculatedHours === 1 ? "hora" : "horas"}
											</span>
										</div>
										{calculatedHours > 12 && <p className='text-xs text-amber-600 mt-1'>⚠️ Más de 12 horas - verifica que las horas sean correctas</p>}
									</div>
								)}

								<div className='flex gap-2 pt-4'>
									<button type='submit' className='flex-1 px-4 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors font-medium'>
										Registrar Horas
									</button>
									<button type='button' onClick={onClose} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium'>
										Cerrar
									</button>
								</div>
							</form>
						</>
					)}

					{/* Solo botón cerrar si no hay proyectos activos */}
					{projects.length === 0 && (
						<div className='pt-4'>
							<button onClick={onClose} className='w-full px-4 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors font-medium'>
								Cerrar
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TimeEntryModal;
