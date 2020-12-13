const admin = require('firebase-admin');
const serviceAccount = require('./bolt-hello-world-node-3ee5bea630af.json');
// firebase initializing
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });



//=============================TEST FIRESTORE SDK (works!)===============================
/*
  // const docRef = db.collection('users').doc('alovelace');

  // docRef.set({
  //   first: 'Ada',
  //   last: 'Lovelace',
  //   born: 1815
  // });

  // const aTuringRef = db.collection('users').doc('aturing');

  // aTuringRef.set({
  //   'first': 'Alan',
  //   'middle': 'Mathison',
  //   'last': 'Turing',
  //   'born': 1912
  // });

  // app.get("/firestore/test" , async (req, res) => {
  //   const snapshot = await db.collection('users').get();
  //   snapshot.forEach((doc) => {
  //     console.log(doc.id, '=>', doc.data());
  //   });

  // });
*/



// const projectListRef = db.doc('slack-external-menus/project list');
//   projectListRef.get()
//   .then(documentSnapshot => {
//     let data = documentSnapshot.data();
//     console.log(`Retrived data = ${JSON.stringify(data)}`);
//     console.log(`data = `);
//     console.log(data);
//   })




//==============================Daily Report ===============================
function DRPrepopURLDocRef(user_id) {
  let DBPath = `cache/${user_id}/DR/pre-populateURL`;
  return db.doc(DBPath);
}

function DRListDocRef(project, DRno) {
  let DBPath = `project/${project}/documentStatus/DR/DRList/${DRno}`;
  return db.doc(DBPath);
}


//============================== Requested Budget ===============================
function RBPrepopURLDocRef(user_id) {
  let DBPath = `cache/${user_id}/RB/pre-populateURL`;
  return db.doc(DBPath);
}
//=============================EXPORT FUNCTIONS=============================
module.exports = {db, 
  DRPrepopURLDocRef, DRListDocRef, 
  RBPrepopURLDocRef};




