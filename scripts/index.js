const attractionsCollectionName = 'attractions';

const ptr = PullToRefresh.init({
  mainElement: '#custom-search-input',
  onRefresh() {
    window.location.reload();
  }
});

// Download Data
var getAttractions = async ({ currentQuery }) => {
  let ref = this.attractionsCollection().orderBy('name', 'asc');
  try {
    if (currentQuery) {
      ref = ref.where('name', '>=', currentQuery).where('name', '<=', currentQuery+'\uf8ff');
    }
    
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
  $("#attractions-list").empty();
  Object.keys(attractions).forEach(function (key) {
    var a = $("<a href='attractionDetail.html?id=" + key + "' class='list-group-item list-group-item-action d-flex justify-content-between align-items-center'>");
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
var makeRemoteRequest = async ({ currentQuery }) => {
  $("#loadMe").modal({
    backdrop: "static",
    keyboard: false,
    show: true
  });
  
  // The data will be an array of attractions.
  const data = await getAttractions({ currentQuery });

  // Iteratively add attractions
  let attractions = {};
  for (let child of data) {
    attractions[child.key] = child;
  }
  this.addAttractions(attractions);
  
  setTimeout(function() {
    $("#loadMe").modal("hide");
  }, 500);
};

// Helpers
function attractionsCollection() {
  return firebase.firestore().collection(attractionsCollectionName);
}

$(document).ready(async function() {
  makeRemoteRequest({});
	$('#search').keyup(function(){	
		var currentQuery = $('#search').val();
		if (currentQuery !== "") {
      makeRemoteRequest({ currentQuery });
		} else {
      makeRemoteRequest({});
		};
	});
});
