document.addEventListener("DOMContentLoaded", function () {
  const editToggle = document.getElementById("editToggle");
  const submitSection = document.getElementById("submitSection");
  const currentPasswordRow = document.getElementById("currentPasswordRow");
  const cancelBtn = document.getElementById("cancelEdit");
  const submitBtn = document.getElementById("submitEdit");

  let isEditMode = false;
  let originalValues = {};

  // Store original values
  function storeOriginalValues() {
    const editableRows = document.querySelectorAll(
      '.info-row[data-editable="true"]'
    );
    editableRows.forEach((row) => {
      const valueElement = row.querySelector(".info-value");
      const field = valueElement.getAttribute("data-field");
      originalValues[field] = valueElement.textContent;
    });
  }

  // Toggle edit mode
  function toggleEditMode() {
    isEditMode = !isEditMode;
    const editableRows = document.querySelectorAll(
      '.info-row[data-editable="true"]'
    );

    if (isEditMode) {
      // Store original values before editing
      storeOriginalValues();

      // Switch to edit mode
      editToggle.classList.add("active");
      submitSection.classList.add("active");

      editableRows.forEach((row) => {
        const valueContainer = row.querySelector(".info-value-container");
        const valueElement = row.querySelector(".info-value");
        const field = valueElement.getAttribute("data-field");
        const currentValue = valueElement.textContent;

        // Create input field
        const input = document.createElement("input");
        input.type = field === "password" ? "password" : "text";
        input.className = "info-input";
        input.placeholder = currentValue;
        input.value = field === "password" ? "" : currentValue;
        input.setAttribute("data-field", field);
        input.name = field;
        input.required = true;

        // Replace value with input
        valueContainer.innerHTML = "";
        valueContainer.appendChild(input);
      });
    } else {
      // Switch back to view mode
      exitEditMode();
    }
  }

  // Exit edit mode
  function exitEditMode() {
    isEditMode = false;
    editToggle.classList.remove("active");
    submitSection.classList.remove("active");

    const editableRows = document.querySelectorAll(
      '.info-row[data-editable="true"]'
    );
    editableRows.forEach((row) => {
      const valueContainer = row.querySelector(".info-value-container");
      const input = row.querySelector(".info-input");

      if (input) {
        const field = input.getAttribute("data-field");
        const value =
          field === "password" ? "************" : originalValues[field];

        // Create span element
        const span = document.createElement("span");
        span.className = "info-value";
        span.setAttribute("data-field", field);
        span.textContent = value;

        // Replace input with span
        valueContainer.innerHTML = "";
        valueContainer.appendChild(span);
      }
    });
  }

  // Event listeners
  editToggle.addEventListener("click", function (e) {
    e.preventDefault();
    toggleEditMode();
  });

  cancelBtn.addEventListener("click", function () {
    exitEditMode();
  });

  // Handle Enter key in inputs
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && isEditMode) {
      saveChanges();
    } else if (e.key === "Escape" && isEditMode) {
      exitEditMode();
    }
  });

  // Initialize original values
  storeOriginalValues();
});
