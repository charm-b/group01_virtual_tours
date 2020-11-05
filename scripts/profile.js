fetchUserInfo = async userId => {
    let ref = firebase.firestore().collection("users").doc(userId);
    try {
        const doc = await ref.get();
        if (doc.exists) {
            const user = doc.data() || {};


            return user;
        }
    } catch ({
        message
    }) {
        alert(message);
    }
};


function uid() {
    return (firebase.auth().currentUser || {}).uid;
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(firebase.auth());
        console.log(firebase.auth().currentUser);
        // User is signed in.
        fetchUserInfo(uid()).then(userInfo => {
            var profileName = document.getElementById("profileName");
            profileName.innerText = userInfo.name;
            var locationAndLinks = document.getElementById("locationAndLinks");
            locationAndLinks.innerText = ("Location: " + userInfo.location + " Email: " + userInfo.email);
        });
    } else {
        // No user is signed in.
    }
});