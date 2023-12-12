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
        session['user_id'] = new_user.id
        return make_response({'user': new_user.to_dict()}, 201)
    
class Events(Resource):
    def post(self):
        params= request.json
        date = params['start_time'].split('-')
        time = date[2].split('T')[1]
        hour= time.split(':')[0]
        minutes= time.split(':')[1]
        dateObj = datetime.datetime(int(date[0]), int(date[1]), int(date[2].split('T')[0]), int(hour), int(minutes))
        new_event = Event(
            name = params['name'],
            img_url = params['img_url'],
            description = params['description'],
            created_by_id = params['created_by_id'],
            event_type_id = params['event_type_id'],
            start_time = dateObj,
            max_tickets = params['max_tickets']
        )
        db.session.add(new_event)
        db.session.commit()
        return make_response({'event': new_event.to_dict()}, 201)
    def get(self):
        return make_response([event.to_dict() for event in  Event.query.all()], 200)

api.add_resource(Events, '/api/v1/events')
api.add_resource(Users, '/api/v1/users')

@app.route('/api/v1/authorized')
def authorized():
    try:
        user = User.query.filter_by(id=session.get('user_id')).first()
        return make_response(user.to_dict(), 200)
    except:
        return make_response({ "error": "User not found"}, 404)
    
@app.route('/api/v1/logout', methods=['DELETE'])
def logout():
    session['user_id'] = None 
    return make_response('', 204)

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

class EventsById(Resource):
    def get(self,id):
        event = Event.query.get(id)
        if not event:
            return make_response({'error': 'event not found'}, 404)
        return make_response(event.to_dict(), 200)
    def patch(self,id):
        event = Event.query.get(id)
        if not event:
            return make_response({'error': 'event not found'}, 404)
        params = request.json
        for attr in params:
            setattr(event, attr, params[attr])
        db.session.commit()
        return make_response(event.to_dict(), 200)
    def delete(self,id):
        event = Event.query.get(id)
        if not event:
            return make_response({'error': 'event not found'}, 404)
        db.session.delete(event)
        db.session.commit()
        return make_response('',204)
    
api.add_resource(EventsById, '/api/v1/events/<int:id>')

class Registrations(Resource):
    def post(self):
        params = request.json
        new_registration = Registration(
            user_id = params['user_id'],
            event_id = params['event_id'],
            tickets = params['tickets']
        )
        db.session.add(new_registration)
        db.session.commit()
        return make_response(new_registration.to_dict(),201)
    
api.add_resource(Registrations, '/api/v1/registrations')

class RegistrationsById(Resource):
    def delete(self, id):
        registrations = Registration.query.filter_by(user_id = id).all()
        if not registrations:
            return make_response({'error': 'registration not found'}, 404)
        for r in registrations: 
            db.session.delete(r)
        db.session.commit()
        return make_response('',204)

api.add_resource(RegistrationsById, '/api/v1/registrations/<int:id>')


@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(email=data['email']).first()
        # import ipdb; ipdb.set_trace()
        if user.authenticate(data['password']):
            session['user_id'] = user.id
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

