document.addEventListener("DOMContentLoaded", function () {
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    const completion = bar.getAttribute("data-completion");
    bar.style.width = completion * 20 + "%";
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
            "#10b981", // Green for the progress
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
      rotation: -180, // Start from the top
      circumference: 270, // 3/4 circle (270 degrees)
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: "easeOutCubic",
      },
    },
  });
});
