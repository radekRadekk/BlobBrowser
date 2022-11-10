let view;
let blobsNumber;
let currentBlob;

function createView() {
    return {
        "PreviousButton": document.getElementById("PreviousButton"),
        "NextButton": document.getElementById("NextButton"),

        "modal": {
            "communicateModalTitle": document.getElementById("communicateModalTitle"),
            "communicateModalButton": document.getElementById("communicateModalButton"),
            "communicateModalText": document.getElementById("communicateModalText")
        },

        "imageBox": document.getElementById("imageBox"),

        "logoutButton": document.getElementById("logoutButton")
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    view = createView();
    await loadImagesInfo();
    await setImage();

    view.logoutButton.onclick = () => logout(view.modal);
    view.PreviousButton.onclick = () => {
        if (currentBlob === 1)
            currentBlob = blobsNumber;
        else
            currentBlob--;
        setImage();
    };

    view.NextButton.onclick = () => {
        if (currentBlob === blobsNumber)
            currentBlob = 1;
        else
            currentBlob++;
        setImage();
    };
});

// async function loadUserNotes(fetchLink) {
//     let notesResponse = await fetch(fetchLink, {
//         method: "GET",
//         redirect: "follow"
//     }).then(async response => {
//         if (response.status === 401) {
//             let refreshStatus = await fetch("/authorization/refresh").then(refreshResponse => refreshResponse.status);
//             if (refreshStatus !== 200) {
//                 window.location.replace("/sessionExpired.html");
//             }
//
//             return await fetch(fetchLink, {
//                 method: "GET",
//                 redirect: "follow"
//             }).then(r => r.json());
//         } else {
//             return response.json();
//         }
//     });
//
//     view.userNotesTableBody.innerHTML = "";
//     for (let i = 0; i < notesResponse.count; i++) {
//         let textNode = document.createTextNode(notesResponse.items[i].text);
//         let isPrivate = notesResponse.items[i].isPrivate === true ? "Tak" : "Nie";
//
//         view.userNotesTableBody.innerHTML += '<tr><td>' + textNode.textContent +
//             '</td><td>' + isPrivate + '</td><td>' + notesResponse.items[i].sharedWithNickname + '</td></tr>'
//     }
//
//     if (notesResponse.links.previous === "") {
//         view.userNotesPreviousButton.disabled = true;
//     } else {
//         view.userNotesPreviousButton.disabled = false;
//     }
//
//     if (notesResponse.links.next === "") {
//         view.userNotesNextButton.disabled = true;
//     } else {
//         view.userNotesNextButton.disabled = false;
//     }
//
//     view.userNotesPreviousButton.onclick = async () => {
//         await load(notesResponse.links.previous);
//     };
//
//     view.userNotesNextButton.onclick = async () => {
//         await load(notesResponse.links.next);
//     };
// }

async function loadImagesInfo() {
    blobsNumber = await fetch("/images/info", {
        method: "GET",
        redirect: "follow",
        headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token").replace('"', '')}
    }).then(async response => {
        if (response.status === 401) {
            window.location.replace("/unauthorized.html");
        } else {
            return parseInt((await response.text()).replace('"', ''));
        }
    });

    currentBlob = 1;
}

async function setImage() {
    let imageBase64 = await fetch("/images/" + currentBlob.toString(), {
        method: "GET",
        redirect: "follow",
        headers: {Authorization: 'Bearer ' + sessionStorage.getItem("token").replace('"', '')}
    }).then(async response => {
        if (response.status === 401) {
            window.location.replace("/unauthorized.html");
        } else {
            return (await response.text()).replace('"', '');
        }
    });

    // console.log(imageBase64)
    view.imageBox.src = "data:image;base64," + imageBase64.replace('"', '');
}