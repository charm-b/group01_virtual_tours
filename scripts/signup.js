createUserObj = async (userId, email, name, location) => {
    console.log(userId, email, name, location);
    try {
        await firebase.firestore().collection("users").doc(userId).set({
            name,
            avatar: '',
            email,
            location,
            favourites
        });
        window.location.href = "index.html";
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
    var name = document.getElementById("inputName").value;
    var location = document.getElementById("inputLocation").value;

    try {

        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(userObj => {
                createUserObj(userObj.user.uid, email, name, location);
            })
            .catch(error => alert("line 27" + error));
    } catch (error) {
        alert("line 30" + error);
    }
 
};

var button2 = document.getElementById("signup-but");
button2.addEventListener("click", signup);