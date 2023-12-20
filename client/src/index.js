import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp";
import HomePage from "./components/HomePage";
import EventForm from "./components/EventForm";
import EventPage from "./components/EventPage";
import MyProfile from "./components/MyProfile";
import EventsPage from "./components/EventsPage";
import GroupsPage from "./components/GroupsPage";
import GroupForm from "./components/GroupForm";

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <div>Error loading app!</div>,
        children: [
            {index: true, element: <HomePage/>},
            {
                path: '/events/new',
                element: <EventForm />,
            },
            {
                path: '/events/:eventId',
                element: <EventPage />,
            },
            {
                path: '/myprofile',
                element: <MyProfile />,
            },
            {
                path: '/events',
                element: <EventsPage />
            },
            {
                path: '/groups',
                element: <GroupsPage />
            },
            {
                path: '/groups/new',
                element: <GroupForm />
            }
        ],
    },
];

const router = createBrowserRouter(routes);


const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
