//=============================Initialize=============================
//const axios = require("axios");
//const qs = require("qs");

const apiUrl = "https://slack.com/api";

//=============================DECLARE obj 'help message'=============================
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


//=============================EXPORT FUNCTIONS=============================
module.exports = {momMsg};