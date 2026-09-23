import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';

test('has title', async ({ page }) => {
	await page.goto('');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle('SUSI - UI tool for ReSiE simulations');
});

test('Open Edit Component Modal', async ({ page }) => {
	await page.goto('');
	dragNodeIn(page, 'Bus');
	await page.getByText('BUS_01').dblclick();
	await expect(page.getByText('Edit ComponentBUS_01Component')).toBeVisible();
	await page.getByRole('button', { name: 'Close', exact: true }).click();
});

test('Change Group Node Name', async ({ page }) => {
	await page.goto('');
	await page.locator('.react-flow__pane').click({
		button: 'right',
	});
	await page.getByRole('button', { name: ' Create Component Group' }).click();
	const groupNode = page.locator('.react-flow__node');
	await groupNode.dblclick();
	await page.getByText('Edit ComponentNew').click();
	await page.getByRole('textbox', { name: 'Component Name' }).fill('Testing_Group_Node');
	await page.getByRole('button', { name: 'Save Changes' }).click();
	await expect(groupNode).toContainText('Testing_Group_Node');
});

const dragNodeIn = async (page: Page, title: string, x: number = 0, y: number = 0) => {
	const node = page.locator('.dndnode').and(page.getByText(title));
	await node.dragTo(page.locator('.react-flow__pane'), { targetPosition: { x, y } });
};

test('Dragging some Nodes onto the Pane', async ({ page }) => {
	await page.goto('');
	await dragNodeIn(page, 'Bus');
	await dragNodeIn(page, 'Bus');
	await dragNodeIn(page, 'Grid Supply');
	await dragNodeIn(page, 'Grid Sink');
	await expect(page.getByTestId('rf__wrapper')).toMatchAriaSnapshot(`
	  - group:
	    - paragraph: BUS_01
	  - group:
	    - paragraph: BUS_02
	  - group:
	    - paragraph: GRSU_01
	  - group:
	    - paragraph: GRSI_01
	  `);
});

test('Undo Create Node', async ({ page }) => {
	await page.goto('http://localhost:5002/');
	await dragNodeIn(page, 'Bus');
	await dragNodeIn(page, 'Grid Supply', 300, 300);
	await page.getByRole('button', { name: ' Undo' }).click();
	await expect(page.getByText('GRSU_01')).toHaveCount(0);
});

const checkImportExport = async (page: Page, fileName: string) => {
	// Read the JSON file as a string to preserve formatting
	const configJsonString = fs.readFileSync(fileName, 'utf-8');
	/** Navigate to import export menu */
	await page.goto('http://localhost:5002/');
	await page.getByLabel('Choose Sidebar Menu').click();
	await page.getByRole('menuitem', { name: 'Import/Export' }).click();
	/** find import button, export button, and textbox */
	const exportButton = page.getByRole('button', { name: 'Export' });
	const importButton = page.getByRole('button', { name: 'Import' });
	const textarea = page.getByRole('textbox', { name: 'Paste import file here to' });
	/** paste json into text area, import, export and check that it's the same */
	await textarea.click();
	await textarea.fill(configJsonString);
	await importButton.click();
	await exportButton.click();
	// Parse both as JSON objects for a cleaner diff comparison
	const expectedJson = JSON.parse(configJsonString);
	const actualText = await textarea.inputValue();
	const actualJson = JSON.parse(actualText);
	expect(actualJson).toEqual(expectedJson);
};

test('Import Export', async ({ page }) => {
	await checkImportExport(page, 'tests/test_config.json');
});

