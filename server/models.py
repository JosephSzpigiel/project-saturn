from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    img_url = db.Column(db.String)
    user_type_id = db.Column(db.String, db.ForeignKey('user_types.id'))
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    modified_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    registrations = db.relationship('Registration', back_populates = 'user', cascade = 'all, delete-orphan')
    events_created = db.relationship('Event', back_populates = 'created_by', cascade = 'all, delete-orphan')
    events_registered = association_proxy('registrations', 'event')
    user_type = db.relationship('UserType', back_populates='users')
    notifications = db.relationship('Notification', back_populates = 'user', cascade = 'all, delete-orphan')
    serialize_rules = ('-events_registered.users',
                        '-events_registered.created_by',
                        '-events_created.created_by',
                        '-events_created.users',
                        '-user_type.users',
                        '-registrations.user',
                        '-_password_hash')


    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, plain_text_password):
        byte_object = plain_text_password.encode('utf-8')
        encrypted_password_object = bcrypt.generate_password_hash(byte_object)
        hashed_password_string = encrypted_password_object.decode('utf-8')
        self._password_hash = hashed_password_string

    def authenticate(self, password_string):
        byte_object = password_string.encode('utf-8')
        return bcrypt.check_password_hash(self.password_hash, byte_object)

    def __repr__(self):
        return f'<User {self.id}: {self.first_name}  {self.last_name}>'
    
class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    img_url = db.Column(db.String)
    description = db.Column(db.String)
    created_by_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    modified_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    event_type_id = db.Column(db.Integer, db.ForeignKey('event_types.id'))
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    max_tickets = db.Column(db.Integer)
    registrations = db.relationship('Registration', back_populates = 'event', cascade = 'all, delete-orphan')
    users = association_proxy('regstrations', 'user')
    created_by = db.relationship('User', back_populates ='events_created')
    event_type = db.relationship('EventType', back_populates='events')
    serialize_rules = ('-users',
                        '-created_by.events_registered', '-created_by.events_created',
                        '-registrations.event', '-event_type.events')

    def __repr__(self):
        return f'<Event {self.id}: {self.name}>'
    
class Registration(db.Model, SerializerMixin):
    __tablename__ = 'registrations'

    id = db.Column(db.Integer, primary_key = True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    modified_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    tickets = db.Column(db.Integer)
    user = db.relationship('User', back_populates = 'registrations')
    event = db.relationship('Event', back_populates = 'registrations')
    serialize_rules = ('-user.events_registered',  '-user.events_created', '-user.registrations', '-event')

    def __repr__(self):
        return f'<Registration {self.id}: User {self.user_id}, Event {self.event_id}>'
    
class EventType(db.Model, SerializerMixin):
    __tablename__ =  'event_types'

    id = db.Column(db.Integer, primary_key = True)
    type_name =db.Column(db.String)
    events = db.relationship('Event', back_populates = 'event_type')

class UserType(db.Model, SerializerMixin):
    __tablename__ =  'user_types'

    id = db.Column(db.Integer, primary_key = True)
    type_name =db.Column(db.String)
    users = db.relationship('User', back_populates = 'user_type')

class Notification(db.Model, SerializerMixin):
    __tablename__ =  'notifications'

    id = db.Column(db.Integer, primary_key = True)
    content =db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates = 'notifications')
    serialize_rules = ('-user',)