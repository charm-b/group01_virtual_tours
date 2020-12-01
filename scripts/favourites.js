const usersCollectionName = 'users';
const attractionsCollectionName = 'attractions';

var getUserFavourites = async uid => {
    let ref = this.usersCollection().doc(uid);
    try {
        const doc = await ref.get();
        if (doc.exists) {
            const user = doc.data() || {};

            return user.favourites;
        }
    } catch ({
        message
    }) {
        alert(message);
    }
};

var getAttraction = async attractionId => {
    let ref = this.attractionsCollection().doc(attractionId);
    try {
        const doc = await ref.get();
        if (doc.exists) {
            const attraction = doc.data() || {};

            const reduced = {
                key: doc.id,
                ...attraction,
            };
            return reduced;
        }
    } catch ({
        message
    }) {
        alert(message);
    }
};

var addAttractions = attractions => {
    $("#attractions-list").empty();
    attractions.forEach((attractionId) => {
        getAttraction(attractionId).then((attraction) => {
            var a = $("<a href='attractionDetail.html?id=" + attractionId + "' class='list-group-item list-group-item-action d-flex justify-content-between align-items-center'>");
            var d1 = $("<div class='image-parent'>");
            d1.append("<img src='" + attraction.imageUrl + "' class='img-fluid' alt='thumbnail'>");
            var d2 = $("<div class='flex-grow-1'>");
            var d3 = $("<div class='d-flex w-100 justify-content-between'>");
            d3.append("<h5 class='mb-1'>" + attraction.name + "</h5>");
            d3.append("<small>" + moment(attraction.lastUpdated.toDate()).fromNow() + "</small>");
            d2.append(d3);
            d2.append("<p class='mb-1'>" + attraction.description + "</p>");
            d2.append("<div class='d-flex text-warning'><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i></div>");
            var i = $("<i class='fas fa-chevron-right'></i>");
            a.append(d1, d2, i);
            $("#attractions-list").append(a);
        })
    });
};

var makeRemoteRequest = async (uid) => {
    $("#loadMe").modal({
        backdrop: "static",
        keyboard: false,
        show: true
    });

    // The data will be an array of attractions.
    const data = await getUserFavourites(uid);

    // Iteratively add attractions
    this.addAttractions(data);

    setTimeout(function () {
        $("#loadMe").modal("hide");
    }, 500);
};

// Helpers
function usersCollection() {
    return firebase.firestore().collection(usersCollectionName);
}

function attractionsCollection() {
    return firebase.firestore().collection(attractionsCollectionName);
}

function uid() {
    return (firebase.auth().currentUser || {}).uid;
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        makeRemoteRequest(uid());
    }
});

