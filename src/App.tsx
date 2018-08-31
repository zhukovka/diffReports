import * as React from "react";
import {ReactNode} from "react";

interface AppProps {
    projects: string[]
}

class App extends React.Component<AppProps, any> {
    render (): ReactNode {
        const {projects} = this.props;
        return (
            <div>
                {this.renderProjects(projects)}
            </div>)
    }

    private renderProjects (projects: string[]): ReactNode[] {
        return projects.map(project => {
            return <div>{project}</div>
        });
    }
}

export default App;