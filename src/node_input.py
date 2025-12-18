from node_input_data import component_config
from typing import Dict

class NodeInput:
    js_type : str = "string"
    resie_name : str = "UNKNOWN"
    editable : bool = True
    display_name : str = "UNKNOWN"
    value : any = "UNKNOWN"

    def add_to_dict(self, dict:Dict[str,any]):
        dict[self.resie_name] = self.value

    def __init__(self,  resie_name, display_name, value, js_type=None, editable=True, required=True, isIncluded=True):
        self.js_type = js_type
        self.resie_name = resie_name
        self.editable = editable
        self.display_name = display_name
        self.value = value
        self.required = required
        self.isIncluded = isIncluded or required # if it's required, it has to be included

        if self.js_type is None:
            self.js_type = self.get_type(self.value)
        if self.value == "":
            self.editable = False
    
    def get_type(self, var):
        match(type(var).__name__):
            case "int": return "number"
            case "float": return "number"
            case "str": return "string"
            case "bool": return "boolean"
    
    def asdict(self):
        input_dict = {
            "js_type" : self.js_type,
            "resie_name" : self.resie_name,
            "editable" : self.editable,
            "display_name" : self.display_name,
            "value" : self.value,
            "required" : self.required,
            "isIncluded" : self.isIncluded,
        }
        return input_dict
    
    def from_dict(node_input_dict : Dict[str, any]):
        return NodeInput(
            js_type=node_input_dict.get('js_type', 'default'),
            resie_name=node_input_dict.get('resie_name', 'default'),
            editable=node_input_dict.get('editable', 'default'),
            display_name=node_input_dict.get('display_name', 'default'),
            value=node_input_dict.get('value', 'default'),
            required=node_input_dict.get('required'),
            isIncluded=node_input_dict.get('isIncluded'),
        )
    def list_from_dict(objects):
        return [NodeInput.from_dict(node_input_object) for node_input_object in objects]
    
    def list_asdict(node_inputs):
        try:
            return [node_input.asdict() for node_input in node_inputs]
        except AttributeError as e:
            print("Warning: Node Input List has not been deserialized.\n " \
            "Did you change your code or interact with the graph while the debugger was running?")
            return node_inputs

def get_node_inputs(component_type):
    if component_type.lower() == "fixedsupply":
        return [
            NodeInput(resie_name="medium", display_name="medium",value="FILL_IN"),
            NodeInput(resie_name="__OPTION_1", display_name="__OPTION_1",value="", editable=False),
            NodeInput(resie_name="constant_supply", display_name="constant_supply",value=-9999, required=False),
            NodeInput(resie_name="constant_temperature", display_name="constant_temperature",value=-9999, required=False),
            NodeInput(resie_name="__OPTION_2", display_name="__OPTION_2",value="",editable=False),
            NodeInput(resie_name="energy_profile_file_path", display_name="energy_profile_file_path",value="FILL_IN"),
            NodeInput(resie_name="temperature_profile_file_path", display_name="temperature_profile_file_path",value="FILL_IN"),
            NodeInput(resie_name="scale", display_name="scale",value=-9999),
        ]
    obj = component_config(component_type=component_type)
    inputs = []
    for key, value in obj.items():
        inputs.append(NodeInput(resie_name=key, display_name=key, value=value))
    return inputs
