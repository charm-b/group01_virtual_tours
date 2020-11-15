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