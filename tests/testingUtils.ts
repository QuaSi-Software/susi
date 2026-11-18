import { expect, type Page } from '@playwright/test';
import * as fs from 'fs';

export const importConfig = async (page: Page, fileName: string) => {
	await page.getByRole('button', { name: ' Import' }).click();
	await page.locator('input[type="file"]').setInputFiles(fileName);
};

export const checkImportExport = async (page: Page, fileName: string) => {
	await page.goto('/');
	/** Import a file and then export the scene again */
	await importConfig(page, fileName);
	const downloadPromise = page.waitForEvent('download');
	await page.getByRole('button', { name: ' Export' }).click();
	const download = await downloadPromise;
	// Parse both files as JSON objects for a cleaner diff comparison
	const originalJSON = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
	const outputJSON = JSON.parse(fs.readFileSync(await download.path(), 'utf-8'));
	expect(originalJSON).toEqual(outputJSON);
	await download.delete();
};

export const dragNodeIn = async (page: Page, title: string, x: number = 0, y: number = 0) => {
	const node = page.locator('.dndnode').and(page.getByText(title));
	await node.dragTo(page.locator('.react-flow__pane'), { targetPosition: { x, y } });
};
