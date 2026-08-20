import { DateTime } from 'luxon';
import type { ResieParameterMenuInfo } from '../../Sidebar/ResieParameters/ResieParameterMenuInfo';
const defaultDateFormat = 'dd.LL.yyyy HH:mm';
function now(): Date {
	const now = new Date();
	now.setHours(0, 0, 0);
	return now;
}

function getDatetimeFormat(startEndUnit: string | null): string {
	if (!startEndUnit) return defaultDateFormat;
	let result = startEndUnit.replaceAll('m', 'L');
	result = result.replaceAll('M', 'm');
	return result;
}

export function parseDate(dateString: string | null | undefined, startEndUnit: string | null): Date {
	if (!dateString) return now();
	const format = getDatetimeFormat(startEndUnit);
	let date = DateTime.fromFormat(dateString, format);
	if (!date.isValid) {
		date = DateTime.fromFormat(dateString, defaultDateFormat);
		if (!date.isValid) return now();
	}
	return date.toJSDate();
}

export function exportDate(date: Date, startEndUnit: string | null = null): string {
	const dateTime: DateTime = DateTime.fromJSDate(date);
	const format = getDatetimeFormat(startEndUnit);
	return dateTime.toFormat(format);
}

export function getStartEndUnit(resieParameterMenus: ResieParameterMenuInfo[]): string {
	const simParams = resieParameterMenus.find((e) => e.exportKey === 'simulation_parameters');
	const startEndUnit = simParams?.inputs.find((e) => e.resieName === 'start_end_unit');
	if (!startEndUnit) return defaultDateFormat;
	return startEndUnit.value;
}
