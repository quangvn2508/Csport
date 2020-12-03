import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addError, addMessage, removeNotification } from '../redux/actions';
import './../Style/Notification.css';

function mapStateToProps(state) {
    return {
        notification: state.notification
    }
}

const mapDipatchToProps = {
    addError,
    addMessage,
    removeNotification
}

function Notification(props) {
    return (
        <>
        {
            props.notification !== null?
            (
                <div className="noti-panel">
                    <Alert variant={props.notification.type} onClose={props.removeNotification} dismissible>
                        {props.notification.heading !== null? <Alert.Heading>{props.notification.heading}</Alert.Heading> : null}
                        {props.notification.body}
                    </Alert>
                </div>
            ): null
        }
        </>
        
    )
}

export default connect(mapStateToProps, mapDipatchToProps)(Notification);