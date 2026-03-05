from typing import List
from enum import Enum
import streamlit as st
from datetime import datetime


# ---------------- Types needed by SusiInput ------------------------
class InputType(Enum):
    Date = 0
    Int = 1
    String = 3
    Dropdown = 4
    Multiselect = 5
    Boolean = 6
    Dropdown_With_Custom_Option = 7
    Float = 8


class SusiVariableCategory(Enum):
    SimulationParameter = 0
    IOSetting = 1


def getKey(type: SusiVariableCategory):
    match (type):
        case SusiVariableCategory.SimulationParameter:
            return "simulation_parameters"
        case SusiVariableCategory.IOSetting:
            return "io_settings"


DATE_FORMAT = "%d.%m.%Y %H:%M"


# ---------------- SusiInput ------------------------
class SusiInput:
    name: str
    input_type: InputType
    help: str = []
    options: List[str]  # dropdown and multiselect only
    optional: bool
    default_value: None
    key: str  # the key in st.session_state
    # custom_text_input: str  # only for Dropdown_With_Custom_Option

    def __init__(
        self,
        name: str,
        input_type: InputType,
        help: str = "",
        options: List = [],
        optional: bool = False,
        default_value: None = None,
        variable_type: SusiVariableCategory = SusiVariableCategory.IOSetting,
        custom_text_input: str = "",
    ):
        self.name = name
        self.input_type = input_type
        self.help = help
        self.options = options
        self.optional = optional
        self.default_value = default_value
        self.key = getKey(variable_type) + "/" + self.name

        # set session state variable
        if (
            input_type is InputType.Dropdown
            or input_type is InputType.Dropdown_With_Custom_Option
        ) and default_value not in options:
            default_value = options[0]
        if self.key not in st.session_state:
            st.session_state[self.key] = default_value

        # Dropdown with Custom Option setup
        if input_type == InputType.Dropdown_With_Custom_Option:
            if options[-1].lower() != "custom":
                print(
                    "Warning: Input "
                    + name
                    + " is a dropdown with custom option, but it's last option is not 'Custom'"
                )
            if self.key + "_CUSTOM_INPUT" not in st.session_state:
                st.session_state[self.key + "_CUSTOM_INPUT"] = custom_text_input

    def get_value(self):
        value = st.session_state[self.key]
        return value

    def set_value(self, value):
        st.session_state[self.key] = value

    def get_custom_input_value(self):
        value = st.session_state[self.key + "_CUSTOM_INPUT"]
        return value

    def set_custom_input_value(self, value):
        st.session_state[self.key + "_CUSTOM_INPUT"] = value

    def get_export_value(self):
        value = self.get_value()
        if self.input_type == InputType.Date and value is not None:
            value = value.strftime(DATE_FORMAT)
        if (
            self.input_type == InputType.Dropdown_With_Custom_Option
            and value == self.options[-1]
        ):
            value = self.get_custom_input_value()
        return value

    def set_value_from_import(self, value):
        if self.input_type == InputType.Date:
            value = datetime.strptime(value, DATE_FORMAT)
        if (
            self.input_type == InputType.Dropdown_With_Custom_Option
            and value not in self.options
        ):
            self.set_custom_input_value(value)
            value = self.options[-1]
        self.set_value(value)
