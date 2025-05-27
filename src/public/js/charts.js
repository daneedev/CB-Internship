      document.addEventListener("DOMContentLoaded", function () {
        const progressBars = document.querySelectorAll(".progress-bar");
        progressBars.forEach((bar) => {
          const completion = bar.getAttribute("data-completion");
          bar.style.width = completion * 20 + "%";
        });
      });