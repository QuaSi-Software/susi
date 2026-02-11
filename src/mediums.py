import time
import streamlit as st
from typing import List
import random

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
        else:
            # Generate a random color
            self.color = f"#{random.randint(0, 0xFFFFFF):06x}"
        self.inputted_name_valid = inputted_name_valid

def serialize_mediums_list():
    serialized_list = [{"name":"Not Set", "key":"UNDEFINED", "color": "#ffffff"}]
    for _, medium in enumerate(st.session_state.mediums):
        if medium.inputted_name_valid:
            serialized_list.append(
                {"name": medium.name, "color": medium.color, "key": medium.key}
            )
    return serialized_list


def get_medium_list_for_export():
    mediums = []
    for m in st.session_state.mediums:
        mediums.append([m.name, m.color])
    return mediums

def set_default_mediums():
    st.session_state.mediums = [
        medium_input(name="m_e_ac_230v", color="#ffee00"),
        medium_input(name="m_h_w_lt1", color="#ff6c6c"),
        medium_input(name="m_h_w_ht1", color="#940000"),
        medium_input(name="m_c_g_h2", color="#00d346"),
        medium_input(name="m_c_g_o2", color="#ff0000"),
        medium_input(name="m_c_g_natgas", color="#6e00d4"),
    ]

def input_is_medium(parameter_name : str):
    if parameter_name == "medium": return True
    split_name : List[str] = parameter_name.split("_")
    if len(split_name) < 3: return False
    return split_name[0] == "m" and (split_name[-1] == "in" or split_name[-1]=="out")

def update_edge_colors(old_medium_list : List[medium_input], new_medium_list : List[medium_input]):
    edges = st.session_state.current_state.edges
    for medium in new_medium_list:
        old_medium : medium_input = [x for x in old_medium_list if x.key == medium.key]
        if len(old_medium) == 0: continue
        if medium.color == old_medium[0].color: continue
        edges_with_medium = [x for x in edges if x.medium_key == medium.key]
        for e in edges_with_medium:
            e.style = {"stroke": medium.color}
    st.session_state.current_state.edges = edges