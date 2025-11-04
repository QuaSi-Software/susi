# syntax=docker/dockerfile:1

FROM python:3.11.14-bookworm

# add build argument for the port with default value
ARG PORT=8505
ENV PORT=$PORT
ENV STREAMLIT_SERVER_PORT=$PORT

WORKDIR /app
COPY . ./

# install requirements, in particular streamlit
RUN pip install -r ./requirements.txt
# install a local fork of streamlit-flow-component as the canon repo is not what we need
# note: make sure you have followed the installation step for the git submodule
RUN pip install -e ./streamlit-flow

EXPOSE ${PORT}

CMD ["streamlit", "run", "./src/main.py"]
