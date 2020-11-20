const getDateFromTimeStamp = (ticks) => (new Date(parseInt(ticks, 10))).toLocaleDateString();


const getDocWithId = (docs) => {
  const data = docs.map(doc => {
    const d = doc.data();
    d.id = doc.id;
    return d;
  });
  return data;
} 

const loadCommentData = (photoID) => new Promise((resolve, reject) => {
  db.collection("photo")
    .doc(photoID)
    .collection("comments")
    .get()
    .then(({ docs }) => {
      const data = getDocWithId(docs);
      resolve(data);
    })
    .catch(err => reject(err));
});

const getPhotoData = () => new Promise((resolve, reject) => {
    db.collection("photo")
    .get()
    .then(({ docs }) => {
      const data = getDocWithId(docs);
      resolve(data); 
    })
    .catch(err => reject(err));
  });

const getPhotoDataWithComments = () => new Promise((resolve, reject) => {
  // getPhotoData().then(data => {
  //   const photoData = data.map(doc => {
  //     doc.comments = await loadCommentData(data.id);
  //     return doc;
  //   });
  //   return photoData;
  // });
});

const addNewPhotoWithComments = async ({uid, imageUrl, comment, timestamp}) => {
  db.collection("photo").doc(uid).set({
    uid,
    imageUrl,
  })
  .then(() => {
    db.collection("photo")
      .doc(uid)
        .collection("comments")
        .doc(uid)
        .set({
      comment,
      timestamp
    });
  }).then(() => {})
  .catch(function(err){
    console.log(err);
  });
};



export {
  getDateFromTimeStamp, loadCommentData, getPhotoData, getPhotoDataWithComments, addNewPhotoWithComments
};
