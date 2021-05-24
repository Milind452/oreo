const logoutBtn = document.querySelector("#logout");

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
