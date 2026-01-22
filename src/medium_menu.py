import streamlit as st
from typing import Dict, List
import time

check_icon = "check_circle"  # other good options: "verified"
warning_icon = "warning"


class medium_input:
    name: str
    key: str  # unique key to identify the medium
    color: str = "#ffffff"
    inputted_name_valid: bool = True

    def __init__(self, name=None, color=None, inputted_name_valid=True):
        self.key = "m_" + str(time.time())
        self.name = name if name is not None else self.key
        if color is not None:
            self.color = color
        self.inputted_name_valid = inputted_name_valid


def serialize_mediums_list():
    serialized_list = []
    for _, medium in st.session_state.mediums:
        if medium.inputted_name_valid:
            serialized_list.append([medium.name, medium.color])
    return serialized_list


def check_duplicate_names():
    name_dict = {}
    medium: medium_input
    for _, medium in enumerate(st.session_state.mediums):
        count = name_dict.get(medium.name, 0) + 1
        name_dict[medium.name] = count
    for _, medium in enumerate(st.session_state.mediums):
        count = name_dict.get(medium.name)
        medium.inputted_name_valid = count == 1
        print("medium with name " + medium.name + " has " + str(count) + " duplicates")


def initialize_medium_list():
    if "mediums" not in st.session_state:
        st.session_state.mediums = [
            medium_input(name="m_e_ac_230v", color="#ffee00"),
            medium_input(name="m_h_w_lt1", color="#ff6c6c"),
            medium_input(name="m_h_w_ht1", color="#940000"),
            medium_input(name="m_c_g_h2", color="#00d346"),
            medium_input(name="m_c_g_o2", color="#ff0000"),
            medium_input(name="m_c_g_natgas", color="#6e00d4"),
        ]


def medium_menu():
    with st.expander("Mediums"):
        # for every medium in the list, display the name and color
        medium: medium_input
        index: int
        for index, medium in enumerate(st.session_state.mediums):
            with st.container(border=True, height=130):
                c1, c2, c3 = st.columns([40, 200, 50], vertical_alignment="bottom")
                with c1:
                    color = st.color_picker(
                        label="Medium Color",
                        value=medium.color,
                        key=medium.key + "_color",
                    )
                    st.session_state.mediums[index].color = color
                with c2:
                    icon_name = (
                        check_icon if medium.inputted_name_valid else warning_icon
                    )
                    new_name = st.text_input(
                        label="Medium Name",
                        value=medium.name,
                        key=medium.key + "_name",
                        icon=":material/" + icon_name + ":",
                    )
                    if medium.name != new_name:
                        medium.name = new_name
                        check_duplicate_names()
                        st.rerun()
                with c3:
                    if st.button(label="X", key=medium.key + "_delete_button"):
                        st.session_state.mediums.pop(index)
                        st.rerun()
                if not medium.inputted_name_valid:
                    st.markdown(body=":red[Please input a unique name for your medium]")
        # Button: when clicked, add another medium to the list
        if st.button(label="+ Add New Medium"):
            st.session_state.mediums.append(medium_input())
            st.rerun()
