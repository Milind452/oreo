const form = document.querySelector("#form");
const nameFieldDiv = document.querySelector('.display-none')
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");
const loginBtn = document.querySelector("#login");
const signupBtn = document.querySelector("#signup");

loginBtn.addEventListener('click', e => {
    e.preventDefault();
    const nameFieldClassList = nameFieldDiv.classList
    if(!nameFieldClassList.contains('display-none')) {
        nameFieldClassList.add('display-none')
    }
    const email = emailField.value;
    const password = passwordField.value;
    console.log("login")
})

signupBtn.addEventListener('click', e => {
    e.preventDefault();
    const nameFieldClassList = nameFieldDiv.classList
    if(nameFieldClassList.contains('display-none')) {
        nameFieldClassList.remove('display-none');
        loginBtn.parentElement.remove();
        document.querySelector('.box__fields').insertAdjacentElement('beforeend', loginBtn.parentElement);
        loginBtn.style.width = '250px';
        signupBtn.style.width = '300px';
    }
    const name = nameField.value;
    const email = emailField.value;
    const password = passwordField.value;
    console.log('Create account')
})