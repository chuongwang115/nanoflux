import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const SETTINGS_PATH = resolve(process.cwd(), 'settings.json');

var settings: Record<string, string> = {};

async function readSettings(): Promise<Record<string, string>> {
	const data = await readFile(SETTINGS_PATH, 'utf-8');
	return JSON.parse(data);
}

async function writeSettings(next: Record<string, string>): Promise<void> {
	const data = JSON.stringify(next, null, 2);
	await writeFile(SETTINGS_PATH, data, 'utf-8');
}

export async function loadSettings(): Promise<void> {
    try {
        settings = await readSettings();
    } catch (error) {
        console.error('Error loading settings:', error);
        settings = {};
    }
}

export function getSettings(): { whitelist: string; prompt: string } {
    return {
        whitelist: settings.whitelist ?? "",
        prompt: settings.prompt ?? ""
    };
}

export async function updateSettings(newSettings: {
    whitelist?: string;
    prompt?: string;
}): Promise<void> {
    const current = getSettings();
    settings = {
        whitelist:
            newSettings.whitelist !== undefined
                ? newSettings.whitelist
                : current.whitelist,
        prompt:
            newSettings.prompt !== undefined ? newSettings.prompt : current.prompt,
    };
    await writeSettings(settings);
}
