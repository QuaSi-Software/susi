"""Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
"""

def node_info(component_type):
    """Info required for creating a node of the given component type.

    # Args:
    -`component_type:str`: The component type
    # Returns:
    -`nr_inputs:int`: The number of inputs for the node
    -`nr_outputs:int`: The number of outputs for the node
    -`segment:str`: The segment for the UAC
    """
    name = component_type.lower()
    if name == "bus":
        return (1, 1, "BUS")
    elif name == "boundedsupply":
        return (0, 1, "SRC")
    elif name == "fixedsupply":
        return (0, 1, "SRC")
    elif name == "demand":
        return (1, 0, "DEM")
    elif name == "boundedsink":
        return (1, 0, "DEM")
    elif name == "gridinput":
        return (0, 1, "GRI")
    elif name == "gridoutput":
        return (1, 0, "GRO")
    elif name == "storage":
        return (1, 1, "STO")
    elif name == ("genericheatsource"):
        return (0, 1, "GHS")
    elif name == ("fuelboiler"):
        return (1, 1, "FBO")
    elif name == ("heatpump"):
        return (2, 1, "HP")
    elif name == ("geothermalprobes"):
        return (1, 1, "GTP")
    elif name == ("geothermalheatcollector"):
        return (1, 1, "GHC")
    elif name == ("chpp"):
        return (1, 2, "CHPP")
    elif name == ("pvplant"):
        return (0, 1, "PV")
    elif name == ("battery"):
        return (1, 1, "BAT")
    elif name == ("electrolyser"):
        return (1, 4, "ELY")
    elif name == ("buffertank"):
        return (1, 1, "BFT")
    elif name == ("seasonalthermalstorage"):
        return (1, 1, "STS")
    else:
        raise NotImplementedError(f"Unknown component type {component_type}")

def categories():
    """Categories of component types for navigation/display purposes.

    # Returns:
    -`dict<list>`: A dict of categories, with each entry of a category corresponding to a
        component type and each tuple of a type containing the component_type and display
        name for that type.
    """
    return {
        "_order": ["Special", "General", "Heat", "Electricity", "Other"],
        "Special": [
            ("Bus", "Bus"),
            ("GridInput", "Grid Input"),
            ("GridOutput", "Grid Output"),
        ],
        "General": [
            ("FixedSupply", "Fixed Supply"),
            ("BoundedSupply", "Flexible Supply"),
            ("Demand", "Fixed Demand"),
            ("BoundedSink", "Flexible Demand"),
            ("Storage", "Storage"),
        ],
        "Heat": [
            ("GenericHeatSource", "Generic Heat Source"),
            ("FuelBoiler", "Fuel Boiler"),
            ("HeatPump", "Heat Pump"),
            ("GeothermalProbes", "Geothermal Probes"),
            ("GeothermalHeatCollector", "Geothermal Heat Collector"),
            ("BufferTank", "Buffer Tank"),
            ("SeasonalThermalStorage", "Seasonal Thermal Storage"),
        ],
        "Electricity": [
            ("CHPP", "Combined-Heat-Power Plant"),
            ("PVPlant", "Photovoltaic Plant"),
            ("Battery", "Battery"),
        ],
        "Other": [
            ("Electrolyser", "Electrolyser"),
        ]
    }

def component_config(component_type):
    """Parameters and settings for the given component type.

    # Args:
    -`component_type:str`: The component type
    # Returns:
    -`dict`: The parameters/settings for the given type
    """
    base = {
        "type": component_type,
        "output_refs": [],
    }
    name = component_type.lower()

    if name == "bus":
        return {
            "type": "Bus",
            "medium": "FILL_IN",
            "connections": {
                "input_order": [],
                "output_order": [],
                "energy_flow": [],
            },
        }
    elif name == "gridinput" or name == "gridoutput":
        return base | {
            "type": "GridConnection",
            "medium": "FILL_IN",
            "is_source": name == "gridinput",
            "__OPTION_1": "",
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "temperature_profile_file_path": "FILL_IN",
        }
    elif name == "boundedsupply":
        return base | {
            "medium": "FILL_IN",
            "__OPTION_1": "",
            "constant_power": -9999,
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "max_power_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "boundedsink":
        return base | {
            "medium": "FILL_IN",
            "__OPTION_1": "",
            "constant_power": -9999,
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "max_power_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "fixedsupply":
        return base | {
            "medium": "FILL_IN",
            "__OPTION_1": "",
            "constant_supply": -9999,
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "energy_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "demand":
        return base | {
            "medium": "FILL_IN",
            "__OPTION_1": "",
            "constant_demand": -9999,
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "energy_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "storage":
        return base | {
            "medium": "FILL_IN",
            "capacity": -9999,
            "load": -9999,
        }
    elif name == "genericheatsource":
        return base | {
            "medium": "FILL_IN",
            "__OPTION_1": "",
            "constant_power": -9999,
            "constant_temperature": -9999,
            "__OPTION_2": "",
            "max_power_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "fuelboiler":
        return base | {
            "m_fuel_in": "FILL_IN",
            "m_heat_out": "m_h_w_ht1",
            "power_th": -9999,
            "__OPTIONAL__": "",
            "efficiency_fuel_in": "const:1.1",
            "efficiency_heat_out": "const:1.0",
            "linear_interface": "heat_out",
            "min_power_fraction": 0.1,
            "output_temperature": -9999,
        }
    elif name == "heatpump":
        return base | {
            "power_th": -9999,
            "__OPTIONAL_MEDIA__": "",
            "m_heat_in": "m_h_w_lt1",
            "m_el_in": "m_e_ac_230v",
            "m_heat_out": "m_h_w_ht1",
            "__OPTIONAL_TEMPERATURES__": "",
            "input_temperature": -9999,
            "output_temperature": -9999,
            "__OPTIONAL_COP_AND_POWER__": "",
            "cop_function": "const:3.5",
            "bypass_cop": 15.0,
            "min_power_function": "const:0.0",
            "max_power_function": "const:1.0",
            "__OPTIONAL_LOSSES__": "",
            "heat_losses_factor": 0.95,
            "power_losses_factor": 0.98,
            "__OPTIONAL_ICING__": "",
            "consider_icing": True,
            "icing_coefficients": "3,-0.42,15,2,30",
            "__OPTIONAL_OPTIMISATION_FOR_INVERTER_HP__": "",
            "optimise_slice_dispatch": True,
            "optimal_plr": 0.5,
            "nr_optimisation_passes": 10,
        }
    elif name == "geothermalprobes":
        return base | {
            "m_heat_out": "m_h_w_lt1",
            "model_type": "detailed",
            "___GENERAL PARAMETER___": "",
            "max_output_power": 150,
            "max_input_power": 150,
            "regeneration": True,
            "soil_undisturbed_ground_temperature": 13,
            "soil_heat_conductivity": 1.6,
            "soil_density": 1800,
            "soil_specific_heat_capacity": 2400,
            "probe_field_geometry": "rectangle",
            "number_of_probes_x": 3,
            "number_of_probes_y": 12,
            "probe_field_key_2": "",
            "borehole_spacing": 8,
            "probe_depth": 150,
            "borehole_diameter": 0.16,
            "boreholewall_start_temperature": 13,
            "unloading_temperature_spread": 1.5,
            "loading_temperature_spread": 4,
            "limit_max_output_energy_to_avoid_pulsing": False,
            "___SIMPLIFIED MODEL___": "",
            "borehole_thermal_resistance": 0.1,
            "___DETAILED MODEL___": "",
            "probe_type": 2,
            "pipe_diameter_outer": 0.032,
            "pipe_diameter_inner": 0.0262,
            "pipe_heat_conductivity": 0.42,
            "shank_spacing": 0.1,
            "fluid_specific_heat_capacity": 3795,
            "fluid_density": 1052,
            "fluid_kinematic_viscosity": 3.9e-6,
            "fluid_heat_conductivity": 0.48,
            "fluid_prandtl_number": 31.3,
            "grout_heat_conductivity": 2
    }
    elif name == "geothermalheatcollector":
        return base | {
            "m_heat_out": "m_h_w_lt1",
            "model_type": "detailed",
            "___GENERAL PARAMETER___": "",
            "ambient_temperature_from_global_file": "temp_ambient_air",
            "global_solar_radiation_from_global_file": "globHorIrr",
            "infrared_sky_radiation_from_global_file": "longWaveIrr",
            "accuracy_mode": "rough",
            "regeneration": False,
            "max_output_power": 25,
            "max_input_power": 25,
            "phase_change_upper_boundary_temperature": -0.25,
            "phase_change_lower_boundary_temperature": -1.0,
            "number_of_pipes": 47,
            "pipe_length": 93,
            "pipe_spacing": 1.0,
            "pipe_laying_depth": 2.0,
            "pipe_radius_outer": 0.02,
            "considered_soil_depth": 10.0,
            "soil_specific_heat_capacity": 850,
            "soil_specific_heat_capacity_frozen": 850,
            "soil_density": 1900,
            "soil_heat_conductivity": 2.4,
            "soil_heat_conductivity_frozen": 2.9,
            "soil_specific_enthalpy_of_fusion": 90000,
            "surface_convective_heat_transfer_coefficient": 14.7,
            "surface_reflection_factor": 0.25,
            "surface_emissivity": 0.9,
            "unloading_temperature_spread": 3.0,
            "loading_temperature_spread": 3.0,
            "start_temperature_fluid_and_pipe": 12.5,
            "undisturbed_ground_temperature": 9.0,
            "___SIMPLIFIED MODEL___": "",
            "pipe_soil_thermal_resistance": 0.1,
            "___DETAILED MODEL___": "",
            "pipe_thickness": 0.0037,
            "pipe_heat_conductivity": 0.4,
            "fluid_specific_heat_capacity": 3944,
            "fluid_heat_conductivity": 0.499,
            "fluid_density": 1025,
            "fluid_kinematic_viscosity": 3.6e-6,
            "fluid_prantl_number": 30
        }
    elif name == "chpp":
        return base | {
            "power_el": -9999,
            "__OPTIONAL_MEDIA__": "",
            "m_fuel_in": "m_c_g_natgas",
            "m_el_out": "m_e_ac_230v",
            "m_heat_out": "m_h_w_ht1",
            "__OPTIONAL_EFFICIENICES__": "",
            "linear_interface": "fuel_in",
            "efficiency_fuel_in": "const:1.0",
            "efficiency_el_out": "pwlin:0.01,0.17,0.25,0.31,0.35,0.37,0.38,0.38,0.38",
            "efficiency_heat_out": "pwlin:0.8,0.69,0.63,0.58,0.55,0.52,0.5,0.49,0.49",
            "nr_discretization_steps": 8,
            "__OPTIONAL__": "",
            "min_power_fraction": 0.1,
            "output_temperature": -9999,
        }
    elif name == "pvplant":
        return base | {
            "energy_profile_file_path": "FILL_IN",
            "scale": -9999,
            "m_el_out": "m_e_ac_230v",
        }
    elif name == "battery":
        return base | {
            "medium": "FILL_IN",
            "capacity": -9999,
            "initial_charge": -9999,
        }
    elif name == "electrolyser":
        return base | {
            "power_el": -9999,
            "__OPTIONAL_MEDIA__": "",
            "m_el_in": "m_e_ac_230v",
            "m_heat_lt_out": "m_h_w_lt1",
            "m_heat_ht_out": "m_h_w_ht1",
            "m_h2_out": "m_c_g_h2",
            "m_o2_out": "m_c_g_o2",
            "__OPTIONAL_TEMPERATURES__": "",
            "heat_lt_is_usable": True,
            "output_temperature_ht": -9999,
            "output_temperature_lt": -9999,
            "__OPTIONAL_UNITS__": "",
            "nr_switchable_units": 2,
            "dispatch_strategy": "equal_with_mpf",
            "min_power_fraction": 0.4,
            "min_power_fraction_total": 0.2,
            "optimal_unit_plr": 0.5,
            "__OPTIONAL_EFFICIENCIES__": "",
            "linear_interface": "el_in",
            "efficiency_el_in": "const:1.0",
            "efficiency_h2_out": "const:0.57",
            "efficiency_h2_out_lossless": "const:0.6",
            "efficiency_o2_out": "const:0.6",
            "efficiency_heat_ht_out": "const:0.15",
            "efficiency_heat_lt_out": "const:0.07",
            "nr_discretization_steps": 8,
        }
    elif name == "buffertank":
        return base | {
            "medium": "m_h_w_ht1",
            "___GENERAL PARAMETER___": "",
            "model_type": "ideally_stratified",
            "capacity": 300000,
            "___OR___": "",
            "volume": 12.0,
            "rho_medium": 1000,
            "cp_medium": 4.18,
            "high_temperature": 80.0,
            "low_temperature": 15.0,
            "initial_load": 0.5,
            "max_load_rate": 1.0,
            "max_unload_rate": 1.5,
            "___BALANCED MODEL ONLY___": "",
            "switch_point": 0.25,
            "___LOSSES___": "",
            "consider_losses": True,
            "h_to_r": 2,
            "constant_ambient_temperature": 18,
            "ground_temperature": 12,
            "thermal_transmission_lid": 1.0,
            "thermal_transmission_barrel": 1.0,
            "thermal_transmission_bottom": 1.0
        }
    elif name == "seasonalthermalstorage":
        return base | {
            "__OPTIONAL_MEDIA__": "",
            "m_heat_in": "m_h_w_ht1",
            "m_heat_out": "m_h_w_lt1",
            "__GEOMETRY_AND_PHYSICS__": "",
            "volume": 3000,
            "shape": "round",
            "hr_ratio": 1.5,
            "sidewall_angle": 60,
            "number_of_layer_total": 25,
            "number_of_layer_above_ground": 1,
            "rho_medium": 1000,
            "cp_medium": 4.18,
            "diffusion_coefficient": 0.000000143,
            "thermal_transmission_lid": 0.25,
            "thermal_transmission_barrel": 0.375,
            "thermal_transmission_bottom": 0.375,
            "__TEMPERATURES__": "",
            "initial_load": 0.2,
            "high_temperature": 95,
            "low_temperature": 10,
            "ambient_temperature_from_global_file": "temp_ambient_air",
            "constant_ground_temperature": 18.0,
            "__CONSTRAINTS__": "",
            "max_load_rate_energy": 0.01,
            "max_unload_rate_energy": 0.01,
            "max_load_rate_mass": 0.04,
            "max_unload_rate_mass": 0.04,
        }
    else:
        raise NotImplementedError(f"Unknown component type {component_type}")
