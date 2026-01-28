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
            # Generating a random number in between 0 and 2^24
                color = random.randrange(0, 2**24)
                # Converting that number from base-10 (decimal) to base-16 (hexadecimal)
                hex_color = hex(color)
                self.color = "#" + hex_color[2:]
        self.inputted_name_valid = inputted_name_valid

def serialize_mediums_list():
    serialized_list = [{"name":"Not Set", "key":"UNDEFINED"}]
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
