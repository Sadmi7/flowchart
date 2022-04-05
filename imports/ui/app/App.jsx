import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { MainPage } from "../mainPage/MainPage.jsx";

import "./app.scss";

export const App = () => (
    <div className="app">
        <ReactFlowProvider>
            <MainPage />
        </ReactFlowProvider>
    </div>
);
