  const momMessageInitial = {
	"blocks": [
    //first block from 'มาบันทึกการประชุมกันเถอะ' => 
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
    //pull gcal list in this section
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
        //make gcal list here**********************************************
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#1",
							"emoji": true
						},
						"value": "PLM: weekly meeting#1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#2",
							"emoji": true
						},
						"value": "PLM: weekly meeting#2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "KTH: weekly meeting#1",
							"emoji": true
						},
						"value": "KTH: weekly meeting#1"
					}
				]
			}
		},
    //NOTE:
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
    //'รายละเอียดการประชุม'
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
    //update meeting_data here*******************************
		{
			"type": "section",
			"block_id": "meeting_data",
			"text": {
				"type": "mrkdwn",
				"text": "*- ชื่อการประชุม : *\n *- วัน-เวลา : * \n *- สถานที่ : *\n *- ผู้เข้าร่วม : *\n *- หัวข้อการประชุม/รายละเอียดการประชุม : *\n "
			}
		},
		{
			"type": "divider"
		},
    //followupTask block
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
    //select_task from Airtable block
		{
			"type": "actions",
			"elements": [
				{
					"type": "static_select",
					"action_id": "select_task",
					"placeholder": {
						"type": "plain_text",
						"text": "เลือกงานติดตาม",
						"emoji": true
					},
					"options": [
            //update airtable task list here********************************************
						{
							"text": {
								"type": "plain_text",
								"text": "HO9: Teerapon ส่ง MP วันที่ 1/6/2020",
								"emoji": true
							},
							"value": "HO9: Teerapon ส่ง MP วันที่ 1/6/2020"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "PLM: Pattarin ทำแบบเสริมเหล็กกลีบดอก 1 วันที่ 25/5/2020",
								"emoji": true
							},
							"value": "PLM: Pattarin ทำแบบเสริมเหล็กกลีบดอก 1 วันที่ 25/5/2020"
						}
					]
				},
				{
					"type": "button",
					"action_id": "task_result_completed",
					"text": {
						"type": "plain_text",
						"text": "เสร็จแล้ว",
						"emoji": true
					},
					"value": "task_completed",
					"style": "primary"
				},
				{
					"type": "button",
					"action_id": "task_result_notcompleted",
					"text": {
						"type": "plain_text",
						"text": "ยังไม่เสร็จ",
						"emoji": true
					},
					"value": "task_in_progress",
					"style": "danger"
				}
			]
		},
    //followupTask summary here*****************************************
		{
			"type": "section",
			"block_id": "task_result",
			"text": {
				"type": "mrkdwn",
				"text": "*Task:* PLM: Pattarin ทำแบบเสริมเหล็กกลีบดอก 1 วันที่ 25/5/2020\n *Update:* เสร็จแล้ว ส่งแล้ววันที่ 20/5/2020"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "followuptask1",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "แก้ไข",
							"emoji": true
						},
						"value": "edit_followuptask"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ลบ",
							"emoji": true
						},
						"value": "delete_followuptask"
					}
				]
			}
		},
		{
			"type": "divider"
		},
    //agenda block STARTS HERE
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
    //note header
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":memo: *Note*"
			}
		},
    //push note list here*******************************************
		{
			"type": "section",
			"block_id": "note1",
			"text": {
				"type": "mrkdwn",
				"text": "- ทดสอบโน๊ต 1"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_note1",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "แก้ไข",
							"emoji": true
						},
						"value": "edit_note"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ลบ",
							"emoji": true
						},
						"value": "delete_note"
					}
				]
			}
		},
		{
			"type": "section",
			"block_id": "note2",
			"text": {
				"type": "mrkdwn",
				"text": "- ทดสอบโน๊ต 2"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_note2",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "แก้ไข",
							"emoji": true
						},
						"value": "edit_note"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ลบ",
							"emoji": true
						},
						"value": "delete_note"
					}
				]
			}
		},
    //decision header
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		},
    //push decision list here*********************************************
		{
			"type": "section",
			"block_id": "decision1",
			"text": {
				"type": "mrkdwn",
				"text": "- ข้อสรุป 1"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_decision1",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "แก้ไข",
							"emoji": true
						},
						"value": "edit_decision"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ลบ",
							"emoji": true
						},
						"value": "delete_decision"
					}
				]
			}
		},
    //task header
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
			}
		},
    //push task list here*********************************************
		{
			"type": "section",
			"block_id": "task1",
			"text": {
				"type": "mrkdwn",
				"text": "- ทำต่อ 1"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_task1",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "แก้ไข",
							"emoji": true
						},
						"value": "edit_task"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "ลบ",
							"emoji": true
						},
						"value": "delete_task"
					}
				]
			}
		},
		{
			"type": "divider"
		},
    //agenda block ENDS HERE**********************************************
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