const logoutBtn = document.querySelector("#logout");
const addTileBtn = document.querySelector("#add-tile");
const cardsGrid = document.querySelector(".cards-grid");

addTileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    function createProjectTile() {
        const projectTile = document.createElement("div");
        projectTile.classList.add("cards-grid__tile");
        projectTile.textContent = "<Project Name>";
        return projectTile;
    }
    cardsGrid.appendChild(createProjectTile());
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
