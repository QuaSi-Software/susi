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
    * If you do not wish to use git to get the source files, you will need to fetch [the repository](https://github.com/siz-energieplus/streamlit-flow) in submodule `streamlit-flow` separately and place its files in there
1. Navigate to the project directory: `cd susi`
1. Change the line endings in file `streamlit-flow/start.sh` to LF if they were CRLF
1. Create file `.env` with the following content:
    ```
    COMPOSE_PROFILES="default"
    SUSI_PORT=8505
    STREAMLIT_FLOW_PORT=3001
    ```
    You can customize the port that SUSI runs on. **Note: At the moment it is not possible to change the port that the streamlit-flow component runs on and the value 3001 must be used.**
1. Start the containers, which will likely take a few minutes the first time: `docker compose up`
1. Now that both containers are running you can use SUSI by opening `http://localhost:8505` in a web browser. After the first run, you can stop and start the containers via Docker Desktop instead of using the console commands.

### VSC Development
To edit SUSI and streamlit-flow code in VS Code, you can attach use the `Attach to running container` function. 

The react code in the streamlit-flow component will run on the nodejs container, but its python code will run on the SUSI container. Code changes on either container should propagate over via their volumes, but be aware, there may be a slight delay. 

If you want to add guardrails to prevent you from editing react code on the SUSI container, you can add a glob pattern to VSC's `Files:Exclude`.

##### Debugging
To attach debuggers, run instead `COMPOSE_PROFILES=debug docker compose up`. In the susi container, you can now debug with F5 as you usually would. For streamlit-flow, you must also set up firefox to support react debugging:

1. install the "Debugger for Firefox" extension in VSC
    * You may have to set the debugging port in the extension to 6000. You can also change the debugging port in your `.env`
1. Install the Firefox extension "React Developer Tools"
1. start Firefox with flag -start-debugger-server. On Windows Powershell this would be `& 'C:\Program Files\Mozilla Firefox\firefox.exe' --start-debugger-server`
1. Set Firefox `config:about` Settings:

    * `devtools.debugger.remote-enabled = true`
    * `devtools.chrome.enabled = true`
    * `devtools.debugger.prompt-connection = false`

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

