#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import User, UserType, Event, EventType, Registration


# Views go here!
class Users(Resource):
    def get(self):
        return make_response([user.to_dict() for user in  User.query.all()], 200)
    def post(self):
        params = request.json
        new_user = User(
            first_name = params['first_name'],
            last_name = params['last_name'],
            email = params['email'],
            img_url = params['img_url'],
            user_type_id = params['user_type_id'],
            password_hash = params['password']
        )
        db.session.add(new_user)
        db.session.commit()
        # session['user_id'] = new_user.id
        return make_response({'user': new_user.to_dict()}, 201)

api.add_resource(Users, '/api/v1/users')

class UsersById(Resource):
    def get(self,id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        return make_response(user.to_dict(), 200)
    def patch(self,id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        params = request.json
        for attr in params:
            setattr(user, attr, params[attr])
        db.session.commit()
        return make_response(user.to_dict(), 200)
    def delete(self,id):
        user = User.query.get(id)
        if not user:
            return make_response({'error': 'user not found'}, 404)
        db.session.delete(user)
        db.session.commit()
        return make_response('',204)

api.add_resource(UsersById, '/api/v1/users/<int:id>')

@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(email=data['email']).first()
        # import ipdb; ipdb.set_trace()
        if user.authenticate(data['password']):
            # session['user_id'] = user.id
            return make_response({'user': user.to_dict()}, 200)
        else:
            return make_response({'error': 'incorrect password'}, 401)
    except:
        return make_response({'error': 'username incorrect'}, 401)


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

