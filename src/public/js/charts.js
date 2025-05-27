document.addEventListener("DOMContentLoaded", async function () {
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar) => {
    const completion = bar.getAttribute("data-completion");
    bar.style.width = completion * 20 + "%";
    });

    const businessId = window.location.pathname.split("/").pop();
    const businessData = await fetch(`/api/getBusinessData/${businessId}`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching business data:', error));


    new Chart(document.getElementById('satisfactionChart'), {
        type: 'doughnut',
        data: {
        datasets: [{
            data: [12, 19],
            borderWidth: 0,
            backgroundColor: ['#a259ff', '#2c2f4a'],
        }]
        },
        options: {
            cutout: '80%',
            plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
            },
            rotation: -90,
            circumference: 180,
        }
    });
});