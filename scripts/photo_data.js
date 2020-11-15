const getDateFromTimeStamp = ({ seconds }) => new Date(seconds);

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

export {
  getDateFromTimeStamp, loadCommentData, getPhotoData, getPhotoDataWithComments
};
