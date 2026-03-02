from typing import List
from enum import Enum
from datetime import datetime

import streamlit as st


class InputType(Enum):
    Date = 0
    Number = 1
    String = 3
    Dropdown = 4
    Multiselect = 5
    Boolean = 6


class ExportVariableCategory(Enum):
    SimulationParameter = 0
    IOSetting = 1


def getKey(type: ExportVariableCategory):
    match (type):
        case ExportVariableCategory.SimulationParameter:
            return "simulation_parameter"
        case ExportVariableCategory.IOSetting:
            return "io_settings"


class SusiInput:
    name: str
    input_type: InputType
    help: str = []
    options: List[str]  # dropdown and multiselect only
    optional: bool
    default_value: None
    key: str  # the key in st.session_state

    def __init__(
        self,
        name: str,
        input_type: InputType,
        help: str = "",
        options: List = [],
        optional: bool = False,
        default_value: None = None,
        variable_type: ExportVariableCategory = ExportVariableCategory.IOSetting,
    ):
        self.name = name
        self.input_type = input_type
        self.help = help
        self.options = options
        self.optional = optional
        self.default_value = default_value
        self.key = getKey(variable_type) + "/" + self.name

    def getValue(self):
        value = st.session_state[self.key]
        if self.input_type == InputType.Date:
            value = value.strftime("%d.%m.%Y")
        return value


simulation_parameters = [
    SusiInput(
        name="start",
        help="Start time of the simulation as datetime format",
        input_type=InputType.Date,
        optional=False,
        variable_type=ExportVariableCategory.SimulationParameter,
    )
]

io_settings = [
    SusiInput(
        name="csv_output_file",
        default_value="./output/out.csv",
        help=" File path to where the CSV output will be written.",
        input_type=InputType.String,
        optional=True,
        variable_type=ExportVariableCategory.IOSetting,
    ),
    SusiInput(
        name="csv_time_unit",
        default_value="date",
        help="Time unit for the time stamp of the CSV file",
        input_type=InputType.Dropdown,
        optional=True,
        options=["seconds", "minutes", "hours", "date"],
        variable_type=ExportVariableCategory.IOSetting,
    ),
    SusiInput(
        name="csv_output_weather",
        default_value=False,
        help="If true, the weather data read in from a given weather file is exported to the CSV file",
        input_type=InputType.Boolean,
        optional=True,
        variable_type=ExportVariableCategory.IOSetting,
    ),
    SusiInput(
        name="auxiliary_plots_formats",
        default_value=["png"],
        help="Array of file formats that should be created",
        input_type=InputType.Multiselect,
        optional=True,
        options=["html", "pdf", "png", "ps", "svg"],
        variable_type=ExportVariableCategory.IOSetting,
    ),
    SusiInput(
        name="step_info_interval",
        default_value=-1,
        help="Defines how often a progress report on the loop over the timesteps of the simulation is logged to the info channel. This is useful to get an estimation of how much longer the simulation requires (albeit that such estimation is always inaccurate). If no value is given, automatically sets a value such that 20 reports are printed over the course of the simulation. To deactivate these reports, set this to 0",
        input_type=InputType.Number,
        optional=True,
        variable_type=ExportVariableCategory.IOSetting,
    ),
]


# SusiInput(
#     name="",
#     default_value=x,
#     help="",
#     input_type=InputType.,
#     optional=True,
# )
