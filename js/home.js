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
const projectContentArea = document.querySelector("#project-content");
const taskContentArea = document.querySelector("#task-content");

const username = document.querySelector("#username");
const navHome = document.querySelector("#nav-home");
const navSettings = document.querySelector("#nav-settings");
const navHelp = document.querySelector("#nav-help");
const titleName = document.querySelector("#title-name");

const addListBtn = document.querySelector("#add-list");
const listModal = document.querySelector(".modal-list");
const listTitleField = document.querySelector("#title-list");
const listCreate = document.querySelector("#create-list");
const listClose = document.querySelector("#close-list");
const addListBtnWrapper = document.querySelector(".list-btn-wrapper");

function setUserName(name) {
    username.textContent = `Hi ${name}`;
}

function createList(listTitle) {
    const list = document.createElement("div");
    list.classList.add("list");
    list.innerHTML = `<div class="list-title">${listTitle}</div>
                        <div class="task-pane"></div>
                        <a class="add-task-btn btn">
                            + Add new task
                        </a>`;
    addListBtnWrapper.insertAdjacentElement("beforebegin", list);
}

function createProjectTile(title) {
    const projectTile = document.createElement("div");
    projectTile.classList.add("cards-grid__tile");
    const count = cardsGrid.childElementCount;
    projectTile.innerHTML = `<a id=${title} class="project-link">
                                ${title}
                            </a>
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
    projectContentArea.classList.toggle("hidden-content");
    taskContentArea.classList.toggle("hidden-content");
});

navHome.addEventListener("click", (e) => {
    e.preventDefault();
    if (projectContentArea.classList.contains("hidden-main")) {
        projectContentArea.classList.remove("hidden-main");
        taskContentArea.classList.add("hidden-main");
        titleName.textContent = "Boards";
    }
});

cardsGrid.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target && e.target.className === "project-link") {
        const projectLink = e.target;
        const projectName = projectLink.id;
        projectContentArea.classList.toggle("hidden-main");
        taskContentArea.classList.toggle("hidden-main");
        titleName.textContent = projectName;
    }
});

addListBtn.addEventListener("click", (e) => {
    e.preventDefault();
    listModal.style.display = "block";
    listTitleField.value = "";
});

listCreate.addEventListener("click", (e) => {
    e.preventDefault();
    const listTitle = listTitleField.value;
    if (listTitle !== "") {
        createList(listTitle);
        listModal.style.display = "none";
        db_createList(listTitle);
    }
});

listClose.addEventListener("click", (e) => {
    e.preventDefault();
    listModal.style.display = "none";
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
            // Github
            window.location.href = "/oreo";
            // VSCode
            // window.location.href = "/index.html";
        })
        .catch((error) => {
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
    } else {
        // User is signed out
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
                name = snap.val();
            })
            .then(() => {
                setUserName(name);
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
                    projects.push({
                        title: title,
                        description: project[title]["description"],
                    });
                }
            })
            .then(() => {
                projects.forEach((project) => {
                    createProjectTile(project.title);
                    db_getLists(project.title);
                });
            })
            .catch((e) => {
                throw e;
            });
    }
}

function db_getLists(title) {
    const user = firebase.auth().currentUser;
    if (user !== null) {
        let lists = [];
        firebase
            .database()
            .ref("users/" + user.uid + "/projects/" + title)
            .once("value", (snap) => {
                let list = snap.val();
                for (let listTitle in list) {
                    if (listTitle === list[listTitle]["title"])
                        lists.push({
                            listTitle: listTitle,
                        });
                }
            })
            .then(() => {
                lists.forEach((list) => {
                    createList(list.listTitle);
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

function db_createList(listTitle) {
    const title = titleName.textContent;
    const user = firebase.auth().currentUser;
    if (user !== null) {
        // TODO: Add details to db in proper order
        const db = firebase.database();
        db.ref("users/" + user.uid + "/projects/" + title + "/" + listTitle)
            .update({
                title: listTitle,
            })
            .then(() => {
                console.log("success");
            })
            .catch((e) => {
                throw e;
            });
    }
}
