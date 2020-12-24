import axios from 'axios';

export default function DownloadFromUrl(url) {
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
    });
}