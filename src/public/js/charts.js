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
  
    const satisfactionSum = businessData.ratings.reduce((sum, rating) => sum + rating.satisfaction, 0);
    const satisfactionCount = businessData.ratings.length * 3;
    new Chart(document.getElementById('satisfactionChart'), {
        type: 'doughnut',
        data: {
        datasets: [{
            data: [satisfactionSum, satisfactionCount - satisfactionSum ],
            borderWidth: 0,
            backgroundColor: ['#a259ff', '#2c2f4a'],
            borderRadius: [10, {
                innerEnd: 10,
                outerEnd: 10
            }]
        }],
        },
        options: {
            cutout: '80%',
            plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
            },
            rotation: -90,
            circumference: 180,
        },
    });

  const staff = document.getElementById("myChart2").getContext("2d");

  const satisfactionRate = parseFloat("{{ stafSatisfactionRate }}") || 9.3;
  const maxScore = 10;
  const percentage = (satisfactionRate / maxScore) * 100;

  const chart = new Chart(staff, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: [
            "rgb(16, 185, 129)", // Green for the progress
            "rgba(255, 255, 255, 0.1)", // Light transparent for the remaining
          ],
          borderWidth: 0,
          cutout: "75%", // Makes it a thick ring
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      rotation: -180,
      circumference: 270, // 3/4 circle (270 degrees)
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: "easeOutCubic",
      },
    },
  });
});