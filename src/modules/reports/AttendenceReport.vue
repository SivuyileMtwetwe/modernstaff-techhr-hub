<template>
    <div>
      <h2 class="text-2xl font-semibold mb-4">Attendance Report</h2>
      <canvas id="attendanceChart"></canvas> <!-- Chart container -->
    </div>
  </template>
  
  <script>
  import { Chart } from 'chart.js';
  
  export default {
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = document.getElementById('attendanceChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['John Doe', 'Jane Smith'], // Employee names
            datasets: [{
              label: 'Attendance',
              data: [1, 0], // 1 for present, 0 for absent
              backgroundColor: ['#4CAF50', '#F44336'],
              borderColor: ['#4CAF50', '#F44336'],
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
  };
  </script>
  