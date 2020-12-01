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
  // The data will be an attraction.
  const data = await getAttraction(attractionId);
  
  $("#attraction-image").attr("src", data.imageUrl);
  $("#attraction-name").text(data.name);
  $("#description").text(data.description);
  
  console.log(data);
};

// Helpers
function attractionsCollection() {
  return firebase.firestore().collection(attractionsCollectionName);
}

$(document).ready(async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const attractionId = urlParams.get('id');
  makeRemoteRequest(attractionId);
});