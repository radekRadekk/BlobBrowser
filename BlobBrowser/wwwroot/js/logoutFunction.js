function logout(modal) {
    sessionStorage.removeItem("token");
    modal.communicateModalTitle.innerText = "Wylogowano pomyślnie!";
    modal.communicateModalText.innerText = "Dziękujemy!";
    modal.communicateModalButton.onclick = () => window.location.replace("/home.html");

    $("#communicateModal").modal('show');
}