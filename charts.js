// Set up bar chart to display classification data
const barChart = document.getElementById('bar-chart').getContext('2d');
const barChartInstance = new Chart(barChart, {
    type: 'bar',
    data: {
        labels: ['Category A', 'Category B', 'Category C'],  // Placeholder labels
        datasets: [{
            label: 'Land Type Count',  // Placeholder label
            data: [10, 20, 30],  // Placeholder data
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Set up pie chart to display private data
const pieChart = document.getElementById('pie-chart').getContext('2d');
const pieChartInstance = new Chart(pieChart, {
    type: 'doughnut',
    data: {
        labels: ['Placeholder 1', 'Placeholder 2', 'Placeholder 3'],  // Placeholder labels
        datasets: [{
            label: 'Placeholder Data',  // Placeholder label
            data: [40, 30, 30],  // Placeholder data
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

function render_chart(queried_data, barChartInstance, pieChartInstance) {
    // Initialize frequency objects
    const private_freq = {};
    const classification_freq = {};

    // Calculate frequencies directly inside render_chart
    queried_data.forEach(row => {
        const private_stat = row[15];
        const classification_stat = row[21];
        private_freq[private_stat] = (private_freq[private_stat] || 0) + 1;
        classification_freq[classification_stat] = (classification_freq[classification_stat] || 0) + 1;
    });

    // Prepare data for charts
    const privateLabels = Object.keys(private_freq);
    const privateData = Object.values(private_freq);
    const classificationLabels = Object.keys(classification_freq);
    const classificationData = Object.values(classification_freq);

    // Clear existing bar chart data
    barChartInstance.data.labels.length = 0;
    barChartInstance.data.datasets.forEach(dataset => dataset.data.length = 0);

    // Clear existing pie chart data
    pieChartInstance.data.labels.length = 0;
    pieChartInstance.data.datasets.forEach(dataset => dataset.data.length = 0);

    // Update bar chart data
    barChartInstance.data.labels = classificationLabels;  // Assign new labels
    barChartInstance.data.datasets.forEach((dataset) => {
        dataset.data = classificationData;  // Assign new data
    });
    barChartInstance.update();

    // Update pie chart data
    pieChartInstance.data.labels = privateLabels;  // Assign new labels
    pieChartInstance.data.datasets.forEach((dataset) => {
        dataset.data = privateData;  // Assign new data
    });
    pieChartInstance.update();
}