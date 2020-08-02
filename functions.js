//=============================Initialize=============================
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const qs = require('qs');
const Airtable = require("airtable");
const dateFormat = require("dateformat");
const formidable = require("express-formidable");

const signature = require('./verifySignature');
const appHome = require('./appHome');
const msg = require('./msg');
const modal = require('./modal');
const test = require('./test');
const fn = require('./functions');
const fs = require('./firestore');

//apply middlewares
const app = express();

const apiUrl = 'https://slack.com/api';
const baseDR = new Airtable(process.env.AIRTABLE_API_KEY).base("appAThxvZSRLzrXta");  //base "ข้อมูลสำหรับ Daily Report"

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

// app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
// app.use(bodyParser.json({ verify: rawBodyBuffer }));
app.use(formidable({
    encoding: "utf-8",
    uploadDir: "/my/dir",
    multiples: true // req.files to be arrays of files
  }));




//====================DECLARE VARIABLE TO BE USED IN THIS FILE======================




//============================GENERAL FUNCTION==============================
//check if it's not empty
function IsNotEmpty(value) {
  if (value) {
    return true;
  } else {
    return false;
  }
}





//====================DR functions==========================================
//Search for Airtable record
function DR_searchPPfrominfo(base, tableName, filterFormula) {
  console.log("searchfrominfo");
  // console.log(`base = ${base}`);    //output =very long object 
  console.log(`tablename = ${tableName}`);
  console.log(`filterFormula = ${filterFormula}`);



  return new Promise((resolve, reject) => {
    if (filterFormula) {
      console.log(`start querying`);
      //retrive PM's ID
      base(tableName).select({
        maxRecords: 1,
        filterByFormula: filterFormula
      })
      .all()
      .then((records) => {
        console.log(`find process successful`);
        console.log(`number of record(s) = ${records.length}`);
        
        if(records.length>0) {
          records.forEach(record => {
            console.log(`recordID = ${record.id} , record firlds = ${JSON.stringify(record.fields)}`);
            resolve(record.fields)
          });
        } 
        else {
          console.log(`found nothing, return blank`);
          resolve();
        } 
      });  
    }
  }).catch(err => {
    console.error(err);
  });
};


function DR_getDataFromID(base, tableName, recordID) {
  console.log(`Find Info`);
  console.log(`tableName = ${tableName}`);
  console.log(`recordID = ${recordID}`);

  return new Promise((resolve, reject) => {
    base(tableName).find(recordID, function(err, record) {
      if (err) { console.error(err); return; }
      console.log(`Retrieved record ${record.id}`);
      console.log(`return record fields `);
      console.log(record.fields);
      resolve(record.fields);
    });
  }).catch(err => {
    console.error(err);
  });


};

function DR_getMultipleRecordsByFormula(base, tableName, filterFormula) {
  console.log("DR_getMultipleRecordsByFormula => list all records that match the criteria");
  // console.log(`base = ${base}`);    //output =very long object 
  console.log(`tablename = ${tableName}`);
  console.log(`filterFormula = ${filterFormula}`);

  let obj = {
    "staff": {
    },
    "dc": {
    }
  };

  return new Promise((resolve, reject) => {
    if (filterFormula) {
      console.log(`start querying`);
      //retrive records
      base(tableName).select({
        maxRecords: 50,
        filterByFormula: filterFormula,
        view:"Sort by date and position"
      })
      .all()
      .then((records) => {
        console.log(`find process successful`);
        console.log(`number of record(s) = ${records.length}`);
        
        if(records.length>0) {
          var i=0;
          var m=0;

          for(var a=0 ; a<records.length ; a++) {
            console.log(`recordID = ${records[a].id} , record fields = ${JSON.stringify(records[a].fields)}`);
            var { fields } = records[a];

            if(fields["ชื่อพนักงาน"]) {
              for(var j=0 ; j<2 ; j++) {
                let key = `q146_staffTable[${i}][${j}]`;
                
                if(j==0) {
                  if(fields["ตำแหน่ง (from รายชื่อพนักงาน)"]) {
                    obj.staff[key] = fields["ตำแหน่ง (from รายชื่อพนักงาน)"].join();
                  }
                  else {
                    obj.staff[key] = "ไม่มีการระบุตำแหน่งงานในฐานข้อมูล โปรดตรวจสอบ Base= ข้อมูลสำหรับ Daily Report, Table= รายชื่อพนักงาน"
                  }
                }
                else {
                  obj.staff[key] = fields["ชื่อพนักงาน (Text)"]
                }
              
              }
              i=i+1;
            }

            if(fields["ชื่อคนงาน"]) {
              for(var n=0 ; n<4 ; n++) {
                let key = `q39_DCTable[${m}][${n}]`
                
                  if(n==0) {
                    if(fields["ชื่อพนักงาน/คนงาน"]) {
                      obj.dc[key] = fields["ชื่อพนักงาน/คนงาน"];
                    }
                    else {
                      obj.dc[key] = "ไม่มีชื่อคนงานในฐานข้อมูล โปรดตรวจสอบ Base= ข้อมูลสำหรับ Daily Report, Table= รายชื่อพนักงาน"
                    }
                  }
                  else if(n==1) {
                    if(fields["รายละเอียด"]) {
                      obj.dc[key] = fields["รายละเอียด"];
                    }
                    else {
                      obj.dc[key] = "ไม่มี"
                    }
                  }
                  else if(n==2) {
                    if(fields["Work Hour"]) {
                      obj.dc[key] = fields["Work Hour"];
                    }
                    else {
                      obj.dc[key] = "ไม่มีการระบุเวลาทำงาน"
                    }
                  }
                  else {
                    if(fields["OT"]) {
                      obj.dc[key] = fields["OT"];
                    }
                    else {
                      obj.dc[key] = "0"
                    }
                  }
              }
              m=m+1;
            }


          }
          console.log(obj);
          resolve(obj);
        } 
        else {
          console.log(`found nothing, return blank`);
          resolve();
        } 
      });  
    }
  }).catch(err => {
    console.error(err);
  });
};




function DR_getDCRecordsByFormula(base, tableName, filterFormula) {
  console.log("getDCRecordsByFormula => list all records that match the criteria");
  // console.log(`base = ${base}`);    //output =very long object 
  console.log(`tablename = ${tableName}`);
  console.log(`filterFormula = ${filterFormula}`);

  let obj = {
    "q39_DCTable[0][0]": ""
  }

  return new Promise((resolve, reject) => {
    if (filterFormula) {
      console.log(`start querying`);
      //retrive records
      base(tableName).select({
        maxRecords: 50,
        filterByFormula: filterFormula,
        view:"Sort by date and position"
      })
      .all()
      .then((records) => {
        console.log(`find process successful`);
        console.log(`number of record(s) = ${records.length}`);
        
        if(records.length>0) {
          for(var i=0 ; i<records.length ; i++) {
            console.log(`recordID = ${records[i].id} , record fields = ${JSON.stringify(records[i].fields)}`);
            var { fields } = records[i];
            for(var j=0 ; j<4 ; j++) {
              let key = `q39_DCTable[${i}][${j}]`
              
                if(j==0) {
                  if(fields["ชื่อพนักงาน/คนงาน"]) {
                    obj[key] = fields["ชื่อพนักงาน/คนงาน"];
                  }
                  else {
                    obj[key] = "ไม่มีชื่อคนงานในฐานข้อมูล โปรดตรวจสอบ Base= ข้อมูลสำหรับ Daily Report, Table= รายชื่อพนักงาน"
                  }
                }
                else if(j==1) {
                  if(fields["รายละเอียด"]) {
                    obj[key] = fields["รายละเอียด"];
                  }
                  else {
                    obj[key] = "ไม่มี"
                  }
                }
                else if(j==2) {
                  if(fields["Work Hour"]) {
                    obj[key] = fields["Work Hour"];
                  }
                  else {
                    obj[key] = "ไม่มีการระบุเวลาทำงาน"
                  }
                }
                else {
                  if(fields["OT"]) {
                    obj[key] = fields["OT"];
                  }
                  else {
                    obj[key] = "0"
                  }
                }
            }
          }
          console.log(obj);
          resolve(obj);
        } 
        else {
          console.log(`found nothing, return blank`);
          resolve();
        } 
      });  
    }
  }).catch(err => {
    console.error(err);
  });
};

//=============================EXPORT FUNCTIONS=============================
module.exports = {IsNotEmpty, DR_searchPPfrominfo, DR_getDataFromID, DR_getMultipleRecordsByFormula};