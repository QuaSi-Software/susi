import time
import streamlit as st


class medium_input:
    name: str
    key: str  # unique key to identify the medium
    color: str = "#ffffff"
    inputted_name_valid: bool = True

    def __init__(self, name=None, color=None, inputted_name_valid=True):
        self.key = "m_" + str(time.time())
        if name is not None:
            self.key = self.key + name
        self.name = name if name is not None else self.key
        if color is not None:
            self.color = color
        self.inputted_name_valid = inputted_name_valid

def serialize_mediums_list():
    serialized_list = [{"name":"Not Set", "key":"UNDEFINED"}]
    for _, medium in enumerate(st.session_state.mediums):
        if medium.inputted_name_valid:
            serialized_list.append(
                {"name": medium.name, "color": medium.color, "key": medium.key}
            )
    return serialized_list


def check_duplicate_names():
    name_dict = {}
    medium: medium_input
    for _, medium in enumerate(st.session_state.medium_list_input):
        count = name_dict.get(medium.name, 0) + 1
        name_dict[medium.name] = count
    for _, medium in enumerate(st.session_state.medium_list_input):
        count = name_dict.get(medium.name)
        medium.inputted_name_valid = count == 1

