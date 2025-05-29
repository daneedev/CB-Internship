document.addEventListener("DOMContentLoaded", function () {
    const qrCodebtn = document.getElementById("qrCode")
    const qrCodeModal = document.getElementById("qrCodeModal");
    const qrCodeClose = document.getElementById("qrCodeClose");
    const qrCodeCancel = document.getElementById("qrCodeCancel");

    qrCodebtn.addEventListener("click", function () {
        qrCodeModal.classList.add("active");

    });
    qrCodeClose.addEventListener("click", function () {
        qrCodeModal.classList.remove("active");
    });
    qrCodeCancel.addEventListener("click", function () {
        qrCodeModal.classList.remove("active");
    });
})