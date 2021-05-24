const logoutBtn = document.querySelector("#logout");

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    firebase
        .auth()
        .signOut()
        .then(() => {
            // Sign-out successful.
            console.log("Successful logout");
        })
        .catch((error) => {
            // An error happened.
            console.log("Logout failed");
        });
});
