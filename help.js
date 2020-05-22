//=============================Initialize=============================
const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://slack.com/api';






//=============================DECLARE obj 'help message'=============================
const helpMsg = () => {
  const msg = {
      "response_type": "ephemeral",
      "text": "This is a help page",
      "blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "ยังจำคำสั่งไม่ได้ใช่ไหมคะ? ลองพิมพ์ตามคำสั่งด้านล่างหรือกดปุ่มก็ได้ค่ะ:relaxed:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":clipboard: *ทำบันทึกการประชุม (MOM)* \n พิมพ์  `/bolt mom`"
			},
			"accessory": {
        "type": "button",
        "action_id": "open_momMsg",
				"text": {
					"type": "plain_text",
					"emoji": true,
					"text": "ทำ MOM"
				},
        "value": "openmodal"
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
					"text": "TIPS: การฝึกจำคีย์ลัดจะทำให้การเรียกคำสั่งเร็วขึ้นนะคะ มาฝึกจำกันเนอะ:hugging_face:"
				}
			]
		}
	] 
    };
  return msg;
};




//=============================EXPORT FUNCTIONS=============================
module.exports = { helpMsg};