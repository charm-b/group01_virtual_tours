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
        var photoRef = firebase.firestore().collection("photo");
        photoRef.where("uid", "==", uid())
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log(doc.data());
                    var newPhoto = $("#imageBox");
                    var theUrl = doc.data().imageUrl;
                    newPhoto.append("<div class='img4'> <figure> <img src='" + theUrl + "' class='figure-img img-fluid rounded' alt='img'></figure></div>")

                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    } else {
        // No user is signed in.
    }
});