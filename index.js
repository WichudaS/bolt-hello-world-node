/*=====THINGS TO DO BEFORE EXPORT TO GITHUB======
  1. Comment slack event
  2. Comment console.log
  3. UNCOMMENT console.log in app.listen 
*/

//=============================INITIALIZE APP=============================

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("qs");
const Airtable = require("airtable");
const dateFormat = require("dateformat");
// const formidable = require("express-formidable");
const TinyURL = require("tinyurl");
// const admin = require('firebase-admin');
const cors = require("cors");

//import module from other .JS files
// const serviceAccount = require('./bolt-hello-world-node-3ee5bea630af.json');
const signature = require("./verifySignature");
// const appHome = require('./appHome');
const msg = require("./msg");
// const modal = require('./modal');
// const test = require('./test');
const fn = require("./functions");
const fs = require("./firestore");

//firebase initializing
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

//apply middlewares
const app = express();
// const db = fs.db();

//===================================Airtable variables===================================
const apiUrl = "https://slack.com/api";
const baseDR = new Airtable(process.env.AIRTABLE_API_KEY).base(
  "appAThxvZSRLzrXta"
); //base "ข้อมูลสำหรับ Daily Report"
const baseWR = new Airtable(process.env.AIRTABLE_API_KEY).base(
  "appUmch1aSmkh0ZI8"
); //base "DR.&WR."
const baseSlackLog = new Airtable(process.env.AIRTABLE_API_KEY).base(
  "appzIDHzu9Ww4Wtb3"
); //base "Slack activity logs"

//========================================================================================

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(cors());
app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
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
var now = new Date(
  new Date().toLocaleString("en-AU", { timeZone: "Asia/Bangkok" })
);
var today = dateFormat(now, "yyyy-mm-dd");

//===========================Test with get on index route===========================
app.get("/", async function (req, res) {
  console.log(`RUN test...`);
  res.send(`Hi!, server is running...`);
});

//=============================Jotform webhooks====================================
app.post("/jotform/hooks", async function (req, res) {
  // console.log("=================JOTFORM WEBHOOKS RECEIVED===================");
  res.status(200).send("OK"); // ห้ามใส่ .end() ตรงนี้เด็ดขาดเพราะจะทำให้ res.send() ข้างล่างส่งไม่ได้

  //================= Parse JotForm request to JSON ===============================

  const body = JSON.stringify(req.body);
  // console.log(`★ req.body is = \n ${body}`);

  const raw = req.body.rawRequest;
  // console.log(`★ raw is = \n ${raw}`);

  // JSON.parse เลยจะอ่านไม่ออก ต้อง stringify ก่อนเสมอ
  const rawreq = JSON.stringify(req.body.rawRequest);
  // console.log(`\n\n\n ★ raw req is = \n ${rawreq}`);

  const formID = req.body.formID;
  // console.log(`★ formID is = \n ${formID}`);

  const formTitle = req.body.formTitle;
  // console.log(`★ formTitle = ${formTitle}`);

  const submissionID = req.body.submissionID;
  // console.log(`★ submissionID = ${submissionID}`);

  //-----------------------for testing (Delete this part when done)---------------------------------

  //   const raw = test.DRJotPayload;
  //   const formID = "201670438940455";
  //   const formTitle = "Daily Report" ;
  //   const submissionID = "4724235956026385529";

  //------------------------------------------------------------------------------------------------

  // console.log(`★ formID is = \n ${formID}`);
  // console.log(`★ formTitle = ${formTitle}`);
  // console.log(`★ submissionID = ${submissionID}`);

  var parsed = JSON.parse(raw);
  // console.log(`★ parsed = \n`);
  // console.log(JSON.stringify(parsed));

  var key = Object.keys(parsed);
  // console.log(`★ parsed key = \n ${key}`);

  // console.log(`★ keylength = ${key.length}`);

  for (var i = 0; i < key.length; i++) {
    var k = key[i];

    // console.log(`★ ${i + 1}.${k} = `);
    // console.log(parsed[k]);
  }

  // console.log(
  //   "=================JOTFORM WEBHOOKS RECEIVED END==================="
  // );

  if (formTitle == "Daily Report") {
    let DRno = parsed["q116_uniqueId"].split("_"); //change string into array
    DRno.splice(0, 1, parsed["q98_input98"]); // delete XXX, insert project ABB.
    DRno = DRno.join("_"); //join array back into string
    // console.log(`★ DRno = ${DRno}`);

    if (!parsed["q176_signature176"]) {
      //IF there is no PM sign or PMcomment => request approve, if filled SAVE to GGD and published to channel
      // console.log(`★ case send DR approve message in Slack, and save the data to Firestore`);

      let DRStatusDB = {
        formID: "201670438940455",
        submissionID: submissionID,
        number: DRno,
        name: `${parsed["q98_input98"]}-DR-${parsed["q22_input22"]["year"]}${parsed["q22_input22"]["month"]}${parsed["q22_input22"]["day"]}`,
        date: `${parsed["q22_input22"]["year"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["year"]}`,
        status: "รออนุมัติ",
        docType: "DR (Daily Report)",
        project: parsed["q98_input98"],
        pdfLink: `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`,
        submitData: {
          submitterSlackID: parsed["q210_SESlackID"],
          submitDate: `${today}`
        },
        approveData: {
          approverSlackID: parsed["q209_PMSlackID"],
          approveDate: "",
          approveResult: "",
          approveComment: ""
        },
        publishedChannel: parsed["q225_publishedChannel"].split(","), //Set to array type in case there are more than one channel to send
        GGDFolder: parsed["q214_GGDFolder"],
        fileUpdated: false
      };
      // console.log(`DRStatusDB = ${JSON.stringify(DRStatusDB)}`);

      //Route 1. => save into FirestoreDB
      const pushToDRListResult = await fs
        .DRListDocRef(DRStatusDB.project, DRStatusDB.number)
        .set(DRStatusDB);
      // console.log(`★ save to DB completed!, here is the result...`);
      console.log(pushToDRListResult);

      //Route 2. => send approve msg to approver in DM

      //-------------------for testing process, delete when the setup is completed, and don't forget to change axios variable, too---------------------
      /*
        let DRStatusDBTEST = {
          "formID": "201670438940455",
          "submissionID": submissionID,
          "number": DRno,
          "name": `${parsed["q98_input98"]}-DR-${parsed["q22_input22"]["year"]}${parsed["q22_input22"]["month"]}${parsed["q22_input22"]["day"]}`,
          "date": `${parsed["q22_input22"]["year"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["day"]}`,
          "status": "รออนุมัติ",
          "docType": "DR (Daily Report)",
          "project": parsed["q98_input98"],
          "pdfLink": `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`,
          "submitData": {
            "submitterSlackID": parsed["q210_SESlackID"],
            "submitDate": `${today}`
          },
          "approveData": {
            "approverSlackID": "U010E15TBU0",
            "approveDate": "",
            "approveResult": "",
            "approveComment": ""
          },
          "publishedChannel": ["C01017F0RM0"],     //Set to array type in case there are more than one channel to send
          "GGDFolder": parsed["GGDFolder"],
          "fileUpdated": false
        };
      */

      //-----------------------------------------------------------------------------------------------
      let postResult = await axios.post(
        "https://slack.com/api/chat.postMessage",
        qs.stringify(msg.drApproveMsg(DRStatusDB, process.env.SLACK_BOT_TOKEN))
      );

      // console.log(`★ POSTED, there is a result =\n `);
      // console.log(postResult.data);
    } else {
      // PM Signed => 1. Save Jotform data to Airtable (create DR records)  2.Save PDF report & attachments to GGD then save to DB & publish message to channel afterward in '/integromat/hooks'
      // console.log(`★ PM Signed => 1. Save Jotform data to Airtable (create DR records)  2.Save PDF report & attachments to GGD then save to DB & publish message to channel afterward in '/integromat/hooks'`);

      //1.Save Jotform data to Airtable (create DR records)
      // console.log(`★ 1. Save Jotform data to Airtable (create DR records)`);

      var DRdataToAirtable = {
        "Daily Report": [
          {
            fields: {
              รหัสเอกสาร: parsed.q116_uniqueId,
              วันที่: `${parsed["q22_input22"]["year"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["day"]}`,
              รายละเอียดงาน: [], //waiting for recordIDs
              รายละเอียดพนักงาน: [], //waiting for recordIDs
              รายละเอียดเครื่องจักร: [], //waiting for recordIDs
              อุปสรรค: parsed["q203_input203"][0][0],
              อุบัติเหตุ: parsed["q203_input203"][0][1],
              ความคิดเห็นเพิ่มเติม: parsed["q204_input204"][0][0],
              แปลนแสดงรายละเอียดการทำงาน: [],
              รูปถ่ายประจำวัน: [],
              สภาพอากาศ: [], //waiting for recordIDs
              "PDF Report": [
                {
                  filename: `${parsed.q116_uniqueId}-${parsed["q22_input22"]["year"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["day"]}`,
                  url: `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`
                }
              ]
            }
          }
        ],
        รายละเอียดการทำงาน: [],
        รายละเอียดพนักงาน: [],
        "รายละเอียดคนงาน DC": [],
        "รายละเอียดคนงาน SUB": [],
        รายละเอียดเครื่องจักร: [],
        "ตารางสภาพอากาศ (WR.)": []
      };

      //rearrange some data structure and create record in Airtable
      //'Daily Report' table
      //add site plans
      if (parsed.Pdf) {
        for (var i of parsed.Pdf) {
          DRdataToAirtable["Daily Report"][0]["fields"][
            "แปลนแสดงรายละเอียดการทำงาน"
          ] = DRdataToAirtable["Daily Report"][0]["fields"][
            "แปลนแสดงรายละเอียดการทำงาน"
          ].concat({
            url: i
          });
        }
      }
      //add site pics
      if (parsed["input92"]) {
        for (var j of parsed["input92"]) {
          DRdataToAirtable["Daily Report"][0]["fields"][
            "รูปถ่ายประจำวัน"
          ] = DRdataToAirtable["Daily Report"][0]["fields"][
            "รูปถ่ายประจำวัน"
          ].concat({
            url: j
          });
        }
      }
      //create record in "Daily Report" table
      const DRrec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "Daily Report",
        DRdataToAirtable["Daily Report"],
        true,
        "รหัสเอกสาร"
      );
      // console.log(`★ "Daily Report" record created = ${JSON.stringify(DRrec)}`);

      //add work progress
      if (parsed["q33_input33"]) {
        for (var i of parsed["q33_input33"]) {
          if (i[2]) {
            //if there is some data about work
            DRdataToAirtable["รายละเอียดการทำงาน"] = DRdataToAirtable[
              "รายละเอียดการทำงาน"
            ].concat({
              fields: {
                รายละเอียดงาน: i[2],
                "ชื่อคนทำงาน (DC)": [], //will be filled when create 'DC' records
                "ชุดช่างที่ทำงาน (SUB)": [], //will be filled when create 'SUB' records
                บริเวณที่ทำงาน: i[3],
                ปริมาณงาน: i[4],
                หน่วย: i[5],
                "%(คิดจากการจบงานตาม ELEMENTAL CODE )": i[6],
                "ELEMENTAL CODE": i[0],
                "WORK SECTION CODE": i[1],
                "Daily Report": Object.values(DRrec)
              }
            });
          }
        }
      }
      //create record in "รายละเอียดการทำงาน" table
      const workRec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "รายละเอียดการทำงาน",
        DRdataToAirtable["รายละเอียดการทำงาน"],
        true,
        "รายละเอียดงาน"
      );
      // console.log(`★ "รายละเอียดการทำงาน" record created = ${JSON.stringify(workRec)}`);

      //get DC manpower list from Airtable
      var DCmanpower = await fn.AT_listATRecordsWithRecIDOutput(
        baseWR,
        "MANPOWER DC",
        { fields: ["Description", "Keywords"] },
        "Keywords"
      );
      // console.log(`★ DC manpower keywords list from Airtable = ${JSON.stringify(DCmanpower)}`);
      //add DC data
      if (parsed["q39_DCTable"]) {
        for (var i of parsed["q39_DCTable"]) {
          if (i[0]) {
            let work = Object.keys(workRec).filter((n) => {
              return n.search(i[1].trim()) != -1;
            }); //return ARRAY
            // console.log(`★ DCwork = ${work}`);
            let DCposition = Object.keys(DCmanpower).filter((m) => {
              return m.search(i[1].trim()) != -1;
            }); //return ARRAY
            // console.log(`★ DCposition = ${DCposition}`);

            DRdataToAirtable["รายละเอียดคนงาน DC"] = DRdataToAirtable[
              "รายละเอียดคนงาน DC"
            ].concat({
              fields: {
                "ชื่อ-สกุล": i[0].trim(),
                รายละเอียดการทำงาน: work.length > 0 ? Object.values(work) : [], //waiting for recordIDs
                DT: i[2].trim(),
                OT: i[3].trim(),
                "Daily Report": Object.values(DRrec),
                "MANPOWER DES":
                  DCposition.length > 0
                    ? DCmanpower[DCposition[0]]
                    : DCmanpower["คนงาน DC"], //waiting for recordIDs
                Error:
                  work.length == 0 && DCposition.length == 0
                    ? `ERROR! มีการใส่ข้อมูลงานหรือชื่อตำแหน่งผิด: ข้อมูลงานที่ทำจาก Jotform=${i[1]}`
                    : ""
              }
            });
          }
        }
      }
      //create DC records
      const DCRec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "รายละเอียดคนงาน DC",
        DRdataToAirtable["รายละเอียดคนงาน DC"],
        true,
        "ชื่อ-สกุล"
      );
      // console.log(`★ "รายละเอียดคนงาน DC" record created = ${JSON.stringify(DCRec)}`);

      //add subcontract data
      if (parsed["q186_Subcontractor"]) {
        for (var i of parsed["q186_Subcontractor"]) {
          if (i[0] && i[1]) {
            //query another base to find SUB data that matches
            let queryData = {
              fields: [
                "ชื่อชุดช่าง",
                "ชื่อย่อโครงการ (from โครงการ)",
                "DES. ใน Manpower"
              ],
              filterByFormula: `AND( {ชื่อชุดช่าง}="${i[1]}",{ชื่อย่อโครงการ (from โครงการ)}="${parsed["q98_input98"]}")`
            };
            let SUBmanpower = await fn.AT_listATRecordsWithRecIDOutput(
              baseDR,
              "ชุดช่าง",
              queryData,
              "DES. ใน Manpower"
            ); //return OBJECT
            // console.log(`★ Matched manpower SUB = ${JSON.stringify(SUBmanpower)}`);

            let work = Object.keys(workRec).filter((n) => {
              return n.search(i[0].trim()) != -1;
            }); //return ARRAY
            // console.log(`★ SUBwork = ${work}`);

            let errorLog = [];
            if (work.length == 0 || Object.keys(SUBmanpower).length != 1) {
              if (work.length == 0) {
                errorLog = errorLog.concat(
                  `รายละเอียดงานไม่ตรงกับตาราง, รายละเอียดงานที่กรอกมา = ${i[0]}`
                );
              }
              if (Object.keys(SUBmanpower).length == 0) {
                errorLog = errorLog.concat(
                  "ไม่มีรายชื่อผรม.นี้ในฐานข้อมูลโครงการ ให้เป็นค่าเริ่มต้น = 'ผรม. งานอื่นๆ'"
                );
              }
              if (Object.keys(SUBmanpower).length > 1) {
                errorLog = errorLog.concat(
                  `มีชื่อผรม.นี้ซ้ำกันในฐานข้อมูล เลือกใช้หมวด Manpower ของรายการแรกที่หาได้ = ${[
                    Object.keys(SUBmanpower)[0]
                  ]}`
                );
              }
            }

            DRdataToAirtable["รายละเอียดคนงาน SUB"] = DRdataToAirtable[
              "รายละเอียดคนงาน SUB"
            ].concat({
              fields: {
                ชุดช่าง: i[1],
                รายละเอียดการทำงาน: work.length > 0 ? Object.values(work) : [], //waiting for recordIDs
                จำนวนคนงาน: i[2],
                DT: i[3],
                OT: i[4] ? i[4] : 0,
                "MANPOWER SUB":
                  Object.keys(SUBmanpower).length > 0
                    ? [Object.keys(SUBmanpower)[0]]
                    : ["ผรม. งานอื่นๆ"], //waiting for recordIDs
                "Daily Report": Object.values(DRrec),
                Error: errorLog.length > 0 ? errorLog.join(" และ ") : ""
              }
            });
          }
        }
      }
      //create SUB records
      const SUBRec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "รายละเอียดคนงาน SUB",
        DRdataToAirtable["รายละเอียดคนงาน SUB"],
        true,
        "ชุดช่าง"
      );
      // console.log(`★ "รายละเอียดคนงาน SUB" record created = ${JSON.stringify(SUBRec)}`);

      //Query staffManpower keyword list
      let staffManpower = await fn.AT_listATRecordsWithRecIDOutput(
        baseWR,
        "MANPOWER พนักงาน",
        { fields: ["Description", "Keywords"] },
        "Keywords"
      ); //return {"keywords" : "recordID"}
      // console.log(`★ Staff manpower keywords list from Airtable = ${JSON.stringify(staffManpower)}`);
      //add staff data
      if (parsed["q146_staffTable"]) {
        for (var i of parsed["q146_staffTable"]) {
          if (i[0] && i[1]) {
            let staffPosition = Object.keys(staffManpower).filter((m) => {
              return m.search(i[0].trim()) != -1;
            }); //return ["keyword"]
            // console.log(`★ staffPosition = ${staffPosition}`);

            let errorLog = [];
            staffPosition.length == 0
              ? (errorLog = [
                  ...errorLog,
                  "ตำแหน่งนี้ไม่อยู่ในรายการ Manpower ใด  ให้ใช้ค่าเริ่มต้น = 'อื่นๆ'"
                ])
              : "";
            staffPosition.length > 1
              ? (errorLog = [
                  ...errorLog,
                  `มีตำแหน่งนี้ในรายการ Manpower มากกว่า 1 รายการ เลือกใช้ชื่อ manpower แรกที่พบ = ${staffPosition[0]}`
                ])
              : "";
            DRdataToAirtable["รายละเอียดพนักงาน"] = DRdataToAirtable[
              "รายละเอียดพนักงาน"
            ].concat({
              fields: {
                "ชื่อ-สกุล": i[1],
                ตำแหน่ง: [i[0]],
                "ตำแหน่ง ใน Manpower":
                  staffPosition.length > 0
                    ? staffManpower[staffPosition[0]]
                    : ["อื่นๆ"], //waiting for recordIDs
                เวลาทำงาน: parsed["q208_timeSchedule"],
                "Daily Report": Object.values(DRrec),
                Error: errorLog.join(" และ ")
              }
            });
          }
        }
      }
      //create staff records
      const staffRec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "รายละเอียดพนักงาน",
        DRdataToAirtable["รายละเอียดพนักงาน"],
        true,
        "ชื่อ-สกุล"
      );
      // console.log(`★ "รายละเอียดพนักงาน" record created = ${JSON.stringify(staffRec)}`);

      //Query manpower equipment list (DO NOT USE THIS, ADD NEW ROW WHEN THERE IS NEW EQUIPMENT)
      // var EQmanpower = await fn.AT_listATRecordsWithRecIDOutput(baseWR, "EQUIPMENT", {"fields":["Description"]} , "Description")
      // console.log(`★ DC manpower keywords list from Airtable = ${JSON.stringify(DCmanpower)}`);
      //add equipment data
      if (parsed["q53_input53"]) {
        for (var i of parsed["q53_input53"]) {
          if (i[0]) {
            //arrayed "รายละเอียดการทำงาน"'s data
            let EQwork = i[3].split(",").map((w) => w.trim());

            DRdataToAirtable["รายละเอียดเครื่องจักร"] = DRdataToAirtable[
              "รายละเอียดเครื่องจักร"
            ].concat({
              fields: {
                เครื่องจักร: i[0],
                จำนวน: i[1],
                หน่วย: i[2],
                รายละเอียดการทำงาน: EQwork,
                "Daily Report": Object.values(DRrec),
                EQUIPMENT: [i[0]], //waiting for recordIDs
                Error: ""
              }
            });
          }
        }
      }
      //create equipment records
      const EQrec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "รายละเอียดเครื่องจักร",
        DRdataToAirtable["รายละเอียดเครื่องจักร"],
        true,
        "เครื่องจักร"
      );
      // console.log(`★ "สภาพอากาศ" record created = ${JSON.stringify(EQrec)}`);

      //add weather data
      if (parsed["q200_input200"]) {
        for (var i of parsed["q200_input200"]) {
          DRdataToAirtable["ตารางสภาพอากาศ (WR.)"] = DRdataToAirtable[
            "ตารางสภาพอากาศ (WR.)"
          ].concat({
            fields: {
              สภาพอากาศ: `สภาพอากาศ ${parsed["q22_input22"]["day"]}/${parsed["q22_input22"]["month"]}/${parsed["q22_input22"]["year"]}`,
              "ช่วงเวลาฝนตก (from Daliy Report)": i[1] == "ฝนตก" ? i[0] : "",
              "สภาพอากาศ (from Daliy Report)": [
                i[1] == "ฝนตก" ? "ฝนตก" : "ปลอดโปร่ง"
              ],
              "Daily Report": Object.values(DRrec)
            }
          });
        }
      }
      //create weather records
      const weatherRec = await fn.AT_createRecordsWithRecIDOutput(
        baseWR,
        "ตารางสภาพอากาศ (WR.)",
        DRdataToAirtable["ตารางสภาพอากาศ (WR.)"],
        true,
        "สภาพอากาศ"
      );
      // console.log(`★ "รายละเอียดเครื่องจักร" record created = ${JSON.stringify(weatherRec)}`);

      // console.log(`★ DRdataToAirtable = ${JSON.stringify(DRdataToAirtable)}`);

      // 2.Save PDF report & attachments to GGD then save to DB & publish message to channel afterward in '/integromat/hooks'"
      // console.log("★ 2.Save PDF report & attachments to GGD then save to DB & publish message to channel afterward in '/integromat/hooks'");
      // Structure the data

      // if there are PM comment => set status to 'AN'
      let status = "";
      let appResult = "";
      let approveCommment = "";
      if (parsed["q204_input204"][0][0]) {
        status = "อนุมัติตามบันทึก (AN)";
        appResult = "AN";
        approveCommment = parsed["q204_input204"][0][0];
      } else {
        status = "อนุมัติ (AP)";
        appResult = "AP";
      }

      let dataToSend = {
        formID: formID,
        submissionID: submissionID,
        number: DRno,
        name: `${parsed["q98_input98"]}-DR-${parsed["q22_input22"]["year"]}${parsed["q22_input22"]["month"]}${parsed["q22_input22"]["day"]}`,
        date: `${parsed["q22_input22"]["year"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["day"]}`,
        status: status,
        docType: "DR (Daily Report)",
        project: parsed["q98_input98"],
        pdfLink: `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`,
        approveData: {
          approverSlackID: parsed["q209_PMSlackID"],
          approveDate: `${today}`,
          approveResult: appResult,
          approveComment: approveCommment
        },
        publishedChannel: [parsed["q225_publishedChannel"]], //Set to array type in case there are more than one channel to send
        GGDFolder: parsed["q214_GGDFolder"],
        planAttachments: parsed["Pdf"],
        sitePicAttachments: parsed["input92"]
      };

      // console.log(`★ data to send to webhooks = ${JSON.stringify(dataToSend)}`);
      const sendResult = await axios.post(
        "https://hook.integromat.com/f7yjit3q9lyz7q31eqvrh2susg53td39",
        qs.stringify(dataToSend)
      );
      // console.log(`★ Webhooks posted, here is the result = ${JSON.stringify(sendResult.data)}`);
    }
  } else if (formTitle == "Requested budget") {
    console.log(
      `★ RB Jotform submitted => 1. set data layout, 2. pull DocStatus from Firestore, 3.update Firestore, 4. Update Airtable`
    );

    let RBno = `${parsed["q15_projectAbb"]}_RB_${parsed["q4_runningNo"]}`;
    console.log(`★ RBno = ${RBno}`);

    //set data layout
    //create firestore document status [initial data]
    let RBStatusDB = {
      formID: formID,
      submissionID: submissionID,
      number: RBno,
      name: `${parsed["q15_projectAbb"]}-RB-${parsed["q6_date"]["year"]}${parsed["q6_date"]["month"]}${parsed["q6_date"]["day"]}`,
      date: `${parsed["q6_date"]["year"]}-${parsed["q6_date"]["month"]}-${parsed["q6_date"]["day"]}`,
      status: "รอ PM อนุมัติ",
      docType: "RB (Requested Budget)",
      project: parsed["q15_projectAbb"],
      pdfLink: `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`,
      submitData: {
        submitterSlackID: parsed["q120_CESlackID"],
        submitDate: `${today}`
      },
      PMapproveData: {
        approverSlackID: parsed["q122_PMSlackID"],
        approveDate: "",
        approveResult: "",
        approveComment: ""
      },
      boardApproveData: {
        approverSlackID: "",
        approveDate: "",
        approveResult: "",
        approveComment: ""
      },
      publishedChannel: parsed["q137_publishedChannel"], //Set to array type in case there are more than one channel to send
      GGDFolder: parsed["q136_GGDFolder"],
      fileUpdated: false
    };

    //Airtable data [initial data]
    //RB summary
    let RBsummary = {
      "RB No": RBno, //"HO9_RB_002"
      วันที่: `${parsed["q6_date"]["year"]}-${parsed["q6_date"]["month"]}-${parsed["q6_date"]["day"]}`, //"2020-12-08"
      Revision: parsed["q132_Revision"], //  "00"
      Project: parsed["q15_projectAbb"], //  "HO9"
      รายละเอียดการขออนุมัติ: parsed["q131_input131"], //  "Gutter Stainless Steel 1.2 mm."       // ["recc4g3qmqfzGXpZi"],
      Status: "รอ PM อนุมัติ", //  ใช้สถานะนี้เริ่มต้นเสมอ
      เอกสารอ้างอิง: parsed["q63_refDoc"], //"HO9/PR/002"
      "เหตุผลในการร้องขอ RB": parsed["q61_RBreason"] //  "มีงานเพิ่มนอกเหนือจากการทำงานครั้งแรก เพิ่ม overflow\n"
    };

    //check document status based on signatures
    //PM signature
    if (parsed["q88_Project88"]) {
      RBStatusDB.PMapproveData = {
        approverSlackID: parsed["q122_PMSlackID"],
        approveDate: `${parsed["q87_PMDate"]["year"]}-${parsed["q87_PMDate"]["month"]}-${parsed["q87_PMDate"]["day"]}`,
        approveResult: parsed["q140_PMcomment"] ? "AN" : "AP",
        approveComment: parsed["q140_PMcomment"] ? parsed["q140_PMcomment"] : ""
      };
      RBStatusDB.status = "รอผู้บริหารอนุมัติ";

      RBsummary.Status = "รอผู้บริหารอนุมัติ";
    }

    //Board signature
    if (
      parsed["q85_input85"] ||
      parsed["q102_input102"] ||
      parsed["q105_input105"] ||
      parsed["q108_input108"]
    ) {
      if (parsed["q85_input85"]) {
        //CNK
        RBStatusDB.boardApproveData = {
          approverSlackID: parsed["q124_CNKSlackID"],
          approveDate: `${parsed["q84_CNKdate"]["year"]}-${parsed["q84_CNKdate"]["month"]}-${parsed["q84_CNKdate"]["day"]}`,
          approveResult: parsed["q141_CNKcomment"] ? "AN" : "AP",
          approveComment: parsed["q141_CNKcomment"]
        };
      } else if (parsed["q102_input102"]) {
        //VSL
        RBStatusDB.boardApproveData = {
          approverSlackID: parsed["q126_VSLSlackID"],
          approveDate: `${parsed["q103_VSLdate"]["year"]}-${parsed["q103_VSLdate"]["month"]}-${parsed["q103_VSLdate"]["day"]}`,
          approveResult: parsed["q142_VSLcomment"] ? "AN" : "AP",
          approveComment: parsed["q142_VSLcomment"]
        };
      } else if (parsed["q105_input105"]) {
        //NPB
        RBStatusDB.boardApproveData = {
          approverSlackID: parsed["q127_NPBSlackID"],
          approveDate: `${parsed["q106_NPBdate"]["year"]}-${parsed["q106_NPBdate"]["month"]}-${parsed["q106_NPBdate"]["day"]}`,
          approveResult: parsed["q143_NPBcomment"] ? "AN" : "AP",
          approveComment: parsed["q143_NPBcomment"]
        };
      } else {
        //TPS
        RBStatusDB.boardApproveData = {
          approverSlackID: parsed["q128_TPSSlackID"],
          approveDate: `${parsed["q109_TPSdate"]["year"]}-${parsed["q109_TPSdate"]["month"]}-${parsed["q109_TPSdate"]["day"]}`,
          approveResult: parsed["q144_TPScomment"] ? "AN" : "AP",
          approveComment: parsed["q144_TPScomment"]
        };
      }

      RBStatusDB.status = "อนุมัติแล้ว";

      RBsummary.Status = "อนุมัติแล้ว";
    }

    console.log(`RBStatusDB = ${JSON.stringify(RBStatusDB)}`);

    //RB details
    //layouting every resource row that is not empty
    let loop = parsed["q28_resource"].filter((i) => i[1] != "");

    let RBdetails = loop.map((i) => {
      return {
        fields: {
          ID: `${parsed["q15_projectAbb"]}_RB_${parsed["q4_runningNo"]}-${i[1]}`, // "HO9_RB_001-Gutter Stainless Steel 1.2 mm."
          "Resource Name": i[1], //"Gutter Stainless Steel 1.2 mm."
          "Original BG Amount": i[4], //  2268.66,
          "Ordered BG Amount": i[7], //29000
          "RB No": RBno,
          "Linked Budget": "", //code after setup BGgrouping
          "Resource Code":
            parsed["q54_description"][
              `${i[0].split(",")[0].trim().split(".")[1] - 1}`
            ][4],
          "Original BG Q'ty": i[2], //  450
          "Original BG Unit Rate": i[3], //  5.015
          "Ordered BG Unit Rate": i[6], //5.01
          "Ordered BG Q'ty": i[5], //  5788
          Remarks: i[9] //"หมายเหตุ"
        }
      };
    });

    //check if there is existing record which RBno is matched?
    //get projectRBstatusData
    let RBstatus = await fs.db
      .collection(
        `/project/${parsed["q15_projectAbb"]}/documentStatus/RB/RBList`
      )
      .where("number", "==", RBno)
      .limit(1)
      .get()
      .then((Snapshot) => {
        if (Snapshot.empty) {
          console.log(`★ no document matches your search`);
          return;
        }
        let result = [];
        Snapshot.forEach((doc) => {
          result = [...result, doc.data()];
        });
        return result; //[]?
      }); // return undefined or []

    console.log(`★ RBstatus = ${JSON.stringify(RBstatus)}`);

    //create FS doc or Update entire doc (same function)
    try {
      let FScreatedResult = await fs
        .RBListDocRef(RBStatusDB.project, RBStatusDB.number)
        .set(RBStatusDB);
      console.log(`★ save to DB completed!, here is the result...`);
      console.log(FScreatedResult);
    } catch (error) {
      await fn.SendBUGmsg("FScreatedResult", "index.js", error, req.body);
    }

    //set Airtable API endpoint for base MS400
    let baseMS400 = new Airtable(process.env.AIRTABLE_API_KEY).base(
      parsed["q138_MS400"]
    );

    //query RBsummary
    let RBsummaryQuery = await baseMS400("Requested Budget Summary")
      .select({
        view: "SERVER-RB summary for query",
        fields: ["Name"],
        filterByFormula: `{RB No}='${RBno}'`,
        maxRecords: 1
      })
      .all()
      .then((records) => {
        let chunks = records.map((n) => {
          return n.id;
        });
        return chunks;
      })
      .catch(async (error) => {
        await fn.SendBUGmsg("RBsummaryQuery", "index.js", error, req.body);
      });

    console.log(`★ RBsummary query = ${RBsummaryQuery}`);

    if (RBsummaryQuery.length == 0) {
      //no existing record => create new record
      console.log(`★ No matched RBsummary record in Airtable`);
      try {
        await baseMS400("Requested Budget Summary")
          .create(RBsummary, { typecast: true })
          .then((record) => {
            return record.id;
          });
      } catch (error) {
        await fn.SendBUGmsg("RBsummaryCreated", "index.js", error, req.body);
      }
    } else {
      //some existing record => udpate record
      try {
        //add id into RBsummary payload
        let addedData = await baseMS400("Requested Budget Summary")
          .replace(RBsummaryQuery[0], RBsummary, { typecast: true })
          .then((record) => {
            return record.id;
          });
      } catch (error) {
        await fn.SendBUGmsg("RBsummaryUpdated", "index.js", error, req.body);
      }
    }

    //query RBdetails
    let RBdetailsQuery = await baseMS400("MS400")
      .select({
        view: "SERVER-RBdetails for Query",
        fields: ["ID"],
        filterByFormula: `{RB No}='${RBno}'`,
        maxRecords: 20
      })
      .all()
      .then((records) => {
        let chunks = records.map((n) => {
          return n.id;
        });
        return chunks;
      });

    if (RBdetailsQuery.length == 0) {
      //if there are ones => delete before create new ones
      console.log(`★ There are some existing records that matched this RBno`);
      for (var i = 0; i < RBdetailsQuery.length; i = i + 10) {
        let chunk = RBdetailsQuery.slice(i, i + 10);
        try {
          await baseMS400("MS400").destroy(chunk);
        } catch (error) {
          await fn.SendBUGmsg("RBdetailsDeleted", "index.js", error, req.body);
        }
      }
    }

    //create new record(s)
    try {
      await baseMS400("MS400").create(RBdetails, { typecast: true });
    } catch (error) {
      await fn.SendBUGmsg("RBdetailsCreated", "index.js", error, req.body);
    }
  } else if (formTitle == "Requested budget_New code verification") {
    console.log(
      `★ New code verfied form RB => 1.grouping, 2.create new record (if any), 3.weight RB, 4.update data in all budgets, 5.send Slack result message`
    );

    //group code choices (use existing budgets or create new budget?)
    let { baseData, RBdata } = JSON.parse(parsed.q209_requestPayload);
    let RBindex = RBdata.name.indexOf("-");
    let RBno = RBdata.name.slice(0, RBindex);
    let RBname = RBdata.name.slice(RBindex + 1, RBdata.name.length);

    //count all code result (count by filtering `c1Choice` or `q285_c1NoMS400Choice`)
    let codeResult = key.reduce(
      (total, k) => {
        if (k.includes("Choice") && parsed[k]) {
          let codeNo = k.split("_c")[1][0];

          if (parsed[k].includes("ลง budget ที่มีอยู่เดิม")) {
            //excract code no.
            return (total.existingBudget = [...total.existingBudget, codeNo]);
          } else {
            //newBudget
            return (total.newBudget = [...total.newBudget, codeNo]);
          }
        } else {
          return total;
        }
      },
      { existingBudget: [], newBudget: [] }
    );

    // codeResult template= {
    //   "existingBudget": [1,2],
    //   "newBudget": [3]
    // }

    //check: no modified recordID? or new recordID?
    let allExistingRec = JSON.parse(
      parsed.q209_requestPayload
    ).budgetData.reduce((total, n) => {
      if (n.conflictedRecordURL.length > 0) {
        let recIDs = n.conflictedRecordURL.map((url) => {
          return url.slice(url.lastIndexOf("/") + 1, url.length);
        });
        return (total = [...total, ...recIDs]);
      } else {
        return total;
      }
    }, []);

    let allSubmittedRec = key.reduce((total, k) => {
      if (k.includes("ExistingBudget")) {
        let ids = parsed[k].reduce((total2, arr) => {
          if (arr.length == 3) {
            return (total2 = [...total2, arr[0]]);
          } else {
            return total2;
          }
        }, []);
        return (total = [...total, ...ids]);
      } else {
        return total;
      }
    }, []);

    let modifiedRecID = allSubmittedRec.reduce((result, id) => {
      if (!allExistingRec.includes(id)) {
        return (result = "Yes");
      } else {
        return result;
      }
    }, "No");

    if (modifiedRecID == "Yes") {
      console.log(
        `★ Some submitted RecordID from Jotform has been modified, send Error message to User to re-submit Jotform again`
      );
      //send Error Msg to user to resubmit Jotform
      let docName = `\n> Jotform submission form:  ${formTitle} \n> Submission ID:  ${submissionID} \n> RB no.:  ${RBno} \n> resource name ชื่อ:  ${RBname}`;
      let error = `มีการแก้ไขค่า recordID ในเอกสาร ทำให้ข้อมูลผิดพลาด`;
      let solution = `\n> 1.กดปุ่ม "ตรวจสอบ Code และดำเนินการต่อ" ในข้อความแจ้งเตือนด้านล่างข้อความนี้ \n> 2.submit เอกสารใหม่อีกครั้ง *ไดยไม่แก้ไข recordID เอกสาร* \n\n _หากการแจ้งเตือนนี้ไม่สมเหตุสมผล รบกวนติดต่อผู้พัฒนาตาม Note ด้านล่าง_`;

      await fn
        .SendErrorMsg(
          JSON.parse(parsed.q209_requestPayload).slackUserData.id,
          docName,
          error,
          solution
        )
        .then((response) => {
          console.log("message sent!");
          console.log(`response.data =`);
          console.log(response.data);
        })
        .catch(async (err) => {
          console.error(err);
          console.log(
            `can't send message, send ERROR message to BUG channel instead`
          );
          await fn.SendBUGmsg("fn.SendErrorMsg", "functions.js", err, req.body);
        });

      //send slack warning message *again*
      await axios
        .post(
          "https://slack.com/api/chat.postMessage",
          qs.stringify(
            await msg.slackNewCodeWarningMsg(
              JSON.parse(parsed.q209_requestPayload)
            )
          )
        )
        .then((response) => {
          console.log("message sent!");
          console.log(`response.data =`);
          console.log(response.data);
        })
        .catch(async (err) => {
          console.error(err);
          console.log(
            `can't send message, send ERROR message to BUG channel instead`
          );
          await fn.SendBUGmsg(
            "msg.slackNewCodeWarningMsg",
            "index.js",
            err,
            req.body
          );
        });
    }
    //if no modified recordID => continue...
    else {
      const baseMS400 = new Airtable(process.env.AIRTABLE_API_KEY).base(
        baseData.id
      );
      //1. create new budget
      let newRecCreatedIDs = [];

      if (codeResult.newBudget.length > 0) {
        //1.1 create new records
        let newBudgetLayouted = codeResult.newBudget.map((codeNo) => {
          let project = baseData.name.split("_")[0];
          let areaCode =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewAC`);
              })}`
            ];
          let groupElement =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewGE`);
              })}`
            ];
          let NRMcode =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewNRM`);
              })}`
            ];
          let description =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewDesc`);
              })}`
            ];
          let resourceCode =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewRC`);
              })}`
            ];
          let resourceName =
            parsed[
              `${key.find((n) => {
                return n.includes(`_c${codeNo}NewRN`);
              })}`
            ];

          return {
            fields: {
              ID: `${project}-${areaCode}-${NRMcode}-${description}-${resourceCode}-${resourceName}`,
              Project: project,
              "Area Code": areaCode,
              "Group Element": groupElement,
              "NRM Code": NRMcode,
              Description: description,
              "Resource Code": resourceCode,
              "Resource Name": resourceName,
              "Q'ty":
                parsed[
                  `${key.find((n) => {
                    return n.includes(`_c${codeNo}NewQty`);
                  })}`
                ],
              Unit:
                parsed[
                  `${key.find((n) => {
                    return n.includes(`_c${codeNo}NewUN`);
                  })}`
                ],
              "Unit Rate":
                parsed[
                  `${key.find((n) => {
                    return n.includes(`_c${codeNo}NewUR`);
                  })}`
                ],
              Remarks: `- budget นี้ถูกสร้างจาก RB id: "${RBdata.name}", Jotform submission "${formTitle}" เลขที่ ${submissionID}`
            }
          };
        });
        try {
          for (var j = 0; j < newBudgetLayouted.length; j = j + 10) {
            let newBudget2 = newBudgetLayouted.slice(j, j + 10);
            await baseMS400("MS400")
              .create(newBudget2, { typecast: true })
              .then((records) => {
                newRecCreatedIDs = record.map((rec) => {
                  return rec.id;
                });
              });
          }
          console.log(
            `★ NewBudgetCreated!, store output recordIDs in "newRecCreatedIDs"`
          );
        } catch (err) {
          console.error(err);
          await fn.SendBUGmsg("NewBudgetCreate", "index.js", error, req.body);
        }
      }
      //1.2 add into stack => waiting to be  weighting RB
      //2. use existing budget
      //2.1 add into stack => waiting to be  weighting RB

      //weight RB into budgets
    }
  } else {
  }
});

//=============================Incoming Webhook==========================
app.post("/integromat/hooks", async function (req, res) {
  res.status(200).send("OK");
  //LOG REQUEST===============
  // console.log("---------------Integromat WEBHOOKS REQUEST STARTS HERE---------------");
  // console.log("----------req.body----------");
  // console.log(req.body);
  // console.log("----------req.body.string----------");
  // console.log(JSON.stringify(req.body));

  // console.log("---------------Integromat WEBHOOKS REQUEST ENDS HERE---------------");

  //check if it is Document process?
  if (req.body.docType) {
    var { docType, fileUpdated } = req.body;

    switch (docType) {
      case "DR (Daily Report)":
        var {
          date,
          name,
          formID,
          number,
          status,
          pdfLink,
          project,
          GGDFolder,
          approveData,
          submissionID,
          publishedChannel
        } = req.body;

        //check if it's not a fileUpdate
        if (!fileUpdated) {
          // console.log(`★ New DR Approved from PM, Save Data to Airtable, Update DB, send publish messages`);
          //Route 1. save to Airtable  ★ waiting for approve
          //----------------------------------เว้นไว้ใส่โค้ด Airtable----------------------------------
          // console.log(`★ save to Airtable`);
          //--------------------------------------------------------------------------------------
          //Route 2. update DB
          // console.log(`★ update DR DB`);
          let DRApproveData = {
            status: status,
            pdfLink: pdfLink,
            approveData: {
              approverSlackID: approveData.approverSlackID,
              approveDate: approveData.approveDate,
              approveResult: approveData.approveResult,
              approveComment: approveData.approveComment
            },
            GGDFolder: GGDFolder,
            fileUpdated: fileUpdated
          };

          const DRApproveResult = await fs
            .DRListDocRef(project, number)
            .update(DRApproveData);
          // console.log(DRApproveResult);

          //get DBData
          // console.log(`★ Get all this DR Data from DB to form a publish message`);

          DRApproveData = await fs
            .DRListDocRef(project, number)
            .get()
            .then((documentSnapshot) => {
              let fields = documentSnapshot.data();
              return fields;
            });
          // console.log(`★ data from DB = `);
          // console.log(JSON.stringify(DRApproveData));

          //send published message according to status
          // console.log(`★ send published message according to status`);

          for (const channel of DRApproveData.publishedChannel) {
            // console.log(`★ channel to post = ${channel}`);
            let postResult = await axios.post(
              "https://slack.com/api/chat.postMessage",
              qs.stringify(
                msg.drPublishedMsg(
                  DRApproveData,
                  channel,
                  process.env.SLACK_BOT_TOKEN
                )
              )
            );

            // console.log(`★ Publish message POSTED, here is a result =\n `);
            // console.log(postResult.data);
          }

          //if ApproveResult is 'AN', send comment message to SE
          if (DRApproveData.approveData.approveResult == "AN") {
            // console.log(`★ "AN" case, send DM back to SE to edit the submission, too.`);
            let postResult = await axios.post(
              "https://slack.com/api/chat.postMessage",
              qs.stringify(
                msg.drCommentMsg(
                  DRApproveData,
                  DRApproveData.submitData.submitterSlackID,
                  process.env.SLACK_BOT_TOKEN
                )
              )
            );

            // console.log(`★ DM Comment to submitter, here is a result =\n `);
            // console.log(postResult.data);
          }
        } else {
          // console.log(`Someone edit a file after it is was approved!, send notification message to published channel`);

          //Route 1. save to Airtable  ★ waiting for approve
          //----------------------------------เว้นไว้ใส่โค้ด Airtable----------------------------------
          // console.log(`★ save to Airtable`);
          //--------------------------------------------------------------------------------------
          //Route 2. update DB
          // console.log(`★ update DR DB`);
          let DRApproveData = {
            pdfLink: pdfLink,
            GGDFolder: GGDFolder,
            fileUpdated: fileUpdated
          };

          const DRApproveResult = await fs
            .DRListDocRef(project, number)
            .update(DRApproveData);
          // console.log(DRApproveResult);

          //get DBData
          // console.log(`★ Get all this DR Data from DB to form a publish message`);

          DRApproveData = await fs
            .DRListDocRef(project, number)
            .get()
            .then((documentSnapshot) => {
              let fields = documentSnapshot.data();
              return fields;
            });
          // console.log(`★ data from DB = `);
          // console.log(JSON.stringify(DRApproveData));

          //send published notification message
          // console.log(`★ send published notification message`);

          for (const channel of DRApproveData.publishedChannel) {
            let postResult = await axios.post(
              "https://slack.com/api/chat.postMessage",
              qs.stringify(
                msg.drFileUpdateMsg(
                  DRApproveData,
                  channel,
                  process.env.SLACK_BOT_TOKEN
                )
              )
            );

            // console.log(`★ Publish message POSTED, here is a result =\n `);
            // console.log(postResult.data);
          }
        }

        break;

      default:
        break;
    }
  }
});

//=============================EVENT RESPONSE=============================
//Uncomment this line below to Stop slack from event running
// app.get('/event' , async(req, res) => {
app.post("/slack/events", async (req, res) => {
  res.status(200);

  //LOG REQUEST===============
  console.log(
    "---------------" + req.body.type + " REQUEST STARTS HERE---------------"
  );
  // console.log("----------req.body.type----------");
  // console.log(req.body.type);
  console.log("----------req.body----------");
  console.log(req.body);
  // console.log("----------req.body.string----------");
  // console.log(JSON.stringify(req.body));
  // console.log("----------req.body.context----------");
  // console.log(req.body.context);
  // console.log("----------req.body.payload----------");
  // console.log(req.body.payload);
  console.log("----------req.body.event----------");
  console.log(req.body.event);
  console.log(
    "---------------" + req.body.type + " REQUEST ENDS HERE---------------"
  );
  //RESPONSE TO EVENT CASES===============,
  switch (req.body.type) {
    //RESPONSE TO URL VERIFICATION===============
    case "url_verification": {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    //RESPONSE TO EVENT CALLBACK ===============
    case "event_callback": {
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

  if (req.body.event) {
    const event = req.body.event;
    // console.log(`★ event = ${JSON.stringify(event)}`);

    //perform CODA automations msg in #erp-coda-auto-create-doc
    if (event.channel == "C01N74NU6DR") {
      res.sendStatus(204);

      let { command, request, response } = JSON.parse(event.text) || "";

      if (command == "CODA_createNewDoc") {
        await axios
          .post(
            "https://hook.integromat.com/8y5omxcwprpsnwlrsujt38i1tllp1dw9",
            qs.stringify(request)
          )
          .then(async (res) => {
            //PUT checked on coda table
            console.log(`create doc result = ${res.data}`);

            response.successPayload.row.cells[2].value = res.data;
            console.log(`res.successpayload= `);
            console.log(JSON.stringify(response.successPayload));

            await axios({
              method: "put",
              url: `https://coda.io/apis/v1/docs${response.path}`,
              headers: {
                Authorization: `Bearer ${process.env.CODA_API_TOKEN}`
              },
              data: response.successPayload
            }).then((res) => {
              console.log(`update SUCCESS coda table result = ${res.status}`);
            });

            //send check emoji to message
            await axios
              .post(
                "https://slack.com/api/reactions.add",
                qs.stringify({
                  token: process.env.SLACK_BOT_TOKEN,
                  channel: event.channel,
                  name: "white_check_mark",
                  timestamp: event.ts
                })
              )
              .then((res) => {
                console.log(
                  `update SUCCESS Slack emoji result = ${res.status}`
                );
              });
          })
          .catch(async (err) => {
            //PUT error in coda table

            console.log(`create new doc FAILED result = ${err}`);

            await axios({
              method: "put",
              url: `https://coda.io/apis/v1/docs${response.path}`,
              headers: {
                Authorization: `Bearer ${process.env.CODA_API_TOKEN}`
              },
              data: response.failedPayload
            }).then((res) => {
              console.log(`update FAILED coda table result = ${res.status}`);
            });

            //send cross emoji
            await axios
              .post(
                "https://slack.com/api/reactions.add",
                qs.stringify({
                  token: process.env.SLACK_BOT_TOKEN,
                  channel: event.channel,
                  name: "x",
                  timestamp: event.ts
                })
              )
              .then((res) => {
                console.log(`update FAILED emoji result = ${res.status}`);
              });

            //send error message to #bug
            await fn.SendBUGmsg(
              "CODA_createNewDoc (axios result)",
              "index.js",
              err,
              req.body
            );
          });
      }
    }

    //Save every HUMAN messages in every channel to Airtable ==============================================
    /*
     * *UPDATE 22/05/2021*
     *
     * CLOSED THIS MODULE DUE TO INACTIVITY (BOOM ISN'T USING IT ANYMORE AND AIRTABLE SUBSCRIPTION HAS CANCELLED)
     */
    /*
    if (
      event.type == "message" &&
      !(event.subtype == "bot_message") &&
      !event.hidden &&
      !req.body.hidden &&
      !event.bot_profile &&
      !event.bot_id
    ) {
      // console.log(`★ Save every message in every channel to Airtable for analytics`);
      res.sendStatus(204);

      var actType = event.type;
      var actSubtype = event.subtype;
      var text = event.text;
      var dateTime = dateFormat("isoDateTime");
      var poster = event.user;
      var channel = event.channel;
      var attachments = event.attachments
        ? event.attachments[0].text || event.attachments[0].fallback
        : "";
      var fileAttachments = event.files ? event.files[0].name : "";

      //if message is shared => write in text
      if (event.attachments && !event.text) {
        if (event.attachments[0].is_share == true) {
          text = "แชร์ข้อความ";
        }
      }

      //if file is shared => write in text
      if (event.files && !event.text) {
        text = "แชร์ไฟล์";
      }

      var eventLayout = {
        "Activity Type": actType,
        "Activity Subtype": actSubtype,
        Text: text,
        "Posted time": dateTime,
        "Poster ID": poster,
        "Channel ID": channel,
        "Shared message": attachments,
        "File attachments": fileAttachments,
        "Slack payload": JSON.stringify(event)
      };

      // console.log(`★ event layout to be saved =`);
      // console.log(JSON.stringify(eventLayout));

      //check if there are already identical records in the table
      var filterFormula = `AND(
        {Text}='${text}',
        {File attachments}='${fileAttachments}',
        {Channel ID}='${channel}',
        {Activity Type}='${actType}',
        {Activity Subtype}='${actSubtype}',
        {Poster ID}='${poster}',
        {Shared message}='${attachments}'
      )`;
      var queryParam = {
        maxRecords: 1,
        view: "For Server Query (3 min tolerance)",
        filterByFormula: filterFormula,
        fields: ["Posted time"]
      };
      // console.log(queryParam)
      try {
        var existingRec = await baseSlackLog("Message logs")
          .select(queryParam)
          .all();
      } catch (error) {
        //แค่ปิดเตือนเฉยๆ ไม่ได้แก้อะไร เพราะคิดว่าบูมไม่น่าจะได้ใช้แล้ว และเรายกเลิก Airtable ไปแล้วด้วย
        // await fn.SendBUGmsg("existingRec", "index.js", error, req.body);
      }
      if (!existingRec.id) {
        //no existing record => create new record
        //create new record in Airtable
        try {
          let recordCreatedResult = await baseSlackLog(
            "Message logs"
          ).create(eventLayout, { typecast: true });
        } catch (error) {
          await fn.SendBUGmsg(
            "recordCreatedResult",
            "index.js",
            error,
            req.body
          );
        }
      }
    }
    */

    //'incoming Jibble message' in '#hr in-out channel' => 'Save to CODA' ======================
    //*UPDATE 22/05/2021* : change Timetable storing database to from 'Airtable' to 'CODA'
    //*UPDATE 29/06/2021* : Change from 'delete only "DC" text before name' to 'delete entire DC code before name'

    if (
      event.type == "message" &&
      event.subtype == "bot_message" &&
      event.bot_id == "B016J4F8FEV" &&
      event.channel == "C014URKUUBX"
    ) {
      // console.log("★ CASE: Save jibble message to CODA");
      res.sendStatus(204);
      //===DECLARE VAR====

      // *UPDATE* แก้ format ชื่อ
      // *UPDATE* Delete Entire DC code because it will be more flexible for DC code to be named
      var preName = event.text
        .split("*")[0]
        .split(" ")
        .filter((n) => n);

      var name =
        preName.length > 2
          ? preName.splice(preName.length - 2, 2).join(" ")
          : preName.join(" ");
      console.log(`★ name = ${name}`);
      var project = [];
      var workType = [];
      var des = [];
      var imgURL = "";

      if (event.attachments) {
        for (var i of event.attachments) {
          // console.log("★ i = " + JSON.stringify(i));
          if (Object.keys(i).includes("text")) {
            try {
              var projectAndWork = i.text
                .split("*")
                .splice(1, 1)
                .toString()
                .split("_");
              if (projectAndWork.length > 1) {
                project = project.concat(projectAndWork[0].trim());
                workType = workType.concat(projectAndWork[1].trim());
              } else {
                workType = workType.concat(projectAndWork[0].trim());
              }

              des = des.concat(
                i.text.split("\n").splice(1, 1).toString().slice(1, -1).trim()
              );
              if (
                des.includes(null) ||
                des.includes(undefined) ||
                des.includes("")
              ) {
                des = des.filter((n) => n != null && n != undefined && n != "");
              }
            } catch (err) {
              console.error(err);
            }
            // console.log(`★ project = ${project}`);
            // console.log(`★ workType = ${workType}`);
            // console.log(`★ des = ${des}`);
          } else if (Object.keys(i).includes("image_url")) {
            imgURL = i.image_url;
            // console.log(`★ imgURL = ${imgURL}`);
          } else {
            // console.log(`★ project = ${project}`);
            // console.log(`★ workType = ${workType}`);
            // console.log(`★ des = ${des}`);
            // console.log(`★ imgURL = ${imgURL}`);
          }
        }
      }

      // var dateTime = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
      var dateTime = new Date(new Date().toLocaleString());
      // console.log(`★ dateTime = ${dateTime}`);

      var day = dateFormat(dateTime, "yyyy-mm-dd");
      // console.log(`★ day = ${day}`);

      const recordPK = `${name} - ${day}`;
      recordPK.toString();

      // console.log(`★ recordPK = ${recordPK}`);

      //  console.log everything before sending
      console.log(`★ PAYLOAD TO BE SEND TO CODA IS`);
      console.log(
        JSON.stringify({
          rows: [
            {
              cells: [
                {
                  column: "ชื่อพนักงาน",
                  value: event.text.includes("DC") ? "" : name
                },
                {
                  column: "ชื่อคนงาน",
                  value: event.text.includes("DC") ? name : ""
                },
                {
                  column: "วันที่",
                  value: dateTime || ""
                },
                {
                  column: "เวลาเข้างาน (First In)",
                  value: event.text.includes("jibbled in") ? dateTime : ""
                },
                {
                  column: "เวลาออกงาน (Last Out)",
                  value: event.text.includes("jibbled in") ? "" : dateTime
                },
                {
                  column: "โครงการ",
                  value: project.join(",")
                },
                {
                  column: "ประเภทงาน",
                  value: workType.join(",")
                },
                {
                  column: "รายละเอียด",
                  value: des.join(",")
                }
              ]
            }
          ]
        })
      );

      //====== Update 22/05/2021 changed platform from 'Airtable' to 'CODA' ======
      //Insert new row on table 'Time Attendacnce' (DocID = "W9JPLH4vI4", tableID = "grid-gAo_Y-j4MP")
      await axios({
        method: "post",
        url: `https://coda.io/apis/v1/docs/W9JPLH4vI4/tables/grid-gAo_Y-j4MP/rows`,
        headers: {
          Authorization: `Bearer ${process.env.CODA_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          rows: [
            {
              cells: [
                {
                  column: "ชื่อพนักงาน",
                  value: event.text.includes("DC") ? "" : name
                },
                {
                  column: "ชื่อคนงาน",
                  value: event.text.includes("DC") ? name : ""
                },
                {
                  column: "วันที่",
                  value: day || ""
                },
                {
                  column: "เวลาเข้างาน (First In)",
                  value: event.text.includes("jibbled in") ? dateTime : ""
                },
                {
                  column: "เวลาออกงาน (Last Out)",
                  value: event.text.includes("jibbled in") ? "" : dateTime
                },
                {
                  column: "โครงการ",
                  value: project.join(",")
                },
                {
                  column: "ประเภทงาน",
                  value: workType.join(",")
                },
                {
                  column: "รายละเอียด",
                  value: des.join(",")
                }
              ]
            }
          ]
        })
      })
        .then((res) => {
          console.log(`update Jibble data to CODA successfully`);
        })
        .catch(async (error) => {
          await fn.SendBUGmsg(
            "Insert new row on table 'Time Attendant'",
            "index.js",
            error,
            req.body
          );
        });
    }
  }

  res.end();
});

//=============================SLASH COMMAND RESPONSE (/BOLT)=============================
app.post("/slack/commands", async (req, res) => {
  //LOG ACTION REQUEST
  // console.log("---------------/bolt COMMAND REQUEST STARTS HERE---------------");
  // console.log("----------req.body(string)----------");
  // console.log(JSON.stringify(req.body));
  // console.log("---------------/bolt COMMAND REQUEST ENDS HERE---------------");
  //CHECK TEXT COMMAND & RETRIVE TRIGGER_ID
  const text = req.body.text;
  // console.log("★ Command text is: " + text);
  const trigger_id = req.body.trigger_id;
  // console.log("★ trigger_id is: " + trigger_id);
  const response_url = req.body.response_url;
  // console.log("★ responseURL is: " + response_url);
  const token = req.body.token;
  // console.log("★ Request token is: " + token);
  const user_id = req.body.user_id;
  // console.log("★ user_id is: " + user_id);
  const channel_id = req.body.channel_id;
  // console.log("★ channel_id is: " + channel_id);

  //if text contains 'mom' => send MOM message
  if (
    text.includes("mom") ||
    text.includes("Mom") ||
    text.includes("MOM") ||
    text.includes("บันทึกการประชุม")
  ) {
    // console.log("==SEND MOM MESSAGE==");
    res.send(msg.momMsg());
  }
  //if text contains 'dr' => send DR message + create DR database cache document
  else if (
    text.includes("dr") ||
    text.includes("DR") ||
    text.includes("daily report") ||
    text.includes("Daily Report") ||
    text.includes("Daily report") ||
    text.includes("DAILY REPORT")
  ) {
    // console.log("==SEND DR MESSAGE==");
    res.sendStatus(204);

    msg
      .drMsg(user_id, channel_id, trigger_id, process.env.SLACK_BOT_TOKEN)
      .then((result) => {
        // console.log(result.data);
        return console.log(`★ DR modal posted!`);
      })
      .catch((err) => {
        console.error(err);
      });

    //create cache document in Firestore
    //const DR_prepopDocPath = `cache/${user_id}/DR/pre-populateURL`;
    var DRJotUrl = {
      head: "https://form.jotform.com/201670438940455",
      day: {
        "input22[month]": "",
        "input22[day]": "",
        "input22[year]": ""
      },
      time: {
        timeSchedule: "08.00-17.00"
      },
      SE: {
        "SEName[first]": "",
        "SEName[last]": "",
        SEPosition: "วิศวกรควบคุมงานก่อสร้าง",
        SESlackID: ""
      },
      PM: {
        "PMName[first]": "",
        "PMName[last]": "",
        PMPosition: "ผู้จัดการโครงการ"
      },
      staff: {
        "q146_staffTable[0][0]": ""
      },
      dc: {
        "q39_DCTable[0][0]": ""
      },
      progress100: {
        "q33_input33[0][0]": ""
      },
      misc: {
        DRProjectQuery: "",
        DRDateQuery: "",
        DRPrepopulatedURL: ""
      }
    };

    const DRcache = await fs.DRPrepopURLDocRef(user_id).set(DRJotUrl);
    // console.log(DRcache);
  }

  //if text contains 'rb' => send RB message + create RB database cache document
  else if (
    text.includes("rb") ||
    text.includes("RB") ||
    text.includes("requested budget") ||
    text.includes("Requested Budget") ||
    text.includes("Requested budget") ||
    text.includes("REQUESTED BUDGET")
  ) {
    // console.log("==SEND RB MESSAGE==");
    res.sendStatus(204);

    let postedModalResult = await msg
      .rbMsg(user_id, trigger_id)
      .then((result) => {
        // console.log(`Modal posted result`);
        // console.log(JSON.stringify(result.data));
        return result.data;
      })
      .catch((err) => {
        console.error(err);
      });

    //create cache document in Firestore
    //const RB_prepopDocPath = `cache/${user_id}/RB/pre-populateURL`;
    var RBJotUrl = {
      head: "https://form.jotform.com/203231001397038",
      day: {
        "date[month]": today.split("-")[1].trim(),
        "date[day]": today.split("-")[2].trim(),
        "date[year]": today.split("-")[0].trim()
      },
      refDocument: {
        refDoc: "",
        workName: ""
      },
      description: {
        "q54_description[0][0]": ""
      },
      resource: {
        "q28_resource[0][0]": ""
      },
      sumBudget: {
        accOriginalBudget: "",
        accOrderedBudget: ""
      },
      CE: {
        "CEName[first]": "",
        "CEName[last]": "",
        CEPosition: "วิศวกรควบคุมต้นทุน",
        CESlackID: ""
      },
      PM: {
        "PMName[first]": "",
        "PMName[last]": "",
        PMPosition: "ผู้จัดการโครงการ",
        PMSlackID: ""
      },
      AirtableData: {
        MS400ID: "",
        viewName: ""
      },
      misc: {
        RBProjectQuery: "",
        RBRefDocQuery: "",
        RBPrepopulatedURL: ""
      }
    };

    const RBcache = await fs.RBPrepopURLDocRef(user_id).set(RBJotUrl);
    // console.log(RBcache);
  }

  //else => send help message
  else {
    // console.log("==SEND HELP MESSAGE==");
    res.send(msg.helpMsg());
  }
});

//=============================ACTION RESPONSE=============================
app.post("/slack/actions", async (req, res) => {
  // console.log(JSON.parse(req.body.payload));
  //LOG ACTION REQUEST
  // console.log("---------------ACTION REQUEST STARTS HERE---------------");
  // console.log("----------req.body----------");
  // console.log(req.body);
  // console.log("----------req.body(string)----------");
  // console.log(JSON.stringify(req.body));
  // console.log("----------req.body.actions----------");
  // console.log(req.body.actions);
  // console.log("----------req.body.context----------");
  // console.log(req.body.context);
  // console.log("----------req.body.payload----------");
  // console.log(req.body.payload);
  // console.log("---------------ACTION REQUEST ENDS HERE---------------");

  const payload = JSON.parse(req.body.payload);

  let {
    type,
    token,
    trigger_id,
    user,
    actions,
    response_url,
    container,
    view,
    message
  } = JSON.parse(req.body.payload);

  const metadata = view ? JSON.parse(view.private_metadata) : "";
  const viewName = metadata ? metadata.viewName : "";
  const channel_id = container
    ? container.channel_id
    : metadata
    ? metadata.channel_id
    : "";
  const user_id = user ? user.id : "";
  const block_id = actions ? actions[0].block_id : "";
  const action_id = actions ? actions[0].action_id : "";

  const submissionValue = view ? view.state.values : "";

  // console.log({ token, user, actions });
  // console.log(`★ viewName = ${viewName}`);
  // console.log(`★ trigger_id = ${trigger_id}`);
  // console.log("★ response_url = " + response_url);
  // console.log("★ block_id = " + block_id);
  // console.log("★ action_id = " + action_id);
  // console.log("★ user_id = "+ user_id);
  // console.log(`★ channel_id = ${channel_id}`);
  // console.log(`★ submissionValue = ${JSON.stringify(submissionValue)}`);
  // console.log(`★ metadata = ${JSON.stringify(metadata)}`);
  // console.log(" ");
  // console.log(" ");

  //-----DR DECLARE VARIABLE-----
  var DRProjectQuery = "";
  var DRDateQuery = "";

  //-----RUN-----
  /*

    ยกเลิกการใช้ switch statement โดยไม่จำเป็น เพราะเกิดปัญหาเรื่องการ declare parameter ที่ชื่อซ้ำ 
    เพราะมันถือว่าเป็น local ระดับเดียวกัน เลยใช้ซ้ำไม่ได้
    (โปรแกรมไม่ให้ reassign ค่าข้าม case ด้วย เหมือน parameter มันใช้ไม่ได้ไปเลย)

  */

  //if `type` is not empty => `Do something!`
  if (type) {
    //block action type => all interactions  (except modal submission)
    if (type == "block_actions") {
      //block_id controls various *specific actions* that grouped by block_id

      //DR interactions=====
      if (block_id.includes("DR_")) {
        //User interacts in DR prepopulatedURL input modal
        if (block_id == "DR_inputModal") {
          //User select project in DR input modal => 1.query project information, PM&SE info then 2.Update cache
          if (action_id == "DR_projectList") {
            res.sendStatus(204);

            let DRProjectData = {
              SE: {
                "SEName[first]": "",
                "SEName[last]": "",
                SEPosition: "วิศวกรควบคุมงานก่อสร้าง",
                SESlackID: ""
              },
              PM: {
                "PMName[first]": "",
                "PMName[last]": "",
                PMPosition: "ผู้จัดการโครงการ"
              },
              "misc.DRProjectQuery": ""
            };

            // console.log(actions[0].selected_option.value)
            let { ABB, ID } = JSON.parse(actions[0].selected_option.value);

            DRProjectQuery = ABB;
            // console.log(`★ DRProjectQuery = ${DRProjectQuery}`);
            DRProjectData["misc.DRProjectQuery"] = DRProjectQuery;

            DRProjectData.SE.SESlackID = user.id;
            // console.log(`★ SESlackID = ${DRProjectData.SE.SESlackID}`);

            // get PM's ID
            let projectData = await fn.DR_searchPPfrominfo(
              baseDR,
              "รายละเอียดโครงการ",
              `{ชื่อย่อโครงการ}="${DRProjectQuery}"`
            );
            let PMRecordID = "";
            if (projectData) {
              PMRecordID = projectData["ชื่อ PM (จากรายชื่อพนักงาน)"];
            }
            //find PM's info (firstname, lastname)
            let PMInfo = await fn.DR_getDataFromID(
              baseDR,
              "รายชื่อพนักงาน",
              PMRecordID
            );
            // console.log(`★ PMinfo = ${JSON.stringify(PMInfo)}`);
            //store data into object
            if (PMInfo) {
              DRProjectData.PM["PMName[first]"] = PMInfo["ชื่อ-สกุล"]
                .split(" ")[0]
                .trim();
              DRProjectData.PM["PMName[last]"] = PMInfo["ชื่อ-สกุล"]
                .split(" ")[1]
                .trim();
            }

            //find SE info with SE slackID
            let SEData = await fn.DR_searchPPfrominfo(
              baseDR,
              "รายชื่อพนักงาน",
              `{Slack USER ID}="${DRProjectData.SE.SESlackID}"`
            );
            if (SEData) {
              DRProjectData.SE["SEName[first]"] = SEData["ชื่อ-สกุล"]
                .split(" ")[0]
                .trim();
              DRProjectData.SE["SEName[last]"] = SEData["ชื่อ-สกุล"]
                .split(" ")[1]
                .trim();
            }

            // console.log("★ DRProjectData =");
            // console.log(JSON.stringify(DRProjectData));

            //update to DB
            let DRcacheUpdate = await fs
              .DRPrepopURLDocRef(user_id)
              .update(DRProjectData);
            // console.log(DRcacheUpdate);
          }
          //User select date in DR input modal => 1.parse date information then 2.Update cache
          else if (action_id == "DR_date") {
            res.sendStatus(204);

            let DRDateData = {
              day: {
                "input22[month]": "",
                "input22[day]": "",
                "input22[year]": ""
              },
              "misc.DRDateQuery": ""
            };

            // res.sendStatus(204); //ack and end
            DRDateQuery = actions[0].selected_date;
            // console.log(`★ DRDateQuery = ${DRDateQuery}`);
            DRDateData["misc.DRDateQuery"] = DRDateQuery;

            //store data into object
            DRDateData.day["input22[year]"] = DRDateQuery.split("-")[0].trim();
            DRDateData.day["input22[month]"] = DRDateQuery.split("-")[1].trim();
            DRDateData.day["input22[day]"] = DRDateQuery.split("-")[2].trim();

            // console.log(`★ input22[day] = ${DRDateData.day["input22[day]"]}`);
            // console.log(`★ input22[month] = ${DRDateData.day["input22[month]"]}`);
            // console.log(`★ input22[year] = ${DRDateData.day["input22[year]"]}`);

            // console.log("★ DRDateData =");
            // console.log(JSON.stringify(DRDateData));

            //Update DB
            let DRcacheDateUpdate = await fs
              .DRPrepopURLDocRef(user_id)
              .update(DRDateData);
            // console.log(DRcacheDateUpdate);
          }
        }
        //PM interacts in DR Approve Requested Message
        else if (block_id == "DR_approveAction") {
          //PM hit 'Approved' button => 1.send Jotform link for PM to sign and 2.delete approve requested message
          if (action_id == "DR_approve") {
            // console.log(`★ PM approved, redirect to Jotform Edit submission page`);
            //Direct to Edit submissionURL link
            res.sendStatus(204); //Ack()

            //Delete message
            let delmsg = msg.delMsg(response_url);
            // console.log(delmsg);
          }
          //PM hit 'Reject' button => 1.pop up modal to PM to add comment  and 2.delete approve requested message
          else if (action_id == "DR_reject") {
            // console.log(`★ PM rejected, pop up modal to add comment & carry data to be update to DB over modal metadata`);
            res.status(200).write(""); // ack

            //structure data for modal to be carry over
            let metadata = {
              DRno: message.blocks[1].fields[1].text.split("\n")[1],
              project: message.blocks[1].fields[1].text
                .split("\n")[1]
                .split("_")[0]
            };

            //send Comment input modal to PM
            let postModalResult = await axios.post(
              `https://slack.com/api/views.open`,
              qs.stringify(
                msg.drRejectCommentMsg(
                  trigger_id,
                  process.env.SLACK_BOT_TOKEN,
                  metadata
                )
              )
            );
            // console.log(`★ Modal posted, here is a result =`);
            // console.log(postModalResult.data);

            //Delete message
            let delAppMsg = msg.delMsg(response_url);
            // console.log(delAppMsg);
          }
        }
      }
      //RB interactions=====
      else if (block_id.includes("RB_")) {
        //User interacts in DR prepopulatedURL input modal
        if (block_id.includes("RB_inputModal")) {
          //User select project
          if (block_id == "RB_inputModal-project") {
            res.sendStatus(204);
            // console.log(`★ RB project has been selected, update cache and RB modal`);

            let { ABB, ID } = JSON.parse(actions[0].selected_option.value);
            //data layout to be updated in Firestore (ref:RBJotUrl)
            let data = {
              sumBudget: {
                accOriginalBudget: "",
                accOrderedBudget: ""
              },
              CE: {
                "CEName[first]": "",
                "CEName[last]": "",
                CEPosition: "วิศวกรควบคุมต้นทุน",
                CESlackID: ""
              },
              PM: {
                "PMName[first]": "",
                "PMName[last]": "",
                PMPosition: "ผู้จัดการโครงการ",
                PMSlackID: ""
              },
              AirtableData: {
                MS400ID: "",
                viewName: "Purchase Requests"
              },
              "misc.RBProjectQuery": ABB
            };

            //get datas
            //Project data
            let projectData = await baseDR("รายละเอียดโครงการ")
              .find(ID)
              .then((record) => {
                return record.fields;
              });
            // console.log(`★ projectData`);
            // console.log(projectData);
            if (projectData) {
              data.AirtableData.MS400ID = projectData["MS400 baseID"];
            }
            //PMData
            let PMData = await baseDR("รายชื่อพนักงาน")
              .find(projectData["ชื่อ PM (จากรายชื่อพนักงาน)"][0])
              .then((record) => {
                return record.fields;
              });
            // console.log(`★ PMData`);
            // console.log(PMData);
            if (PMData) {
              data.PM["PMName[first]"] = PMData["ชื่อ-สกุล"]
                .split(" ")[0]
                .trim();
              data.PM["PMName[last]"] = PMData["ชื่อ-สกุล"]
                .split(" ")[1]
                .trim();
              data.PM.PMSlackID = PMData["Slack USER ID"];
            }
            //CEData
            let CEData = await baseDR("รายชื่อพนักงาน")
              .select({
                view: "Grid view",
                maxRecords: 1,
                filterByFormula: `{Slack USER ID} = "${user_id}"`
              })
              .all(); //[]
            if (CEData) {
              data.CE["CEName[first]"] = CEData[0].fields["ชื่อ-สกุล"]
                .split(" ")[0]
                .trim();
              data.CE["CEName[last]"] = CEData[0].fields["ชื่อ-สกุล"]
                .split(" ")[1]
                .trim();
              data.CE.CESlackID = user_id;
            }
            //sumRB
            let baseMS400 = new Airtable(process.env.AIRTABLE_API_KEY).base(
              `${projectData["MS400 baseID"]}`
            );
            let RBData = await baseMS400("MS400")
              .select({
                view: "Requested Budgets",
                fields: ["ID", "Original BG Amount", "Ordered BG Amount"]
              })
              .all()
              .then((records) => {
                return records.map((n) => {
                  return n.fields;
                });
              });
            // console.log(`★ RBData`);
            // console.log(RBData);
            if (RBData) {
              data.sumBudget.accOriginalBudget = RBData.reduce((sum, rec) => {
                return {
                  "Original BG Amount":
                    sum["Original BG Amount"] + rec["Original BG Amount"]
                };
              })["Original BG Amount"];
              data.sumBudget.accOrderedBudget = RBData.reduce((sum, rec) => {
                return {
                  "Ordered BG Amount":
                    sum["Ordered BG Amount"] + rec["Ordered BG Amount"]
                };
              })["Ordered BG Amount"];
            }

            // console.log(`★ summary of cache data to be updated`);
            // console.log(JSON.stringify(data));

            //query and add `PR list` into msg
            //query `PR list` in MS400
            let PRData = await baseMS400("MS400")
              .select({ view: data.AirtableData.viewName, fields: ["PR No"] })
              .all()
              .then((records) => {
                //get only unique data
                let uniqueData = {};
                records.forEach((record) => {
                  uniqueData[`${record.fields["PR No"]}`] = "";
                });

                return Object.keys(uniqueData);
              });
            // console.log(`★ PRData`);
            // console.log(PRData);

            //added into msg
            //structure data
            let PRoptions = PRData.map((n) => {
              return {
                text: {
                  type: "plain_text",
                  text: n,
                  emoji: true
                },
                value: n
              };
            });
            // console.log(`layouted projects = `);
            // PRoptions.forEach(n => console.log(JSON.stringify(n)));

            let PRListSection = {
              type: "input",
              block_id: "RB_inputModal-PR",
              dispatch_action: true,
              element: {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "เลือกโครงการ",
                  emoji: true
                },
                options: PRoptions
              },
              label: {
                type: "plain_text",
                text: ":memo:  เลือกเอกสารอ้างอิง",
                emoji: true
              }
            };

            // let newModalView = await msg.rbMsgTemplate(user_id)
            //test-- use the payload view
            let newModalView = {
              type: view.type,
              title: view.title,
              submit: view.submit,
              close: view.close,
              blocks: view.blocks,
              private_metadata: view.private_metadata
            };
            //update metadata
            metadata.MS400baseID = projectData["MS400 baseID"];
            newModalView.private_metadata = JSON.stringify(metadata);

            //add into msg blocks
            newModalView.blocks = [...newModalView.blocks, PRListSection];
            // console.log(`new modal view =`);
            // console.log(JSON.stringify(newModalView));

            //update modal
            try {
              let args = {
                token: process.env.SLACK_BOT_TOKEN,
                view: JSON.stringify(newModalView),
                view_id: view.id
              };

              let updateModalResult = await axios.post(
                `${apiUrl}/views.update`,
                qs.stringify(args)
              );
              // console.log('★ New modal view pushed!');
              // console.log(updateModalResult.data)
            } catch (error) {
              console.error(error);
            }

            //update cache (userID & Project abb)
            let RBcacheDateUpdate = await fs
              .RBPrepopURLDocRef(user_id)
              .update(data);
            // console.log(RBcacheDateUpdate);
          }
          //User `select refDoc`
          else if (block_id == "RB_inputModal-PR") {
            res.sendStatus(204);
            // console.log(`★ RB refDoc has been selected, update cache`);

            //data layout to be updated in Firestore (ref:RBJotUrl)
            let PRdata = {
              "refDocument.refDoc": actions[0].selected_option.value,
              "misc.RBRefDocQuery": actions[0].selected_option.value
            };

            //update modal
            let data = {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "ข้อมูลครบแล้ว กด submit ได้เลยค่ะ :heavy_check_mark: "
              }
            };

            //test-- use the payload view
            let newModalView = {
              type: view.type,
              title: view.title,
              submit: view.submit,
              close: view.close,
              blocks: view.blocks,
              private_metadata: view.private_metadata
            };

            //add into msg blocks
            newModalView.blocks = [...newModalView.blocks, data];
            // console.log(`new modal view =`);
            // console.log(JSON.stringify(newModalView));

            //update modal
            try {
              let args = {
                token: process.env.SLACK_BOT_TOKEN,
                view: JSON.stringify(newModalView),
                view_id: view.id
              };

              let updateModalResult = await axios.post(
                `${apiUrl}/views.update`,
                qs.stringify(args)
              );
              // console.log('★ New modal view pushed!');
              // console.log(updateModalResult.data)
            } catch (error) {
              console.error(error);
            }

            //update cache
            //update cache (userID & Project abb)
            let RBcachePRUpdate = await fs
              .RBPrepopURLDocRef(user_id)
              .update(PRdata);
            // console.log(RBcachePRUpdate);
          }
        }
      }

      //THIS action_id controls various *common actions* which DOES NOT have  block_id
      //User hit 'delete message' button in help message => delete the message
      else if (action_id == "deletemessage") {
        res.status(200);
        res.write(""); //=ack();
        // code block
        // console.log("★ delete message case");
        //res.status(200); //=ack();
        let result = await msg.delMsg(response_url);
        // console.log(result.data);
        res.end();
      }
      //User hit 'Minute of Meeting' button in help message => just acknowledge
      else if (action_id == "open_momMsg") {
        res.sendStatus(204);
      }
      //User hit 'Open Daily Report' button in help messsage => send DR modal
      else if (action_id == "open_drMsg") {
        res.sendStatus(204);
        // console.log("★ open DR message case");
        // res.status(200); //=ack();

        //send DR message
        msg
          .drMsg(user_id, channel_id, trigger_id, process.env.SLACK_BOT_TOKEN)
          .then((result) => {
            // console.log(result.data)
            return console.log("★ Modal posted");
          })
          .catch((err) => {
            console.error(err);
          });

        //create cache for pre-populateURL
        var DRJotUrl = {
          head: "https://form.jotform.com/201670438940455",
          day: {
            "input22[month]": "",
            "input22[day]": "",
            "input22[year]": ""
          },
          time: {
            timeSchedule: "08.00-17.00"
          },
          SE: {
            "SEName[first]": "",
            "SEName[last]": "",
            SEPosition: "วิศวกรควบคุมงานก่อสร้าง",
            SESlackID: ""
          },
          PM: {
            "PMName[first]": "",
            "PMName[last]": "",
            PMPosition: "ผู้จัดการโครงการ"
          },
          staff: {
            "q146_staffTable[0][0]": ""
          },
          dc: {
            "q39_DCTable[0][0]": ""
          },
          progress100: {
            "q33_input33[0][0]": ""
          },
          misc: {
            DRProjectQuery: "",
            DRDateQuery: "",
            DRPrepopulatedURL: ""
          }
        };
        const DRcache = await fs.DRPrepopURLDocRef(user_id).set(DRJotUrl);
        // console.log(DRcache);
      }
      //User hit 'Open Requested Budget' button in help messsage => send RB modal
      else if (action_id == "open_rbMsg") {
        // console.log("==SEND RB MESSAGE==");
        res.sendStatus(204);

        await msg
          .rbMsg(user_id, trigger_id)
          .then((result) => {
            // console.log(result.data);
            return console.log(`★ RB modal posted!`);
          })
          .catch((err) => {
            console.error(err);
          });

        //create cache document in Firestore
        //const DR_prepopDocPath = `cache/${user_id}/RB/pre-populateURL`;
        var RBJotUrl = {
          head: "https://form.jotform.com/203231001397038",
          day: {
            "date[month]": today.split("-")[1].trim(),
            "date[day]": today.split("-")[2].trim(),
            "date[year]": today.split("-")[0].trim()
          },
          refDocument: {
            refDoc: "",
            workName: ""
          },
          description: {
            "q54_description[0][0]": ""
          },
          resource: {
            "q28_resource[0][0]": ""
          },
          sumBudget: {
            accOriginalBudget: "",
            accOrderedBudget: ""
          },
          CE: {
            "CEName[first]": "",
            "CEName[last]": "",
            CEPosition: "วิศวกรควบคุมต้นทุน",
            CESlackID: ""
          },
          PM: {
            "PMName[first]": "",
            "PMName[last]": "",
            PMPosition: "ผู้จัดการโครงการ",
            PMSlackID: ""
          },
          AirtableData: {
            MS400ID: "",
            viewName: ""
          },
          misc: {
            RBProjectQuery: "",
            RBRefDocQuery: "",
            RBPrepopulatedURL: ""
          }
        };

        const RBcache = await fs.RBPrepopURLDocRef(user_id).set(RBJotUrl);
        // console.log(RBcache);
      } else {
        res.sendStatus(200);
      }
    }
    //view_submission
    else if (type == "view_submission") {
      //Specific actions only for view submission that has 'viewName' in private_metadata

      //User hit 'Submit' button in DR input modal => 1.Verify project name & date, if "OK" then 2.Generate pre-populated Jotform URL 3.Push new view with prepopulated Jotform URL
      if (viewName == "DR_prepopInput") {
        // console.log("★ case DR_pre-populate URL");
        let today = new Date();

        //pop-up warning message if 'project' is not selected , OR 'date' is in the future
        //1. get data from DB => return datafields
        let data = await fs
          .DRPrepopURLDocRef(user_id)
          .get()
          .then((documentSnapshot) => {
            let fields = documentSnapshot.data();
            return fields;
          });
        // console.log(`★ data from DB = `);
        // console.log(JSON.stringify(data));

        //2. check the date (if data.misc.DRDateQuery = "" => data.misc.DRDateQuery = date)
        var date = new Date(
          new Date().toLocaleString("en-AU", { timeZone: "Asia/Bangkok" })
        );
        let day = dateFormat(date, "yyyy-mm-dd");

        if (!data.misc.DRDateQuery) {
          // console.log(`★ There is no date from DB, assign date`);
          data.misc.DRDateQuery = day;

          //store data into object
          data.day["input22[year]"] = day.split("-")[0].trim();
          data.day["input22[month]"] = day.split("-")[1].trim();
          data.day["input22[day]"] = day.split("-")[2].trim();

          // console.log(`★ input22[day] = ${data.day["input22[day]"]}`);
          // console.log(`★ input22[month] = ${data.day["input22[month]"]}`);
          // console.log(`★ input22[year] = ${data.day["input22[year]"]}`);
        }

        //2.5 Store project & date variable for output message
        let drProject = data.misc.DRProjectQuery;
        let drDate = data.misc.DRDateQuery;

        //3. check, get other infos, save URL to Firestore cache, push new view with prepopulated Jotform URL
        if (
          !data.misc.DRProjectQuery ||
          new Date(data.misc.DRDateQuery) > today
        ) {
          // console.log("-----error case, no project chosen ,or date is in the future");
          res.send(await msg.drErrorMsg(user_id, channel_id));
          // console.log('★ msg sent!');
        } else {
          // console.log("★ input checked! continue");

          //NOT USED
          // console.log(`★ Clear modal view(s)`);
          // res.send({
          //   "response_action": "clear"
          // });

          //find other infos
          //1.get DC & staff data from Airtable
          const staffAndDCData = await fn.DR_getMultipleRecordsByFormula(
            baseDR,
            "บันทึกเวลาเข้าออก",
            `AND( {วันที่ (Text)}="${data.misc.DRDateQuery}", IF(SEARCH("${data.misc.DRProjectQuery}",ARRAYJOIN({โครงการ}))=BLANK(),FALSE(),TRUE()))`
          );
          if (staffAndDCData) {
            if (Object.keys(staffAndDCData.staff).length > 0) {
              // console.log(`★ staffData from Airtable = ${JSON.stringify(staffAndDCData.staff)}`);
              data.staff = staffAndDCData.staff;
              // console.log(`★ Updated staff data`);
            } else {
              // console.log("★ found no staff data = delete data.staff key");
              delete data.staff;
            }

            if (Object.keys(staffAndDCData.dc).length > 0) {
              // console.log(`★ DCData from Airtable = ${JSON.stringify(staffAndDCData.dc)}`);
              data.dc = staffAndDCData.dc;
              // console.log(`★ DC data updated`);
            } else {
              // console.log("★ found no DC data = delete data.dc key");
              delete data.dc;
            }
          } else {
            // console.log(`★ No staff or DC data on this day, delete staff and dc keys`);
            delete data.staff;
            delete data.dc;
          }

          //2.get progress100% (ยังไม่ทำเพราะ base เก็บข้อมูล DR ยังไม่มา)
          const progressData = undefined;
          if (progressData) {
            // console.log(`★ There are progress 100% from other DR`);
          } else {
            // console.log(`★ No progress100% this week, delete progress tree`);
            delete data.progress100;
          }

          //delete unused data
          delete data.misc;
          // console.log(`★ finished data = ${JSON.stringify(data)}`)

          //transform and merge into URL
          const key = Object.keys(data);
          // console.log(`★ data keys = ${key}`);

          //concat URL part from every keys except head
          var URLparam = [];
          for (var o in data) {
            // console.log(`★ data key = ${o}`);
            if (o != "head") {
              let entries = Object.entries(data[o]);
              entries = entries.map((n) => n.join("=")).join("&");
              // console.log(entries);
              URLparam = URLparam.concat(entries);
            } else {
              // console.log(`★ data keys = head, do nothing`);
            }
          }
          URLparam = URLparam.join("&");
          // console.log(`★ Finished URLparam = ${URLparam}`);

          //merge URL
          URL = `${data.head}?${URLparam}`;
          // console.log(`★ URL = ${URL}`);

          //Shorten URL
          let URLshort = await TinyURL.shorten(URL);
          // console.log(`★ URLshort = ${URLshort}`);

          //save URL to Firestore cache
          let DRcacheUpdate = await fs
            .DRPrepopURLDocRef(user_id)
            .update({ "misc.DRPrepopulatedURL": URLshort });
          // console.log(`★ cache update result = ${JSON.stringify(DRcacheUpdate)}`);

          //Push new modal view that contains PrepopulatedURL
          // console.log(`★ drProject = ${drProject}`);
          // console.log(`★ drDate = ${drDate}`);

          // let pushURLviewResult = await axios.post(`https://slack.com/api/views.push`,msg.drPrepopulatedURL(user_id, channel_id, drProject, drDate, URLshort));

          try {
            res.send(
              await msg.drPrepopulatedURL(
                user_id,
                channel_id,
                drProject,
                drDate,
                URLshort
              )
            );
            // console.log('★ New modal view pushed!');
          } catch (error) {
            console.error(error);
          }

          /* NOT USED
          //Send URL message
          let responseURL = payload.response_urls[0].response_url;
          // console.log(`★ responseURL = ${responseURL}`);


          try {

            
            let URLmessageResult = await axios.post( `${responseURL}` , msg.drPrepopMsg(drProject, drDate, URLshort) );


            // console.log(`★ URLmessageResult = ${JSON.stringify(URLmessageResult.data)}`);
            // console.log(`★ message posted`)
          } catch (error) {
            // console.log(error);

          }
          */
        }
      }

      //User hit 'Submit' button in RB input modal
      if (viewName == "RB_prepopInput") {
        // res.sendStatus(204);
        // console.log(`★ RB populate URL to submitted RB modal`);

        //recall RB cache
        // console.log(`recall RB cache`);
        let cache = await fs
          .RBPrepopURLDocRef(user_id)
          .get()
          .then((documentSnapshot) => {
            let fields = documentSnapshot.data();
            return fields;
          });
        // console.log(`★ data from DB = `);
        // console.log(JSON.stringify(cache));

        //send ERROR modal if project name and refDoc is empty
        if (!cache.misc.RBProjectQuery) {
          // console.log(`★ SEND PROJECT ERROR MODAL`);

          res.send({
            response_action: "errors",
            errors: {
              "RB_inputModal-project": "เลือกโครงการก่อนนะคะ"
            }
          });
        } else if (!cache.misc.RBRefDocQuery) {
          // console.log(`★ SEND REFDOC ERROR MODAL`);

          res.send({
            response_action: "errors",
            errors: {
              "RB_inputModal-PR": "เลือกเอกสารด้วยค่ะ"
            }
          });
        } else {
          //get refDoc data
          // console.log(`★ get refDoc data`);
          let baseMS400 = new Airtable(process.env.AIRTABLE_API_KEY).base(
            `${metadata["MS400baseID"]}`
          );
          let PRData = await baseMS400("MS400")
            .select({
              view: "Purchase Requests",
              filterByFormula: `{PR No}="${cache.misc.RBRefDocQuery}"`,
              fields: ["ID", "Details", "Linked Budget"]
            })
            .all()
            .then((records) => {
              return records.map((n) => {
                return n.fields;
              });
            })
            .catch((err) => console.error(err));
          // console.log(`★ PRData`);
          // console.log(PRData);

          //generate workName, description, resource if there are record(s)
          // console.log(`★ generate workName, description, resource if there are record(s)`);
          if (PRData[0]) {
            //workName
            let workname = PRData.map((rec) => {
              return rec.Details;
            }).reduce((arrayunique, val) => {
              val.trim();
              return arrayunique.includes(val)
                ? arrayunique
                : [...arrayunique, val];
            }, []); //[workName]
            // console.log(`★ workname`);
            // console.log(workname);

            cache.refDocument.workName = workname.join(", ");

            //description & resource
            //1.query linked budgetData
            let linkedBudgetList = PRData.reduce((arr, rec) => {
              return [...arr, ...rec["Linked Budget"]];
            }, []); //[recordID]
            let linkedBudgetData = [];
            for (var val of linkedBudgetList) {
              let data = await baseMS400("MS400")
                .find(val)
                .then((rec) => {
                  return {
                    RecordID: rec.id,
                    Budget_ID: rec.fields["Budget_ID"],
                    "Area Code": rec.fields["Area Code"],
                    "Group Element": rec.fields["Group Element"],
                    "NRM Code": rec.fields["NRM Code"],
                    Description: rec.fields["Description"],
                    "Resource Code": rec.fields["Resource Code"],
                    "Resource Name": rec.fields["Resource Name"],
                    "Q'ty": rec.fields["Q'ty"],
                    "Unit Rate": rec.fields["Unit Rate"],
                    "Budget Amount": rec.fields["Budget Amount"],
                    Unit: rec.fields["Unit"]
                  };
                })
                .catch((err) => console.error(err));

              // console.log(data)
              linkedBudgetData = [...linkedBudgetData, data];
            }

            // console.log(`★ linkedBudgetData`);
            // console.log(linkedBudgetData);
            // console.log(JSON.stringify(linkedBudgetData));

            //2.group unique (sum budget of every duplicate) & restructure
            let uniqueBudget = linkedBudgetData.reduce((unique, rec) => {
              let ID2 = `${rec["Budget_ID"]}-${rec["Unit"]}`;
              let keys = Object.keys(unique);
              // console.log(`ID2 = ${ID2}`);
              // console.log(`keys = ${keys}`);

              if (keys.includes(ID2)) {
                unique[ID2]["Q'ty"] = unique[ID2]["Q'ty"] + rec["Q'ty"];
                unique[ID2]["Budget Amount"] =
                  unique[ID2]["Budget Amount"] + rec["Budget Amount"];
                unique[ID2]["Unit Rate"] =
                  unique[ID2]["Budget Amount"] / unique[ID2]["Q'ty"];

                return unique;
              } else {
                unique[ID2] = rec;
                return unique;
              }
            }, {});

            // console.log(`★ uniqueBudget =`);
            // console.log(uniqueBudget);
            // console.log(JSON.stringify(uniqueBudget));

            //3.restructure & update cache for description table
            let desFields = [
              "Area Code",
              "Group Element",
              "NRM Code",
              "Description",
              "Resource Code"
            ];
            let desRow = 0;
            for (var k in uniqueBudget) {
              // console.log(`>>uniquebudget loop${desRow}: ${k}`)
              for (var i in desFields) {
                cache.description[`q54_description[${desRow}][${i}]`] =
                  uniqueBudget[k][`${desFields[i]}`];
              }
              desRow = desRow + 1;
            }

            // console.log(`★ updated description table =`);
            // console.log(JSON.stringify(cache.description));

            //4.compare data to uniqueResource{}
            let uniqueResource = Object.values(uniqueBudget).reduce(
              (unique, n, i) => {
                //check resource code
                let resAndUnit = `${n["Resource Code"]}-${n["Unit"]}`;
                // console.log(`★ resAndUnit =`);
                // console.log(resAndUnit);

                let keys = Object.keys(unique);
                // console.log(`★ unique keys =`);
                // console.log(keys);

                //filter resource code
                let resourceMatched = keys.filter((key) => {
                  return key.includes(n["Resource Code"]);
                });
                // console.log(`★ matched resource`);
                // console.log(resourceMatched);
                if (resourceMatched.length > 0) {
                  // console.log(`★ resource matched => check for unit`);
                  //matched resource => check for unit
                  // console.log(`★ Unit = " -${n["Unit"]} "`);

                  if (resourceMatched.join(",").includes(`-${n["Unit"]}`)) {
                    //resource and unit matched => update sum budget
                    // console.log(`★ resource and unit matched => update sum budget`);
                    //sumbudget
                    unique[resAndUnit]["Q'ty"] =
                      unique[resAndUnit]["Q'ty"] + n["Q'ty"];
                    unique[resAndUnit]["Budget Amount"] =
                      unique[resAndUnit]["Budget Amount"] + n["Budget Amount"];
                    unique[resAndUnit]["Unit Rate"] =
                      unique[resAndUnit]["Budget Amount"] /
                      unique[resAndUnit]["Q'ty"];
                    unique[resAndUnit]["linkedDes"] = unique[resAndUnit][
                      "linkedDes"
                    ].concat(`, 1.${i + 1}`);
                    // console.log(`★ Updated unique`);
                    // console.log(unique);

                    return unique;
                  } else {
                    //resource matched but NOT unit => add unit remarks for that resource and add new row with unit remarks
                    // console.log(`★ resource matched but NOT unit => add unit remarks for that resource and add new row with unit remarks`);
                    //add unit remarks in filtered resource
                    resourceMatched.map((key) => {
                      return (unique[key]["Remarks"] = `Unit = ${key
                        .split("-")[1]
                        .trim()}`);
                    });
                    //add new data
                    n["Remarks"] = `Unit = ${n["Unit"]}`;
                    n["linkedDes"] = `1.${i + 1}`;

                    unique[resAndUnit] = n;

                    // console.log(`★ Updated unique`);
                    // console.log(unique);

                    return unique;
                  }
                } else {
                  //NO matched resource => add new data
                  // console.log(`★ NO matched resource => add new data`)
                  n["linkedDes"] = `1.${i + 1}`;
                  unique[resAndUnit] = n;

                  // console.log(`★ Updated unique`);
                  // console.log(unique);

                  return unique;
                }
              },
              {}
            );

            // console.log(`★ uniqueResource = `);
            // console.log(uniqueResource);
            // console.log(JSON.stringify(uniqueResource));

            //5.restructure & update cache for resource table
            let resFields = [
              "linkedDes",
              "Resource Name",
              "Q'ty",
              "Unit Rate",
              "Budget Amount",
              "Remarks"
            ];
            desRow = 0;
            for (var k in uniqueResource) {
              // console.log(`>>uniqueResource loop${desRow}: ${k}`)
              for (var i in resFields) {
                cache.resource[`q28_resource[${desRow}][${i}]`] =
                  uniqueResource[k][`${resFields[i]}`];
              }
              desRow = desRow + 1;
            }

            // console.log(`★ updated resource table =`);
            // console.log(JSON.stringify(cache.resource));
          }

          //re-structure & form URL
          // console.log(`★ re-structure & form URL`);

          // console.log(`★ cache =`);
          // console.log(JSON.stringify(cache));

          //delete unused data
          delete cache.misc;
          // console.log(`★ finished cache = ${JSON.stringify(cache)}`)

          //transform and merge into URL
          const key = Object.keys(cache);
          // console.log(`★ cache keys = ${key}`);

          //concat URL part from every keys except head
          var URLparam = [];
          for (var o in cache) {
            // console.log(`★ cache key = ${o}`);
            if (o != "head" && o != "AirtableData") {
              let entries = Object.entries(cache[o]);
              entries = entries.map((n) => n.join("=")).join("&");
              // console.log(entries);
              URLparam = URLparam.concat(entries);
            } else {
              // console.log(`★ cache keys = head, do nothing`);
            }
          }
          URLparam = URLparam.join("&");
          // console.log(`★ Finished URLparam = ${URLparam}`);

          //merge URL
          URL = `${cache.head}?${URLparam}`;
          // console.log(`★ URL = ${URL}`);

          //Shorten URL
          let URLshort = await TinyURL.shorten(URL);
          // console.log(`★ URLshort = ${URLshort}`);

          //update modal
          try {
            res.send(
              await msg.rbPrepopulatedURL(
                cache.refDocument.refDoc.split("/")[0].trim(),
                cache.refDocument.refDoc,
                URLshort,
                cache.AirtableData.MS400ID
              )
            );
            // console.log('★ New modal view pushed!');
          } catch (error) {
            console.error(error);
          }

          //update cache
          let cacheUpdate = await fs.RBPrepopURLDocRef(user_id).update({
            refDocument: cache.refDocument,
            description: cache.description,
            resource: cache.resource,
            "misc.RBPrepopulatedURL": URLshort
          });
          // console.log(`★ cache update result = ${JSON.stringify(cacheUpdate)}`);

          /*
          //Update modal view (send URL)
          let newBlock = [{
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `:jotform:   *RB Jotform URL :  <${URLshort}>*`
            }
          }];
  
          let newModalView = {"type": view.type, "title": view.title, "submit": view.submit, "close": view.close, "blocks": view.blocks, "private_metadata": view.private_metadata}
  
          //add into msg blocks
            //delete `ข้อมูลครบแล้ว หก submit ได้เลยค่ะ` message
          newModalView.blocks.splice(4,1)
          newModalView.blocks = [...newModalView.blocks, ...newBlock];
          // console.log(`new modal view =`);
          // console.log(JSON.stringify(newModalView));
  
  
          //update modal
          try {
            let args = {
              "token": process.env.SLACK_BOT_TOKEN,
              "view": JSON.stringify(newModalView),
              "view_id": view.id
            };
  
            let updateModalResult = await axios.post(`${apiUrl}/views.update`, qs.stringify(args));
            // console.log('★ New modal view pushed!'); 
            // console.log(updateModalResult.data)             
          } 
          catch (error) {
            console.error(error);
          }
          */
        }
      } else if (submissionValue) {
        //Check DR approve action in DR approve requested message
        if (submissionValue.DR_approveAction) {
          //User hit 'submit' button in reject comment modal => 1.update cache and 2.send reject message to SE
          if (submissionValue.DR_approveAction.DR_rejectComment.value) {
            res.sendStatus(204); //ack;
            // console.log(`★ Rejected comment received!, update DB & send message to submitter`);

            //update DB
            let DRno = metadata.DRno;
            let project = metadata.project;

            const DRApproveResult = await fs
              .DRListDocRef(project, DRno)
              .update({
                status: "ไม่อนุมัติ (RE)",
                "approveData.approveDate": `${today}`,
                "approveData.approveResult": "RE",
                "approveData.approveComment":
                  payload.view.state.values.DR_approveAction.DR_rejectComment
                    .value
              });
            // console.log(DRApproveResult);

            //send message to submitter
            //1. get DB Data
            // console.log(`★ Get all this DR Data from DB to form a reject message`);

            let DRApproveData = await fs
              .DRListDocRef(project, DRno)
              .get()
              .then((documentSnapshot) => {
                let fields = documentSnapshot.data();
                return fields;
              });
            // console.log(`★ data from DB = `);
            // console.log(JSON.stringify(DRApproveData));

            //2. send Message
            let postResult = await axios.post(
              "https://slack.com/api/chat.postMessage",
              qs.stringify(
                msg.drRejectMsg(
                  DRApproveData,
                  DRApproveData.submitData.submitterSlackID,
                  process.env.SLACK_BOT_TOKEN
                )
              )
            );

            // console.log(`★ DM'ed to submitter, there is a result =\n `);
            // console.log(postResult.data);
          }
        }
      }
    }
  }
});

//=============================Airtable scripts=============================
app.post("/airtable/hooks/:command", async (req, res) => {
  //LOG REQUEST===============
  console.log("--------------- REQUEST STARTS HERE---------------");
  // console.log("----------req----------");
  // console.log(req);
  console.log("----------req.url----------");
  console.log(req.url);
  console.log("----------req.route----------");
  console.log(req.route);
  console.log("----------req.body----------");
  console.log(req.body);
  console.log("----------req.body.string----------");
  console.log(JSON.stringify(req.body));
  console.log("----------req.params----------");
  console.log(req.params);
  console.log("----------req.query----------");
  console.log(req.query);
  console.log("----------req.data----------");
  console.log(req.data);
  console.log("--------------- REQUEST ENDS HERE---------------");

  //RESPONSE TO COMMANDS===============,
  // let command = req.body.command;
  let command = req.params.command;
  console.log(`commmand = ${command}`);

  if (command == "sendSlackErrorMsg") {
    console.log('★ send Slack error message to "bug" channel');
    let { functionName, fileName, error } = req.body;
    // console.log(`functionName = ${functionName}`);
    // console.log(`fileName = ${fileName}`);
    // console.log(`error = ${error}`);

    await fn
      .SendBUGmsg(functionName, fileName, error, req.body)
      .then(() => {
        res.send('★ send Slack error message to "bug" channel completed!');
      })
      .catch((err) => {
        console.log(`Can't send bug, send console.error`);
        console.error("can't send bug to 'bug' channel, reason unknown");
        res.send("can't send bug to 'bug' channel, reason unknown");
      });
  } else if (command == "slackNewCodeWarningMsg") {
    console.log(`★ send Slack warning message to user's DM`);

    //run slack warning function
    await axios
      .post(
        "https://slack.com/api/chat.postMessage",
        qs.stringify(await msg.slackNewCodeWarningMsg(req.body))
      )
      .then((response) => {
        console.log("message sent!");
        console.log(`response.data =`);
        console.log(response.data);
        res.send(
          `warning message posted!,\n\n ${JSON.stringify(response.data)}`
        );
      })
      .catch(async (err) => {
        console.error(err);
        await fn.SendBUGmsg(
          "msg.slackNewCodeWarningMsg",
          "index.js",
          err,
          req.body
        );
        res.send(
          `can't send message, send ERROR message to BUG channel instead`
        );
      });
  } else {
    console.log("command not matched");
    res.send("command not matched");
  }
});

//=============================LISTEN TO PORT=============================
/* Running Express server */
app.listen(port, () => {
  console.log("★ Your app is listening on port " + port);
});
