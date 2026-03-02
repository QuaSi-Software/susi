from typing import List
from enum import Enum
import streamlit as st
from datetime import datetime


# ---------------- Types needed by SusiInput ------------------------
class InputType(Enum):
    Date = 0
    Number = 1
    String = 3
    Dropdown = 4
    Multiselect = 5
    Boolean = 6


class SusiVariableCategory(Enum):
    SimulationParameter = 0
    IOSetting = 1


def getKey(type: SusiVariableCategory):
    match (type):
        case SusiVariableCategory.SimulationParameter:
            return "simulation_parameters"
        case SusiVariableCategory.IOSetting:
            return "io_settings"


# ---------------- SusiInput ------------------------
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
        variable_type: SusiVariableCategory = SusiVariableCategory.IOSetting,
    ):
        self.name = name
        self.input_type = input_type
        self.help = help
        self.options = options
        self.optional = optional
        self.default_value = default_value
        self.key = getKey(variable_type) + "/" + self.name

    def get_value(self):
        value = st.session_state[self.key]
        return value

    def get_export_value(self):
        value = self.get_value()
        if self.input_type == InputType.Date and value is not None:
            value = value.strftime("%d.%m.%Y")
        return value

    def set_value(self, value):
        st.session_state[self.key] = value

    def set_value_from_import(self, value):
        if self.input_type == InputType.Date and type(value) == type(""):
            value = datetime.strptime(value, "%d.%m.%Y")
        self.set_value(value)
