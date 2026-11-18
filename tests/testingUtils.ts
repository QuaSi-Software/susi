import { expect, type Page } from '@playwright/test';
import * as fs from 'fs';

export const importConfig = async (page: Page, fileName: string) => {
	await page.getByRole('button', { name: ' Import' }).click();
	await page.locator('input[type="file"]').setInputFiles(fileName);
};

export const checkImportExport = async (page: Page, fileName: string) => {
	// Read the JSON file as a string to preserve formatting
	const configJsonString = fs.readFileSync(fileName, 'utf-8');
	/** Navigate to import export menu */
	await page.goto('/');
	await importConfig(page, fileName);
	const exportButton = page.getByRole('button', { name: 'Export' });
	const textarea = page.getByRole('textbox', { name: 'Paste import file here to' });
	await exportButton.click();
	// Parse both as JSON objects for a cleaner diff comparison
	const expectedJson = JSON.parse(configJsonString);
	const actualText = await textarea.inputValue();
	const actualJson = JSON.parse(actualText);
	expect(actualJson).toEqual(expectedJson);
};

export const dragNodeIn = async (page: Page, title: string, x: number = 0, y: number = 0) => {
	const node = page.locator('.dndnode').and(page.getByText(title));
	await node.dragTo(page.locator('.react-flow__pane'), { targetPosition: { x, y } });
};
