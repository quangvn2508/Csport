import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from './Components/Home';
import Problem from './Components/Problem';
import CreateProblem from './Components/CreateProblem';

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/createProblem" component={CreateProblem}/>
                <Route exact path="/problem" component={Problem}/>
                <Route exact path="/" component={Home}/>
                
                
                {/* https://ui.dev/react-router-v4-protected-routes-authentication/ */}
            </Switch>
        );
    }
}

export default Routes;