//=============================Initialize=============================
const axios = require('axios'); 
//const qs = require('qs');

const apiUrl = 'https://slack.com/api';




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
const drMsg = () => {
	const msg = {
	  response_type: "ephemeral",
	  blocks: [
		  {
			  "type": "section",
			  "text": {
				  "type": "mrkdwn",
				  "text": "สวัสดีค่า มากรอก Daily Report กันน้าา :heart:"
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
				  "text": ":point_right:  <https://form.jotform.com/201670438940455>"
			  }
		  }
	  ]
	};
	return msg;
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
						"url": "https://form.jotform.com/201670438940455",
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


//=============================EXPORT FUNCTIONS=============================
module.exports = {helpMsg, delMsg, momMsg, drMsg};