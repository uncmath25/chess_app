FROM python:3.12.1

USER root

COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

ARG SRC_DIR="src"
COPY ./$SRC_DIR /$SRC_DIR
ENV PYTHONPATH "$PYTHONPATH:/$SRC_DIR"
WORKDIR /$SRC_DIR

ARG FLASK_USER="flask"
RUN useradd -ms /bin/bash $FLASK_USER
USER $FLASK_USER

EXPOSE 3030
CMD python3 main.py
