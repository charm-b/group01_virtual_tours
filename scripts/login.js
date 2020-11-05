login = async () => {

    console.log("something");
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        window.location.href = "profile.html";
    } catch (error) {
        alert(error);
    }
};

var button = document.getElementById("login-but");
button.addEventListener("click", login);