# Changelog

Current SUSI version: 0.2.2
Implemented for ReSie version: 0.11.3

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