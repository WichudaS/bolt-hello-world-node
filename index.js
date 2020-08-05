

//=============================INITIALIZE APP=============================
/* 
 * Slack API Demo 
 * This example shows how to ustilize the App Home feature
 * October 11, 2019 
 *
 * This example is written in Vanilla-ish JS with Express (No Slack SDK or Framework)
 * To see how this can be written in Bolt, https://glitch.com/edit/#!/apphome-bolt-demo-note
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const qs = require('qs');
const Airtable = require("airtable");
const dateFormat = require("dateformat");
const formidable = require("express-formidable");
// const admin = require('firebase-admin');




//import module from other .JS files
// const serviceAccount = require('./bolt-hello-world-node-3ee5bea630af.json');
const signature = require('./verifySignature');
const appHome = require('./appHome');
const msg = require('./msg');
const modal = require('./modal');
const test = require('./test');
const fn = require('./functions');
const fs = require('./firestore');
const dr = require('./dr');

//firebase initializing
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

//apply middlewares
const app = express();
// const db = fs.db();

const apiUrl = 'https://slack.com/api';
const baseDR = new Airtable(process.env.AIRTABLE_API_KEY).base("appAThxvZSRLzrXta");  //base "ข้อมูลสำหรับ Daily Report"


  /*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 *
 * Forget this if you're using Bolt framework or either SDK, otherwise you need to implement this by yourself to verify signature!
*/ 

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
// app.use(formidable({
//     encoding: "utf-8",
//     uploadDir: "/my/dir",
//     multiples: true, // req.files to be arrays of files
//     verify: rawBodyBuffer
//   }));






//=============================DECLARE GLOBAL VARIABLE=============================
const port = process.env.PORT || 3000;
var viewID = "initial value for viewID";
var private_metadata = "";



//=============================Jotform webhooks====================================
app.post('/jotform/hooks' , async function(req, res) {
  console.log("=================RECEIVED JOTFORM WEBHOOKS===================");
  res.status(200).send("OK");// ห้ามใส่ .end() ตรงนี้เด็ดขาดเพราะจะทำให้ res.send() ข้างล่างส่งไม่ได้

  //================= Parse JotForm request to JSON ===============================


  const fields = JSON.stringify(req.body);
  console.log(`req fields are = \n ${fields}`);
  
  const raw = req.body.rawRequest;
  console.log(`raw is = \n ${raw}`);

  //๋JSON.parse เลยจะอ่านไม่ออก ต้อง stringify ก่อนเสมอ
  const rawreq = JSON.stringify(req.body.rawRequest);
  console.log(`\n\n\n raw req is = \n ${rawreq}`);


  const formID = req.body.formID;
  console.log(`formID is = \n ${formID}`);

  var parsed = JSON.parse(raw);
  console.log(`parsed = \n ${parsed}`);

  var key = Object.keys(parsed);
  console.log(`parsed key = \n ${key}`);

  console.log(`keylength = ${key.length}`);

  for (var i = 0; i < key.length; i++) {
    var k = key[i];
    console.log(`${i+1}.${k} = ${parsed[k]}`);
  }
  
});



//=============================EVENT RESPONSE=============================
//Uncomment below line to Stop slack from event running 
// app.get('/event' , async(req, res) => {  
app.post('/slack/events' , async(req, res) => {
  res.status(200); //=ack();
  
  //LOG REQUEST===============    
      console.log("---------------" + req.body.type +" REQUEST STARTS HERE---------------");
      console.log("----------req.body.type----------");   
      console.log(req.body.type);    
      console.log("----------req.body----------");   
      console.log(req.body);  
      console.log("----------req.body.string----------");   
      console.log(JSON.stringify(req.body)); 
      console.log("----------req.body.context----------");   
      console.log(req.body.context);       
      console.log("----------req.body.payload----------");   
      console.log(req.body.payload);  
      // console.log("----------req.body.event----------");   
      // console.log(req.body.event);    
      console.log("---------------" + req.body.type +" REQUEST ENDS HERE---------------");     
  //RESPONSE TO EVENT CASES===============,
  switch (req.body.type) {
    //RESPONSE TO URL VERIFICATION===============  
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    //RESPONSE TO EVENT CALLBACK ===============       
    case 'event_callback': {
      // Verify the signing secret    
      if (!signature.isVerified) {
        res.sendStatus(404);
        return;
      } 
      //RESPONSE TO message =============== 
      else { 
      }
      break;
    }
  }
  
  
  //If there are event => Do something

  if(req.body.event) {
    const event = req.body.event;
    console.log(`event = ${JSON.stringify(event)}`);


    //'incoming Jibble message' in '#hr in-out channel' => 'Save to Airtable'
    
    if(event.type=="message" && event.subtype=="bot_message" && event.bot_id=="B016J4F8FEV" && event.channel=="C014URKUUBX") {
      console.log("CASE: Save jibble message to Airtable");
      res.sendStatus(204);  
      //===DECLARE VAR====
      
      var name = [];
      name = name.concat(event.text.split("*").splice(0,1).reduce((n) => n).trim());
      console.log(name);
      var project = [];
      var workType = [];
      var des = [];
      var imgURL = "";
  
      if(event.attachments) {
        for (var i of event.attachments) {
          console.log("i = " + JSON.stringify(i));
          if (Object.keys(i).includes("text")) {          
            try{
              var projectAndWork = i.text.split("*").splice(1,1).toString().split("_");
              if(projectAndWork.length > 1 ) {
                project = project.concat(projectAndWork[0].trim());
                workType = workType.concat(projectAndWork[1].trim());
              }
              else {
                workType = workType.concat(projectAndWork[0].trim());
              }

              des = des.concat(i.text.split("\n").splice(1,1).toString().slice(1,-1).trim());
              if(des.includes(null) || des.includes(undefined) || des.includes("")) {
                des = des.filter(n => n!= null && n!= undefined && n!="");
              }
            }
            catch (err) {console.log(err); 
            };
            console.log(`project = ${project}`);
            console.log(`workType = ${workType}`);
            console.log(`des = ${des}`);
          } 
          else if (Object.keys(i).includes("image_url")) {
            imgURL = i.image_url;
            console.log(`imgURL = ${imgURL}`);
          } 
          else {
            console.log(`project = ${project}`);
            console.log(`workType = ${workType}`);
            console.log(`des = ${des}`);
            console.log(`imgURL = ${imgURL}`);
          }
        }
      }
  
      // var dateTime = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
      var dateTime = new Date(new Date().toLocaleString());
      console.log(`dateTime = ${dateTime}`);
  
      var day = dateFormat(dateTime, "dd/mm/yyyy");
      console.log(`day = ${day}`);
      
      const recordPK = `${name} - ${day}`;
      recordPK.toString();
      console.log(`recordPK = ${recordPK}`);
  
  
      //===DECLARE FUNCTION===
  
        //Airtable Layout
      function JibbleLayout( event , recordID, name , dateTime ,workType, des, day, imgURL) {
        console.log("=====Jibble layout=====");
        return new Promise((resolve, reject) => {
  
          if (event.text.includes("jibbled")) {
            if (event.text.includes("jibbled in") && !(recordID) ) {
              let layout = {
                "fields": {
                  "ชื่อพนักงาน": name,
                  "เวลาเข้างาน (First In)": dateTime,
                  "โครงการ": project,
                  "ประเภทงาน": workType,
                  "รายละเอียด": des,
                  "วันที่": day
                }
              }
              
              let layoutArray = [];
              layoutArray = layoutArray.concat(layout);
  
              console.log(JSON.stringify(layoutArray));
              resolve(layoutArray);
            }
            if (event.text.includes("jibbled in") && (recordID) ) {
              let layout = {
                "id": recordID,
                "fields": {
                  "โครงการ": project,
                  "ประเภทงาน": workType,
                  "รายละเอียด": des
                }
              }
  
              let layoutArray = [];
              layoutArray = layoutArray.concat(layout);
  
              console.log(JSON.stringify(layoutArray));
              resolve(layoutArray);
            }
            if (event.text.includes("jibbled out") && (recordID) ) {
              let layout = {
                "id": recordID,
                "fields": {
                  "เวลาออกงาน (Last Out)": dateTime
                }
              }
  
              let layoutArray = [];
              layoutArray = layoutArray.concat(layout);
  
              console.log(JSON.stringify(layoutArray));
              resolve(layoutArray);
            }
  
          } else {
            reject();
          }
        }).catch(err => {
          console.log(err);
        });
      }
  
      //Search for Airtable record
      function RetrieveID(base, tableName, recordPK) {
        console.log("=====Retrieve record=====");
        console.log(`tableName = ${tableName}`);
        console.log(`recordPK = ${recordPK}`);
        // console.log(`base = ${base}`);
        console.log(`filerformula = {ชื่อและวันที่}="${recordPK}"` );
        
        return new Promise((resolve, reject) => {
          if (recordPK) {
            console.log(`case recordPK`);
            //find an existing Task recordID from AIRTABLE_BASE_ID
            base("บันทึกเวลาเข้าออก")
            .select({
              maxRecords: 1,
              view: "Grid view",
              fields: ["ชื่อและวันที่","ชื่อพนักงาน","วันที่","เวลาเข้างาน (First In)", "เวลาออกงาน (Last Out)","ประเภทงาน","รายละเอียด","โครงการ"],
              filterByFormula: `{ชื่อและวันที่}="${recordPK}"`
            }).all()
            .then((records) => {
              console.log(`case successful`);
              console.log(records);
              if(records.length>0) {
                records.forEach(item => {
                  console.log(`Found the record, recordID is = ${item.id}`);
                  console.log(item);

                  //add existing record's project into new project message
                  project = project.concat(item["fields"]["โครงการ"]);
                  if(project.includes(null) || project.includes(undefined) || project.includes("")) {
                    project = project.filter(n => n!= null && n!= undefined && n!="");
                  }                  
                  console.log(`project = ${project}`);

                  //add existing record's workType into new workType message
                  workType = workType.concat(item["fields"]["ประเภทงาน"]);
                  if(workType.includes(null) || workType.includes(undefined) || workType.includes("")) {
                    workType = workType.filter(n => n!= null && n!= undefined && n!="");
                  }                  
                  console.log(`workType = ${workType}`);

                  //add existing record's des into new des message
                  des = des.concat(item["fields"]["รายละเอียด"]);
                  if(des.includes(null) || des.includes(undefined) || des.includes("")) {
                    des = des.filter(n => n!= null && n!= undefined && n!="");
                  }
                  console.log(`des = ${des}`);

                  resolve(item.id);
                });
              } 
              else {
                console.log(`error case, recordID = ""`); 
                recordID = ""; 
                resolve(recordID);
              }
            });
          } else {
            console.log("Nothing match your search");
            reject();
          }
        }).catch(err => {
          console.log("Record not found, set recordID to empty.");
          recordID="";
        });
      }
  
  
      //Create new record
      function RecordCreate(base, tableName, dataGroup) {
        console.log("=====Create new record=====");
        //test OK!
        console.log("dataGroup = ");
        console.log(dataGroup);
  
        return new Promise((resolve, reject) => {
          if (dataGroup) {
            var allRecord = [];
            base(tableName).create(dataGroup, { typecast: true }, function(err,records) {
              if (err) {
                console.error(err);
                return;
              }
              records.forEach(function(record) {
                allRecord = allRecord.concat(record);
                console.log(`record ID ${record.id} from ${tableName} is CREATED!`);
              });
              console.log("allRecord = ");
              console.log(allRecord);
              resolve(allRecord);
            });
          } else {
            reject();
          }
        }).catch(err => {
          console.log(err);
        });
      }
  
      //Update extisting record
      function RecordUpdate(base, tableName, dataGroup) {
        console.log("=====Update existing record=====");
        //test OK!
        console.log("dataGroup = ");
        console.log(JSON.stringify(dataGroup));
  
        return new Promise((resolve, reject) => {
          let text = "";
          if (dataGroup) {
            base(tableName).update(dataGroup, { typecast: true }, function(
              err,
              records
            ) {
              if (err) {
                console.error(err);
                return;
              }
              records.forEach(function(record) {
                text = `record ID ${record.id} from ${tableName} is UPDATED!`
              });
              resolve(text);
            });
          } else {
            reject();
          }
        }).catch(err => {
          console.log(err);
        });
      }
  
  
  
      //===RUN===
    
      var baseID = "appAThxvZSRLzrXta"; //Jibble Datastore
      console.log(`baseID = ${baseID}`);
  
      var tableName = "บันทึกเวลาเข้าออก"; 
      console.log(`tableName = ${tableName}`);
  
      var recordID = await RetrieveID(baseDR, tableName, recordPK);
      console.log(`recordID = ${recordID}`);
      var dataGroup = await JibbleLayout( event , recordID, name , dateTime ,workType, des, day, imgURL);
      console.log(`dataGroup = ${dataGroup}`);
  
      if (recordID) {
        var updateRecord = await RecordUpdate(baseDR, tableName, dataGroup);
        console.log(updateRecord);
      }
      else {
        var createRecord = await RecordCreate(baseDR, tableName, dataGroup);
        console.log(createRecord);
      }
      
    }

  }

  res.end();
});



//=============================SLASH COMMAND RESPONSE (/BOLT)=============================
app.post('/slack/commands', async(req, res) => {

  //LOG ACTION REQUEST 
      console.log("---------------/bolt COMMAND REQUEST STARTS HERE---------------");
      console.log("----------req.body(string)----------");  
      console.log(JSON.stringify(req.body)); 
      console.log("---------------/bolt COMMAND REQUEST ENDS HERE---------------");       
  //CHECK TEXT COMMAND & RETRIVE TRIGGER_ID
  const text = req.body.text;
  console.log("Command text is: " + text);
  const trigger_id = req.body.trigger_id;
  console.log("trigger_id is: " + trigger_id);
  const response_url = req.body.response_url;
  console.log("responseURL is: " + response_url);
  const token = req.body.token;
  console.log("Request token is: " + token);
  const user_id = req.body.user_id;
  console.log("user_id is: " + user_id);
  const channel_id = req.body.channel_id
  console.log("channel_id is: " + channel_id);
  
  //if text contains 'mom' => send MOM message
  if (text.includes("mom") || text.includes("Mom") || text.includes("MOM") || text.includes("บันทึกการประชุม")) {
    console.log("==SEND MOM MESSAGE==");
    res.send(msg.momMsg());
  }
  //if text contains 'dr' => send DR message + create DR database cache document
  else if (text.includes("dr") || text.includes("DR") || text.includes("daily report") || text.includes("Daily Report") || text.includes("Daily report") || text.includes("DAILY REPORT")) {
    console.log("==SEND DR MESSAGE==");
    
    msg.drMsg(user_id, channel_id, trigger_id, process.env.SLACK_BOT_TOKEN)
    .then(result => {
      console.log(result.data);
      return res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
    })

    //create cache document in Firestore
    //const DR_prepopDocPath = `cache/${user_id}/DR/pre-populateURL`;
    var DRJotUrl = {
      "head": "https://form.jotform.com/201670438940455",
      "day": {
        "input22[month]": "",
        "input22[day]": "",
        "input22[year]": ""
      },
      "time": {
        "timeSchedule": "08.00-17.00"
      },
      "SE": {
        "SEName[first]": "",
        "SEName[last]": "",
        "SEPosition": "วิศวกรควบคุมงานก่อสร้าง",
        "SESlackID": ""
      },
      "PM": {
        "PMName[first]": "",
        "PMName[last]": "",
        "PMPosition": "ผู้จัดการโครงการ"
      },
      "staff": {
        "q146_staffTable[0][0]": ""
      },
      "dc": {
        "q39_DCTable[0][0]": ""
      },
      "progress100": {
        "q33_input33[0][0]":""
      },
      "misc": {
        "DRProjectQuery":"",
        "DRDateQuery":""
      }
    };

    const DRcache = await fs.DRPrepopURLDocRef(user_id).set(DRJotUrl);
    console.log(DRcache);

  }
  //else => send help message
  else {
    console.log("==SEND HELP MESSAGE==");
    res.send(msg.helpMsg());
  }
  

});


//=============================ACTION RESPONSE=============================
app.post('/slack/actions', async(req, res) => {
  //console.log(JSON.parse(req.body.payload));
  //LOG ACTION REQUEST 
      console.log("---------------ACTION REQUEST STARTS HERE---------------");
      console.log("----------req.body----------");  
      console.log(req.body); 
      console.log("----------req.body.actions----------");   
      console.log(req.body.actions);      
      console.log("----------req.body.context----------");   
      console.log(req.body.context);       
      console.log("----------req.body.payload----------");   
      console.log(req.body.payload);  
      console.log("---------------ACTION REQUEST ENDS HERE---------------");     
      
      const {type} = JSON.parse(req.body.payload)
  

  //-----DR DECLARE VARIABLE-----
  var DRProjectQuery = "";
  var DRDateQuery = "";
  


  
  //-----RUN-----

  switch(type) {
    case "block_actions":
      const { token, trigger_id, user, actions, response_url, container, view } = JSON.parse(req.body.payload);
      const channelID = container.channel_id || view.private_metadata;
      const user_id = user.id;  
      const action_id = actions[0].action_id;
      // const 
      // const value = 
      
      console.log({ token, user, actions });
      console.log(`trigger_id = ${trigger_id}`);
      console.log("response_url = " + response_url);
      console.log("action_id = " + action_id);
      console.log("user_id = "+ user_id); 
      console.log(`channelID = ${channelID}`);


      switch(action_id) {
        case "deletemessage":
          res.status(200);
          res.write(""); //=ack();
          // code block
          console.log("delete message case");
          //res.status(200); //=ack();
          let result = await msg.delMsg(response_url);
          console.log(result.data);
          res.end();
        break;
    
        case "open_drMsg":
          res.status(200);
          res.write(""); //=ack();
          console.log("open DR message case");
          // res.status(200); //=ack();

          //create cache for pre-populateURL
          var DRJotUrl = {
            "head": "https://form.jotform.com/201670438940455",
            "day": {
              "input22[month]": "",
              "input22[day]": "",
              "input22[year]": ""
            },
            "time": {
              "timeSchedule": "08.00-17.00"
            },
            "SE": {
              "SEName[first]": "",
              "SEName[last]": "",
              "SEPosition": "วิศวกรควบคุมงานก่อสร้าง",
              "SESlackID": ""
            },
            "PM": {
              "PMName[first]": "",
              "PMName[last]": "",
              "PMPosition": "ผู้จัดการโครงการ"
            },
            "staff": {
              "q146_staffTable[0][0]": ""
            },
            "dc": {
              "q39_DCTable[0][0]": ""
            },
            "progress100": {
              "q33_input33[0][0]":""
            },
            "misc": {
              "DRProjectQuery":"",
              "DRDateQuery":""
            }
          };
          const DRcache = await fs.DRPrepopURLDocRef(user_id).set(DRJotUrl);
          console.log(DRcache);

          //send DR message
          msg.drMsg(user_id, channelID, trigger_id, process.env.SLACK_BOT_TOKEN)
          .then(result => {
            console.log("message posted succesfully!");
            return res.end();
          
          })
          .catch(err => {
            console.error(err);
          })
        break;

        case "DR_projectList":
          res.status(200);
          res.write(""); //=ack();

          let DRProjectData = {
            "SE": {
              "SEName[first]": "",
              "SEName[last]": "",
              "SEPosition": "วิศวกรควบคุมงานก่อสร้าง",
              "SESlackID": ""
            },
            "PM": {
              "PMName[first]": "",
              "PMName[last]": "",
              "PMPosition": "ผู้จัดการโครงการ"
            },
            "misc.DRProjectQuery": ""
          };

          DRProjectQuery = actions[0].selected_option.value;
          console.log(`DRProjectQuery = ${DRProjectQuery}`);
          DRProjectData["misc.DRProjectQuery"] = DRProjectQuery;

          DRProjectData.SE.SESlackID = user.id;
          console.log(`SESlackID = ${DRProjectData.SE.SESlackID}`);

          // get PM's ID
          let projectData = await fn.DR_searchPPfrominfo(baseDR, "รายละเอียดโครงการ", `{ชื่อย่อโครงการ}="${DRProjectQuery}"`)
          let PMRecordID = "";
          if(projectData) {
            PMRecordID = projectData["ชื่อ PM (จากรายชื่อพนักงาน)"]
          }
          //find PM's info (firstname, lastname)
          let PMInfo = await fn.DR_getDataFromID(baseDR, "รายชื่อพนักงาน", PMRecordID);
          console.log(`PMinfo = ${JSON.stringify(PMInfo)}`);
          //store data into object
          if(PMInfo) {
            DRProjectData.PM["PMName[first]"] = PMInfo["ชื่อ-สกุล"].split(" ")[0].trim()                                      
            DRProjectData.PM["PMName[last]"] = PMInfo["ชื่อ-สกุล"].split(" ")[1].trim()
          }

          //find SE info with SE slackID
          let SEData = await fn.DR_searchPPfrominfo(baseDR, "รายชื่อพนักงาน", `{Slack USER ID}="${DRProjectData.SE.SESlackID}"`)
          if(SEData) {
            DRProjectData.SE["SEName[first]"] = SEData["ชื่อ-สกุล"].split(" ")[0].trim()                                      
            DRProjectData.SE["SEName[last]"] = SEData["ชื่อ-สกุล"].split(" ")[1].trim()
          }

          console.log("DRProjectData =");
          console.log(JSON.stringify(DRProjectData));

          //update to DB
          const DRcacheUpdate = await fs.DRPrepopURLDocRef(user_id).update(DRProjectData);
          console.log(DRcacheUpdate);
          res.end();
        break;

        case "DR_date":
          res.status(200);
          res.write(""); //=ack();

          let DRDateData = {
            "day": {
              "input22[month]": "",
              "input22[day]": "",
              "input22[year]": ""
            },            
            "misc.DRDateQuery": ""
          };

          // res.sendStatus(204); //ack and end
          DRDateQuery = actions[0].selected_date
          console.log(`DRDateQuery = ${DRDateQuery}`);
          DRDateData["misc.DRDateQuery"] = DRDateQuery;

          //store data into object 
          DRDateData.day["input22[year]"] = DRDateQuery.split("-")[0].trim()
          DRDateData.day["input22[month]"] = DRDateQuery.split("-")[1].trim()
          DRDateData.day["input22[day]"] = DRDateQuery.split("-")[2].trim()

          console.log(`input22[day] = ${DRDateData.day["input22[day]"]}`);
          console.log(`input22[month] = ${DRDateData.day["input22[month]"]}`);
          console.log(`input22[year] = ${DRDateData.day["input22[year]"]}`);

          console.log("DRDateData =");
          console.log(JSON.stringify(DRDateData));

          //Update DB
          const DRcacheDateUpdate = await fs.DRPrepopURLDocRef(user_id).update(DRDateData);
          console.log(DRcacheDateUpdate);
          res.end();
        break;
      }


    break;

    case "view_submission":

      const payload = JSON.parse(req.body.payload);

      const metaData = JSON.parse(payload.view.private_metadata);
      console.log(`metaData = ${JSON.stringify(metaData)}`);

      const viewName = metaData.viewName;
      console.log(`viewName = ${viewName}`);
      const channel_id = metaData.channel_id; 
      console.log(`channel_id = ${channel_id}`);
      const userSubmitID = payload.user.id;
      console.log(`userSubmitID = ${userSubmitID}`);

      switch(viewName) {
        case "DR_prepopInput":
          console.log("-----case DR_pre-populate URL");
          let today = new Date();

          //pop-up warning message if 'project' is not selected , OR 'date' is in the future
          //1. get data from DB => return datafields
          let data = await fs.DRPrepopURLDocRef(userSubmitID).get().then(documentSnapshot => {
            let fields = documentSnapshot.data();
            return fields;
          })
          console.log(`data from DB = `);
          console.log(JSON.stringify(data));

          //2. check the date (if data.misc.DRDateQuery = "" => data.misc.DRDateQuery = date)
          var date = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
          let day = dateFormat(date, "yyyy-mm-dd");

          if(!data.misc.DRDateQuery) {
            console.log(`Ther is no date from DB, assign date`);
            data.misc.DRDateQuery = day;

            //store data into object 
            data.day["input22[year]"] = day.split("-")[0].trim()
            data.day["input22[month]"] = day.split("-")[1].trim()
            data.day["input22[day]"] = day.split("-")[2].trim()

            console.log(`input22[day] = ${data.day["input22[day]"]}`);
            console.log(`input22[month] = ${data.day["input22[month]"]}`);
            console.log(`input22[year] = ${data.day["input22[year]"]}`);

          }

          //3. check and send message
          if(!(data.misc.DRProjectQuery) || (new Date(data.misc.DRDateQuery)>today)) {
            console.log("-----error case, no project chosen ,or date is in the future");
            res.send(await msg.drErrorMsg(userSubmitID, channel_id))
            console.log('msg sent!');
          }
          else{
            console.log("input checked! continue");
              
            //find other infos
            //1.get DC & staff data from Airtable
            const staffAndDCData = await fn.DR_getMultipleRecordsByFormula(baseDR, "บันทึกเวลาเข้าออก", `AND( {วันที่ (Text)}="${data.misc.DRDateQuery}", IF(SEARCH("${data.misc.DRProjectQuery}",ARRAYJOIN({โครงการ}))=BLANK(),FALSE(),TRUE()))`)
            if(staffAndDCData) {
              
              if(Object.keys(staffAndDCData.staff).length>0) {
                console.log(`staffData from Airtable = ${JSON.stringify(staffAndDCData.staff)}`);
                data.staff = staffAndDCData.staff;
                console.log(`Updated staff data`);
              }
              else {
                console.log("found no staff data = delete data.staff key");
                delete data.staff;
              }
              
              if(Object.keys(staffAndDCData.dc).length>0) {
                console.log(`DCData from Airtable = ${JSON.stringify(staffAndDCData.dc)}`);
                data.dc = staffAndDCData.dc;
                console.log(`DC data updated`);
              }
              else {
                console.log("found no DC data = delete data.dc key");
                delete data.dc;
              }
              
            }
            else{
              console.log(`No staff or DC data on this day, delete staff and dc keys`);
              delete data.staff;
              delete data.dc;
            }
            
            //2.get progress100% (ยังไม่ทำเพราะ base เก็บข้อมูล DR ยังไม่มา)
            const progressData = undefined;
            if(progressData) {
              console.log(`There are preogress 100% from other DR`);
            }
            else {
              console.log(`No progress100% this week, delete progress tree`);
              delete data.progress100;
            }
            
            //delete unused data
            delete data.misc;
            console.log(`finished data = ${JSON.stringify(data)}`)
            
            //transform and merge into URL
            const key = Object.keys(data)
            console.log(`data keys = ${key}`);

            //concat URL part from every keys except head
            var URLparam = [];
            for (var o in data) {
              console.log(`data key = ${o}`);
              if(o != "head") {
                let entries = Object.entries(data[o]);
                entries = entries.map(n => n.join("=")).join("&");
                console.log(entries);
                URLparam = URLparam.concat(entries);
              }
              else {
                console.log(`data keys = head, do nothing`);
              }
            }
            URLparam = URLparam.join("&")
            console.log(`Finished URLparam = ${URLparam}`);

            //merge URL
            URL = `${data.head}?${URLparam}`
            console.log(`URL = ${URL}`);

            //send message through chat.postEphemeral 
            // const msgText = `:cityscape:  <${URL}|Daily Report JotForm URL>  :cityscape:`
            /*
            var message = {
              "type": "modal",
              "title": {
                "type": "plain_text",
                "text": "Daily Report",
                "emoji": true
              },
              "submit": {
                "type": "plain_text",
                "text": "Close",
                "emoji": true
              },
              "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
              },
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "ลิ้งค์สำหรับกรอก Daily Report ค่ะ"
                  }
                },
                {
                  "type": "divider"
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "test"
                  }
                }
              ]
            }
            */

            res.send(await msg.drPrepopulatedURL(userSubmitID, channel_id, URL))
            console.log(`Modal link updated!`);

          }
          
          break;
        }
        
        break;
      }
      
      
      
    });












//=============================LISTEN TO PORT=============================
  /* Running Express server */
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});

