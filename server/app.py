#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource
import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import User, UserType, Event, EventType, Registration


# Views go here!



@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

