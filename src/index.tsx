import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

fetch("/projects/projects.json").then(res => res.json()).then(projects => {
    ReactDOM.render(
        <App projects={projects}></App>,
        document.getElementById("app")
    );
});
