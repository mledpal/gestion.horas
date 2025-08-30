import { useState } from "react";

const QuickProjectModal = ({ onSubmit, onClose }) => {
	const [projectText, setProjectText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (projectText.trim()) {
			onSubmit(projectText);
			setProjectText("");
		}
	};

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={handleOverlayClick}>
			<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold text-blue-soft-800'>Registro Rápido</h2>
					<button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-2xl font-bold'>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='projectText' className='block text-sm font-medium text-gray-700 mb-2'>
							Proyecto y Horas (obligatorio)
						</label>
						<input
							type='text'
							id='projectText'
							value={projectText}
							onChange={(e) => setProjectText(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-soft-500 focus:border-transparent'
							placeholder='PROYECTO		8:00		10:00'
							autoFocus
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<button
							type='submit'
							disabled={!projectText.trim()}
							className='flex-1 bg-blue-soft-600 text-white py-2 px-4 rounded-md hover:bg-blue-soft-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
						>
							Crear y Registrar
						</button>
						<button type='button' onClick={onClose} className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors'>
							Cancelar
						</button>
					</div>
				</form>

				<div className='mt-4 p-3 bg-blue-soft-50 rounded-md'>
					<p className='text-sm text-blue-soft-700 mb-2'>
						<strong>Formato requerido:</strong>
					</p>
					<div className='text-xs text-blue-soft-600 space-y-1'>
						<div>
							<code className='bg-white px-2 py-1 rounded'>PROYECTO 8:00 10:00</code>
						</div>
					</div>
					<p className='text-xs text-blue-soft-600 mt-2'>
						<strong>Obligatorio:</strong> Debe incluir proyecto, hora inicio y hora fin. Las horas se registrarán para el día de hoy.
					</p>
				</div>
			</div>
		</div>
	);
};

export default QuickProjectModal;
