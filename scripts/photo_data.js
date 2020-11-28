/**
 * generate a guid
 */
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const getDateFromTimeStamp = (ticks) => (new Date(parseInt(ticks, 10))).toLocaleDateString();

/**
 * take the firebase doc and return json data with id added
 * @param {*} docs firebase doc stracture
 */
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
    .then(({
      docs
    }) => {
      const data = getDocWithId(docs);
      resolve(data);
    })
    .catch(err => reject(err));
});

const getPhotoData = () => new Promise((resolve, reject) => {
  db.collection("photo")
    .get()
    .then(({
      docs
    }) => {
      const data = getDocWithId(docs);
      resolve(data);
    })
    .catch(err => reject(err));
});

const addComment = async ({
  id,
  uid,
  timestamp,
  comment
}) => {
  await db.collection("photo")
    .doc(id)
    .collection("comments")
    .doc()
    .set({
      comment,
      timestamp
    });
};

const addNewPhotoWithComments = async ({
  uid,
  imageUrl,
  comment,
  timestamp,
  like
}) => {
  const ref = db.collection("photo").doc();
  const id = ref.id;
  await ref.set({
    uid,
    imageUrl,
    like: false
  });
  await addComment({
    id,
    uid,
    timestamp,
    comment
  });
};

const likePhoto = async ({
  photoID,
  userID
}) => {
  console.log(`likePhoto ${photoID}  for user ${userID}`);
  const dataSet = await db.collection('likes')
    .doc(userID)
    .get();
  const {
    likes = []
  } = dataSet.data() || {};
  likes.push(photoID);
  const uniqueLikes = [...new Set(likes)];

  await db.collection('likes')
    .doc(userID)
    .set({
      likes: uniqueLikes
    });
};

const disLikePhoto = async ({
  userID,
  photoID
}) => {
  console.log(`dislikePhoto ${photoID}  for user ${userID}`);
  const dataSet = await db.collection('likes')
    .doc(userID)
    .get();

  const {
    likes = []
  } = dataSet.data() || {};
  const newLikes = likes.filter(l => l !== photoID);

  await db.collection('likes')
    .doc(userID)
    .set({
      likes: newLikes
    });
};

const loadLikes = async (userID) => {
  const doc = await db.collection("likes").doc(userID).get();
  const data = doc.data();
  console.log(`loaded likes for user ${userID} `);
  console.log(JSON.stringify(data));
  return data;
};

const sucessMessage = () => {
  const messageContainer = document.querySelector('.messageContainer');
  messageContainer.innerHTML = '<div class="alert alert-success"><string>Success!</strong></div>' +
    '<a class="btn btn-info backMainBtn" href="./index.html">Back to Main page</a>';
  return messageContainer;
}

const failMessage = (err) => {
  const messageContainer = document.querySelector('.messageContainer');
  messageContainer.innerHTML = `<div class="alert alert-danger"><strong>Error! ${err}</strong>Employee was not created!</div>
  '<a class="btn btn-info backMainBtn" href="./index.html">Back to Main page</a>'
  `;
  return messageContainer;
}

export {
  getDateFromTimeStamp,
  loadCommentData,
  getPhotoData,
  addNewPhotoWithComments,
  uuidv4,
  addComment,
  sucessMessage,
  failMessage,
  likePhoto,
  disLikePhoto,
  loadLikes
};