import { Popover, OverlayTrigger } from 'react-bootstrap';
import IconButton from "@material-ui/core/IconButton";
import HelpOutlineRoundedIcon from '@material-ui/icons/HelpOutlineRounded';

function Tooltip(props) {
    return (
        <OverlayTrigger trigger="focus" placement="right" overlay={(
            <Popover id="popover-basic">
                <Popover.Title as="h3">{props.title}</Popover.Title>
                <Popover.Content>{props.content}</Popover.Content>
            </Popover>
        )}>
            <IconButton component="span" >
                <HelpOutlineRoundedIcon fontSize="small" />
            </IconButton>
        </OverlayTrigger>
    );
}

export default Tooltip;