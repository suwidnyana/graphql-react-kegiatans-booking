import React from 'react'

// import { Bar as BarChart } from 'react-chartjs';
import { Bar as BarChart } from 'react-chartjs-2';
const BOOKINGS_CHART = {
    'Murah': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Mahal': {
        min: 200,
        max: 10000000
    }
};

const bookingChart = props => {
    const chartData = {
        labels: [],
        datasets: []
    }
    let values = []
    for(const bucket in BOOKINGS_CHART) {
        const filteredBookings = props.bookings.reduce((prev, current) =>{
            if( 
                current.event.harga > BOOKINGS_CHART[bucket].min 
                && 
                current.event.harga < BOOKINGS_CHART[bucket].max 
                ) 
            {
                return prev + 1; 
            } else {
                return prev;
            }
        }, 0);
        // output[bucket] = filteredBookings;
        values.push(filteredBookings);
        chartData.labels.push(bucket);

        chartData.datasets.push({
          // label: "My First dataset",
          label: bucket,
          fillColor: 'rgba(220,220,220,0.5)',
          strokeColor: 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: values
        });

        values = [...values];
        values[values.length - 1] = 0;
      

    }
    return ( 
        <>
     
       <BarChart data={chartData}/>
       </>
    )
}

export default bookingChart;