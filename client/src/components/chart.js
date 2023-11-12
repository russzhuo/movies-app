import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ ratings }) {
  const labels = [
    "0-1",
    "1-2",
    "2-3",
    "3-4",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
  ];


    return <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: "IMDB ratings at a glance",
            data: getData(ratings),
            backgroundColor:"aqua",
            borderColor:'yellow',
            borderWidth: 0.25,
          },
        ],
      }}
      height={100}
      width={350}
      options={{
        maintainAspectRatio: false,
        scales: {
          y: 
            {
              min:0,
              max:25
            },
          
        },
        legend: {
          labels: {
            fontSize: 12,
          },
        },
      }
    }
    />
}

function between(x, min, max) {
  if (max === 10) {
    return x >= min;
  }
  return x >= min && x < max;
}

function getData(ratings) {
  const data = [];
  for (let i = 0; i < 10; i++) {
    let count = 0;
    for (const r of ratings) if (between(r, i, i + 1)) count++;

    data.push(count);
  }
  return data;
}

export default BarChart;
