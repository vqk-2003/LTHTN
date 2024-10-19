import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDqucO7npbsctT7ZfENNQ9IIxfML32tUSU",
    authDomain: "mybtl-f1109.firebaseapp.com",
    databaseURL: "https://mybtl-f1109-default-rtdb.firebaseio.com",
    projectId: "mybtl-f1109",
    storageBucket: "mybtl-f1109.appspot.com",
    messagingSenderId: "928020385299",
    appId: "1:928020385299:web:e744997ee6151c592ef9e6",
    measurementId: "G-TVG3ZMTZVR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const test = ref(database, "data");
const tempCtx = document.getElementById('temperatureChart').getContext('2d');
const moistCtx = document.getElementById('moistureChart').getContext('2d');
const limit = -5; // max number of data

// Function to create a chart
function createChart(ctx, label, borderColor, backgroundColor) {
  return new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: label,
              data: [],
              borderColor: borderColor,
              backgroundColor: backgroundColor,
              fill: false
          }]
      },
      options: {
          responsive: true,
          scales: {
              x: { title: { display: true, text: 'Time' } },
              y: { title: { display: true, text: label } }
          }
      }
  });
}
const tempChart = createChart(tempCtx,'Temperature (°C)','rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)')
const moistChart = createChart(moistCtx,'Moisture (%)','rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)')

function updateChart(chart,newData) {
  chart.data.labels = Object.keys(newData).slice(limit);
  chart.data.datasets[0].data = Object.values(newData).slice(limit);
  chart.update("none");
};

onValue(test, (snapshot) => {
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();
  document.getElementById('current-time').innerText = `${dateString} ${timeString}`;
  updateChart(tempChart,snapshot.val());
  updateChart(moistChart,snapshot.val());
});