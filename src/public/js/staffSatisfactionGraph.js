// Mobile menu toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (
          !sidebar.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)
        ) {
          sidebar.classList.remove("open");
        }
      }
    });
  }

  // Create the satisfaction chart
  const ctx = document.getElementById("myChart2").getContext("2d");

  // Get satisfaction rate from template variable or set default
  const satisfactionRate = parseFloat("{{ stafSatisfactionRate }}") || 9.3;
  const maxScore = 10;
  const percentage = (satisfactionRate / maxScore) * 100;

  const chart = new Chart(ctx, {
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
      rotation: -90, // Start from the top
      circumference: 270, // 3/4 circle (270 degrees)
      animation: {
        animateRotate: true,
        duration: 2000,
        easing: "easeOutCubic",
      },
    },
  });
});
