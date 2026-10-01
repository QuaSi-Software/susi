import { test, expect } from '@playwright/test';
import { checkImportExport, dragNodeIn, importConfig } from './testingUtils';
import * as fs from 'fs';

test('has title', async ({ page }) => {
	await page.goto('');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle('SUSI - UI tool for ReSiE simulations');
});

test('Open Edit Component Modal', async ({ page }) => {
	await page.goto('');
	await dragNodeIn(page, 'Bus');
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

test('Import Export', async ({ page }) => {
	await checkImportExport(page, 'tests/test_config.json');
});

test('Check delete Edges on Medium Change', async ({ page }) => {
	await page.goto('http://localhost:5002/');
	const configJsonString = fs.readFileSync('tests/row_of_buses.json', 'utf-8');
	await importConfig(page, configJsonString);
	// Click on the canvas to deselect the Import/Export textbox before interacting with nodes
	await page.locator('.react-flow__pane').click();
	await page.getByText('BUS_01').dblclick();
	const mediumSelect = page.locator('#Medium-floatingSelect');
	/** If this waitFor is left out, the test times out on webkit */
	await mediumSelect.waitFor({ state: 'visible' });
	await mediumSelect.selectOption('m_h_w_ht1_DEFAULT_KEY');
	await page.getByRole('button', { name: 'Save Changes' }).click();
	await expect(page.locator('.react-flow__edge-path')).toHaveCount(0);
});

