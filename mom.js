//=============================Initialize=============================
const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://slack.com/api';





//=============================build 'MOM message'=============================
//declare Initial message variable=============================


const logData = () => {
  return newblock;
};




//แบ่ง chunk
const momMessageInitial = {
	"blocks": [
//****************************************Chunk#1****************************************
    //OK!
/*
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
				"options": [
        //Chunk#1.1 ==>  make gcal list here**********************************************  
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#1",
							"emoji": true
						},
						"value": "0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#2",
							"emoji": true
						},
						"value": "1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "KTH: weekly meeting#1",
							"emoji": true
						},
						"value": "2"
					}
        //Chunk#1.1 ENDS**********************************************    
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
   */ 
    
//****************************************Chunk#2**************************************** 
    //OK!
/*    
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
*/
//****************************************Chunk#3  ==>  update meeting_data here **************************
 //OK!
    /*
		{
			"type": "section",
			"block_id": "meeting_data",
			"text": {
				"type": "mrkdwn",
				"text": "*- ชื่อการประชุม : *\n *- วัน-เวลา : * \n *- สถานที่ : *\n *- ผู้เข้าร่วม : *\n *- หัวข้อการประชุม/รายละเอียดการประชุม : *\n "
			}
		},
    */
//****************************************Chunk#4****************************************    
	//OK
    /*
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
   */ 
//****************************************Chunk#5 ==> followupTask summary here****************************************    
	//OK
    /*	{
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
		},*/
//****************************************Chunk#6 AGENDA****************************************     
   //OK
    /*
    //Chunk#6.1 ==> header*****************************************
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
    //Chunk#6.2 ==> push note list here*****************************************
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
    //Chunk#6.3 ==> decision header*****************************************
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		},
    //Chunk#6.4 ==> push decision list here*****************************************
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
    //Chunk#6.5 ==> task header*****************************************
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
			}
		},
    //Chunk#6.6 ==> push task list here*****************************************
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
    */
//****************************************Chunk#7****************************************    
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



//rebuild block!
//****************************************Chunk#1****************************************
    //first block from 'มาบันทึกการประชุมกันเถอะ' => 

const gcalList = [
    					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#1",
							"emoji": true
						},
						"value": "0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "PLM: weekly meeting#2",
							"emoji": true
						},
						"value": "1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "KTH: weekly meeting#1",
							"emoji": true
						},
						"value": "2"
					}
  ];

const chunk1 = [
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
				"options": gcalList
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
		}
];

//****************************************Chunk#2****************************************   
const chunk2 = [
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
		} 
];

//****************************************Chunk#3  ==>  update meeting_data here ****************************************    
var meeting_data = {
  meetingName: "",
  dateTime: "",
  place: "",
  attendees: "",
  meetingDescription: ""
}
var meeting_data_text = String(" *- ชื่อการประชุม :* " + meeting_data.meetingName + "\n *- วัน-เวลา :* "+ meeting_data.dateTime +"\n *- สถานที่ :* "+ meeting_data.place +"\n *- ผู้เข้าร่วม :* "+ meeting_data.attendees +"\n *- หัวข้อการประชุม/รายละเอียดการประชุม :* \n " + meeting_data.meetingDescription);

const chunk3 = [
 		{
			"type": "section",
			"block_id": "meeting_data",
			"text": {
				"type": "mrkdwn",
				"text": meeting_data_text
			}
		} 
];

//****************************************Chunk#4****************************************    
const chunk4 = [
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
		} 
];

//****************************************Chunk#5 ==> followupTask summary here****************************************    
var followup_task = [
  {
    taskName: "PLM: Pattarin ทำแบบเสริมเหล็กกลีบดอก 1 วันที่ 25/5/2020",
    taskUpdate: "เสร็จแล้ว ส่งแล้ววันที่ 20/5/2020"
  },
  {
    taskName: "xxxxxx",
    taskUpdate: "yyyyy"
  }
];

//put [] in chunk layout
var chunk5 = [];
var i=0;
const lenFT = followup_task.length;

for (i = 0; i < lenFT; i++) {
  var layout = [
    {
			"type": "section",
			"block_id": "task_result"+i,
			"text": {
				"type": "mrkdwn",
				"text": "*Task:* "+ followup_task[i].taskName +"\n *Update:* " + followup_task[i].taskUpdate
			},
			"accessory": {
				"type": "overflow",
				"action_id": "followuptask"+i,
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
		}
  ];

chunk5 = chunk5.concat(layout);
}

//****************************************Chunk#6 AGENDA****************************************     
const agenda = [
  {name: "หัวข้อการประชุมที่ 1",
   note: ["ทดสอบโน๊ต 1", "xx", "yy", "zz"],
   decision: ["ทดสอบ decision 1", "A", "B", "C"],
   task: ["ทดสอบ task 1", "D", "E", "F", "G"]
  },
  {name: "หัวข้อการประชุมที่ 2",
   note: ["ทดสอบโน๊ต 5", "6", "7", "8"],
   decision: ["ทดสอบ decision 5", "10", "9", "8"],
   task: ["ทดสอบ task 9", "99", "999", "9999"]
  }
];

const numbering = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

var chunk6 = [];

var j = 0;
var lenA = agenda.length;

//agenda loop
for (j = 0; j < lenA ; j++) {

  var k,l,m = 0;
  const lenN = agenda[j].note.length;
  const lenD = agenda[j].decision.length;
  const lenT = agenda[j].task.length;

//Chunk#6.1 ==> header*****************************************
  const chunk6_1 = [
  		{
			"type": "divider"
		},
    //agenda block STARTS HERE
	  	{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":"+ numbering[j] +": *" + agenda[j].name +"*"
			},
			"accessory": {
				"type": "overflow",
				"action_id": "agenda"+j,
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
		}
];

    //Chunk#6.2 ==> push note list here*****************************************

//put [] in chunk layout
  var chunk6_2 = [];

  for (k = 0 ; k < lenN ; k++) {
    let layout = [
      {
			"type": "section",
			"block_id": "agenda"+ j +"_note"+k,
			"text": {
				"type": "mrkdwn",
				"text": "- "+ agenda[j].note[k]
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_agenda"+ j +"_note"+k,
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
		}
    ]
    chunk6_2 = chunk6_2.concat(layout);
    }

    //Chunk#6.3 ==> decision header*****************************************
  const chunk6_3 = [
  {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		}
];
  
    //Chunk#6.4 ==> push decision list here*****************************************
  var chunk6_4 = [];

  for (l = 0 ; l < lenD ; l++) {
    let layout = [
          {
			"type": "section",
			"block_id": "agenda"+ j +"_decision"+l,
			"text": {
				"type": "mrkdwn",
				"text": "- "+agenda[j].decision[l]
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_agenda"+ j +"_decision"+l,
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
		}
    ]
    chunk6_4 = chunk6_4.concat(layout);
  }  
  
    //Chunk#6.5 ==> task header*****************************************
  const chunk6_5 = [
      {
			  "type": "section",
		  	"text": {
		  		"type": "mrkdwn",
		  		"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
			  }
		  }
  ];
  
    //Chunk#6.6 ==> push task list here*****************************************
  var	chunk6_6 = [];

  for (m = 0 ; m < lenT ; m++) {
    let layout = [
       {
			"type": "section",
			"block_id":  "agenda"+ j +"_task"+m,
			"text": {
				"type": "mrkdwn",
				"text": "- "+agenda[j].task[m]
			},
			"accessory": {
				"type": "overflow",
				"action_id": "action_agenda"+ j +"_task"+m,
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
		}
    ]
    chunk6_6 = chunk6_6.concat(layout);
  }  
  
  //sum chunk#6
  chunk6 = chunk6.concat(chunk6_1, chunk6_2, chunk6_3, chunk6_4, chunk6_5, chunk6_6);
}

//****************************************Chunk#7****************************************    
const chunk7 = [
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
];








//WORKS!===================================================================================
/*
การทำ block ใหม่ โดยการ concat จะทำให้ js เป็น object และแปลงเป็น JSON ไม่ได้  (เพราะ JSON แปลง object อยู่แล้วไม่ได้)
ต้องรวม message ทั้งหมดก่อน แล้ว stringify เพื่อให้เป็น text ก่อน (มันจะ break ความเป็น array และ object ไป)
พอถึงเวลาใช้ยิง HTTP จริงค่อย parse กลับเป็น JSON อีกที ก็จะส่งได้แล้ว
*/
const allchunk = chunk1.concat(chunk2, chunk3, chunk4, chunk5, chunk6, chunk7);

const newblock = JSON.stringify({
  "response_type": "ephemeral",
  "text": "This is a MOM input page",
	"blocks": allchunk
});

//=========================================================================================







//=============================DECLARE obj 'MOM message'=============================
const momMsg = () => {
 // console.log("responseURL to be sent is " + response_url);
/*  
  const msg = {
   "response_type": "ephemeral",
    "text": "This is a MOM input page",
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
				"text": "*- ชื่อการประชุม : *\n *- วัน-เวลา : * \n *- สถานที่ : *\n *- ผู้เข้าร่วม : *\n *- หัวข้อการประชุม/รายละเอียดการประชุม : *\n "
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
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		},
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
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
			}
		},
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
*/  
    const msg = JSON.parse(newblock);
  //const result = await axios.post(response_url, msg);
 // await console.log("============POST finished===============")
return msg;
};



//=============================DECLARE obj 'MOM message' FROM HELP *BUTTON*=============================
const momMsgHelp = async(response_url) => {
  console.log("responseURL to be sent is " + response_url);
  const msg = {
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
				"text": "*- ชื่อการประชุม : *\n *- วัน-เวลา : * \n *- สถานที่ : *\n *- ผู้เข้าร่วม : *\n *- หัวข้อการประชุม/รายละเอียดการประชุม : *\n "
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
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *ข้อสรุป*"
			}
		},
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
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":construction_worker: *สิ่งที่ต้องทำต่อ*"
			}
		},
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
  
  const result = await axios.post(response_url, msg);
  await console.log("============POST finished===============")
};



//=============================DECLARE obj 'UPDATE MOM message'=============================
const updatemomMsg = async(response_url) => {
  console.log("responseURL to be sent is " + response_url);
  const msg = {
      "response_type": "ephemeral",
      "replace_original": "true",
      "text": "Let's make MOM!",
  }; 
  const result = await axios.post(response_url, msg);
  await console.log("============POST finished===============")
};






























//=============================EXPORT FUNCTIONS=============================
module.exports = { momMsg, momMsgHelp, updatemomMsg, logData };