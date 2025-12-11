import json
from typing import Dict
from components import component_config

class NodeInput:
    js_type : str = "string"
    resie_name : str = "UNKNOWN"
    editable : bool = True
    display_name : str = "UNKNOWN"
    value : any = "UNKNOWN"

    def add_to_dict(self, dict:Dict[str,any]):
        dict[self.resie_name] = self.value

    def __init__(self,  resie_name, display_name, value, js_type=None, editable=True, ):
        self.js_type = js_type
        self.resie_name = resie_name
        self.editable = editable
        self.display_name = display_name
        self.value = value

        if self.js_type is None:
            self.js_type = self.get_type(self.value)
    
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
        }
        return input_dict
    
    def from_dict(node_input_dict : Dict[str, any]):
        return NodeInput(
            js_type=node_input_dict.get('js_type', 'default'),
            resie_name=node_input_dict.get('resie_name', 'default'),
            editable=node_input_dict.get('editable', 'default'),
            display_name=node_input_dict.get('display_name', 'default'),
            value=node_input_dict.get('value', 'default'),
        )
    def list_from_dict(objects):
        return [NodeInput.from_dict(node_input_object) for node_input_object in objects]
    
    def list_asdict(node_inputs):
        return [node_input.asdict() for node_input in node_inputs]

def get_node_inputs(component_type):
    obj = component_config(component_type=component_type)
    inputs = []
    for key, value in obj.items():
        inputs.append(NodeInput(resie_name=key, display_name=key, value=value))
    return inputs
