import axios from 'axios';
import { Pagination } from 'react-bootstrap';

export const DownloadFromUrl = (url) => {
    axios.get(url, {
        responseType: 'blob'
    })
    .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'testcase.zip');
        document.body.appendChild(link);
        link.click();
    })
    .catch(err => {
        console.log(err.response);
    });
}

export const PageController = (props) => {
    return (
        <Pagination>
            {props.current > 1 && 
                <>
                <Pagination.First onClick={() => props.update(1)}/>
                <Pagination.Prev onClick={() => props.update(props.current - 1)}/>
                </>
            }
            {
                [...Array(props.size).keys()].map(value => {
                    let pageNumber = value - Math.floor(props.size / 2) + props.current;
                    if (pageNumber >= 1 && pageNumber <= props.max) {
                        return <Pagination.Item active={pageNumber === props.current} onClick={() => props.update(pageNumber)} key={pageNumber}>{pageNumber}</Pagination.Item>
                    } else return undefined;
                })
            }
            {props.current < props.max && 
                <>
                <Pagination.Next onClick={() => props.update(props.current + 1)}/>
                <Pagination.Last onClick={() => props.update(props.max)}/>
                </>
            }
        </Pagination>
    );
}