import { useState } from "react";

const Calendar = ({ timeEntries, projects, onDateClick }) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const firstDayOfMonth = new Date(year, month, 1);
	const lastDayOfMonth = new Date(year, month + 1, 0);
	// Ajustar para que la semana empiece por lunes (0=domingo -> 6, 1=lunes -> 0, etc.)
	const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
	const daysInMonth = lastDayOfMonth.getDate();

	const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

	const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

	const goToPreviousMonth = () => {
		setCurrentDate(new Date(year, month - 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(year, month + 1));
	};

	const getDateString = (day) => {
		const date = new Date(year, month, day);
		// Usar fecha local para evitar problemas de zona horaria
		const localYear = date.getFullYear();
		const localMonth = String(date.getMonth() + 1).padStart(2, "0");
		const localDay = String(date.getDate()).padStart(2, "0");
		return `${localYear}-${localMonth}-${localDay}`;
	};

	const getDayEntries = (day) => {
		const dateStr = getDateString(day);
		return timeEntries[dateStr] || {};
	};

	const getTotalHours = (day) => {
		const entries = getDayEntries(day);
		return Object.values(entries).reduce((sum, entry) => {
			// Compatibilidad con datos antiguos (números) y nuevos (objetos)
			const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
			return sum + (parseFloat(hours) || 0);
		}, 0);
	};

	const isToday = (day) => {
		const today = new Date();
		return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
	};

	const isPastDate = (day) => {
		const today = new Date();
		const date = new Date(year, month, day);
		today.setHours(0, 0, 0, 0);
		date.setHours(0, 0, 0, 0);
		return date < today;
	};

	const handleDayClick = (day) => {
		const date = new Date(year, month, day);
		onDateClick(date);
	};

	const renderCalendarDays = () => {
		const days = [];

		// Espacios en blanco para los días anteriores al primer día del mes
		for (let i = 0; i < firstDayWeekday; i++) {
			days.push(<div key={`empty-${i}`} className='h-24'></div>);
		}

		// Días del mes
		for (let day = 1; day <= daysInMonth; day++) {
			const entries = getDayEntries(day);
			const totalHours = getTotalHours(day);
			const hasEntries = Object.keys(entries).length > 0;

			days.push(
				<div
					key={day}
					onClick={() => handleDayClick(day)}
					className={`
            h-24 border border-blue-soft-200 p-2 cursor-pointer transition-colors
            ${isToday(day) ? "bg-blue-soft-200 border-blue-soft-400" : "bg-white hover:bg-blue-soft-50"}
            ${hasEntries ? "ring-2 ring-blue-soft-300" : ""}
          `}
				>
					<div className='flex justify-between items-start'>
						<span className={`text-sm font-medium ${isToday(day) ? "text-blue-soft-800" : "text-gray-700"}`}>{day}</span>
						{hasEntries && <span className='text-xs bg-blue-soft-500 text-white px-1 rounded'>{totalHours.toFixed(1)}h</span>}
					</div>

					{hasEntries && (
						<div className='mt-1 space-y-1'>
							{Object.entries(entries)
								.sort(([projectIdA], [projectIdB]) => {
									const projectA = projects.find((p) => p.id === projectIdA);
									const projectB = projects.find((p) => p.id === projectIdB);
									const nameA = projectA?.name || "Proyecto eliminado";
									const nameB = projectB?.name || "Proyecto eliminado";
									return nameA.localeCompare(nameB, "es", { sensitivity: "base" });
								})
								.slice(0, 2)
								.map(([projectId, entry]) => {
									const project = projects.find((p) => p.id === projectId);
									// Compatibilidad con datos antiguos (números) y nuevos (objetos)
									const hours = typeof entry === "object" && entry.hours !== undefined ? entry.hours : entry;
									const displayHours = parseFloat(hours) || 0;
									const projectName = project?.name || "Proyecto eliminado";
									const isInactive = project && project.active === false;

									return (
										<div key={projectId} className={`text-xs px-1 rounded truncate ${isInactive ? "bg-red-100 text-red-700" : "bg-blue-soft-100 text-blue-soft-700"}`}>
											{projectName}
											{isInactive ? " (INACTIVO)" : ""}: {displayHours.toFixed(1)}h
										</div>
									);
								})}
							{Object.keys(entries).length > 2 && <div className='text-xs text-blue-soft-600'>+{Object.keys(entries).length - 2} más...</div>}
						</div>
					)}
				</div>
			);
		}

		return days;
	};

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<div className='flex justify-between items-center mb-6'>
				<button onClick={goToPreviousMonth} className='p-2 hover:bg-blue-soft-100 rounded-lg transition-colors'>
					<svg className='w-5 h-5 text-blue-soft-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
					</svg>
				</button>

				<h2 className='text-2xl font-bold text-blue-soft-800'>
					{monthNames[month]} {year}
				</h2>

				<button onClick={goToNextMonth} className='p-2 hover:bg-blue-soft-100 rounded-lg transition-colors'>
					<svg className='w-5 h-5 text-blue-soft-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
					</svg>
				</button>
			</div>

			<div className='grid grid-cols-7 gap-0 mb-2'>
				{dayNames.map((day) => (
					<div key={day} className='p-2 text-center font-medium text-blue-soft-700 bg-blue-soft-50'>
						{day}
					</div>
				))}
			</div>

			<div className='grid grid-cols-7 gap-0'>{renderCalendarDays()}</div>
		</div>
	);
};

export default Calendar;
