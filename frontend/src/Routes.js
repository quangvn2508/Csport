import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from './Components/Home';
import Problem from './Components/Problem';
import Problems from './Components/Problems';
import CreateProblem from './Components/CreateProblem';
import Invalid from './Components/Invalid';
import Ranking from './Components/Ranking';
import SecuredRoute from './Components/SecuredRoute';
import Profile from './Components/Profile';
import Submission from './Components/Submission';

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <SecuredRoute exact path="/createProblem" component={CreateProblem}/>
                <Route exact path="/problem/:problemId" component={Problem}/>
                <Route exact path="/problems" component={Problems}/>
                <Route exact path="/rank" component={Ranking}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/submission/:submissionId" component={Submission}/>
                <Route exact path={["/", "/home"]} component={Home}/>
                <Route component={Invalid}/>
            </Switch>
        );
    }
}

export default Routes;