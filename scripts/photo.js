import * as Data from './photo_data.js';

const commentTemplate = ({
  uid,
  comment,
  timestamp = ''
}) => `
  <p id="${uid}" class="comment">${comment}</p>
  <p class="timestamp" data-date="${timestamp}">${Data.getDateFromTimeStamp(timestamp)}</p>`;

const photoTemplate = ({
  imageUrl,
  id
}) => `
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
      try {
        data.forEach(({
          id
        }) => loadCommentUI(id));
      } catch (err) {
        console.log(err);
      }
    });
};

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
    // Enable Upload COntrol (if it exists)
    document.body.classList.add('auth-user');
  } else {
    // Disable
    document.body.classList.remove('auth-user');
  }
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
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


const initPhotoUpload = () => {
  document.querySelector('#photoSubmitButton').addEventListener('click', async () => {
    console.log('clicked');
    const fileInput = document.querySelector('#file-input');
    if (fileInput.value === '') return;
    const uri = URL.createObjectURL(fileInput.files[0]); 
    if (uri !== '') {
      const imageUrl = await uploadMediaAsync(uri);
      const comment = document.querySelector('#photoComment').value;
      const timestamp = Date.now();
      Data.addNewPhotoWithComments({
        uid: uid(),
        imageUrl,
        comment,
        timestamp
      });
    }
  });
};

(() => {
  const photoContainer = document.querySelector('#photoFromDatabase');
  const photoUpload = document.querySelector('#file-input');
  if (photoContainer) loadUIPhoto();
  if (photoUpload) initPhotoUpload();
})();