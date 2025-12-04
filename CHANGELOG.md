# Changelog

Current SUSI version: 0.3.0
Implemented for ReSie version: 0.12.4

## v0.3.1
* Change node colors of electricity and heat related nodes
* Add custom color scheme
* Make edges deletable by default
* Add Python debugging support in VSC
* Changes in Streamlit Flow Fork
    * Remove PaneMenu option to create Node
    * Remove many options from NodeContextMenu
    * Fix edges jumping to first handle on node on refresh
    * Add support for hot reloading and debugging react code

## v0.3.0
* Refactor deployment / operation of SUSI so it works with Docker containers
    * The repository now includes the required custom implementation of the streamlit-flow component as submodule, so it is no longer necessary to have a separate installation as it will be started in a second container alongside SUSI
    * **Note: This is a breaking change and users running SUSI are required to follow the new installation instructions using Docker.**

## v0.2.4
* Add component SolarthermalCollector 

## v0.2.3
* change default for CSV and plot output to new syntax
* remove coordinates in sim_params as the default should be to get them from a weather file

## v0.2.2
* Update and restructure parameters of components HeatPump, GeothermalProbe, GeothermalCollector and BufferTank
* Update parameters of STES to new detailed model

## v0.2.1
* Adjust parameters of components FuelBoiler and PVPlant
* Fix that exporting does not respect custom UACs set by editing the nodes

## v0.2.0
* Add all remaining ReSiE components of the current version 0.10.4
    * With the exception of HeatPump, which is designed around an unreleased version, that will likely be released in the near future

## v0.1.0
* Initial release, containing functionality from the prototyping phase:
    * Running SUSI as a streamlit app using the streamlit-flow component
    * UI for adding components to a graph editor and connecting the components
    * Export functionality to generate a ReSiE input file from the created graph
    * Some sample components are implemented to display functionality
