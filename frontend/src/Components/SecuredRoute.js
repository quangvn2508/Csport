import { connect } from 'react-redux';
import { showLoginPanel } from '../redux/actions';
import { Route } from "react-router-dom";

function mapStateToProps(state) {
    return {
        jwt: state.jwt
    }
}

const mapDipatchToProps = {
    showLoginPanel
}

function SecuredRoute({ component: Component, jwt, showLoginPanel, ...rest }) {
    return (<Route {...rest} render={(props) => {
        if (jwt !== null) {
            return <Component {...props} />;
        } else {
            showLoginPanel(true);
            return <div>Unauthorize</div>;
        }
    }} />);
}

export default connect(mapStateToProps, mapDipatchToProps)(SecuredRoute);