const attractionsCollectionName = 'attractions';

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

// Call our database and ask for the attraction
var makeRemoteRequest = async (attractionId) => {
  $("#loadMe").modal({
    backdrop: "static",
    keyboard: false,
    show: true
  });
  
  // The data will be an attraction.
  const data = await getAttraction(attractionId);
  
  $("#attraction-image").attr("src", data.imageUrl);
  $("#attraction-name").text(data.name);
  $("#last-updated").text(moment(data.lastUpdated.toDate()).fromNow());
  $("#description").text(data.description);
  
  setTimeout(function() {
    $("#loadMe").modal("hide");
  }, 500);
};

// Helpers
function attractionsCollection() {
  return firebase.firestore().collection(attractionsCollectionName);
}

$(document).ready(async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const attractionId = urlParams.get('id');
  makeRemoteRequest(attractionId);
  $('#back-button').on('click', function(e) {
    window.history.back();
  });
});
