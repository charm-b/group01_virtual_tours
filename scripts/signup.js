createUserObj = async (userId, email) => {
    console.log(userId, email);
    try {
        firebase.firestore().collection("users").doc(userId).set({
            name: 'Enter Name',
            avatar: '',
            email,
        });
    } catch ({
        message
    }) {
        alert("line 11" + message);
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
            .then(userObj => createUserObj(userObj.user.uid, email))
            .catch(error => alert("line 27" + error));
            window.location.href = "index.html";
    } catch (error) {
        alert("line 30" + error);
    }
 
};

var button2 = document.getElementById("signup-but");
button2.addEventListener("click", signup);