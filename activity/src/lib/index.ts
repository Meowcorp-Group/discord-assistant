// place files you want to import through the `$lib` alias in this folder.

import { error } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";

export function mapValue<T extends string | number | symbol, R>(mapping: Record<T, R>, value: T): R {
	if (!(value in mapping)) {
		throw error(400, `Invalid value: ${String(value)}. Expected one of: ${Object.keys(mapping).join(', ')}`);
	}
	return mapping[value];
}

export function getDaysAgoDate(timezone: string, days: number): string {
	const today = Temporal.Now.zonedDateTimeISO(timezone).toPlainDate();
	return today.subtract({ days }).toString();
}