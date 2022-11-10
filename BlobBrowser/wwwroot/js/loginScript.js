const UserLoginAddress = "/api/authorize";

let view;

function createView() {
    return {
        "loginInput": document.getElementById("loginInput"),
        "passwordInput": document.getElementById("passwordInput"),
        "loginButton": document.getElementById("loginButton"),
        "modal": {
            "communicateModalTitle": document.getElementById("communicateModalTitle"),
            "communicateModalButton": document.getElementById("communicateModalButton"),
            "communicateModalText": document.getElementById("communicateModalText")
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    view = createView();

    setLoginButtonVisibility();

    view.loginInput.onchange = () => {
        let login = view.loginInput.value;

        if (login === "") {
            view.modal.communicateModalTitle.innerText = "Niepoprawny login!";
            view.modal.communicateModalText.innerText = "Login nie może być pusty."
            view.modal.communicateModalButton.onclick = () => $("#communicateModal").modal('hide');

            $("#communicateModal").modal('show');
        }

        setLoginButtonVisibility();
    };

    view.passwordInput.onchange = () => {
        let password = view.passwordInput.value;

        if (password === "") {
            view.modal.communicateModalTitle.innerText = "Niepoprawne hasło!";
            view.modal.communicateModalText.innerText = "Hasło nie może być puste."
            view.modal.communicateModalButton.onclick = () => $("#communicateModal").modal('hide');

            $("#communicateModal").modal('show');
        }

        setLoginButtonVisibility();
    };

    view.loginButton.onclick = () => {
        let content = JSON.stringify({
            "username": view.loginInput.value,
            "password": view.passwordInput.value,
        });

        let registerParams = {
            method: "POST",
            body: content,
            redirect: "follow",
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(UserLoginAddress, registerParams)
            .then(response => {
                if (response.status === 200) {
                    window.location.replace("/userHome.html");
                    response.text().then(t => sessionStorage.setItem("token", t.replace('"','')));
                } else {
                    view.modal.communicateModalTitle.innerText = "Nie udało się zalogować!";
                    view.modal.communicateModalText.innerText = "Spróbuj ponownie";
                    view.modal.communicateModalButton.onclick = () => window.location.replace("/login.html");

                    $("#communicateModal").modal('show');
                }
            });
    };

});

function setLoginButtonVisibility() {
    view.loginButton.disabled = view.loginInput.value === "" || view.passwordInput.value === "";
}