import { useState } from "react";

const ProjectManager = ({ projects, onAddProject, onEditProject, onDeleteProject }) => {
	const [isAddingProject, setIsAddingProject] = useState(false);
	const [editingProjectId, setEditingProjectId] = useState(null);
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectActive, setProjectActive] = useState(true);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (projectName.trim()) {
			onAddProject(projectName.trim(), projectDescription.trim());
			resetForm();
		}
	};

	const handleEditSubmit = (e) => {
		e.preventDefault();
		if (projectName.trim() && editingProjectId) {
			onEditProject(editingProjectId, projectName.trim(), projectDescription.trim(), projectActive);
			resetForm();
		}
	};

	const handleEdit = (project) => {
		setEditingProjectId(project.id);
		setProjectName(project.name);
		setProjectDescription(project.description || "");
		setProjectActive(project.active !== false); // Default true si no existe
		setIsAddingProject(true); // Reutilizar el formulario
	};

	const resetForm = () => {
		setProjectName("");
		setProjectDescription("");
		setProjectActive(true);
		setIsAddingProject(false);
		setEditingProjectId(null);
	};

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-blue-soft-800'>Gestión de Proyectos</h2>
				<button onClick={() => setIsAddingProject(true)} className='px-4 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors font-medium'>
					+ Nuevo Proyecto
				</button>
			</div>

			{isAddingProject && (
				<div className='mb-6 p-4 bg-blue-soft-50 rounded-lg border border-blue-soft-200'>
					<h3 className='text-lg font-semibold text-blue-soft-800 mb-4'>{editingProjectId ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
					<form onSubmit={editingProjectId ? handleEditSubmit : handleSubmit} className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-blue-soft-700 mb-2'>Nombre del Proyecto *</label>
							<input
								type='text'
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								className='w-full px-3 py-2 border border-blue-soft-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-soft-500'
								placeholder='Ingrese el nombre del proyecto'
								required
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-blue-soft-700 mb-2'>Descripción</label>
							<textarea
								value={projectDescription}
								onChange={(e) => setProjectDescription(e.target.value)}
								className='w-full px-3 py-2 border border-blue-soft-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-soft-500'
								placeholder='Descripción opcional del proyecto'
								rows='3'
							/>
						</div>

						<div>
							<label className='flex items-center space-x-2'>
								<input
									type='checkbox'
									checked={projectActive}
									onChange={(e) => setProjectActive(e.target.checked)}
									className='w-4 h-4 text-blue-soft-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-soft-500'
								/>
								<span className='text-sm font-medium text-blue-soft-700'>Proyecto activo (disponible para registro de horas)</span>
							</label>
						</div>

						<div className='flex gap-2'>
							<button type='submit' className='px-4 py-2 bg-blue-soft-500 text-white rounded-lg hover:bg-blue-soft-600 transition-colors'>
								{editingProjectId ? "Actualizar" : "Guardar"}
							</button>
							<button type='button' onClick={resetForm} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			)}

			<div className='space-y-4'>
				{projects.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						<p className='text-lg mb-2'>No hay proyectos registrados</p>
						<p className='text-sm'>Haz clic en "Nuevo Proyecto" para comenzar</p>
					</div>
				) : (
					projects
						.slice() // Crear una copia para no mutar el array original
						.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" })) // Ordenar alfabéticamente
						.map((project) => {
							const isActive = project.active !== false; // Default true si no existe
							return (
								<div key={project.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${isActive ? "border-blue-soft-200" : "border-red-200 bg-red-50"}`}>
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<div className='flex items-center gap-2 mb-2'>
												<h3 className={`text-lg font-semibold ${isActive ? "text-blue-soft-800" : "text-red-600"}`}>{project.name}</h3>
												{!isActive && <span className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium'>INACTIVO</span>}
											</div>
											{project.description && <p className={`text-sm ${isActive ? "text-gray-600" : "text-red-500"}`}>{project.description}</p>}
										</div>

										<div className='flex gap-1 ml-4'>
											<button onClick={() => handleEdit(project)} className='p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors' title='Editar proyecto'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
													/>
												</svg>
											</button>

											<button onClick={() => onDeleteProject(project.id)} className='p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors' title='Eliminar proyecto'>
												<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
						})
				)}
			</div>
		</div>
	);
};

export default ProjectManager;
