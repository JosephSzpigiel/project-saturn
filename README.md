# Registr

## Introduction

Welcome to Registr: an app for planning hangouts and events with like minded groups in your area!
This is a Phase 5 project for [Flatiron School](https://flatironschool.com/), whose primary purpose is to help students gain experience building a full-stack project with a React frontend and a Flask backend.
This project was created and developed by [Joseph Szpigiel](https://github.com/JosephSzpigiel).

---

## Project Breakdown

#### Login
This project uses an Auth token to confirm and persist user details. Users can create an account or login using an existing account and password. 

#### Groups
Once logged in, users can create or join "Groups" which act as interest groups or social circles. Once in a group, a user can view and register for that groups events, or create an event within that group. The upcoming events for groups that a user is a part of will appear on the homepage.

#### Events
Events can be created within groups allowing the members of that group to see and participate in the events. In addition to the group, they are also categorized by an event type, allowing a single group to host multiple types of events. When looking at the event list, you can filter by events you created, the event type, or any of your groups.

#### Notifications
When someone signs up or canceled a registration for one an event a user is hosting, they are sent a notification that can be viewed on the homepage or profile menu in the upper right hand corner. These notifications can be cleared as well, giving the user an empty notifications panel for awaiting additional updates.

#### Cloudinary Uploads
This project uses [Cloudinary](https://cloudinary.com/) for image uploads and hosting for profiles, groups and events.

---

## Setup locally

To get this app running on your local machine, first **fork** a copy into your Github account then **clone** from that copy. To download the dependencies for the backend server, navigate into the repo and run:

```console
pipenv install
pipenv shell
```

You can run the Flask API on [`localhost:5555`](http://localhost:5555) by running:

```console
python server/app.py
```

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by running:

```sh
npm start --prefix client
```

## Generating Your Database

First cd into the `server` directory:

```console
cd server
```

Then initialize the database `app.db` file, and, if desired, seed the database with some example data:

```
flask db init
flask db revision -m 'Create DB'
flask db upgrade head
python seed.py
```
