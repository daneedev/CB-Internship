document.addEventListener("DOMContentLoaded", function () {
    const businessCards = document.querySelectorAll(".business-card");
    const selectedBusinessName = document.getElementById(
      "selectedBusinessName"
    );
    const continueBtn = document.getElementById("continueBtn");
    const addBusinessBtn = document.getElementById("addBusinessBtn");
    const addBusinessModal = document.getElementById("addBusinessModal");
    const closeAddBusinessModal = document.getElementById(
      "closeAddBusinessModal"
    );
    const cancelAddBusiness = document.getElementById("cancelAddBusiness");
    const logoOptions = document.querySelectorAll(".logo-option");

    let selectedBusiness = null;
    let selectedLogoClass = "";

    // Business selection functionality
    businessCards.forEach((card) => {
      card.addEventListener("click", function () {
        businessCards.forEach((c) => c.classList.remove("selected"));
        this.classList.add("selected");

        selectedBusiness = this.dataset.id;
        const businessName = this.querySelector(".business-name").textContent;
        selectedBusinessName.textContent = businessName;
        continueBtn.disabled = false;
      });
    });

    continueBtn.addEventListener("click", function () {
      if (selectedBusiness) {
        console.log("Selected business:", selectedBusiness);
        window.location.href = `/dash/${selectedBusiness}`;
      }
    });

    // Modal functionality
    addBusinessBtn.addEventListener("click", () => {
      addBusinessModal.classList.add("active");
    });

    function closeModal() {
      addBusinessModal.classList.remove("active");
      addBusinessForm.reset();
      logoOptions.forEach((option) => option.classList.remove("selected"));
      selectedLogoClass = "";
    }

    closeAddBusinessModal.addEventListener("click", closeModal);
    cancelAddBusiness.addEventListener("click", closeModal);

    // Close modal when clicking outside
    addBusinessModal.addEventListener("click", function (e) {
      if (e.target === addBusinessModal) {
        closeModal();
      }
    });

  
  });