#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
import datetime

# Local imports
from app import app
from models import db, Group, User, UserGroup, Event, Registration, Notification, EventType, UserType

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")       
        print("Deleting data...")
        Group.query.delete()
        User.query.delete()
        UserGroup.query.delete()
        Event.query.delete()
        Registration.query.delete()
        Notification.query.delete()
        EventType.query.delete()

        print("Creating Users...")
        u1 = User(id = 1, first_name = 'Ben', last_name = 'Spoons', email = 'ben@spoons.com', img_url = 'https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51aAu04384L.jpg', user_type_id = 1, password_hash = '12345')
        u2 = User(id = 2, first_name = 'Dave', last_name = 'Cars', email = 'dave@cars.com', img_url = 'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds', user_type_id = 1, password_hash = '12345')
        u3 = User(id = 3, first_name = 'Penelope', last_name = 'Snow', email = 'pen@snow.com', img_url = 'https://www.treehugger.com/thmb/DaW05sIPUUrCEDOa5ht63oXp5Oo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2014__12__snowflake-84c87424d5734b03ab1ca695c5a423c6.jpg', user_type_id = 1, password_hash = '12345')
        u4 = User(id = 4, first_name = 'Frank', last_name = 'Castles', email = 'frank@castles.com', img_url = 'https://a.cdn-hotels.com/gdcs/production12/d1130/83f1c8c6-e12d-4e69-8433-c5bbc90b5ad6.jpg', user_type_id = 1, password_hash = '12345')
        u5 = User(id = 5, first_name = 'Peter', last_name = 'Bins', email = 'peter@bins.com', img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Wheelie_Bin.jpg/800px-Wheelie_Bin.jpg', user_type_id = 1, password_hash = '12345')

        users = [u1, u2, u3, u4, u5]
        db.session.add_all(users)

        print("Creating Event Types...")
        et1 = EventType(id = 1, type_name = "Movie")
        et2 = EventType(id = 2, type_name = "Game")
        et3 = EventType(id = 3, type_name = "Overnight")
        et4 = EventType(id = 4, type_name = "Sport")

        eventTypes = [et1, et2, et3, et4]
        db.session.add_all(eventTypes)

        print("Creating Groups...")
        g1 = Group(id = 1, name = 'Switch Players', img_url = 'https://res.cloudinary.com/grover/image/upload/e_trim/b_white,c_pad,dpr_2.0,h_500,w_520/f_auto,q_auto/v1630929408/ge9mvskzvtggnlv8gitr.png', description = 'Lets play switch together! Online or in person!')
        g2 = Group(id = 2, name = 'Beach Bums', img_url = 'https://images.nationalgeographic.org/image/upload/v1638889927/EducationHub/photos/pebble-beach.jpg', description = 'If chillin on the beach is your vibe, this group is for you')
        g3 = Group(id = 3, name = 'Clubbers', img_url = 'https://golf.com/wp-content/uploads/2021/03/TSG1-1856-Wall.jpg', description='A group for those who would rather tee up than get down')
        g4 = Group(id = 4, name = 'Hobby Finders', img_url = 'https://www.elevana.com/images/blogs/Shrug.jpg', description="Don't know what to answer when people ask what your hobbies are? Try some new stuff with us!")
        g5 = Group(id = 5, name = 'DnD Club', img_url = 'https://www.awesomedice.com/cdn/shop/articles/DD-Logo_700x.jpg?v=1572377159', description= "Hark! Join our modest group of travelers on an epic journey through perilous worlds filled with monsters galore. But be careful! Danger lurks around every corner...")

        groups = [g1, g2, g3, g4, g5]
        db.session.add_all(groups)

        ug1 = UserGroup(id = 1, user_id = 1, group_id = 1, admin = 1)
        ug2 = UserGroup(id = 2, user_id = 2, group_id = 2, admin = 1)
        ug3 = UserGroup(id = 3, user_id = 3, group_id = 3, admin = 1)
        ug4 = UserGroup(id = 4, user_id = 4, group_id = 4, admin = 1)
        ug5 = UserGroup(id = 5, user_id = 5, group_id = 5, admin = 1)

        usergroups = [ug1, ug2, ug3, ug4, ug5]
        db.session.add_all(usergroups)

        e1 = Event(
            name = 'Mario Party',
            img_url = 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000014158/0ca41128bf40b7e0dc32a046a659ecdc69e4d7cc7a3257d6280be665d2f795b5',
            description = "It's a Mario Party!",
            created_by_id = 1,
            event_type_id = 2,
            start_time = datetime.datetime(2024, 3, 16, 14, 30),
            max_tickets = 5,
            group_id = 1
        )
        e2 = Event(
            name = 'Deerfield Beach Hang',
            img_url = 'https://www.shutterstock.com/image-photo/friends-hanging-out-on-beach-600nw-2094434575.jpg',
            description = "Chill. On the beach.",
            created_by_id = 2,
            event_type_id = 4,
            start_time = datetime.datetime(2024, 1, 16, 15, 30),
            max_tickets = 5,
            group_id = 2
        )
        e3 = Event(
            name = 'Mini Gold',
            img_url = 'https://www.smugglersgolf.com/hubfs/Content%20Update%202023/SCG_ContentShoot_Jan_2023_068.jpg#keepProtocol',
            description = "Hey- its still counts!",
            created_by_id = 3,
            event_type_id = 4,
            start_time = datetime.datetime(2024, 2, 16, 9, 30),
            max_tickets = 5,
            group_id = 3
        )
        e4 = Event(
            name = 'Camping',
            img_url = 'https://www.nps.gov/grte/planyourvisit/images/JLCG_tents_Teewinot_2008_mattson_1.JPG',
            description = "Maybe camping can define our personality!",
            created_by_id = 4,
            event_type_id = 3,
            start_time = datetime.datetime(2024, 1, 18, 9, 30),
            max_tickets = 5,
            group_id = 4
        )
        e5 = Event(
            name = 'The Orc Trials',
            img_url = 'https://images.ctfassets.net/m3d2dwoc9jko/4QJvtrRkpPuIC0EjBuYQqP/cfe7b821fe4bac8db14fccd5e3c65a82/orc-name-generator.jpg',
            description = "Come one come all to the exciting trial of Rebelok or the Orc!",
            created_by_id = 5,
            event_type_id = 2,
            start_time = datetime.datetime(2024, 5, 10, 20, 00),
            max_tickets = 5,
            group_id = 5
        )


        events = [e1, e2, e3, e4, e5]
        db.session.add_all(events)

        db.session.commit()
        print("Seeding Done!")


