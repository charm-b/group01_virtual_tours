import * as Data from './photo_data.js';

const DOMEvents = {
  PageLoaded: 'DOMContentLoaded',
  Click: 'click'
};

//need this method for the id starts from 0 otherwise error
const getSafeId = (id) => `id_${id}`;

const commentTemplate = ({
  comment,
  timestamp = ''
}) => `<li>
  <p class="comment">${comment}</p>
  <p class="timestamp" data-date="${timestamp}">${Data.getDateFromTimeStamp(timestamp)}</p>
  </li>`;

const photoTemplate = ({
  imageUrl,
  id
}) => `
  <div data-id="${id}" class="photoSubContainer">
    <img alt="view photo" class="viewImage" src="${imageUrl}" />
    <i class="fas fa-heart" data-id="${id}"></i>
    <div class="comments photoIconSection">
    </div>   
    <button type="button" class="btn btn-info loadButton showAllComments" data-id="${id}"></button>
    ${replyCommentsForm(id)}
    </div>
  `;

  const replyCommentsForm = (id) =>
  `
  <div class="form-group">
    <textarea class="form-control replyComment" rows="3" placeholder="add comments"  data-id="${id}"></textarea>
    <button type="button" class="btn btn-info replyButton" data-id="${id}">Reply</button>
  </div>
  `;

  const loadPhotoLikes = async (userID) => {
    const {likes =[]} = await Data.loadLikes(userID);
    likes.forEach(l => {
      const selector = `.fa-heart[data-id="${l}"]`;
      console.log(`setting like for ${selector}`);
      const heart = document.querySelector(selector);
      if(heart) heart.classList.add('changeColor');
    });
  };

// display in HTML
const loadCommentUI = (photoID) => {
  //sort
  //add ul
  Data.loadCommentData(photoID)
    .then(data => {
      const html = data
        .sort( (a, b) => a.timestamp - b.timestamp)
        .map(doc => commentTemplate(doc))
        .join('');
        document.querySelector(`div.photoSubContainer[data-id="${photoID}"] .comments`)
        .innerHTML = `<ul class="commentUl" data-id="${photoID}">${html}</ul>`;
    });
};

//display photo to HTML
const loadUIPhoto = (dataMethod = Data.getPhotoData) => {
  dataMethod()
    .then(data => {
      document.querySelector('#photoFromDatabase').innerHTML = data.map(doc => photoTemplate(doc))
      .join('');
      try {
        data.forEach(({
          id
        }) => loadCommentUI(id));
      } catch (err) {
        console.log(err);
      }
      loadPhotoLikes(uid());
    });
};

// storing photoes to the firestore
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
  const path = `users/${uid()}/${Data.uuidv4()}.${getFileExtension(uri)}`;
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

function uid() {
  return (firebase.auth().currentUser || {}).uid;
}

function getFileExtension(uri) {
  return uri
    .split('.')
    .pop()
    .split(/#|\?/)[0];
}

// adding to firebase, uploading file, and adding comments
const photoUpload = async () => {
    const fileInput = document.querySelector('#file-input');
    if (fileInput.value === '') return;
    const uri = URL.createObjectURL(fileInput.files[0]); 
    if (uri !== '') {
      const imageUrl = await uploadMediaAsync(uri);
      const comment = document.querySelector('#photoComment').value;
      const timestamp = Date.now();
      const container = document.querySelector('.container');
      Data.addNewPhotoWithComments({
        uid: uid(),
        imageUrl,
        comment,
        timestamp
      }).then(() => {
        container.style.display = 'none';
        Data.sucessMessage();
      }).catch((err) => {
        container.style.display = 'none';
        Data.failMessage(err);
      });
    }
};

// add comments to existing photo
const addComment = ({ dataset : {id} }) => {
  const comment = document.querySelector(`textarea.replyComment[data-id="${id}"]`).value;
  if(comment !== ''){
    Data.addComment({
      id,
      comment,
      timestamp: Date.now() 
    });
  }
  loadUIPhoto();
};

const toggleCommentShow = ({dataset: { id }}) => {
  document.querySelector(`div.photoSubContainer[data-id="${id}"]`).classList.toggle('showAll');
};

// like button
const likePhoto = ({dataset: {id}}) => {
  const heart = document.querySelector(`.fa-heart[data-id="${id}"]`);
  heart.classList.toggle('changeColor');
  const likeData = {
    photoID: id,
    userID: uid()
  };
  if(heart.classList.contains('changeColor')){
    Data.likePhoto(likeData);
  }else{
    Data.disLikePhoto(likeData);
  };
};

const processClick = (target) =>{
  if(target.matches('.replyButton')) addComment(target);
  if(target.matches('#photoSubmitButton')) photoUpload();
  if(target.matches('.showAllComments')) toggleCommentShow(target);
  if(target.matches('.fa-heart')) likePhoto(target);
};

// DOM ready call the functions
document.addEventListener(DOMEvents.PageLoaded, () => {
  const photoContainer = document.querySelector('#photoFromDatabase');
  const photoUploadInput = document.querySelector('#file-input');
  if (photoContainer) loadUIPhoto();
  if (photoUploadInput) photoUpload();
  document.addEventListener('click', ({target}) => processClick(target))
});

