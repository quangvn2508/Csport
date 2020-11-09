import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from './Components/Home';
// import Problem from './Components/Problem';
import CreateProblem from './Components/CreateProblem';
import Invalid from './Components/Invalid';

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/createProblem" component={CreateProblem}/>
                {/* <Route exact path="/problem" component={Problem}/> */}
                {/* <Route exact path="/problems" component={Home}/> */}
                {/* <Route exact path="/rank" component={Home}/> */}
                {/* <Route exact path="/login" component={Home}/> */}
                {/* <Route exact path="/profile" component={Home}/> */}
                <Route exact path={["/", "/home"]} component={Home}/>
                <Route component={Invalid}/>
                
                {/* https://ui.dev/react-router-v4-protected-routes-authentication/ */}
                {/* https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4 */}
            </Switch>
        );
    }
}

export default Routes;