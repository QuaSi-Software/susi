// import { useContext } from 'react';
import { getUndefinedMedium } from '../Sidebar/Mediums/MediumUtils';
import type { Medium } from './Medium';
import type { NodeInput } from './NodeInput';
import { createNodeInput, NodeInputType } from './NodeInput';
// import { AppContext } from '../Reactflow-Components/AppContext';

/**
 * Get NodeInput array for a given component type
 * @param componentType The component type (e.g., "Bus", "GridInput", "Storage")
 * @returns Array of NodeInput objects for the component
 */
export function getNodeInputs(componentType: string, mediums: Medium[]): NodeInput[] {
	const normalizedType = componentType.toLowerCase();

	const configs: Record<string, NodeInput[]> = {
		bus: [createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN')],
		gridinput: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.BOOLEAN, 'is_source', 'Is Source', true),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
		],
		gridoutput: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.BOOLEAN, 'is_source', 'Is Source', false),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
		],
		boundedsupply: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'constant_power', 'Constant Power', -9999),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
		],
		boundedsink: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'constant_power', 'Constant Power', -9999),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
		],
		fixedsupply: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'constant_supply', 'Constant Supply', -9999),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
		],
		demand: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'constant_demand', 'Constant Demand', -9999),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
		],
		storage: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'capacity', 'Capacity', -9999),
			createNodeInput(NodeInputType.NUMBER, 'load', 'Load', -9999),
		],
		genericheatsource: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'constant_power', 'Constant Power', -9999),
			createNodeInput(NodeInputType.NUMBER, 'constant_temperature', 'Constant Temperature', -9999),
			createNodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			createNodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
		],
		fuelboiler: [
			createNodeInput(NodeInputType.MEDIUM, 'm_fuel_in', 'M Fuel In', 'FILL_IN'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'M Heat Out', 'm_h_w_ht1'),
			createNodeInput(NodeInputType.NUMBER, 'power_th', 'Power Th', -9999),
			createNodeInput(NodeInputType.STRING, 'efficiency_fuel_in', 'Efficiency Fuel In', 'const:1.1'),
			createNodeInput(NodeInputType.STRING, 'efficiency_heat_out', 'Efficiency Heat Out', 'const:1.0'),
			createNodeInput(NodeInputType.STRING, 'linear_interface', 'Linear Interface', 'heat_out'),
			createNodeInput(NodeInputType.NUMBER, 'min_power_fraction', 'Min Power Fraction', 0.1),
			createNodeInput(NodeInputType.NUMBER, 'output_temperature', 'Output Temperature', -9999),
		],
		heatpump: [
			createNodeInput(NodeInputType.NUMBER, 'power_th', 'Power Th', -9999),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_in', 'M Heat In', 'm_h_w_lt1'),
			createNodeInput(NodeInputType.MEDIUM, 'm_el_in', 'M El In', 'm_e_ac_230v'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'M Heat Out', 'm_h_w_ht1'),
			createNodeInput(NodeInputType.NUMBER, 'input_temperature', 'Input Temperature', -9999),
			createNodeInput(NodeInputType.NUMBER, 'output_temperature', 'Output Temperature', -9999),
			createNodeInput(NodeInputType.STRING, 'cop_function', 'Cop Function', 'const:3.5'),
			createNodeInput(NodeInputType.NUMBER, 'bypass_cop', 'Bypass Cop', 15.0),
			createNodeInput(NodeInputType.STRING, 'min_power_function', 'Min Power Function', 'const:0.0'),
			createNodeInput(NodeInputType.STRING, 'max_power_function', 'Max Power Function', 'const:1.0'),
			createNodeInput(NodeInputType.NUMBER, 'heat_losses_factor', 'Heat Losses Factor', 0.97),
			createNodeInput(NodeInputType.NUMBER, 'power_losses_factor', 'Power Losses Factor', 0.97),
			createNodeInput(NodeInputType.BOOLEAN, 'consider_icing', 'Consider Icing', true),
			createNodeInput(NodeInputType.STRING, 'icing_coefficients', 'Icing Coefficients', '3,-0.42,15,2,30'),
			createNodeInput(NodeInputType.BOOLEAN, 'optimise_slice_dispatch', 'Optimise Slice Dispatch', true),
			createNodeInput(NodeInputType.NUMBER, 'optimal_plr', 'Optimal Plr', 0.5),
			createNodeInput(NodeInputType.NUMBER, 'nr_optimisation_passes', 'Nr Optimisation Passes', 10),
		],
		pvplant: [
			createNodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'scale', 'Scale', -9999),
			createNodeInput(NodeInputType.MEDIUM, 'm_el_out', 'M El Out', 'm_e_ac_230v'),
		],
		battery: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			createNodeInput(NodeInputType.NUMBER, 'capacity', 'Capacity', -9999),
			createNodeInput(NodeInputType.NUMBER, 'initial_charge', 'Initial Charge', -9999),
		],
		electrolyser: [
			createNodeInput(NodeInputType.NUMBER, 'power_el', 'Power El', -9999),
			createNodeInput(NodeInputType.MEDIUM, 'm_el_in', 'M El In', 'm_e_ac_230v'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_lt_out', 'M Heat Lt Out', 'm_h_w_lt1'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_ht_out', 'M Heat Ht Out', 'm_h_w_ht1'),
			createNodeInput(NodeInputType.MEDIUM, 'm_h2_out', 'M H2 Out', 'm_c_g_h2'),
			createNodeInput(NodeInputType.MEDIUM, 'm_o2_out', 'M O2 Out', 'm_c_g_o2'),
			createNodeInput(NodeInputType.BOOLEAN, 'heat_lt_is_usable', 'Heat Lt Is Usable', true),
			createNodeInput(NodeInputType.NUMBER, 'output_temperature_ht', 'Output Temperature Ht', -9999),
			createNodeInput(NodeInputType.NUMBER, 'output_temperature_lt', 'Output Temperature Lt', -9999),
			createNodeInput(NodeInputType.NUMBER, 'nr_switchable_units', 'Nr Switchable Units', 2),
			createNodeInput(NodeInputType.STRING, 'dispatch_strategy', 'Dispatch Strategy', 'equal_with_mpf'),
			createNodeInput(NodeInputType.NUMBER, 'min_power_fraction', 'Min Power Fraction', 0.4),
			createNodeInput(NodeInputType.NUMBER, 'min_power_fraction_total', 'Min Power Fraction Total', 0.2),
			createNodeInput(NodeInputType.NUMBER, 'optimal_unit_plr', 'Optimal Unit Plr', 0.5),
		],
		buffertank: [
			createNodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'm_h_w_ht1'),
			createNodeInput(NodeInputType.NUMBER, 'capacity', 'Capacity', -9999),
			createNodeInput(NodeInputType.NUMBER, 'volume', 'Volume', -9999),
			createNodeInput(NodeInputType.STRING, 'model_type', 'Model Type', 'ideally_stratified'),
			createNodeInput(NodeInputType.NUMBER, 'high_temperature', 'High Temperature', -9999),
			createNodeInput(NodeInputType.NUMBER, 'low_temperature', 'Low Temperature', -9999),
			createNodeInput(NodeInputType.NUMBER, 'rho_medium', 'Rho Medium', 1000),
			createNodeInput(NodeInputType.NUMBER, 'cp_medium', 'Cp Medium', 4.18),
			createNodeInput(NodeInputType.NUMBER, 'initial_load', 'Initial Load', 0.5),
			createNodeInput(NodeInputType.NUMBER, 'max_load_rate', 'Max Load Rate', 1.0),
			createNodeInput(NodeInputType.NUMBER, 'max_unload_rate', 'Max Unload Rate', 1.5),
			createNodeInput(NodeInputType.NUMBER, 'switch_point', 'Switch Point', 0.25),
			createNodeInput(NodeInputType.BOOLEAN, 'consider_losses', 'Consider Losses', true),
			createNodeInput(NodeInputType.NUMBER, 'h_to_r', 'H To R', 2),
			createNodeInput(NodeInputType.NUMBER, 'constant_ambient_temperature', 'Constant Ambient Temperature', 18),
			createNodeInput(NodeInputType.NUMBER, 'ground_temperature', 'Ground Temperature', 12),
			createNodeInput(NodeInputType.NUMBER, 'thermal_transmission_lid', 'Thermal Transmission Lid', 1.0),
			createNodeInput(NodeInputType.NUMBER, 'thermal_transmission_barrel', 'Thermal Transmission Barrel', 1.0),
			createNodeInput(NodeInputType.NUMBER, 'thermal_transmission_bottom', 'Thermal Transmission Bottom', 1.0),
		],
		chpp: [
			createNodeInput(NodeInputType.MEDIUM, 'm_fuel_in', 'm_fuel_in', 'm_c_g_natgas'),
			createNodeInput(NodeInputType.MEDIUM, 'm_el_out', 'm_el_out', 'm_e_ac_230v'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'm_heat_out', 'm_h_w_ht1'),
		],
		seasonalthermalstorage: [
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_in', 'm_heat_in', 'm_h_w_ht1'),
			createNodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'm_heat_out', 'm_h_w_lt1'),
		],
	};
	const nodeInputs = configs[normalizedType];
	console.assert(nodeInputs !== undefined);
	nodeInputs.forEach((nodeInput) => {
		if (nodeInput.type !== NodeInputType.MEDIUM) return;
		const medium = mediums.find((m) => m.name === nodeInput.value);
		nodeInput.value = medium !== undefined ? medium!.key : getUndefinedMedium().key;
	});

	if (!nodeInputs) {
		console.warn(`Unknown component type: ${componentType}`);
		return [];
	}

	return nodeInputs;
}

export default getNodeInputs;
