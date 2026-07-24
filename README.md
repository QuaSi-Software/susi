# SUSI

SUSI (Simple UI for Simulation Input) is a user interface made with Typescript React and built with Reactflow to create the input that is required to use the energy system simulation software [ReSiE](https://github.com/QuaSi-Software/resie).

## Installation for development
This project uses **Vite** as the build tool and bundler for a TypeScript React application.

### Prerequisites
- Node.js
- npm

### Instructions

1. Clone the repository: `git clone git@github.com:QuaSi-Software/susi.git`
1. Switch into directory: `cd susi`
1. Install dependencies: `npm install`
1. Run the app: `npm run dev`

## Installation for deployment (via docker)
This project can be deployed as a docker container, which avoids the needs to install node on the host machine.

**Note:** At the moment the port on which SUSI is running is fixed at 5002. This might be addressed in a future update.

### Prerequisites
- Docker
  - For Windows: Install Docker Desktop
  - For Linux: Install via package manager, including compose
- Access to a ReSiE simulation API **or** a SIMON instance **or** a prerendered JSON file with the parameter definitions. If you are unsure how to get any of these options, you can find contact information at https://quasi-software.org/contact

### Instructions

1. Clone the repository: `git clone git@github.com:QuaSi-Software/susi.git`
1. Switch into directory: `cd susi`
1. Create a file called `.env` in this directory and fill it with content:
    ```
    NODE_ENV=production
    API_BACKEND_URL=http://example.com
    ```
    * Use the URL of the simulation API instead of the example value
1. Build and run the docker container: `docker compose up`
    * You can also run SUSI in the background using `docker compose up -d`. You can turn it off using `docker compose down`
    * To force a new build, for example after updates, you can use `docker compose up --build`

## Contributing

If you want to contribute to this project, you can find more information [here](https://quasi-software.readthedocs.io/en/latest/workflow_code_contributions/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.