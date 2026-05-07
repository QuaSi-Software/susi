// import { useContext } from 'react';
import { getUndefinedMedium } from '../Mediums/MediumUtils';
import type { Medium } from '../Mediums/Medium';
import { NodeInput, NodeInputType } from './NodeInput';
// import { AppContext } from '../Reactflow-Components/AppContext';

/**
 * Get NodeInput array for a given component type
 * @param componentType The component type (e.g., "Bus", "GridInput", "Storage")
 * @returns Array of NodeInput objects for the component
 */
export function getNodeInputs(componentType: string, mediums: Medium[]): NodeInput[] {
	const normalizedType = componentType.toLowerCase();

	const configs: Record<string, NodeInput[]> = {
		bus: [new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN')],
		gridinput: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.BOOLEAN, 'is_source', 'Is Source', true),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
		],
		gridoutput: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.BOOLEAN, 'is_source', 'Is Source', false),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
		],
		boundedsupply: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'constant_power', 'Constant Power', -9999),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
		],
		boundedsink: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'constant_power', 'Constant Power', -9999),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
		],
		fixedsupply: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'constant_supply', 'Constant Supply', -9999),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
		],
		demand: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'constant_demand', 'Constant Demand', -9999),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
		],
		storage: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'capacity', 'Capacity', -9999),
			new NodeInput(NodeInputType.INT, 'load', 'Load', -9999),
		],
		genericheatsource: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'constant_power', 'Constant Power', -9999),
			new NodeInput(NodeInputType.INT, 'constant_temperature', 'Constant Temperature', -9999),
			new NodeInput(
				NodeInputType.STRING,
				'max_power_profile_file_path',
				'Max Power Profile File Path',
				'FILL_IN'
			),
			new NodeInput(
				NodeInputType.STRING,
				'temperature_profile_file_path',
				'Temperature Profile File Path',
				'FILL_IN'
			),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
		],
		fuelboiler: [
			new NodeInput(NodeInputType.MEDIUM, 'm_fuel_in', 'M Fuel In', 'FILL_IN'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'M Heat Out', 'm_h_w_ht1'),
			new NodeInput(NodeInputType.INT, 'power_th', 'Power Th', -9999),
			new NodeInput(NodeInputType.STRING, 'efficiency_fuel_in', 'Efficiency Fuel In', 'const:1.1'),
			new NodeInput(NodeInputType.STRING, 'efficiency_heat_out', 'Efficiency Heat Out', 'const:1.0'),
			new NodeInput(NodeInputType.STRING, 'linear_interface', 'Linear Interface', 'heat_out'),
			new NodeInput(NodeInputType.INT, 'min_power_fraction', 'Min Power Fraction', 0.1),
			new NodeInput(NodeInputType.INT, 'output_temperature', 'Output Temperature', -9999),
		],
		heatpump: [
			new NodeInput(NodeInputType.INT, 'power_th', 'Power Th', -9999),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_in', 'M Heat In', 'm_h_w_lt1'),
			new NodeInput(NodeInputType.MEDIUM, 'm_el_in', 'M El In', 'm_e_ac_230v'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'M Heat Out', 'm_h_w_ht1'),
			new NodeInput(NodeInputType.INT, 'input_temperature', 'Input Temperature', -9999),
			new NodeInput(NodeInputType.INT, 'output_temperature', 'Output Temperature', -9999),
			new NodeInput(NodeInputType.STRING, 'cop_function', 'Cop Function', 'const:3.5'),
			new NodeInput(NodeInputType.INT, 'bypass_cop', 'Bypass Cop', 15.0),
			new NodeInput(NodeInputType.STRING, 'min_power_function', 'Min Power Function', 'const:0.0'),
			new NodeInput(NodeInputType.STRING, 'max_power_function', 'Max Power Function', 'const:1.0'),
			new NodeInput(NodeInputType.INT, 'heat_losses_factor', 'Heat Losses Factor', 0.97),
			new NodeInput(NodeInputType.INT, 'power_losses_factor', 'Power Losses Factor', 0.97),
			new NodeInput(NodeInputType.BOOLEAN, 'consider_icing', 'Consider Icing', true),
			new NodeInput(NodeInputType.STRING, 'icing_coefficients', 'Icing Coefficients', '3,-0.42,15,2,30'),
			new NodeInput(NodeInputType.BOOLEAN, 'optimise_slice_dispatch', 'Optimise Slice Dispatch', true),
			new NodeInput(NodeInputType.INT, 'optimal_plr', 'Optimal Plr', 0.5),
			new NodeInput(NodeInputType.INT, 'nr_optimisation_passes', 'Nr Optimisation Passes', 10),
		],
		pvplant: [
			new NodeInput(NodeInputType.STRING, 'energy_profile_file_path', 'Energy Profile File Path', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'scale', 'Scale', -9999),
			new NodeInput(NodeInputType.MEDIUM, 'm_el_out', 'M El Out', 'm_e_ac_230v'),
		],
		battery: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'FILL_IN'),
			new NodeInput(NodeInputType.INT, 'capacity', 'Capacity', -9999),
			new NodeInput(NodeInputType.INT, 'initial_charge', 'Initial Charge', -9999),
		],
		electrolyser: [
			new NodeInput(NodeInputType.INT, 'power_el', 'Power El', -9999),
			new NodeInput(NodeInputType.MEDIUM, 'm_el_in', 'M El In', 'm_e_ac_230v'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_lt_out', 'M Heat Lt Out', 'm_h_w_lt1'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_ht_out', 'M Heat Ht Out', 'm_h_w_ht1'),
			new NodeInput(NodeInputType.MEDIUM, 'm_h2_out', 'M H2 Out', 'm_c_g_h2'),
			new NodeInput(NodeInputType.MEDIUM, 'm_o2_out', 'M O2 Out', 'm_c_g_o2'),
			new NodeInput(NodeInputType.BOOLEAN, 'heat_lt_is_usable', 'Heat Lt Is Usable', true),
			new NodeInput(NodeInputType.INT, 'output_temperature_ht', 'Output Temperature Ht', -9999),
			new NodeInput(NodeInputType.INT, 'output_temperature_lt', 'Output Temperature Lt', -9999),
			new NodeInput(NodeInputType.INT, 'nr_switchable_units', 'Nr Switchable Units', 2),
			new NodeInput(NodeInputType.STRING, 'dispatch_strategy', 'Dispatch Strategy', 'equal_with_mpf'),
			new NodeInput(NodeInputType.INT, 'min_power_fraction', 'Min Power Fraction', 0.4),
			new NodeInput(NodeInputType.INT, 'min_power_fraction_total', 'Min Power Fraction Total', 0.2),
			new NodeInput(NodeInputType.INT, 'optimal_unit_plr', 'Optimal Unit Plr', 0.5),
		],
		buffertank: [
			new NodeInput(NodeInputType.MEDIUM, 'medium', 'Medium', 'm_h_w_ht1'),
			new NodeInput(NodeInputType.INT, 'capacity', 'Capacity', -9999),
			new NodeInput(NodeInputType.INT, 'volume', 'Volume', -9999),
			new NodeInput(NodeInputType.STRING, 'model_type', 'Model Type', 'ideally_stratified'),
			new NodeInput(NodeInputType.INT, 'high_temperature', 'High Temperature', -9999),
			new NodeInput(NodeInputType.INT, 'low_temperature', 'Low Temperature', -9999),
			new NodeInput(NodeInputType.INT, 'rho_medium', 'Rho Medium', 1000),
			new NodeInput(NodeInputType.INT, 'cp_medium', 'Cp Medium', 4.18),
			new NodeInput(NodeInputType.INT, 'initial_load', 'Initial Load', 0.5),
			new NodeInput(NodeInputType.INT, 'max_load_rate', 'Max Load Rate', 1.0),
			new NodeInput(NodeInputType.INT, 'max_unload_rate', 'Max Unload Rate', 1.5),
			new NodeInput(NodeInputType.INT, 'switch_point', 'Switch Point', 0.25),
			new NodeInput(NodeInputType.BOOLEAN, 'consider_losses', 'Consider Losses', true),
			new NodeInput(NodeInputType.INT, 'h_to_r', 'H To R', 2),
			new NodeInput(NodeInputType.INT, 'constant_ambient_temperature', 'Constant Ambient Temperature', 18),
			new NodeInput(NodeInputType.INT, 'ground_temperature', 'Ground Temperature', 12),
			new NodeInput(NodeInputType.INT, 'thermal_transmission_lid', 'Thermal Transmission Lid', 1.0),
			new NodeInput(NodeInputType.INT, 'thermal_transmission_barrel', 'Thermal Transmission Barrel', 1.0),
			new NodeInput(NodeInputType.INT, 'thermal_transmission_bottom', 'Thermal Transmission Bottom', 1.0),
		],
		chpp: [
			new NodeInput(NodeInputType.MEDIUM, 'm_fuel_in', 'm_fuel_in', 'm_c_g_natgas'),
			new NodeInput(NodeInputType.MEDIUM, 'm_el_out', 'm_el_out', 'm_e_ac_230v'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'm_heat_out', 'm_h_w_ht1'),
		],
		seasonalthermalstorage: [
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_in', 'm_heat_in', 'm_h_w_ht1'),
			new NodeInput(NodeInputType.MEDIUM, 'm_heat_out', 'm_heat_out', 'm_h_w_lt1'),
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
