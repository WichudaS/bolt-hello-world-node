  const momMsgInit = {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "มาบันทึกการประชุมกันเถอะ :blush:"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": " "
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *เลือกชื่อการประชุมจากรายการ*"
			},
			"accessory": {
				"type": "static_select",
				"action_id": "select_meeting",
				"placeholder": {
					"type": "plain_text",
					"text": "เลือกการประชุม",
					"emoji": true
				},

				"options": [
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
			"type": "divider"
		},
	  {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":star2: *รายละเอียดการประชุม*"
			},
			"accessory": {
				"type": "button",
				"action_id": "edit_meeting_data",
				"text": {
					"type": "plain_text",
					"text": "แก้ไขข้อมูล",
					"emoji": true
				},
				"value": "edit_meeting_data"
			}
		},
  	{
			"type": "section",
			"block_id": "meeting_data",
			"text": {
				"type": "mrkdwn",
				"text": "*- ชื่อการประชุม :* \n *- วัน-เวลา :* \n *- สถานที่ :* \n *- ผู้เข้าร่วม :* \n *- หัวข้อการประชุม/รายละเอียดการประชุม :* \n "
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":zero: *ติดตามความคืบหน้า* _(ถ้าไม่มีให้เว้นว่าง)_"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "followup_task",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "เพิ่มงานติดตาม",
							"emoji": true
						},
						"value": "add_followup_task"
					}
				]
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":one: *หัวข้อการประชุมที่ 1*"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "agenda1",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": ":zap: แก้ไขหัวข้อการประชุม",
							"emoji": true
						},
						"value": "edit_agenda_name"
					},
					{
						"text": {
							"type": "plain_text",
							"text": ":memo: เพิ่ม Note",
							"emoji": true
						},
						"value": "add_note"
					},
					{
						"text": {
							"type": "plain_text",
							"text": ":round_pushpin: เพิ่มข้อสรุป",
							"emoji": true
						},
						"value": "add_decision"
					},
					{
						"text": {
							"type": "plain_text",
							"text": ":construction_worker: เพิ่มสิ่งที่ต้องทำต่อ",
							"emoji": true
						},
						"value": "add_task"
					},
					{
						"text": {
							"type": "plain_text",
							"text": ":wastebasket: ลบหัวข้อการประชุมนี้",
							"emoji": true
						},
						"value": "delete_agenda"
					}
				]
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":memo: *Note*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
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
					"action_id": "add_agenda",
					"text": {
						"type": "plain_text",
						"text": ":heavy_plus_sign: เพิ่มหัวข้อประชุมใหม่",
						"emoji": true
					},
					"value": "add_agenda"
				},
				{
					"type": "button",
					"action_id": "submit_mom",
					"text": {
						"type": "plain_text",
						"text": ":heavy_check_mark: ส่ง MOM :heavy_check_mark:",
						"emoji": true
					},
					"style": "primary",
					"value": "submit_mom"
				}
			]
		}
	]
};