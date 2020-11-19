import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Home from './Components/Home';
import Problem from './Components/Problem';
import Problems from './Components/Problems';
import CreateProblem from './Components/CreateProblem';
import Invalid from './Components/Invalid';
import Ranking from './Components/Ranking';
import Login from './Components/Login';
import Cookie from 'js-cookie';
import { JWT_KEY } from './config';

const SecuredRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        Cookie.get(JWT_KEY) !== undefined ? <Component {...props} /> : <Redirect to='/login' />
    )} />
)

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <SecuredRoute exact path="/createProblem" component={CreateProblem}/>
                <Route exact path="/problem/:problemId" component={Problem}/>
                <Route exact path="/problems" component={Problems}/>
                <Route exact path="/rank" component={Ranking}/>
                <Route exact path="/login" component={Login}/>
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