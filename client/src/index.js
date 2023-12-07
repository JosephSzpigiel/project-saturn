import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp";
import HomePage from "./components/HomePage";

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <div>Error loading app!</div>,
        children: [
            {index: true, element: <HomePage/>},
            // {
            //     path: '/addactivity',
            //     element: <AddActivity />,
            // },
            // {
            //     path: '/dates',
            //     element: <AllDates />,
            // },
            // {
            //     path: '/dates/create',
            //     element: <CreateDate />,
            // },
        ],
    },
];

const router = createBrowserRouter(routes);


const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
