const logoutBtn = document.querySelector("#logout");
const addTileBtn = document.querySelector("#add-tile");
const cardsGrid = document.querySelector(".cards-grid");
const modal = document.querySelector(".modal");

const titleField = document.querySelector("#title");
const descriptionField = document.querySelector("#description");
const create = document.querySelector("#create");
const close = document.querySelector("#close");

addTileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
    titleField.value = "";
    descriptionField.value = "";
});

create.addEventListener("click", (e) => {
    e.preventDefault();
    title = titleField.value;
    description = descriptionField.value;
    if (title !== "") {
        function createProjectTile() {
            const projectTile = document.createElement("div");
            projectTile.classList.add("cards-grid__tile");
            projectTile.textContent = title;
            console.log(title, description);
            return projectTile;
        }
        cardsGrid.appendChild(createProjectTile());
        modal.style.display = "none";
        const user = firebase.auth().currentUser;
        if (user !== null) {
            const db = firebase.database();
        }
    }
});

close.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "none";
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            console.log("Successful logout");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            // An error happened.
            console.log("Logout failed");
        });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(user);
        // ...
    } else {
        // User is signed out
        // ...
        console.log("not logged in");
    }
});
