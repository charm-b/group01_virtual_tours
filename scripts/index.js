const attractionsCollectionName = 'attractions';

// Download Data
var getAttractions = async () => {
  let ref = this.attractionsCollection().orderBy('name', 'asc');
  try {
    const querySnapshot = await ref.get();
    const data = [];
    querySnapshot.forEach(function(doc) {
      if (doc.exists) {
        const attraction = doc.data() || {};

        const reduced = {
          key: doc.id,
          ...attraction,
        };
        data.push(reduced);
      }
    });

    return data;
  } catch ({ message }) {
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
  } catch ({ message }) {
    alert(message);
  }
};

// Append the item to our list group
var addAttractions = attractions => {
  Object.keys(attractions).forEach(function (key) {
    var a = $("<a href='#' class='list-group-item list-group-item-action d-flex justify-content-between align-items-center'>");
    var d1 = $("<div class='image-parent'>");
    d1.append("<img src='" + attractions[key].imageUrl + "' class='img-fluid' alt='thumbnail'>");
    var d2 = $("<div class='flex-grow-1'>");
    var d3 = $("<div class='d-flex w-100 justify-content-between'>");
    d3.append("<h5 class='mb-1'>" + attractions[key].name + "</h5>");
    d3.append("<small>" + moment(attractions[key].lastUpdated.toDate()).fromNow() + "</small>");
    d2.append(d3);
    d2.append("<p class='mb-1'>" + attractions[key].description + "</p>");
    d2.append("<div class='d-flex text-warning'><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i></div>");
    var i = $("<i class='fas fa-chevron-right'></i>");
    a.append(d1, d2, i);
    $("#attractions-list").append(a);
  });
};

// Call our database and ask for the attractions
var makeRemoteRequest = async () => {
  // The data will be an array of attractions.
  const data = await getAttractions();

  // Iteratively add attractions
  let attractions = {};
  for (let child of data) {
    attractions[child.key] = child;
  }
  this.addAttractions(attractions);
};

// Helpers
function attractionsCollection() {
  return firebase.firestore().collection(attractionsCollectionName);
}

$(document).ready(async function() {
  makeRemoteRequest();
});
