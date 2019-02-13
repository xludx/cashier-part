
/**
 * checks if design docs are deployed to Couchdb and deploys them if not
 *
 */

const fs = require('fs');
const storage = require('./models/storage');

fs.readdir('./_design_docs', (err, designDocs) => {
  if (err) {
    console.log('Cant read design documents list');
    process.exit();
  }

  const readFileCallback = function (err, data) {
    const json = JSON.parse(data);
    if (err) {
      return console.log(err);
    }
    storage.getDocumentPromise(json._id).then((doc) => {
      if (!doc || doc.error === 'not_found') {
        console.log(`${json._id} design doc needs to be created`);
        storage.saveDocumentPromise(json).then((response, err) => {
          console.log('Creating design document resulted in:', JSON.stringify(response || err));
        });
      }
    });
  };

  for (let i = 0; i < designDocs.length; i++) {
    fs.readFile(`${'./_design_docs' + '/'}${designDocs[i]}`, 'utf8', readFileCallback);
  }
});
