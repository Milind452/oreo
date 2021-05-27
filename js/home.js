const logoutBtn = document.querySelector("#logout");
const addTileBtn = document.querySelector("#add-tile");
const cardsGrid = document.querySelector(".cards-grid");
const modal = document.querySelector(".modal");

const titleField = document.querySelector("#title");
const descriptionField = document.querySelector("#description");
const create = document.querySelector("#create");
const close = document.querySelector("#close");

const hamburger = document.querySelector("#hamburger");
const navWrapper = document.querySelector(".nav-wrapper");
const titleWrapper = document.querySelector(".title-wrapper");
const contentArea = document.querySelector(".content-area");

function createProjectTile(title) {
    const projectTile = document.createElement("div");
    projectTile.classList.add("cards-grid__tile");
    const count = cardsGrid.childElementCount;
    projectTile.innerHTML = `${title}
                            <div class="tile-links">
                            <a id="edit${count}" class="tile-links__action">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a id="delete${count}" class="tile-links__action">
                                <i class="fa fa-trash"></i>
                            </a>
                            </div>`;
    cardsGrid.appendChild(projectTile);
}

hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    navWrapper.classList.toggle("hidden-nav");
    titleWrapper.classList.toggle("hidden-content");
    contentArea.classList.toggle("hidden-content");
});

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
        createProjectTile(title);
        modal.style.display = "none";
        db_createProject(title, description);
    }
    create.textContent = "Create";
});

close.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "none";
    if (create.textContent === "Save") {
        title = titleField.value;
        description = descriptionField.value;
        if (title !== "") {
            createProjectTile(title);
            modal.style.display = "none";
            db_createProject(title, description);
        }
    }
    create.textContent = "Create";
});

cardsGrid.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target && e.target.parentElement.id.match(/^delete[0-9]+$/)) {
        const projectTile = e.target.parentElement.parentElement.parentElement;
        const title = projectTile.innerText;
        if (
            confirm(
                `Are you sure you want to delete project ${title}. Once deleted, it cannot be recovered.`
            )
        ) {
            projectTile.remove();
            db_deleteProject(title);
        }
    }
});

cardsGrid.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target && e.target.parentElement.id.match(/^edit[0-9]+$/)) {
        const projectTile = e.target.parentElement.parentElement.parentElement;
        const oldTitle = projectTile.innerText;
        let oldDescription;
        const user = firebase.auth().currentUser;
        if (user !== null) {
            const db = firebase.database();
            db.ref("users/" + user.uid + "/projects/" + oldTitle)
                .once("value", (snap) => {
                    oldDescription = snap.val().description;
                    modal.style.display = "block";
                    titleField.value = oldTitle;
                    descriptionField.value = oldDescription;
                    create.textContent = "Save";
                })
                .then(() => {
                    projectTile.remove();
                    db_deleteProject(oldTitle);
                })
                .catch((e) => {
                    throw e;
                });
        }
    }
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            console.log("Successful logout");
            window.location.href = "/oreo";
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
        db_getUserName();
        db_getProjects();
        // ...
    } else {
        // User is signed out
        // ...
        console.log("not logged in");
    }
});

function db_getUserName() {
    const user = firebase.auth().currentUser;
    if (user !== null) {
        let name;
        firebase
            .database()
            .ref("users/" + user.uid + "/name")
            .once("value", (snap) => {
                // console.log(snap.val());
                name = snap.val();
            })
            .then(() => {
                console.log(name);
                // TODO: Display user name on the home page "Hi <username>"
            })
            .catch((e) => {
                throw e;
            });
    }
}

function db_getProjects() {
    const user = firebase.auth().currentUser;
    if (user !== null) {
        let projects = [];
        firebase
            .database()
            .ref("users/" + user.uid + "/projects")
            .once("value", (snap) => {
                let project = snap.val();
                for (let title in project) {
                    for (let description in project[title]) {
                        projects.push({
                            title: title,
                            description: project[title][description],
                        });
                    }
                }
                // console.log(projects);
            })
            .then(() => {
                projects.forEach((project) => {
                    createProjectTile(project.title);
                });
            })
            .catch((e) => {
                throw e;
            });
    }
}

function db_createProject(title, description) {
    const user = firebase.auth().currentUser;
    if (user !== null) {
        const db = firebase.database();
        db.ref("users/" + user.uid + "/projects/" + title)
            .update({
                description: description,
            })
            .catch((e) => {
                throw e;
            });
    }
}

function db_deleteProject(title) {
    const user = firebase.auth().currentUser;
    if (user !== null) {
        const db = firebase.database();
        db.ref("users/" + user.uid + "/projects/" + title)
            .remove()
            .catch((e) => {
                throw e;
            });
    }
}
