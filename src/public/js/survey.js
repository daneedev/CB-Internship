document.addEventListener("DOMContentLoaded", async function () {
    const businessId = window.location.pathname.split("/").pop();
    await fetch(`/api/countVisit/${businessId}`)
      .then((response) => response.json())
      .catch((error) => console.error("Error counting visit:", error));
});