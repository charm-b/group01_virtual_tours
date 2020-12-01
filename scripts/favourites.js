

const addToFavourites = async ({
    uid,
    attractionID,
  }) => {
    const ref = db.collection("users").doc();
    const id = ref.id;
    await ref.set({
      uid,
      favourites = attractionID
    });
  };

var button = document.getElementById("addToFav");
button.addEventListener("click", addToFavourites);