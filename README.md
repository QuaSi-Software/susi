# SUSI - Simple UI for Simulation input

SUSI is a Streamlit application for creating input files used in the simulation engine [ReSiE](https://github.com/QuaSi-Software/resie).

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Python 3.9 or later.

## Running the App

To run SUSI locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/QuaSi-Software/susi.git
    ```
2. Navigate to the project directory:
    ```sh
    cd susi
    ```
3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
4. Run the Streamlit app:
    ```sh
    streamlit run main.py
    ```
    Note that sometimes this might not work due to streamlit not being installed as executable correctly. In that try the following:
    ```sh
    python -m streamlit run main.py
    ```

## Usage

Once the app is running, open your web browser and go to `http://localhost:8501` to view the app. You might be directed there automatically by streamlit upon running the app.

### Creating an energy system
Using the buttons in the sidebar on the left, you can create component nodes of various types. Connecting the nodes using the little connector widgets will link the components, where the left widget (if any) is an input to the component and the widget on the right (if any) is an output of the component.

In general no widget should remain unconnected in order for an energy system to be complete. There are further restrictions on how to construct a valid energy system for simulation with ReSiE, however not all of them are implemented in SUSI as well. You might have to keep the app open and adjust a few times after getting an error in ReSiE.

Once you have your energy system set up as you need, click the "Export" button in the sidebar. This will generate the content of an input file and display the result in the text area below the graph-drawing canvas. Save this content as a `.json` file and use it as input for ReSiE.

## Contributing

If you want to contribute to this project, you can find more information [here](https://quasi-software.readthedocs.io/en/latest/workflow_code_contributions/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

