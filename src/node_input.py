from node_input_data import component_config
from typing import Dict, List
from mediums import serialize_mediums_list


class NodeInput:
    js_type: str = "string"
    resie_name: str = "UNKNOWN"
    editable: bool = True
    display_name: str = "UNKNOWN"
    value: any = "UNKNOWN"
    dropdown_options: List = []
    dropdown_option_display_names = []
    is_medium: bool = False
    tooltip = ""

    def add_to_dict(self, dict: Dict[str, any]):
        dict[self.resie_name] = self.value

    def __init__(
        self,
        resie_name,
        display_name,
        value,
        js_type=None,
        editable=True,
        required=True,
        isIncluded=True,
        dropdown_options=[],
        dropdown_options_display_names=None,
        tooltip="",
        is_medium=False,
    ):
        self.js_type = js_type
        self.resie_name = resie_name
        self.editable = editable
        self.display_name = display_name
        self.required = required
        self.tooltip = tooltip
        self.dropdown_options_display_names = dropdown_options_display_names
        # if it's required, it has to be included
        self.isIncluded = (isIncluded or required)  
        # if this is a medium, its value should be the key of the medium in the list
        self.is_medium = is_medium
        self.set_value(value)


        # if the dropdown options list isn't empty, this is a dropdown field.
        self.dropdown_options = dropdown_options
        if len(self.dropdown_options) > 0:
            self.js_type = "dropdown"
            # verify that the start value is in the list of options
            if self.value not in self.dropdown_options:
                print(
                    "Warning: start value '"
                    + str(value)
                    + "' is not in dropdown options "
                    + str(dropdown_options)
                )
                self.value = self.dropdown_options[0]

        if self.js_type is None:
            self.js_type = self.get_type(self.value)
        if self.value == "":
            self.editable = False

    def get_type(self, var):
        match (type(var).__name__):
            case "int":
                return "number"
            case "float":
                return "number"
            case "str":
                return "string"
            case "bool":
                return "boolean"
        return "unknown"

    def set_value(self, value):
        if self.is_medium:
            mediums : List[Dict[str,str]] = serialize_mediums_list()
            input_medium : Dict[str,str] = next((m for m in mediums if m["key"] == value or m["name"]==value), mediums[0])
            self.value = input_medium["key"] 
        else:
            self.value = value

    def asdict(self):
        input_dict = {
            "js_type": self.js_type,
            "resie_name": self.resie_name,
            "editable": self.editable,
            "display_name": self.display_name,
            "value": self.value,
            "required": self.required,
            "isIncluded": self.isIncluded,
            "dropdown_options": self.dropdown_options,
            "dropdown_options_display_names": self.dropdown_options_display_names,
            "tooltip": self.tooltip,
            "is_medium": self.is_medium,
        }
        return input_dict

    def from_dict(node_input_dict: Dict[str, any]):
        return NodeInput(
            js_type=node_input_dict.get("js_type", "default"),
            resie_name=node_input_dict.get("resie_name", "default"),
            editable=node_input_dict.get("editable", "default"),
            display_name=node_input_dict.get("display_name", "default"),
            value=node_input_dict.get("value", "default"),
            required=node_input_dict.get("required"),
            isIncluded=node_input_dict.get("isIncluded"),
            dropdown_options=node_input_dict.get("dropdown_options"),
            dropdown_options_display_names=node_input_dict.get(
                "dropdown_options_display_names"
            ),
            tooltip=node_input_dict.get("tooltip"),
            is_medium=node_input_dict.get("is_medium"),
        )

    def list_from_dict(objects):
        return [NodeInput.from_dict(node_input_object) for node_input_object in objects]

    def list_asdict(node_inputs):
        try:
            return [node_input.asdict() for node_input in node_inputs]
        except AttributeError as e:
            print(
                "Warning: Node Input List has not been deserialized.\n "
                "Did you change your code or interact with the graph while the debugger was running?"
            )
            return node_inputs


def get_node_inputs(component_type):
    if component_type.lower() == "fixedsupply":
        return [
            NodeInput(
                resie_name="medium",
                display_name="medium",
                value="FILL_IN",
                is_medium=True,
            ),
            NodeInput(
                resie_name="__OPTION_1",
                display_name="__OPTION_1",
                value="",
                editable=False,
            ),
            NodeInput(
                resie_name="constant_supply",
                display_name="Constant Supply",
                value=-9999,
                required=False,
            ),
            NodeInput(
                resie_name="constant_temperature",
                display_name="Constant Temperature",
                value=-9999,
                required=False,
            ),
            NodeInput(
                resie_name="__OPTION_2",
                display_name="__OPTION_2",
                value="",
                editable=False,
            ),
            NodeInput(
                resie_name="energy_profile_file_path",
                display_name="energy profile file path",
                value="FILL_IN",
            ),
            NodeInput(
                resie_name="temperature_profile_file_path",
                display_name="temperature profile file path",
                value="FILL_IN",
            ),
            NodeInput(
                resie_name="testing",
                display_name="Testing Dropdown",
                value="heat",
                dropdown_options=["electricity", "heat", "water"],
                tooltip="This is a testing medium",
            ),
            NodeInput(
                resie_name="testing2",
                display_name="Testing Dropdown with Display Names",
                value="heat",
                dropdown_options=["electricity", "heat", "water"],
                dropdown_options_display_names=["ELECTRICITY", "HEAT", "WATER"],
                tooltip="This is a testing medium",
            ),
            NodeInput(resie_name="scale", display_name="scale", value=-9999),
        ]
    obj = component_config(component_type=component_type)
    inputs = []
    for key, value in obj.items():
        inputs.append(NodeInput(resie_name=key, display_name=key, value=value))
    return inputs
