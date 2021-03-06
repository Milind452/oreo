const form = document.querySelector("#form");
const nameFieldDiv = document.querySelector(".display-none");
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");
const loginBtn = document.querySelector("#login");
const signupBtn = document.querySelector("#signup");
const submitBtn = document.querySelector("#submit");

let isCreatingUser = false;
function IssueTracker() {
    this.issues = [];
}
IssueTracker.prototype = {
    add: function (issue) {
        this.issues.push(issue);
    },
    retrieve: function () {
        var message = "";
        switch (this.issues.length) {
            case 0:
                // do nothing because message is already ""
                break;
            case 1:
                message =
                    "Please correct the following issue:\n" + this.issues[0];
                break;
            default:
                message =
                    "Please correct the following issues:\n" +
                    this.issues.join("\n");
                break;
        }
        return message;
    },
};

function checkNameRequirements(name, nameIssueTracker) {
    if (!name.match(/^[a-zA-Z0-9 ]+$/g)) {
        nameIssueTracker.add("enter valid name");
    }
}

function checkEmailRequirements(email, emailIssueTracker) {
    if (!email.match(/[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/g)) {
        emailIssueTracker.add("enter valid email id");
    }
}

function checkPasswordRequirements(password, passwordIssueTracker) {
    if (password.length < 8) {
        passwordIssueTracker.add("fewer than 8 characters");
    } else if (password.length > 100) {
        passwordIssueTracker.add("greater than 100 characters");
    }

    if (!password.match(/[\!\@\#\$\%\^\&\*]/g)) {
        passwordIssueTracker.add("missing a symbol (!, @, #, $, %, ^, &, *)");
    }

    if (!password.match(/\d/g)) {
        passwordIssueTracker.add("missing a number");
    }

    if (!password.match(/[a-z]/g)) {
        passwordIssueTracker.add("missing a lowercase letter");
    }

    if (!password.match(/[A-Z]/g)) {
        passwordIssueTracker.add("missing an uppercase letter");
    }

    const illegalCharacterGroup = password.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g);
    if (illegalCharacterGroup) {
        illegalCharacterGroup.forEach(function (illegalChar) {
            passwordIssueTracker.add(
                "includes illegal character: " + illegalChar
            );
        });
    }
}

signupBtn.addEventListener("click", (e) => {
    const nameFieldClassList = nameFieldDiv.classList;
    if (nameFieldClassList.contains("display-none")) {
        nameFieldClassList.remove("display-none");
        submitBtn.textContent = "Create Account";
        nameField.required = true;
    }
});

loginBtn.addEventListener("click", (e) => {
    const nameFieldClassList = nameFieldDiv.classList;
    if (!nameFieldClassList.contains("display-none")) {
        nameFieldClassList.add("display-none");
        submitBtn.textContent = "Login";
        nameField.required = false;
    }
});

submitBtn.addEventListener("click", (e) => {
    const status = submitBtn.innerText;
    if (status === "Login") {
        const email = emailField.value;
        const password = passwordField.value;
        let passwordIssueTracker = new IssueTracker();
        let emailIssueTracker = new IssueTracker();
        checkEmailRequirements(email, emailIssueTracker);
        checkPasswordRequirements(password, passwordIssueTracker);
        const emailIssues = emailIssueTracker.retrieve();
        const passwordIssues = passwordIssueTracker.retrieve();
        emailField.setCustomValidity(emailIssues);
        passwordField.setCustomValidity(passwordIssues);
        e.preventDefault();
        if (passwordIssues.length === 0 && emailIssues.length == 0) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    // Github
                    window.location.href = "/oreo/home.html";
                    // VSCode
                    // window.location.href = "/home.html";
                })
                .catch((error) => {
                    if (error.code === "auth/user-not-found") {
                        alert(
                            "User does not exist. Please check if you entered the correct email id."
                        );
                    } else if (error.code === "auth/wrong-password") {
                        alert("Wrong password.");
                    }
                });
        }
    } else {
        const name = nameField.value;
        const email = emailField.value;
        const password = passwordField.value;
        let passwordIssueTracker = new IssueTracker();
        let emailIssueTracker = new IssueTracker();
        let nameIssueTracker = new IssueTracker();
        checkNameRequirements(name, nameIssueTracker);
        checkEmailRequirements(email, emailIssueTracker);
        checkPasswordRequirements(password, passwordIssueTracker);
        const nameIssues = nameIssueTracker.retrieve();
        const emailIssues = emailIssueTracker.retrieve();
        const passwordIssues = passwordIssueTracker.retrieve();
        nameField.setCustomValidity(nameIssues);
        emailField.setCustomValidity(emailIssues);
        passwordField.setCustomValidity(passwordIssues);
        e.preventDefault();
        if (
            passwordIssues.length === 0 &&
            emailIssues.length === 0 &&
            nameIssues.length === 0
        ) {
            isCreatingUser = true;
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                    if (user !== null) {
                        const db = firebase.database();
                        db.ref("users/" + user.uid)
                            .set({
                                email: email,
                                name: name,
                            })
                            .then(() => {
                                isCreatingUser = false;
                                // Github
                                window.location.href = "/oreo/home.html";
                                // VSCode
                                // window.location.href = "/home.html";
                            })
                            .catch((e) => {
                                isCreatingUser = false;
                                throw e;
                            });
                    }
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        alert(error.message);
                    }
                });
        }
    }
});

firebase.auth().onAuthStateChanged((user) => {
    if (user && !isCreatingUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // console.log(user);
    } else {
        // User is signed out
        // console.log("not logged in");
    }
});
