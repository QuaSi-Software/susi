from typing import List
from enum import Enum
import streamlit as st


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
            return "simulation_parameter"
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

    def getValue(self):
        value = st.session_state[self.key]
        if self.input_type == InputType.Date:
            value = value.strftime("%d.%m.%Y")
        return value
