createUserObj = async (userId, email) => {
    try {
        firebase.firestore().collection("users").doc(userId).set({
            name: 'Enter Name',
            avatar: '',
            email,
        });
    } catch ({
        message
    }) {
        alert(message);
    }
};

signup = async () => {

    console.log("something");
    var email = document.getElementById("inputEmail4").value;
    var pass = document.getElementById("inputPassword4").value;

    try {

        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(userObj => createUserObj(userObj.user, email))
            .catch(error => alert(error));
        window.location.href = "index.html";
    } catch (error) {
        alert(error);
    }
 
};

var button2 = document.getElementById("signup-but");
button2.addEventListener("click", signup);