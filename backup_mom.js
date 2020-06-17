/*

//=============================Initialize=============================
const axios = require('axios'); 
const qs = require('qs');

const apiUrl = 'https://slack.com/api';

const JsonDB = require('node-json-db');
const db = new JsonDB('notes', true, false);


//=============================declare variable & database=============================
//add main db 
const momdb = {};

const userData = {
  "data" : {
    "meetingData": {
        name: " ",
        dateTime: " ",
        place: " ",
        attendees: " ",
        description: " "
    },
    "followupTask": [],
    "agenda":[]
}
};



const followuptask = {
  "name": "",
  "status": "",
  "update": "",
};

const agenda = {
  "name": "หัวข้อการประชุมที่ ",
  "note": [],
  "decision": [],
  "task": []
};

var gcalList = [
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



  


//=============================build chunks=============================
//****************************************Chunk#1 (static)****************************************
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

//****************************************Chunk#2 (static)****************************************   
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

//****************************************Chunk#3 (dynamic) ==>  update meeting_data here ****************************************      
var chunk3 = [];

const runchunk3 = function(user_id) {
//check if meetingdata is new?
  
  var meeting_data_text = String(" *- ชื่อการประชุม :* " + momdb[user_id]["data"]["meetingData"]["name"] + "\n *- วัน-เวลา :* "+ momdb[user_id]["data"]["meetingData"]["dateTime"] +"\n *- สถานที่ :* "+ momdb[user_id]["data"]["meetingData"]["place"] +"\n *- ผู้เข้าร่วม :* "+ momdb[user_id]["data"]["meetingData"]["attendees"] +"\n *- หัวข้อการประชุม/รายละเอียดการประชุม :* \n " + momdb[user_id]["data"]["meetingData"]["description"]);
  console.log("meeting_data_text ="+meeting_data_text);
  chunk3 = [
 	  	{
		  	"type": "section",
  			"block_id": "meeting_data",
	  		"text": {
		  		"type": "mrkdwn",
			  	"text": meeting_data_text
  			}
	  	} 
  ];
  console.log(JSON.stringify(chunk3));
return chunk3;
};

//****************************************Chunk#4 (static)****************************************    
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

//****************************************Chunk#5 (dynamic) ==> followupTask summary here****************************************    
var chunk5 = [];

const runchunk5 = async function(user_id) {

  //put [] in chunk layout
  var i=0;
  const lenFT = momdb[user_id]["data"]["followupTask"].length;

  for (i = 0; i < lenFT; i++) {
    var layout = [
    {
			"type": "section",
			"block_id": "task_result"+i,
			"text": {
				"type": "mrkdwn",
				"text": "*Task:* "+ momdb[user_id]["data"]["followupTask"][i]["name"] +"\n *Status: * " + momdb[user_id]["data"]["followupTask"][i]["status"] + "\n *Update:* " + momdb[user_id]["data"]["followupTask"][i]["update"]
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
  console.log(JSON.stringify(chunk5));
return chunk5;
};

//****************************************Chunk#6 AGENDA****************************************     
var chunk6 = [];
const runchunk6 = async function(user_id) {

  const numbering = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  var j = 0;
  var lenA = momdb[user_id]["data"]["agenda"].length;

//agenda loop
for (j = 0; j < lenA ; j++) {

  var k,l,m = 0;
  const lenN = momdb[user_id]["data"]["agenda"][j].note.length;
  const lenD = momdb[user_id]["data"]["agenda"][j].decision.length;
  const lenT = momdb[user_id]["data"]["agenda"][j].task.length;

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
				"text": ":"+ numbering[j] +": *" + momdb[user_id]["data"]["agenda"][j].name +j +"*"
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
				"text": "- "+ momdb[user_id]["data"]["agenda"][j].note[k]
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
				"text": "- "+ momdb[user_id]["data"]["agenda"][j].decision[l]
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
				"text": "- "+momdb[user_id]["data"]["agenda"][j].task[m]
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
return chunk6;
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
					"action_id": "add_AGD",
					"text": {
						"type": "plain_text",
						"text": ":heavy_plus_sign: เพิ่มหัวข้อประชุมใหม่",
						"emoji": true
					},
					"value": "add_AGD"
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



var allblock = [];






const logData = () => {
  console.log("===============LOG DATA==============");
  console.log("MOMDB =: \n");
  console.log(JSON.stringify(momdb));
  console.log("===============LOG DATA==============");
};




//===========================================================================================

//=============================SEND 'MOM message' from /bolt mom=============================
const momMsg = (userid) => {
  //reset momdb
  db.delete(`/${userid}`);
  //Object.keys(momdb).forEach(function(key) {delete momdb[key];} );
  //add blank userData to db
   db.push(`/${userid}`, userData, true); 
  //run blocks
    console.log("db to be log is :");
    console.log(JSON.stringify(db.getData("/")));
    
 
   allblock = chunk1.concat(chunk2, chunk3, chunk4, chunk5, chunk6, chunk7);

    let msgCombined = JSON.stringify({
  "response_type": "ephemeral",
  "text": "This is a MOM input page",
	"blocks": allblock
});
    console.log("=======LOG msg combine=====");
    console.log(JSON.stringify(allblock));  
  const msg = JSON.parse(msgCombined);

return msg;
};



//=============================SEND 'MOM message' FROM HELP *BUTTON*=============================
const momMsgHelp = async(userid, response_url) => {
  console.log("responseURL to be sent is " + response_url);
    Object.keys(momdb).forEach(function(key) {delete momdb[key];} );
  //add blank userData to db
    momdb[userid] = userData;
  //run blocks
    console.log("momdb to be log is :");
    console.log(JSON.stringify(momdb));
    
  
   let allblock = chunk1.concat(chunk2, chunk3, chunk4, chunk5, chunk6, chunk7);
//    console.log("=======LOG allblock=====");
//    console.log(JSON.stringify(allblock));
    let msgCombined = JSON.stringify({
  "response_type": "ephemeral",
  "text": "This is a MOM input page",
	"blocks": allblock
});
    console.log("=======LOG msg combine=====");
    console.log(JSON.stringify(allblock));  
  const msg = JSON.parse(msgCombined);
  
  const result = await axios.post(response_url, msg);
  await console.log("============POST finished===============")
};


//=============================Add new 'agenda block' from *NEW AGENDA BUTTON*=============================
const addAgenda = async(userid, response_url) => {
 //add new agenda block 
  
  momdb[userid]["data"]["agenda"].push(agenda);
  console.log(momdb);
   console.log("responseURL for new message to be sent is :" + response_url);
  await console.log("new agenda added, now there are :" + momdb[userid]["data"]["agenda"].length + " agenda(s)"); 
  
  runchunk6(userid);
  console.log("chunk6: ");
  console.log(chunk6);
  
  let allblock = chunk1.concat(chunk2, chunk3, chunk4, chunk5, chunk6 ,chunk7);
//    console.log("=======LOG allblock=====");
//    console.log(JSON.stringify(allblock));
    let msgCombined = JSON.stringify({
  "response_type": "ephemeral",
  "text": "This is a MOM input page",
	"blocks": allblock
});
    console.log("=======LOG msg combine=====");
    console.log(msgCombined);  
  const msg = JSON.parse(msgCombined);

  const result = await axios.post(response_url, msg);

};




//=============================open modal from *EDIT AGENDA NAME BUTTON*=============================
const editAgendaNameModal = async(agenda_index, user_id, trigger_id) => {
  
  console.log("momdb = \n" + JSON.stringify(momdb));
  
  let modal = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "แก้ไขชื่อหัวข้อการประชุม",
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
				"text": "*ชื่อการประชุมเดิม:* \n " + momdb[user_id]["data"]["agenda"][agenda_index]["name"]
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input"
			},
			"label": {
				"type": "plain_text",
				"text": "ชื่อการประชุมใหม่",
				"emoji": true
			}
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




























//=============================EXPORT FUNCTIONS=============================
module.exports = { momMsg, momMsgHelp, addAgenda, logData, editAgendaNameModal };

*/