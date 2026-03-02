from Susi_Variables.susi_variable import SusiInput, InputType, SusiVariableCategory

simulation_parameters = [
    SusiInput(
        name="start",
        help="Start time of the simulation as datetime format",
        input_type=InputType.Date,
        optional=False,
        variable_type=SusiVariableCategory.SimulationParameter,
    )
]

io_settings = [
    SusiInput(
        name="csv_output_file",
        default_value="./output/out.csv",
        help=" File path to where the CSV output will be written.",
        input_type=InputType.String,
        optional=True,
        variable_type=SusiVariableCategory.IOSetting,
    ),
    SusiInput(
        name="csv_time_unit",
        default_value="date",
        help="Time unit for the time stamp of the CSV file",
        input_type=InputType.Dropdown,
        optional=True,
        options=["seconds", "minutes", "hours", "date"],
        variable_type=SusiVariableCategory.IOSetting,
    ),
    SusiInput(
        name="csv_output_weather",
        default_value=False,
        help="If true, the weather data read in from a given weather file is exported to the CSV file",
        input_type=InputType.Boolean,
        optional=True,
        variable_type=SusiVariableCategory.IOSetting,
    ),
    SusiInput(
        name="auxiliary_plots_formats",
        default_value=["png"],
        help="Array of file formats that should be created",
        input_type=InputType.Multiselect,
        optional=True,
        options=["html", "pdf", "png", "ps", "svg"],
        variable_type=SusiVariableCategory.IOSetting,
    ),
    SusiInput(
        name="step_info_interval",
        default_value=-1,
        help="Defines how often a progress report on the loop over the timesteps of the simulation is logged to the info channel. This is useful to get an estimation of how much longer the simulation requires (albeit that such estimation is always inaccurate). If no value is given, automatically sets a value such that 20 reports are printed over the course of the simulation. To deactivate these reports, set this to 0",
        input_type=InputType.Number,
        optional=True,
        variable_type=SusiVariableCategory.IOSetting,
    ),
]


# SusiInput(
#     name="",
#     default_value=x,
#     help="",
#     input_type=InputType.,
#     optional=True,
# )
