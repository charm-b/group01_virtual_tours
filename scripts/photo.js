const getDateFromTimeStamp = ({ seconds }) => new Date(seconds);

const getDocWithId = (docs) => {
  const data = docs.map(doc => {
    const d = doc.data();
    d.id = doc.id;
    return d;
  });
  return data;
} 

const loadComments = (photoID) => new Promise((resolve, reject) => {
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

  

  const commentTemplate = ({ uid, comment, timestamp = '' }) => `
  <p id="${uid}" class="comment">${comment}</p>
  <p class="timestamp">${getDateFromTimeStamp(timestamp)}</p>`;

  const photoTemplate = ({ imageUrl, id }) => `
  <div id="${id}" class="dbImage">
    <img  src="${imageUrl}" />
    <div class="comments">
    </div>
  </div>
  `;


  const loadCommentUI = (photoID) => {
    loadComments(photoID)
      .then(data => {
        document.querySelector(`#${photoID} .comments`).innerHTML = data.map(doc => commentTemplate(doc))
        .join('');      
      })
  }

const loadUIPhoto = (dataMethod = getPhotoData) => {
  dataMethod()
    .then(data => {
      document.querySelector('#photoFromDatabase').innerHTML = data.map(doc => photoTemplate(doc)).join('');
      data.forEach(({ id }) => loadCommentUI(id));
    });
};
loadUIPhoto();