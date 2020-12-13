//=============================Initialize=============================
const axios = require('axios'); 
const dateFormat = require("dateformat");
const qs = require('qs');
const Airtable = require("airtable");
const fs = require('./firestore');

const apiUrl = 'https://slack.com/api';
const baseDR = new Airtable(process.env.AIRTABLE_API_KEY).base("appAThxvZSRLzrXta");  //base "ข้อมูลสำหรับ Daily Report"


//====================DECLARE VARIABLE TO BE USED IN THIS FILE======================

var today = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
console.log(today);

var initialDatepicker = dateFormat(today, "yyyy-mm-dd");
console.log(`initialDatepicker = ${initialDatepicker}`);

//=============================DECLARE obj 'MOM message'=============================
const momMsg = () => {
	const msg = {
	  response_type: "ephemeral",
	  blocks: [
		  {
			  "type": "section",
			  "text": {
				  "type": "mrkdwn",
				  "text": "มาบันทึกการประชุมกันเถอะค่ะ คลิกที่ลิ้งค์ด้านล่างได้เลยย :wink:"
			  },
			  "accessory": {
				  "type": "button",
				  "action_id": "deletemessage",
				  "text": {
					  "type": "plain_text",
					  "text": "ปิด :x:",
					  "emoji": true
				  },
				  "value": "deletemessage"
			  }
		  },
		  {
			  "type": "section",
			  "text": {
				  "type": "mrkdwn",
				  "text": ":point_right:  <https://form.jotform.com/201602931022439>"
			  }
		  }
	  ]
	};
	return msg;
};



//=============================DECLARE 'DR message'==================================
//-----Pre-populate URL modal------
const drMsg = (user_id, channel_id, triggerID, SLACK_BOT_TOKEN) => {
  let welcomeText = `สวัสดีค่าคุณ<@${user_id}>  มากรอก Daily Report กันนะคะ :heart:`
  let metadata = JSON.stringify({"channel_id": channel_id , "viewName": "DR_prepopInput"});
  
  
  const msg = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Daily Report",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
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
          "text": welcomeText
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*:building_construction: :calendar:   เลือกโครงการและวันที่ก่อนค่ะ*"
        }
      },
      {
        "type": "actions",
        "block_id": "DR_inputModal",
        "elements": [
          {
            "type": "static_select",
            "action_id": "DR_projectList",
            "placeholder": {
              "type": "plain_text",
              "text": "โครงการ",
              "emoji": true
            }
          },
          {
            "type": "datepicker",
            "action_id": "DR_date",
            "initial_date": initialDatepicker,
            "placeholder": {
              "type": "plain_text",
              "text": "วันที่ใน DR",
              "emoji": true
            }
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": " ",
            "emoji": true
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "NOTE:\n     - วันที่คือวันที่ใน DR เช่น การบันทึก DR ของเมื่อวาน ให้ใส่วันที่เมื่อวาน",
            "emoji": true
          }
        ]
      }
    ],
    "private_metadata":metadata,
  };

  let msg_not_used = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Daily Report",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
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
          "text": welcomeText
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*:building_construction: :calendar:   เลือกโครงการและวันที่ก่อนค่ะ*"
        }
      },
      {
        "type": "actions",
        "block_id": "DR_inputModal",
        "elements": [
          {
            "type": "static_select",
            "action_id": "DR_projectList",
            "placeholder": {
              "type": "plain_text",
              "text": "โครงการ",
              "emoji": true
            }
          },
          {
            "type": "datepicker",
            "action_id": "DR_date",
            "initial_date": initialDatepicker,
            "placeholder": {
              "type": "plain_text",
              "text": "วันที่ใน DR",
              "emoji": true
            }
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "(วันที่คือวันที่ใน DR เช่น การบันทึก DR ของเมื่อวาน ให้ใส่วันที่เมื่อวาน)",
            "emoji": true
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": " ",
            "emoji": true
          }
        ]
      },
      {
        "type": "input",
        "element": {
          "type": "conversations_select",
          "action_id": "channelSelected",
          "default_to_current_conversation": true,
          "response_url_enabled": true
        },
        "label": {
          "type": "plain_text",
          "text": ":male-construction-worker: :female-construction-worker:   เลือกห้องที่จะให้ URL ส่งไปหา (เห็นได้คนเดียว)",
          "emoji": true
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "(หากส่งหาตัวเองในห้องที่กำลังเปิดอยู่ _ไม่ต้องแก้ไขข้อมูล_)"
          }
        ]
      }
    ],
    "private_metadata":metadata,
  }


  return new Promise((resolve, reject) => {

    fs.db.doc('slack-external-menus/project list').get()
    .then(documentSnapshot => {
      let data = documentSnapshot.data();
      // console.log(`Retrived data = ${JSON.stringify(data)}`);
      // console.log(`data = `);
      // console.log(data);
      msg.blocks[3].elements[0].options = data.options;
      // console.log(`new msg =`);
      // console.log(JSON.stringify(msg));
      return msg;
    })
    .then( msg => {
      const args = {
          "token": SLACK_BOT_TOKEN,
          "trigger_id": triggerID,
          "view": JSON.stringify(msg)
      };
    
      // open modal
      const result = axios.post(`${apiUrl}/views.open`, qs.stringify(args));
      resolve(result)
    })
    .catch( err => {
      console.error(err);
      resolve()
    })

  });

};

const drErrorMsg = (user_id, channel_id) => {
  let welcomeText = `สวัสดีค่าคุณ<@${user_id}>  มากรอก Daily Report กันนะคะ :heart:`
  let metadata = JSON.stringify({"channel_id": channel_id , "viewName": "DR_prepopInput"});
  
  
  const msg = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Daily Report",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
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
          "text": welcomeText
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "เลือกโครงการและวันที่ก่อนนะคะ"
        }
      },
      {
        "type": "actions",
        "block_id": "DR_ProjectAndDateSelect",
        "elements": [
          {
            "type": "static_select",
            "action_id": "DR_projectList",
            "placeholder": {
              "type": "plain_text",
              "text": "โครงการ",
              "emoji": true
            }
          },
          {
            "type": "datepicker",
            "action_id": "DR_date",
            "initial_date": initialDatepicker,
            "placeholder": {
              "type": "plain_text",
              "text": "วันที่ใน DR",
              "emoji": true
            }
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":octagonal_sign:  *_กรุณาเลือกโครงการ หรือวันที่ไม่เกินวันนี้ด้วยค่ะ_*  :octagonal_sign:"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": " ",
            "emoji": true
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "NOTE:\n     - วันที่คือวันที่ใน DR เช่น การบันทึก DR ของเมื่อวาน ให้ใส่วันที่เมื่อวาน",
            "emoji": true
          }
        ]
      }
    ],
    "private_metadata":metadata,
  };

  return new Promise((resolve, reject) => {
    let arg = {};

    fs.db.doc('slack-external-menus/project list').get()
    .then(documentSnapshot => {
      let data = documentSnapshot.data();
      // console.log(`Retrived data = ${JSON.stringify(data)}`);
      // console.log(`data = `);
      // console.log(data);
      msg.blocks[3].elements[0].options = data.options;
      // console.log(`new msg =`);
      // console.log(JSON.stringify(msg));
      return msg;
    })
    .then( msg => {
      arg = {
        "response_action": "update",
        "view": msg
      }
      resolve(arg);
    })
    .catch(err => {
      console.error(err);
      reject();
    })

  });

};

const drPrepopulatedURL = (user_id, channel_id, project, date, url) => {
  let metadata = JSON.stringify({"channel_id": channel_id , "viewName": "DR_prepopclosed"});
  let formattedDate = dateFormat(new Date(date), "dd/mm/yyyy");
  
  // const msg = {
  //   "type": "modal",
  //   "title": {
  //     "type": "plain_text",
  //     "text": "Daily Report",
  //     "emoji": true
  //   },
  //   "close": {
  //     "type": "plain_text",
  //     "text": "Close",
  //     "emoji": true
  //   },
  //   "blocks": [
  //     {
  //       "type": "section",
  //       "text": {
  //         "type": "mrkdwn",
  //         "text": "ลิ้งค์สำหรับกรอก Daily Report ค่ะ"
  //       }
  //     },
  //     {
  //       "type": "divider"
  //     },
  //     {
  //       "type": "section",
  //       "text": {
  //         "type": "mrkdwn",
  //         "text": `:cityscape:  <${url}| Jotform URL Link CLICK HERE!>  :cityscape:`
  //       }
  //     },
  //     {
  //       "type": "section",
  //       "text": {
  //         "type": "plain_text",
  //         "text": " ",
  //         "emoji": true
  //       }
  //     },
  //     {
  //       "type": "context",
  //       "elements": [
  //         {
  //           "type": "plain_text",
  //           "text": " ",
  //           "emoji": true
  //         }
  //       ]
  //     }
  //   ],
  //   "private_metadata":metadata,
  // };

  let msg = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Daily Report",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Close",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ลิ้งค์สำหรับกรอก Daily Report"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:building_construction:  โครงการ:  ${project}\n\n :calendar:         วันที่:  ${formattedDate}\n\n :jotform:         URL:  <${url}|DR_${project}_${formattedDate}>`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "ขอบคุณค่ะ",
          "emoji": true
        }
      }
    ],
    "private_metadata":metadata,
  }; 


  return new Promise((resolve, reject) => {
    let arg = {
        "response_action": "update",
        "view": msg
      }
      resolve(arg);
    })
    .catch(err => {
      console.error(err);
      reject();
    })


};

//-----Pre-populated link message-----
const drPrepopMsg = (project, date, url) => {

  let formattedDate = dateFormat(new Date(date), "dd/mm/yyyy");

  const args = {
    "text": "ลิ้งค์กรอก Daily Report ค่ะ",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ลิ้งค์สำหรับกรอก Daily Report"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:building_construction:  โครงการ: ${project}\n\n :calendar:  วันที่:       ${formattedDate}\n\n :jotform:  URL:       <${url}|DR-${project}-${formattedDate}>`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "ขอบคุณค่ะ",
          "emoji": true
        }
      }
    ]
  };

  return args;
};

//-----Approve request msg-----
const drApproveMsg = (DBobj, SLACK_BOT_TOKEN) => {
  // โครงสร้าง Obj ของ DRList
  /*
  let DBobj = {
    "formID": "201670438940455",
    "submissionID": formTitle,
    "number": DRno,
    "name": `${parsed["q98_input98"]}-DR-${parsed["q22_input22"]["year"]}${parsed["q22_input22"]["month"]}${parsed["q22_input22"]["day"]}`,
    "status": "รออนุมัติ",
    "docType": "DR (Daily Report)",
    "project": parsed["q98_input98"],
    "pdfLink": `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`,
    "submitData": {
      "submitterSlackID": parsed["q210_SESlackID"],
      "submitDate": `${parsed["q22_input22"]["day"]}-${parsed["q22_input22"]["month"]}-${parsed["q22_input22"]["year"]}`
    },
    "approveData": {
      "approverSlackID": parsed["q209_PMSlackID"],
      "approveDate": "",
      "approveResult": "",
      "approveComment": ""
    },
    "published channel": []    //Set to array type in case there are more than one channel to send
  };
  */

  var {name, number, project, docType, submitData, pdfLink, approveData, submissionID } = DBobj;

  let approveURL = `https://www.jotform.com/edit/${submissionID}`
  // console.log(`edit submissionURL = ${approveURL}`);

  let msg = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "สวัสดีค่ะ รบกวนขออนุมัติเอกสารด้วยค่ะ"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*ชื่อเอกสาร:*\n${name}`
          },
          {
            "type": "mrkdwn",
            "text": `*หมายเลขเอกสาร:*\n${number}`
          },
          {
            "type": "mrkdwn",
            "text": `*โครงการ*\n${project}`
          },
          {
            "type": "mrkdwn",
            "text": `*ชนิดเอกสาร:*\n${docType}`
          },
          {
            "type": "mrkdwn",
            "text": `*วันที่ขออนุมัติ:*\n${submitData.submitDate}`
          },
          {
            "type": "mrkdwn",
            "text": `*ผู้ส่งขออนุมัติ:*\n<@${submitData.submitterSlackID}>`
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Link เอกสาร:*  <${pdfLink}>`
        }
      },
      {
        "type": "actions",
        "block_id": "DR_approveAction",
        "elements": [
          {
            "type": "button",
            "action_id": "DR_approve",
            "url": `https://www.jotform.com/edit/${submissionID}`,
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Approve"
            },
            "style": "primary",
            "value": "approve"
          },
          {
            "type": "button",
            "action_id": "DR_reject",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Reject"
            },
            "style": "danger",
            "value": "reject"
          }
        ]
      }
    ]
  };

  const args = {
    "token": SLACK_BOT_TOKEN,
    "channel": approveData.approverSlackID,
    "text": "ขออนุมัติเอกสารหน่อยค่ะ :blush:",
    "blocks": JSON.stringify(msg["blocks"])
  };

  return args; 
};

//-----Published msg-----
const drPublishedMsg = (DBobj, channel, SLACK_BOT_TOKEN) => {
  // โครงสร้าง Obj ของ DRList
  /*
  let DBobj = {
    "name": "PLM-DR-20200805",
    "formID": "201670438940455",
    "approveData": {
        "approverSlackID": "U010E15TBU0",
        "approveDate": "2020-08-13",
        "approveComment": "ทดสอบการ commane ของ  PM",
        "approveResult": "AN"
    },
    "publishedChannel": [
        "C01017F0RM0"
    ],
    "submissionID": "4724235956026385529",
    "project": "PLM",
    "docType": "DR (Daily Report)",
    "submitData": {
        "submitDate": "2020-08-05",
        "submitterSlackID": "U010E15TBU0"
    },
    "GGDFolder": "https://drive.google.com/drive/folders/10d6tlye9bx7lBXJzILdCty_56fyb68o9",
    "pdfLink": "https://drive.google.com/file/d/1ZPo9mVJmpHQXpGwdRtLI25Yd_sMDRsZU/view?usp=drivesdk",
    "number": "PLM_DR_0011",
    "status": "อนุมัติตามบันทึก (AN)"
  };
  */

  var { name, formID, approveData, publishedChannel, submissionID, project, docType, submitData, GGDFolder, pdfLink, number, status } = DBobj;

  let statusText = "*สถานะ:*        `"+status+"`"
  let submitdate = submitData.submitDate.split("-");
  let approvedate = approveData.approveDate.split("-");
  let msg ={};

  if (approveData.approveResult == "AP") {
    msg = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":mega:   ขออนุญาตแจ้งเอกสารใหม่ที่อนุมัติแล้วค่ะ  :page_facing_up::sparkles:"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*ชื่อเอกสาร:*  ${name}`
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*ชนิด:*                 ${docType}`
            },
            {
              "type": "mrkdwn",
              "text": `*หมายเลข:*   ${number}`
            },
            {
              "type": "mrkdwn",
              "text": `*โครงการ:*          ${project}`
            },
            {
              "type": "mrkdwn",
              "text": statusText
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*ขอโดย:*       <@${submitData.submitterSlackID}>`
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่อนุมัติ:*       ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*อนุมัติโดย:*  <@${approveData.approverSlackID}>`
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ggd: *Link เอกสาร:* \n<${pdfLink}>`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "ขอบคุณค่ะ"
          }
          
        },
        {
          "type": "divider"
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "plain_text",
              "text": "ขอความกรุณา ไม่แก้ไขเอกสารที่ Approve แล้วนะคะ เนื่องจากจะมี Revision ของไฟล์บน GGD และการแจ้งเตือนซ้ำซ้อนซึ่งอาจทำให้สับสนได้",
              "emoji": true
            }
          ]
        }
      ]
    };  
  }
  else {
    msg = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":mega:   ขออนุญาตแจ้งเอกสารใหม่ที่อนุมัติแล้วค่ะ  :page_facing_up::sparkles:"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*ชื่อเอกสาร:*  ${name}`
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*ชนิด:*                 ${docType}`
            },
            {
              "type": "mrkdwn",
              "text": `*หมายเลข:*   ${number}`
            },
            {
              "type": "mrkdwn",
              "text": `*โครงการ:*          ${project}`
            },
            {
              "type": "mrkdwn",
              "text": statusText
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*ขอโดย:*       <@${submitData.submitterSlackID}>`
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่อนุมัติ:*       ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*อนุมัติโดย:*  <@${approveData.approverSlackID}>`
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Comment:*   ${approveData.approveComment}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ggd: *Link เอกสาร:* \n<${pdfLink}>`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "ขอบคุณค่ะ"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "plain_text",
              "text": "ขอความกรุณา ไม่แก้ไขเอกสารที่ Approve แล้ว เนื่องจากจะมี Revision ของไฟล์บน GGD และการแจ้งเตือนซ้ำซ้อนซึ่งอาจทำให้สับสนได้",
              "emoji": true
            }
          ]
        }
      ]
    };  
  }


  const args = {
    "token": SLACK_BOT_TOKEN,
    "channel": channel,
    "text": "มีเอกสารใหม่ที่อนุมัติแล้วค่ะ",
    "blocks": JSON.stringify(msg["blocks"])
  };

  return args; 
};

//-----send AN message notification to SE-----
const drCommentMsg = (DBobj, channel, SLACK_BOT_TOKEN) => {
  // โครงสร้าง Obj ของ DRList
  /*
  let DBobj = {
    "name": "PLM-DR-20200805",
    "formID": "201670438940455",
    "approveData": {
        "approverSlackID": "U010E15TBU0",
        "approveDate": "2020-08-13",
        "approveComment": "ทดสอบการ commane ของ  PM",
        "approveResult": "AN"
    },
    "publishedChannel": [
        "C01017F0RM0"
    ],
    "submissionID": "4724235956026385529",
    "project": "PLM",
    "docType": "DR (Daily Report)",
    "submitData": {
        "submitDate": "2020-08-05",
        "submitterSlackID": "U010E15TBU0"
    },
    "GGDFolder": "https://drive.google.com/drive/folders/10d6tlye9bx7lBXJzILdCty_56fyb68o9",
    "pdfLink": "https://drive.google.com/file/d/1ZPo9mVJmpHQXpGwdRtLI25Yd_sMDRsZU/view?usp=drivesdk",
    "number": "PLM_DR_0011",
    "status": "อนุมัติตามบันทึก (AN)"
  };
  */

  var { name, formID, approveData, publishedChannel, submissionID, project, docType, submitData, GGDFolder, pdfLink, number, status } = DBobj;

  let statusText = "*สถานะ:*        `"+status+"`"
  let submitdate = submitData.submitDate.split("-");
  let approvedate = approveData.approveDate.split("-");

  let msg = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "รบกวนรีวิวคอมเม้นท์เอกสารที่ *_อนุมัติตามบันทึก (AN)_* อีกครั้งค่ะ  :eyes::exclamation: \nเผื่อว่าจะต้องมีการเตรียมข้อมูลเพิ่มเติม"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*ชื่อเอกสาร:*  ${name}`
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*ชนิด:*                 ${docType}`
          },
          {
            "type": "mrkdwn",
            "text": `*หมายเลข:*   ${number}`
          },
          {
            "type": "mrkdwn",
            "text": `*โครงการ:*          ${project}`
          },
          {
            "type": "mrkdwn",
            "text": statusText
          },
          {
            "type": "mrkdwn",
            "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
          },
          {
            "type": "mrkdwn",
            "text": `*ขอโดย:*       <@${submitData.submitterSlackID}>`
          },
          {
            "type": "mrkdwn",
            "text": `*วันที่อนุมัติ:*       ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
          },
          {
            "type": "mrkdwn",
            "text": `*อนุมัติโดย:*  <@${approveData.approverSlackID}>`
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Comment:*   ${approveData.approveComment}`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:ggd: *Link เอกสาร:* \n<${pdfLink}>`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:ggd: *Folder ที่เก็บเอกสาร:* \n<${GGDFolder}>`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ขอบคุณค่ะ"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": "ขอความกรุณา ไม่แก้ไขเอกสารที่ Approve แล้ว เนื่องจากจะมี Revision ของไฟล์บน GGD และการแจ้งเตือนซ้ำซ้อนซึ่งอาจทำให้สับสนได้",
            "emoji": true
          }
        ]
      }
    ]
  };


  const args = {
    "token": SLACK_BOT_TOKEN,
    "channel": channel,
    "text": "รบกวนรีวิวคอมเม้นท์เอกสารสถานะ AN ด้วยค่ะ",
    "blocks": JSON.stringify(msg["blocks"])
  };

  return args; 
};

//-----FileUpdate after published notification-----
const drFileUpdateMsg = (DBobj, channel, SLACK_BOT_TOKEN) => {
  // โครงสร้าง Obj ของ DRList
  /*
  let DBobj = {
    "name": "PLM-DR-20200805",
    "formID": "201670438940455",
    "approveData": {
        "approverSlackID": "U010E15TBU0",
        "approveDate": "2020-08-13",
        "approveComment": "ทดสอบการ commane ของ  PM",
        "approveResult": "AN"
    },
    "publishedChannel": [
        "C01017F0RM0"
    ],
    "submissionID": "4724235956026385529",
    "project": "PLM",
    "docType": "DR (Daily Report)",
    "submitData": {
        "submitDate": "2020-08-05",
        "submitterSlackID": "U010E15TBU0"
    },
    "GGDFolder": "https://drive.google.com/drive/folders/10d6tlye9bx7lBXJzILdCty_56fyb68o9",
    "pdfLink": "https://drive.google.com/file/d/1ZPo9mVJmpHQXpGwdRtLI25Yd_sMDRsZU/view?usp=drivesdk",
    "number": "PLM_DR_0011",
    "status": "อนุมัติตามบันทึก (AN)",
    "fileUpdated": false
  };
  */

  var { name, formID, approveData, publishedChannel, submissionID, project, docType, submitData, GGDFolder, pdfLink, number, status, fileUpdated } = DBobj;

  let statusText = "*สถานะ:*        `"+status+"`"
  let submitdate = submitData.submitDate.split("-");
  let approvedate = approveData.approveDate.split("-");
  let msg ={};

  if (approveData.approveResult == "AP") {
    msg = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":mega: @channel ขออนุญาตแจ้ง *_เอกสารที่เปลี่ยนแปลงหลังการ publish_* ค่ะ"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*ชื่อเอกสาร:*  ${name}`
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*ชนิด:*                 ${docType}`
            },
            {
              "type": "mrkdwn",
              "text": `*หมายเลข:*   ${number}`
            },
            {
              "type": "mrkdwn",
              "text": `*โครงการ:*          ${project}`
            },
            {
              "type": "mrkdwn",
              "text": statusText
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*ขอโดย:*       <@${submitData.submitterSlackID}>`
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่อนุมัติ:*       ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*อนุมัติโดย:*  <@${approveData.approverSlackID}>`
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ggd: *Link เอกสารใหม่:* \n<${pdfLink}>`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "ขอบคุณค่ะ"
          }
          
        },
        {
          "type": "divider"
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "plain_text",
              "text": "ขอความกรุณา ไม่แก้ไขเอกสารที่ Approve แล้วนะคะ เนื่องจากจะมี Revision ของไฟล์บน GGD และการแจ้งเตือนซ้ำซ้อนซึ่งอาจทำให้สับสนได้",
              "emoji": true
            }
          ]
        }
      ]
    };  
  }
  else {
    msg = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":mega: @channel ขออนุญาตแจ้ง *_เอกสารที่เปลี่ยนแปลงหลังการ publish_* ค่ะ"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*ชื่อเอกสาร:*  ${name}`
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*ชนิด:*                 ${docType}`
            },
            {
              "type": "mrkdwn",
              "text": `*หมายเลข:*   ${number}`
            },
            {
              "type": "mrkdwn",
              "text": `*โครงการ:*          ${project}`
            },
            {
              "type": "mrkdwn",
              "text": statusText
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*ขอโดย:*       <@${submitData.submitterSlackID}>`
            },
            {
              "type": "mrkdwn",
              "text": `*วันที่อนุมัติ:*       ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
            },
            {
              "type": "mrkdwn",
              "text": `*อนุมัติโดย:*  <@${approveData.approverSlackID}>`
            }
          ]
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Comment:*   ${approveData.approveComment}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:ggd: *Link เอกสาร:* \n<${pdfLink}>`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "ขอบคุณค่ะ"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "plain_text",
              "text": "ขอความกรุณา ไม่แก้ไขเอกสารที่ Approve แล้ว เนื่องจากจะมี Revision ของไฟล์บน GGD และการแจ้งเตือนซ้ำซ้อนซึ่งอาจทำให้สับสนได้",
              "emoji": true
            }
          ]
        }
      ]
    };  
  }


  const args = {
    "token": SLACK_BOT_TOKEN,
    "channel": channel,
    "text": "มีเอกสารใหม่ที่อนุมัติแล้วค่ะ",
    "blocks": JSON.stringify(msg["blocks"])
  };

  return args; 
};

//-----Reject comment input modal-----
const drRejectCommentMsg = (triggerID, SLACK_BOT_TOKEN, metadata) => {

  const msg = {
    "private_metadata":"",
    "type": "modal",
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true
    },
    "title": {
      "type": "plain_text",
      "text": "เหตุผลที่ reject",
      "emoji": true
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "DR_approveAction",
        "label": {
          "type": "plain_text",
          "text": "กรุณากรอกเหตุผลที่ reject",
          "emoji": true
        },
        "element": {
          "type": "plain_text_input",
          "action_id": "DR_rejectComment",
          "multiline": true
        }
      }
    ]
  };

  if(metadata) {
    msg.private_metadata = JSON.stringify(metadata);
  }

  const args = {
    "token": SLACK_BOT_TOKEN,
    "trigger_id": triggerID,
    "view": JSON.stringify(msg)
  };
  
  console.log(`args = ${JSON.stringify(args)}`);

  return args;
};


//-----Send 'reject' message to submitter-----
const drRejectMsg = (DBobj, channel, SLACK_BOT_TOKEN) => {
  // โครงสร้าง Obj ของ DRList
  /*
  let DBobj = {
    "name": "PLM-DR-20200805",
    "formID": "201670438940455",
    "approveData": {
        "approverSlackID": "U010E15TBU0",
        "approveDate": "2020-08-13",
        "approveComment": "ทดสอบการ commane ของ  PM",
        "approveResult": "AN"
    },
    "publishedChannel": [
        "C01017F0RM0"
    ],
    "submissionID": "4724235956026385529",
    "project": "PLM",
    "docType": "DR (Daily Report)",
    "submitData": {
        "submitDate": "2020-08-05",
        "submitterSlackID": "U010E15TBU0"
    },
    "GGDFolder": "https://drive.google.com/drive/folders/10d6tlye9bx7lBXJzILdCty_56fyb68o9",
    "pdfLink": "https://drive.google.com/file/d/1ZPo9mVJmpHQXpGwdRtLI25Yd_sMDRsZU/view?usp=drivesdk",
    "number": "PLM_DR_0011",
    "status": "อนุมัติตามบันทึก (AN)"
  };
  */

  var { name, formID, approveData, publishedChannel, submissionID, project, docType, submitData, GGDFolder, pdfLink, number, status } = DBobj;

  let statusText = "*สถานะ:*         `"+status+"`"
  let submitdate = submitData.submitDate.split("-");
  let approvedate = approveData.approveDate.split("-");

  let msg = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "รบกวนแก้ไขเอกสารที่ *_ไม่อนุมัติ (RE)_* อีกครั้งค่ะ  :eyes::exclamation:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*ชื่อเอกสาร:*  ${name}`
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*ชนิด:*                 ${docType}`
          },
          {
            "type": "mrkdwn",
            "text": `*หมายเลข:*    ${number}`
          },
          {
            "type": "mrkdwn",
            "text": `*โครงการ:*          ${project}`
          },
          {
            "type": "mrkdwn",
            "text": statusText
          },
          {
            "type": "mrkdwn",
            "text": `*วันที่ขออนุมัติ:*  ${submitdate[2]}-${submitdate[1]}-${submitdate[0]}`
          },
          {
            "type": "mrkdwn",
            "text": `*ขอโดย:*        <@${submitData.submitterSlackID}>`
          },
          {
            "type": "mrkdwn",
            "text": `*วันที่ตอบกลับ:*  ${approvedate[2]}-${approvedate[1]}-${approvedate[0]}`
          },
          {
            "type": "mrkdwn",
            "text": `*ปฏิเสธโดย:*  <@${approveData.approverSlackID}>`
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*เหตุผลที่ไม่อนุมัติ:*   ${approveData.approveComment}`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:jotform: *Link สำหรับแก้ไขเอกสาร:* \n<https://www.jotform.com/edit/${submissionID}>`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ขอบคุณค่ะ"
        }
      }
    ]
  };


  const args = {
    "token": SLACK_BOT_TOKEN,
    "channel": channel,
    "text": "รบกวนแก้ไขเอกสารสถานะ RE ด้วยค่ะ",
    "blocks": JSON.stringify(msg["blocks"])
  };

  return args; 
};


//=============================DECLARE obj 'RB message'===============================
//-----Pre-populate URL modal------
const rbMsg = async (user_id, triggerID) => {
  
  //1. get all projects from Airtable
  const projects = await baseDR("รายละเอียดโครงการ").select({maxRecords: 100, view: "Jotform-Project list", fields: ["Name", "ชื่อย่อโครงการ", "RecordID"]}).all();
  //print test
  console.log(`projects from Airtable`)
  projects.forEach((r) => console.log(JSON.stringify(r.fields)));

  let welcomeText = `สวัสดีค่าคุณ<@${user_id}>  มาทำ Requested Budget กันนะคะ :heart:`
  let metadata = JSON.stringify({"viewName": "RB_prepopInput", "MS400baseID": ""});

  const msg = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Requested Budget",
      "emoji": true
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
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
          "text": welcomeText
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "input",
        "block_id": "RB_inputModal-project",
        "dispatch_action": true,
        "element": {
          "type": "static_select",
          "placeholder": {
            "type": "plain_text",
            "text": "เลือกโครงการ",
            "emoji": true
          },
          "options": [
          ]
        },
        "label": {
          "type": "plain_text",
          "text": ":building_construction:  เลือกโครงการ",
          "emoji": true
        }
      }
  
    ],
    "private_metadata":metadata
  };


  //layout projectData
  let data = projects.map((n) => {

    return {
    "text": {
      "type": "plain_text",
      "text": `${n.fields.Name}`,
      "emoji": true
    },
    "value": `{"ABB": "${n.fields["ชื่อย่อโครงการ"]}" , "ID": "${n.id}"}`
  }});
  // console.log(`layouted projects = `);
  // data.forEach(n => console.log(JSON.stringify(n)));
  

  //add into msg blocks
  msg.blocks[2].element.options = data;
  // console.log(`new msg =`);
  // console.log(JSON.stringify(msg));

  const args = {
    "token": process.env.SLACK_BOT_TOKEN,
    "trigger_id": triggerID,
    "view": JSON.stringify(msg)
  };

  // open modal
  try {
    const result = axios.post(`${apiUrl}/views.open`, qs.stringify(args));
    return result;
  } catch (error) {
    console.error(error);
  }

};
//-----rbMsg template for update-------
const rbPrepopulatedURL = (project, refDoc, URL, MS400baseID) => {
  let metadata = JSON.stringify({"viewName": "RB_prepopInput", "MS400baseID": MS400baseID});

  let msg = {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Requested Budget",
      "emoji": true
    },
    "close": {
      "type": "plain_text",
      "text": "Close",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ลิ้งค์สำหรับกรอก *Requested Budget*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:building_construction:            โครงการ:  ${project}\n\n :calendar:   เอกสารอ้างอิง:  ${refDoc}\n\n :jotform:                  URL:  <${URL}>`
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": " ",
            "emoji": true
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "ขอบคุณค่ะ",
          "emoji": true
        }
      }
    ],
    "private_metadata":metadata,
  }; 

  let arg = {
    "response_action": "update",
    "view": msg
  }

  return arg;
};








//=============================DECLARE obj 'help message'=============================
const helpMsg = () => {
  const msg = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "ฮั่นแน่! ยังจำคำสั่งไม่ได้ใช่ไหมคะ? ลองพิมพ์ตามคำสั่งด้านล่างหรือกดปุ่มก็ได้ค่ะ:relaxed:"
        },
        "accessory": {
          "type": "button",
          "action_id": "deletemessage",
          "text": {
            "type": "plain_text",
            "text": "ปิด :x:",
            "emoji": true
          },
          "value": "deletemessage"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":clipboard: *ทำบันทึกการประชุม (MOM)* \n        พิมพ์  `/kdc mom`"
        },
        "accessory": {
          "type": "button",
          "url": "https://form.jotform.com/201602931022439",
          "action_id": "open_momMsg",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Minute of Meeting"
          },
          "value": "open_momMsg"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":clipboard: *ทำ Daily Report (DR)* \n        พิมพ์  `/kdc dr`"
        },
        "accessory": {
          "type": "button",
          "action_id": "open_drMsg",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Daily Report"
          },
          "value": "open_drMsg"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":clipboard: *ทำ Requested Budget (RB)* \n        พิมพ์  `/kdc rb`"
        },
        "accessory": {
          "type": "button",
          "action_id": "open_rbMsg",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Requested Budget"
          },
          "value": "open_rbMsg"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "TIPS: การฝึกจำคีย์ลัดจะทำให้การเรียกคำสั่งเร็วขึ้นนะคะ มาฝึกจำกันนะคะ :hugging_face:"
          }
        ]
      }
    ]
  }
  return msg;
};


//=============================DECLARE obj 'delete message'=============================
//(PROMISE METHOD = WORKS!)
/*
function delMsg(response_url) {
  const msg = {
    "delete_original": "true"
    };
  
  return new Promise((resolve, reject) => {
    if (response_url) {
      //const result = axios.post(response_url, msg);
      axios.post(response_url, msg);
      console.log(result);
        resolve();
      }
    else {
      reject();
    }
  }).catch(err => {
    // console.log(err);
  })
};
*/

//(ALSO TYPICAL METHOD WORKS, TOO!)
function delMsg(response_url) {
  const msg = {
    "delete_original": "true"
    };
	const result = axios.post(response_url, msg);
	return result.data;
};

//(ALSO TYPICAL METHOD WORKS, TOO!)
function updateMsg(response_url, msg) {
  msg.replace_original = "true";
  // console.log(msg);
	// const result = axios.post(response_url, msg);
	return axios.post(response_url, msg)
};

//send ephemeral message by chat.postEphemeral WEB API
function sendEphemeralMsg(user_id, channel_id, msg, SLACK_BOT_TOKEN) {
  try{
    const args = {
          "token": SLACK_BOT_TOKEN,
          "channel": channel_id,
          "user": user_id,
          "block": JSON.stringify(msg["blocks"])
          // "text": "test"
      };

      // console.log(`args = `);
      // console.log(args);
  
    return new Promise((resolve, reject) => {
      const result = axios.post(`${apiUrl}/chat.postEphemeral`, qs.stringify(args));
      resolve(JSON.stringify(result));
    })
  }
  catch(err) {
    console.error(err);
  }
    
    
}


//=============================EXPORT FUNCTIONS=============================
module.exports = { 
  helpMsg, delMsg, updateMsg, momMsg, sendEphemeralMsg, 
  drMsg, drErrorMsg, drPrepopulatedURL, drPrepopMsg, drApproveMsg, drPublishedMsg, drCommentMsg, drFileUpdateMsg, drRejectCommentMsg , drRejectMsg, 
  rbMsg, rbPrepopulatedURL};

