# Development Setup

## VSC Development
To edit SUSI and streamlit-flow code in VS Code, you can attach use the `Attach to running container` function. 

The react code in the streamlit-flow component will run on the nodejs container, but its python code will run on the SUSI container. Code changes on either container should propagate over via their volumes, but be aware, there may be a slight delay. 

If you want to add guardrails to prevent you from editing react code on the SUSI container, you can add a glob pattern to VSC's `Files:Exclude`.

## Running debugger for Susi (Streamlit)
To be able to use debugger in Susi, run instead `COMPOSE_PROFILES=debug docker compose up`. This will open the container without having `streamlit run src/main.py` as the container process. 

Next you need to add a launch.json to your `.vscode` directory. This launch.json is the same you would use in any Streamlit project, but you have to run it *from inside your container.*
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Streamlit",
            "type": "debugpy",
            "request": "launch",
            "module": "streamlit",
            "args": [
                "run",
                "${workspaceFolder}/src/main.py",
                "--server.port",
                "8505"
            ]
        }
    ]
}
```

In the susi container, you can now debug with F5 as you usually would. 

Note: The python code in the Streamlit Flow Repo is also executed in this container, so if you want to set a breakpoint in that code, you can do that in this container.

## Running a debugger for Streamlit-Flow (Firefox)
For streamlit-flow, you must also set up firefox to support react debugging:

1. Install the "Debugger for Firefox" extension in VSC
    * You may have to set the debugging port in the extension to 6000. You can also change the debugging port `REACT_DEBUGGING_PORT` in your `.env` to whatever port you want.
1. Install the Firefox extension "React Developer Tools"
1. Start Firefox with flag -start-debugger-server. On Windows Powershell this would be  `& 'C:\Program Files\Mozilla Firefox\firefox.exe' --start-debugger-server`
1. Set Firefox `config:about` Settings:

    * `devtools.debugger.remote-enabled = true`
    * `devtools.chrome.enabled = true`
    * `devtools.debugger.prompt-connection = false`
1. You will also need a `launch.json` 
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Firefox (Streamlit Component)",
            "type": "firefox",
            "request": "attach",
            "url": "http://localhost:3001/",
            "webRoot": "${workspaceFolder}/frontend/src",
            "pathMappings": [
                {
                    "url": "http://localhost:3001/app/streamlit_flow/frontend",
                    "path": "${workspaceFolder}/streamlit_flow/frontend"
                }
            ]
        }
    ]
}
```
Unlike Debugging Susi, here you attach the debugger to the already running streamlit-flow process. 