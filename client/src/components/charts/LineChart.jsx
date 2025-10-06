import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// We must register the components we want to use with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ chartData, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: '#F9FAFB', // White text
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' }, // Light gray text
        grid: { color: '#374151' }, // Slate-700
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default LineChart;
