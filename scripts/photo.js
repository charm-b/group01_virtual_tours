import * as Data from './photo_data.js';

  const commentTemplate = ({ uid, comment, timestamp = '' }) => `
  <p id="${uid}" class="comment">${comment}</p>
  <p class="timestamp">${Data.getDateFromTimeStamp(timestamp)}</p>`;

  const photoTemplate = ({ imageUrl, id }) => `
  <div id="${id}" class="photoSubContainer">
    <img alt="view photo" class="viewImage" src="${imageUrl}" />
    <div class="comments photoIconSection">
    </div>
  </div>
  `;

  const loadCommentUI = (photoID) => {
    Data.loadCommentData(photoID)
      .then(data => {
        document.querySelector(`#${photoID} .comments`).innerHTML = data.map(doc => commentTemplate(doc))
        .join('');      
      })
  }

const loadUIPhoto = (dataMethod = Data.getPhotoData) => {
  dataMethod()
    .then(data => {
      document.querySelector('#photoFromDatabase').innerHTML = data.map(doc => photoTemplate(doc)).join('');
      data.forEach(({ id }) => loadCommentUI(id));
    });
};
loadUIPhoto();
Data.getPhotoDataWithComments().then(data => {
  console.log(JSON.stringify(data));
});

function uploadMedia(uri, uploadUri) {
  return new Promise(async (res, rej) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref(uploadUri);
    const unsubscribe = ref.put(blob).on(
      'state_changed',
      state => {},
      err => {
        unsubscribe();
        rej(err);
      },
      async () => {
        unsubscribe();
        const url = await ref.getDownloadURL();
        res(url);
      }
    );
  });
}

// Upload Data
var uploadMediaAsync = async uri => {
  const path = `users/${uid()}/${uuidv4()}.${getFileExtension(uri)}`;
  return uploadMedia(uri, path);
};

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // uploadMediaAsync("../Wires.png").then((url)=>{
    //   console.log(url);
    // });
  } else {
      // No user is signed in.
  }
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uid() {
  return (firebase.auth().currentUser || {}).uid;
}

function getFileExtension(uri) {
  return uri
    .split('.')
    .pop()
    .split(/#|\?/)[0];
}
