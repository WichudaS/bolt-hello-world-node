//=============================Initialize=============================
const axios = require('axios'); 
const dateFormat = require("dateformat");
const qs = require('qs');

const fs = require('./firestore');


const apiUrl = 'https://slack.com/api';




//====================DECLARE VARIABLE TO BE USED IN THIS FILE======================

var today = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
// console.log(today);

var initialDatepicker = dateFormat(today, "yyyy-mm-dd");
// console.log(`initialDatepicker = ${initialDatepicker}`);

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
const drMsg = (user_id, channel_id, triggerID, SLACK_BOT_TOKEN) => {
  let welcomeText = `สวัสดีค่าคุณ<@${user_id}>  มากรอก Daily Report กันน้าา :heart:`
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

    fs.db.doc('slack-external-menus/project list').get()
    .then(documentSnapshot => {
      let data = documentSnapshot.data();
      console.log(`Retrived data = ${JSON.stringify(data)}`);
      console.log(`data = `);
      console.log(data);
      msg.blocks[3].elements[0].options = data.options;
      console.log(`new msg =`);
      console.log(JSON.stringify(msg));
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
  let welcomeText = `สวัสดีค่าคุณ<@${user_id}>  มากรอก Daily Report กันน้าา :heart:`
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
      console.log(`Retrived data = ${JSON.stringify(data)}`);
      console.log(`data = `);
      console.log(data);
      msg.blocks[3].elements[0].options = data.options;
      console.log(`new msg =`);
      console.log(JSON.stringify(msg));
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


const drPrepopulatedURL = (user_id, channel_id, URL) => {
  let metadata = JSON.stringify({"channel_id": channel_id , "viewName": "DR_prepopclosed"});
  
  
  const msg = {
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
          "text": `:cityscape:  <${URL}|Daily Report JotForm URL>  :cityscape:`
        }
      }
    ],
    "private_metadata":metadata,
  };

  return new Promise((resolve, reject) => {
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


};

//=============================DECLARE obj 'help message'=============================
const helpMsg = () => {
  const msg = {
			"response_type": "ephemeral",
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
						"text": ":clipboard: *ทำบันทึกการประชุม (MOM)* \n พิมพ์  `/kdc mom`"
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
						"text": ":clipboard: *ทำ Daily Report (DR)* \n พิมพ์  `/kdc dr`"
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
    };
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
      //console.log(result);
        resolve();
      }
    else {
      reject();
    }
  }).catch(err => {
    console.log(err);
  })
};
*/

//(ALSO TYPICAL METHOD WORKS, TOO!)
function delMsg(response_url) {
  const msg = {
    "delete_original": "true"
    };
	const result = axios.post(response_url, msg);
	return result;
};

//(ALSO TYPICAL METHOD WORKS, TOO!)
function updateMsg(response_url, msg) {
  msg.replace_original = "true";
  console.log(msg);
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

      console.log(`args = `);
      console.log(args);
  
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
module.exports = {helpMsg, delMsg, updateMsg, momMsg, drMsg, drErrorMsg, sendEphemeralMsg, drPrepopulatedURL};

