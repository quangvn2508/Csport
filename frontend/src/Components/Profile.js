import React from 'react';
import ReactApexChart from "react-apexcharts";


const series = [{
    name: "rank",
    data: [...Array(90).keys()].map(ele => ele + 100)
}];

const options = {
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        width: 1,
        colors: '#aaaaaa',
        curve: 'smooth'
    },
    xaxis: {
        categories: [...Array(90).keys()],
        labels: {
            show: false
        }
    },
    yaxis: {
        labels: {
            show: false
        },
        reversed: true
    },
    grid: {
        show: false
    },
    markers: {
        size: 0,
        colors: '#aaaaaa',
        discrete: [],
        shape: "circle",
        radius: 0
    }
}

function Profile() {

    // https://apexcharts.com/docs/options/markers/
    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>);
};

export default Profile;