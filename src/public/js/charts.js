document.addEventListener("DOMContentLoaded", async function () {
  const progressBars = document.querySelectorAll(".progress-bar");
  progressBars.forEach((bar) => {
    const completion = bar.getAttribute("data-completion");
    bar.style.width = completion * 20 + "%";
  });

  const businessId = window.location.pathname.split("/").pop();
  const businessData = await fetch(`/api/getBusinessData/${businessId}`)
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching business data:", error));

  const satisfactionSum = businessData.ratings.reduce(
    (sum, rating) => sum + rating.satisfaction,
    0
  );
  const satisfactionCount = businessData.ratings.length * 3;
  new Chart(document.getElementById("satisfactionChart"), {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [satisfactionSum, satisfactionCount - satisfactionSum],
          borderWidth: 0,
          backgroundColor: ["#a259ff", "#2c2f4a"],
          borderRadius: [
            10,
            {
              innerEnd: 10,
              outerEnd: 10,
            },
          ],
        },
      ],
    },
    options: {
      cutout: "80%",
      responsive: true,
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
      rotation: -90,
      circumference: 180,
    },
  });

  const staff = document.getElementById("myChart2").getContext("2d");

  const staffSum = businessData.ratings.reduce(
    (sum, rating) => sum + rating.staff,
    0
  );
  const staffCount = businessData.ratings.length * 4;
  const chart = new Chart(staff, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [staffSum, staffCount - staffSum],
          backgroundColor: [
            "rgb(16, 185, 129)", // Green for the progress
            "rgba(255, 255, 255, 0.1)", // Light transparent for the remaining
          ],
          borderWidth: 0,
          cutout: "75%",
          borderRadius: [
            10,
            {
              innerEnd: 10,
              outerEnd: 10,
            },
          ],
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


    function surveysInMonth(month) {
    return businessData.ratings.filter((survey) => {
        return survey.month === month;
    }).length;
    }

    new Chart(document.getElementById("overviewChart"), {
    type: "line",
    data: {
        labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        ],
        datasets: [
        {
            label: "Surveys",
            data: [
            surveysInMonth(0),
            surveysInMonth(1),
            surveysInMonth(2),
            surveysInMonth(3),
            surveysInMonth(4),
            surveysInMonth(5),
            surveysInMonth(6),
            surveysInMonth(7),
            surveysInMonth(8),
            surveysInMonth(9),
            surveysInMonth(10),
            surveysInMonth(11),
            ],
            borderColor: "#a259ff",
            tension: 0.5,
            fill: true,
            backgroundColor: "rgba(162, 89, 255, 0.2)",
        },
        ],
    },
    });

    function getUsageFrequency(usage) {
        return businessData.ratings.filter((survey) => {
            return survey.usage === usage;
        }).length;
    }

    new Chart(document.getElementById("usageChart"), {
        type: "bar",
        data: {
            labels: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
            datasets: [
                {
                    label: "Usage Frequency",
                    data: [getUsageFrequency("daily"), getUsageFrequency("weekly"), getUsageFrequency("monthly"), getUsageFrequency("rarely"), getUsageFrequency("never")],
                    backgroundColor: "#a259ff",
                    borderRadius: 10,
                },
            ],
        },
        options: {
            responsive: true,
        }
    })


});

