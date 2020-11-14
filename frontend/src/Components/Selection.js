import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
/**
 * Require
 * @param {} props.title 
 * @param {} props.selection
 * @param {} props.update
 */
function Selection(props) {
    const [current, setCurrent] = useState(null);
    function updateSelection (item) {
        props.update(item.value);
        setCurrent(item.value === null ? null : item.label);
    }

    return (
        <DropdownButton variant="outline-secondary" size="sm" title={current === null? props.title : current}>
            {props.selection.map(item => 
                <Dropdown.Item key={item.value} onClick={()=>updateSelection(item)}>{item.label}</Dropdown.Item>
            )}
        </DropdownButton>
    )
}

export default Selection;