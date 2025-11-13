# SUSI - Simple UI for Simulation input

SUSI is a Streamlit application for creating input files used in the simulation engine [ReSiE](https://github.com/QuaSi-Software/resie).

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Docker Desktop

## Running the App

To run SUSI locally, follow these steps:

1. Get a copy of the source files
    * The recommended way is to use `git clone --recurse-submodules git@github.com:QuaSi-Software/susi.git`
    * If you use clone without `--recurse-submodules` you will need to `cd` into the directory and run `git submodule update --init --recursive` afterwards
    * If you do not wish to use git to get the source files, you will need to fetch the repository in submodule `streamlit-flow` separately and place its files in there
1. Change the line endings in `streamlit-flow/start.sh` to CRLF
1. Navigate to the project directory and run `COMPOSE_PROFILES=default docker compose up`. This will likely take a few minutes.
1. Now that both containers are running you can use SUSI by opening `http://localhost:8505` in a web browser. The first time it might take a little while until the drawing surface is available. After the first run, you can stop and start the containers via Docker Desktop instead of using the console commands.

## Usage

Once the app is running, open your web browser and go to `http://localhost:8505` to view the app.

### Creating an energy system
Using the buttons in the sidebar on the left, you can create component nodes of various types. Connecting the nodes using the little connector widgets will link the components, where the left widget (if any) is an input to the component and the widget on the right (if any) is an output of the component.

In general no widget should remain unconnected in order for an energy system to be complete. There are further restrictions on how to construct a valid energy system for simulation with ReSiE, however not all of them are implemented in SUSI as well. You might have to keep the app open and adjust a few times after getting an error in ReSiE.

Once you have your energy system set up as you need, click the "Export" button in the sidebar. This will generate the content of an input file and display the result in the text area below the graph-drawing canvas. Save this content as a `.json` file and use it as input for ReSiE.

## Contributing

If you want to contribute to this project, you can find more information [here](https://quasi-software.readthedocs.io/en/latest/workflow_code_contributions/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

