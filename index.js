

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
//const amplify = require('amplifyjs');


//import module from other .JS files
const signature = require('./verifySignature');
const appHome = require('./appHome');
const mom = require('./mom');
const msg = require('./msg');
const modal = require('./modal');
const test = require('./Test');

//apply middlewares
const app = express();

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




//=============================FUNCTION DECLARATION=============================

//check if it's not empty
function IsNotEmpty(value) {
  if (value) {
    return true;
  } else {
    return false;
  }
}






//=============================DECLARE GLOBAL VARIABLE=============================
const port = process.env.PORT || 3000;
var viewID = "initial value for viewID";
var private_metadata = "";



//=============================EVENT RESPONSE=============================
//Uncomment below line to Stop slack from event running 
// app.post('/slack/event' , async(req, res) => {  
app.post('/slack/events' , async(req, res) => {
res.status(200); //=ack();
  
  //LOG REQUEST===============    
      console.log("---------------" + req.body.type +" REQUEST STARTS HERE---------------");
      console.log("----------req type----------");   
      console.log(req.body.type);    
      console.log("----------req.body----------");   
      console.log(req.body);  
      console.log("----------req.body.string----------");   
      console.log(JSON.stringify(req.body)); 
      console.log("----------req.context----------");   
      console.log(req.context);       
      console.log("----------req.payload----------");   
      console.log(req.payload);  
      // console.log("----------req.body.event----------");   
      // console.log(req.body.event);    
      console.log("---------------" + req.body.type +" REQUEST ENDS HERE---------------");     
  //RESPONSE TO EVENT CASES===============
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
      if (!signature.isVerified(req)) {
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
          
      //===DECLARE VAR====
      
      var name = [];
      name = name.concat(event.text.split("*").splice(0,1).reduce((n) => n).trim());
      console.log(name);
      var project = [];
      var workType = [];
      var des = [];
      var imgURL = "";
  
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
  
              console.log(layoutArray);
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
  
              console.log(layoutArray);
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
  
              console.log(layoutArray);
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
              fields: ["ชื่อและวันที่","ชื่อพนักงาน","วันที่","เวลาเข้างาน (First In)", "เวลาออกงาน (Last Out)","ประเภทงาน","รายละเอียด"],
              filterByFormula: `{ชื่อและวันที่}="${recordPK}"`
            }).all()
            .then((records) => {
              console.log(`case successful`);
              console.log(records);
              if(records.length>0) {
                records.forEach(item => {
                  console.log(`Found the record, recordID is = ${item.id}`);
                  console.log(item);
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
  res.status(200); //=ack();
//LOG ACTION REQUEST 
      console.log("---------------/bolt COMMAND REQUEST STARTS HERE---------------");
      console.log("----------req.body----------");  
      console.log(req.body); 
      console.log("----------req.body.context----------");   
      console.log(req.body.context);       
      console.log("----------req.body.payload----------");   
      console.log(req.body.payload);  
      console.log("---------------/bolt COMMAND REQUEST ENDS HERE---------------");       
  
  //CHECK TEXT COMMAND & RETRIVE TRIGGER_ID
  const text = req.body.text;
  console.log("Command text is: " + text);
  const triggerID = req.body.trigger_id;
  console.log("triggerID is: " + triggerID);
  const response_url = req.body.response_url;
  console.log("responseURL is: " + response_url);
  const token = req.body.token;
  console.log("Request token is: " + token);
  const user_id = req.body.user_id;
  console.log("user_id is: " + user_id);
  
  //if text contains 'mom' => send MOM message
  if (text.includes("mom") || text.includes("Mom") || text.includes("MOM") || text.includes("บันทึกการประชุม")) {
    console.log("==SEND MOM MESSAGE==");
    res.send(msg.momMsg());
    //console.log(res);
    //console.log(res.data);
    //console.log(res.body);
    /* send modal
    const result = await modal.openModal(triggerID);
    console.log("========== OPEN_MODAL RESPONSE.data STARTS ==========");
    console.log(result.data);   
    console.log("========== OPEN_MODAL RESPONSE.data ENDS ==========");
    viewID = result.data.view.id
    console.log("ViewID in index.js for this modal is " + viewID);
    */
  }
  //if text contains 'dr' => send DR message
  else if (text.includes("dr") || text.includes("DR") || req.body.text.includes("daily report") || req.body.text.includes("Daily Report") || req.body.text.includes("Daily report") || req.body.text.includes("DAILY REPORT")) {
    console.log("==SEND DR MESSAGE==");
    res.send(msg.drMsg());
  }
  //else => send help message
  else {
    console.log("==SEND HELP MESSAGE==");
    res.send(msg.helpMsg());
  }
  
});





//=============================ACTION RESPONSE=============================
app.post('/slack/actions', async(req, res) => {
  res.status(200); //=ack();
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
      
  
  const { token, trigger_id, user, actions, type, response_url } = JSON.parse(req.body.payload);
  const user_id = user.id;  
  const action_id = actions[0].action_id;
  
      console.log({ token, trigger_id, user, actions, type });
      console.log("response_url = " + response_url);
      console.log("action_id = " + action_id);
      console.log("user_id = "+ user_id);  
  
  
  switch(action_id) {
  case "deletemessage":
    // code block
      console.log("delete message case");
    //res.status(200); //=ack();
    res.send(await msg.delMsg(response_url));
    break;
  default:
    // code block
}
  
  // Modal forms submitted --
/*      
  else if(type === 'view_submission') {
    res.send(''); // Make sure to respond to the server to avoid an error
    
    const ts = new Date();
    const { user, view } = JSON.parse(req.body.payload);

    const data = {
      timestamp: ts.toLocaleString(),
      note: view.state.values.note01.content.value,
      color: view.state.values.note02.color.selected_option.value
    }
    
    appHome.displayHome(user.id, data);
  }
});
*/

});





//=============================LISTEN TO PORT=============================
  /* Running Express server */
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});

