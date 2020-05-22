//=============================INITIALIZE APP=============================
const app = require('./index');
const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://slack.com/api';




//=============================DECLARE FUNCTION 'openModal'=============================
const openModal = async(trigger_id) => {

  const modal = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "บันทึกการประชุม (MOM)",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "ส่ง MOM",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "ยกเลิก",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "มาบันทึกการประชุมกันเถอะ :blush:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: เลือกชื่อการประชุมจากรายการ"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "ชื่อการประชุม",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#1",
							"emoji": true
						},
						"value": "choice1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#2",
							"emoji": true
						},
						"value": "choice2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "KTH: weekly meeting#1",
							"emoji": true
						},
						"value": "choice3"
					}
				]
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "NOTE: List การประชุมมาจากการประชุม 30 วันล่าสุดใน Google Calendar ของบริษัท"
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": ":clipboard: รายละเอียดการประชุม",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "- ชื่อการประชุม :\n - วัน-เวลา : \n - สถานที่ : \n - ผู้เข้าร่วม : \n - หัวข้อการประชุม/รายละเอียดการประชุม : \n "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":pushpin: *หัวข้อการประชุมที่ 1*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input"
			},
			"label": {
				"type": "plain_text",
				"text": "ชื่อหัวข้อ",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"multiline": true
			},
			"label": {
				"type": "plain_text",
				"text": "รายละเอียด",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
          "action_id": "addNextAction",
					"text": {
						"type": "plain_text",
						"text": ":fire: เพิ่ม Next Action",
						"emoji": true
					},
					"value": "addNextAction"
				},
				{
					"type": "button",
          "action_id": "addNewAgenda",
					"text": {
						"type": "plain_text",
						"text": ":heavy_plus_sign: เพิ่มหัวข้อการประชุมใหม่",
						"emoji": true
					},
					"value": "addNewAgenda"
				}
			]
		}
	]
};
  
  const args = {
    token: process.env.SLACK_BOT_TOKEN,
    trigger_id: trigger_id,
    view: JSON.stringify(modal)
  };
  
  const result = await axios.post(`${apiUrl}/views.open`, qs.stringify(args));
//  console.log("========== OPEN_MODAL RESPONSE.data STARTS ==========");
//  console.log(result.data);
//  console.log("========== OPEN_MODAL RESPONSE.data ENDS ==========")
  return result;
};




//=============================DECLARE FUNCTION 'updateModal'=============================
const updateModal = async(viewID) => {

  const modal = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "บันทึกการประชุม (MOM)",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "ส่ง MOM",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "ยกเลิก",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "มาบันทึกการประชุมกันเถอะ :blush: (*UPDATE!!!!*)"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: เลือกชื่อการประชุมจากรายการ"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "ชื่อการประชุม",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#1",
							"emoji": true
						},
						"value": "choice1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#2",
							"emoji": true
						},
						"value": "choice2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "KTH: weekly meeting#1",
							"emoji": true
						},
						"value": "choice3"
					}
				]
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "NOTE: List การประชุมมาจากการประชุม 30 วันล่าสุดใน Google Calendar ของบริษัท"
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": ":clipboard: รายละเอียดการประชุม",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "- ชื่อการประชุม :\n - วัน-เวลา : \n - สถานที่ : \n - ผู้เข้าร่วม : \n - หัวข้อการประชุม/รายละเอียดการประชุม : \n "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":pushpin: *หัวข้อการประชุมที่ 1*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input"
			},
			"label": {
				"type": "plain_text",
				"text": "ชื่อหัวข้อ",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"multiline": true
			},
			"label": {
				"type": "plain_text",
				"text": "รายละเอียด",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
          "action_id": "addNextAction",
					"text": {
						"type": "plain_text",
						"text": ":fire: เพิ่ม Next Action",
						"emoji": true
					},
					"value": "addNextAction"
				},
				{
					"type": "button",
          "action_id": "addNewAgenda",
					"text": {
						"type": "plain_text",
						"text": ":heavy_plus_sign: เพิ่มหัวข้อการประชุมใหม่",
						"emoji": true
					},
					"value": "addNewAgenda"
				}
			]
		}
	]
};
  
  const args = {
    token: process.env.SLACK_BOT_TOKEN,
    view_id: viewID,
    view: JSON.stringify(modal)
  };
  
  const result = await axios.post(`${apiUrl}/views.update`, qs.stringify(args));
//  console.log("========== OPEN_MODAL RESPONSE.data STARTS ==========");
//  console.log(result.data);
//  console.log("========== OPEN_MODAL RESPONSE.data ENDS ==========")
  return result;
};




//=============================EXPORT FUNCTIONS=============================
module.exports = {openModal,updateModal};