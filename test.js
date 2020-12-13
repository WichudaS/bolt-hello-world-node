// switch(type) {
//     // case "block_actions":
//     //   let { token, trigger_id, user, actions, response_url, container, view, message } = JSON.parse(req.body.payload);
//     //   const metadata = JSON.parse(view.private_metadata)
//     //   const channel_id = container.channel_id || JSON.parse(view.private_metadata).channel_id;
//     //   const user_id = user.id;  
//     //   const block_id = actions[0].block_id;
//     //   const action_id = actions[0].action_id;
//     //   // const 
//     //   // const value = 
      
//     //   console.log({ token, user, actions });
//     //   console.log(`★ trigger_id = ${trigger_id}`);
//     //   console.log("★ response_url = " + response_url);
//     //   console.log("★ block_id = " + block_id);
//     //   console.log("★ action_id = " + action_id);
//     //   console.log("★ user_id = "+ user_id); 
//     //   console.log(`★ channel_id = ${channel_id}`);

//       //block_id controls various *specific actions* that grouped by block_id 
//     //   switch (block_id) {
//     //     //PM interacts in DR Approve Requested Message
//     //     // case "DR_approveAction":

//     //     // //   switch (action_id) {
//     //     // //     //PM hit 'Approved' button => 1.send Jotform link for PM to sign and 2.delete approve requested message
//     //     // //     // case "DR_approve":
//     //     // //     //   console.log(`★ PM approved, redirect to Jotform Edit submission page`);
//     //     // //     //   //Direct to Edit submissionURL link
//     //     // //     //   res.sendStatus(204); //Ack()

//     //     // //     //   //Delete message
//     //     // //     //   let delmsg = msg.delMsg(response_url)
//     //     // //     //   console.log(delmsg);
//     //     // //     // break;
//     //     // //     //PM hit 'Reject' button => 1.pop up modal to PM to add comment  and 2.delete approve requested message
//     //     // //     // case "DR_reject":
//     //     // //     //   console.log(`★ PM rejected, pop up modal to add comment & carry data to be update to DB over modal metadata`);
//     //     // //     //   res.status(200).write(""); // ack 

//     //     // //     //   //structure data for modal to be carry over
//     //     // //     //   let metadata = {
//     //     // //     //     "DRno": message.blocks[1].fields[1].text.split("\n")[1],
//     //     // //     //     "project": message.blocks[1].fields[1].text.split("\n")[1].split("_")[0]
//     //     // //     //   }

//     //     // //     //   //send Comment input modal to PM
//     //     // //     //   let postModalResult = await axios.post(`https://slack.com/api/views.open`, qs.stringify(msg.drRejectCommentMsg(trigger_id, process.env.SLACK_BOT_TOKEN, metadata)));
//     //     // //     //   console.log(`★ Modal posted, here is a result =`);
//     //     // //     //   console.log(postModalResult.data);

//     //     // //     //   //Delete message
//     //     // //     //   let delAppMsg = msg.delMsg(response_url)
//     //     // //     //   console.log(delAppMsg);
//     //     // //     // break;

//     //     // //     default:
//     //     // //       break;
//     //     // //   }

//     //     // break;  
        
//     //     //User interacts in DR prepopulatedURL input modal
//     //     // case "DR_inputModal":
        
//     //     //   switch (action_id) {
//     //     //     //User select project in DR input modal => 1.query project information, PM&SE info then 2.Update cache
//     //     //     // case "DR_projectList":
//     //     //     //   res.sendStatus(204);

//     //     //     //   let DRProjectData = {
//     //     //     //     "SE": {
//     //     //     //       "SEName[first]": "",
//     //     //     //       "SEName[last]": "",
//     //     //     //       "SEPosition": "วิศวกรควบคุมงานก่อสร้าง",
//     //     //     //       "SESlackID": ""
//     //     //     //     },
//     //     //     //     "PM": {
//     //     //     //       "PMName[first]": "",
//     //     //     //       "PMName[last]": "",
//     //     //     //       "PMPosition": "ผู้จัดการโครงการ"
//     //     //     //     },
//     //     //     //     "misc.DRProjectQuery": ""
//     //     //     //   };

//     //     //     //   DRProjectQuery = actions[0].selected_option.value;
//     //     //     //   console.log(`★ DRProjectQuery = ${DRProjectQuery}`);
//     //     //     //   DRProjectData["misc.DRProjectQuery"] = DRProjectQuery;

//     //     //     //   DRProjectData.SE.SESlackID = user.id;
//     //     //     //   console.log(`★ SESlackID = ${DRProjectData.SE.SESlackID}`);

//     //     //     //   // get PM's ID
//     //     //     //   let projectData = await fn.DR_searchPPfrominfo(baseDR, "รายละเอียดโครงการ", `{ชื่อย่อโครงการ}="${DRProjectQuery}"`)
//     //     //     //   let PMRecordID = "";
//     //     //     //   if(projectData) {
//     //     //     //     PMRecordID = projectData["ชื่อ PM (จากรายชื่อพนักงาน)"]
//     //     //     //   }
//     //     //     //   //find PM's info (firstname, lastname)
//     //     //     //   let PMInfo = await fn.DR_getDataFromID(baseDR, "รายชื่อพนักงาน", PMRecordID);
//     //     //     //   console.log(`★ PMinfo = ${JSON.stringify(PMInfo)}`);
//     //     //     //   //store data into object
//     //     //     //   if(PMInfo) {
//     //     //     //     DRProjectData.PM["PMName[first]"] = PMInfo["ชื่อ-สกุล"].split(" ")[0].trim()                                      
//     //     //     //     DRProjectData.PM["PMName[last]"] = PMInfo["ชื่อ-สกุล"].split(" ")[1].trim()
//     //     //     //   }

//     //     //     //   //find SE info with SE slackID
//     //     //     //   let SEData = await fn.DR_searchPPfrominfo(baseDR, "รายชื่อพนักงาน", `{Slack USER ID}="${DRProjectData.SE.SESlackID}"`)
//     //     //     //   if(SEData) {
//     //     //     //     DRProjectData.SE["SEName[first]"] = SEData["ชื่อ-สกุล"].split(" ")[0].trim()                                      
//     //     //     //     DRProjectData.SE["SEName[last]"] = SEData["ชื่อ-สกุล"].split(" ")[1].trim()
//     //     //     //   }

//     //     //     //   console.log("★ DRProjectData =");
//     //     //     //   console.log(JSON.stringify(DRProjectData));

//     //     //     //   //update to DB
//     //     //     //   let DRcacheUpdate = await fs.DRPrepopURLDocRef(user_id).update(DRProjectData);
//     //     //     //   console.log(DRcacheUpdate);
//     //     //     // break;
            
//     //     //     //User select date in DR input modal => 1.parse date information then 2.Update cache
//     //     //     // case "DR_date":
//     //     //     //   res.sendStatus(204);

//     //     //     //   let DRDateData = {
//     //     //     //     "day": {
//     //     //     //       "input22[month]": "",
//     //     //     //       "input22[day]": "",
//     //     //     //       "input22[year]": ""
//     //     //     //     },            
//     //     //     //     "misc.DRDateQuery": ""
//     //     //     //   };

//     //     //     //   // res.sendStatus(204); //ack and end
//     //     //     //   DRDateQuery = actions[0].selected_date
//     //     //     //   console.log(`★ DRDateQuery = ${DRDateQuery}`);
//     //     //     //   DRDateData["misc.DRDateQuery"] = DRDateQuery;

//     //     //     //   //store data into object 
//     //     //     //   DRDateData.day["input22[year]"] = DRDateQuery.split("-")[0].trim()
//     //     //     //   DRDateData.day["input22[month]"] = DRDateQuery.split("-")[1].trim()
//     //     //     //   DRDateData.day["input22[day]"] = DRDateQuery.split("-")[2].trim()

//     //     //     //   console.log(`★ input22[day] = ${DRDateData.day["input22[day]"]}`);
//     //     //     //   console.log(`★ input22[month] = ${DRDateData.day["input22[month]"]}`);
//     //     //     //   console.log(`★ input22[year] = ${DRDateData.day["input22[year]"]}`);

//     //     //     //   console.log("★ DRDateData =");
//     //     //     //   console.log(JSON.stringify(DRDateData));

//     //     //     //   //Update DB
//     //     //     //   let DRcacheDateUpdate = await fs.DRPrepopURLDocRef(user_id).update(DRDateData);
//     //     //     //   console.log(DRcacheDateUpdate);
//     //     //     // break;
          
//     //     //     //User clicked 'URL for ios' in DR input modal => 1.close this modal, 2.send URL message
//     //     //     // case "sendDRurlForIos":
//     //     //     //   res.sendStatus(200);

//     //     //     //   console.log(`★ User clicked 'Requested URL for ios' in DR input modal => 1.close this modal, 2.send URL message`);
              
//     //     //     //   //1.close DR input modal
//     //     //     //   console.log(`★ 1.close DR input modal`);

//     //     //     //   //2.send URL message
//     //     //     //   console.log(`★ 2.send URL message`);
//     //     //     //   let messageResult = await axios.post(`https://slack.com/api/chat.postMessage`, qs.stringify({
//     //     //     //     "token": process.env.SLACK_BOT_TOKEN,
//     //     //     //     // "response_type": "ephemeral",
//     //     //     //     "channel": `${channel_id}`,
//     //     //     //     "text": "This is your URL"
//     //     //     //   }));
//     //     //     //   console.log(`★ URL message result = ${JSON.stringify(messageResult.data)}`);
              
//     //     //     //   res.end();
//     //     //     // break

//     //     //     default:
//     //     //       break;
//     //     //   }

//     //     // break;
        
//     //     //User `select project` in RB prepopulatedURL input modal
//     //     // case "RB_inputModal-project":
//     //     //   res.sendStatus(204);
//     //     //   console.log(`★ RB project has been selected, update cache and RB modal`);

//     //     //   let { ABB, ID } = JSON.parse(actions[0].selected_option.value)
//     //     //   //data layout to be updated in Firestore (ref:RBJotUrl)
//     //     //   let data = {
//     //     //     "sumBudget": {
//     //     //       "originalBudget": "",
//     //     //       "orderedBudget": ""
//     //     //     },
//     //     //     "CE": {
//     //     //       "CEName[first]": "",
//     //     //       "CEName[last]": "",
//     //     //       "CEPosition": "วิศวกรควบคุมต้นทุน",
//     //     //       "CESlackID": ""
//     //     //     },
//     //     //     "PM": {
//     //     //       "PMName[first]": "",
//     //     //       "PMName[last]": "",
//     //     //       "PMPosition": "ผู้จัดการโครงการ",
//     //     //       "PMSlackID": ""
//     //     //     },
//     //     //     "AirtableData": {
//     //     //       "MS400ID": "",
//     //     //       "viewName": "Purchase Requests"
//     //     //     },
//     //     //     "misc.RBProjectQuery": ABB
//     //     //   };
          
//     //     //   //get datas
//     //     //   //Project data
//     //     //   let projectData = await baseDR("รายละเอียดโครงการ").find(ID).then(record => {return record.fields});
//     //     //   // console.log(`★ projectData`);          
//     //     //   // console.log(projectData);
//     //     //   if(projectData) {
//     //     //     data.AirtableData.MS400ID = projectData["MS400 baseID"];
//     //     //   }
//     //     //   //PMData
//     //     //   let PMData = await baseDR("รายชื่อพนักงาน").find(projectData["ชื่อ PM (จากรายชื่อพนักงาน)"][0]).then(record => {return record.fields});
//     //     //   // console.log(`★ PMData`);
//     //     //   // console.log(PMData);
//     //     //   if(PMData) {
//     //     //     data.PM["PMName[first]"] = PMData["ชื่อ-สกุล"].split(" ")[0].trim();
//     //     //     data.PM["PMName[last]"] = PMData["ชื่อ-สกุล"].split(" ")[1].trim();
//     //     //     data.PM.PMSlackID = PMData["Slack USER ID"];
//     //     //   }
//     //     //   //CEData
//     //     //   let CEData = await baseDR("รายชื่อพนักงาน").select({"view": "Grid view", "maxRecords": 1, "filterByFormula": `{Slack USER ID} = "${user_id}"`}).all();  //[]
//     //     //   if(CEData) {
//     //     //     data.CE["CEName[first]"] = CEData[0].fields["ชื่อ-สกุล"].split(" ")[0].trim();          
//     //     //     data.CE["CEName[last]"] = CEData[0].fields["ชื่อ-สกุล"].split(" ")[1].trim();
//     //     //     data.CE.CESlackID = user_id;
//     //     //   }
//     //     //   //sumRB
//     //     //   let baseMS400 = new Airtable(process.env.AIRTABLE_API_KEY).base(`${projectData["MS400 baseID"]}`)
//     //     //   let RBData = await baseMS400("MS400").select({"view": "Requested Budgets", "fields":["ID", "Original BG Amount", "Ordered BG Amount"]}).all().then((records) => {return records.map((n) => {return n.fields})})
//     //     //   // console.log(`★ RBData`);
//     //     //   // console.log(RBData);
//     //     //   if(RBData) {
//     //     //     data.sumBudget.originalBudget = RBData.reduce((sum, rec)=> {return {"Original BG Amount": sum["Original BG Amount"] + rec["Original BG Amount"]} })["Original BG Amount"]
//     //     //     data.sumBudget.orderedBudget = RBData.reduce((sum, rec)=> {return {"Ordered BG Amount": sum["Ordered BG Amount"] + rec["Ordered BG Amount"]} })["Ordered BG Amount"]
//     //     //   }

//     //     //   console.log(`★ summary of cache data to be updated`);
//     //     //   console.log(JSON.stringify(data));


//     //     //   //query and add `PR list` into msg
//     //     //   //query `PR list` in MS400
//     //     //   let PRData = await baseMS400("MS400").select({"view": data.AirtableData.viewName, "fields": ["PR No"]}).all()
//     //     //   .then((records) => {
//     //     //     //get only unique data
//     //     //     let uniqueData = {}
//     //     //     records.forEach((record) => {
//     //     //       uniqueData[`${record.fields["PR No"]}`] = "";
//     //     //     });

//     //     //     return Object.keys(uniqueData);
//     //     //   });
//     //     //   console.log(`★ PRData`);
//     //     //   console.log(PRData);

//     //     //   //added into msg
//     //     //   //structure data
//     //     //   let PRoptions = PRData.map((n) => {
            
//     //     //     return {
//     //     //       "text": {
//     //     //         "type": "plain_text",
//     //     //         "text": n,
//     //     //         "emoji": true
//     //     //       },
//     //     //       "value": n
//     //     //     }
//     //     //   });
//     //     //   // console.log(`layouted projects = `);
//     //     //   // PRoptions.forEach(n => console.log(JSON.stringify(n)));

//     //     //   let PRListSection = [
//     //     //     {
//     //     //       "type": "section",
//     //     //       "text": {
//     //     //         "type": "mrkdwn",
//     //     //         "text": `*:building_construction:  โครงการที่เลือก* : ${actions[0].selected_option.text.text}`
//     //     //       }
//     //     //     },
//     //     //     {
//     //     //     "type": "section",
//     //     //     "block_id": "RB_inputModal-PR",
//     //     //     "text": {
//     //     //         "type": "mrkdwn",
//     //     //         "text": ":memo:  *เลือกเอกสารอ้างอิง*\n         _(เอกสารที่มีปัญหา)_"
//     //     //     },
//     //     //     "accessory": {
//     //     //         "type": "static_select",
//     //     //         "placeholder": {
//     //     //             "type": "plain_text",
//     //     //             "text": "เลือกเอกสาร",
//     //     //             "emoji": true
//     //     //         },
//     //     //         "options": PRoptions
//     //     //     }
//     //     //   }]
          
//     //     //   // let newModalView = await msg.rbMsgTemplate(user_id)
//     //     //   //test-- use the payload view
//     //     //   let newModalView = {"type": view.type, "title": view.title, "submit": view.submit, "close": view.close, "blocks": view.blocks, "private_metadata": view.private_metadata}
//     //     //   //update metadata
//     //     //   metadata.MS400baseID = projectData["MS400 baseID"];
//     //     //   newModalView.private_metadata = JSON.stringify(metadata);
//     //     //   //cut projectlist block (block[2])
//     //     //   newModalView.blocks.splice(2,1)
//     //     //   //add into msg blocks
//     //     //   newModalView.blocks = [...newModalView.blocks, ...PRListSection];
//     //     //   console.log(`new modal view =`);
//     //     //   console.log(JSON.stringify(newModalView));

//     //     //   //update modal
//     //     //   try {
//     //     //     let args = {
//     //     //       "token": process.env.SLACK_BOT_TOKEN,
//     //     //       "view": JSON.stringify(newModalView),
//     //     //       "view_id": view.id
//     //     //     };

//     //     //     let updateModalResult = await axios.post(`${apiUrl}/views.update`, qs.stringify(args));
//     //     //     console.log('★ New modal view pushed!'); 
//     //     //     console.log(updateModalResult.data)             
//     //     //   } 
//     //     //   catch (error) {
//     //     //     console.error(error);
//     //     //   }

//     //     //   //update cache (userID & Project abb)
//     //     //   let RBcacheDateUpdate = await fs.RBPrepopURLDocRef(user_id).update(data);
//     //     //   console.log(RBcacheDateUpdate);

//     //     // break;

//     //     //User `select refDoc` in RB prepopulatedURL input modal
//     //     // case "RB_inputModal-PR":
//     //     //   res.sendStatus(204);
//     //     //   console.log(`★ RB refDoc has been selected, update cache`);

          
//     //     //   //data layout to be updated in Firestore (ref:RBJotUrl)
//     //     //   let PRdata = {
//     //     //     "refDocument.refDoc": actions[0].selected_option.value,     
//     //     //     "misc.RBRefDocQuery": actions[0].selected_option.value
//     //     //   };

//     //     //   //update cache
//     //     //   //update cache (userID & Project abb)
//     //     //   let RBcachePRUpdate = await fs.RBPrepopURLDocRef(user_id).update(PRdata);
//     //     //   console.log(RBcachePRUpdate);

//     //     // break;

//     //   }
      
//       //THIS action_id controls various *common actions* which DOES NOT have  block_id 
//     //   switch(action_id) {
//     //     //User hit 'delete message' button in help message => delete the message
//     //     // case "deletemessage":
//     //     //   res.status(200);
//     //     //   res.write(""); //=ack();
//     //     //   // code block
//     //     //   console.log("★ delete message case");
//     //     //   //res.status(200); //=ack();
//     //     //   let result = await msg.delMsg(response_url);
//     //     //   console.log(result.data);
//     //     //   res.end();
//     //     // break;
//     //     //User hit 'Open Daily Report' button in help messsage => send DR modal
//     //     // case "open_drMsg":
//     //     //   res.sendStatus(204);
//     //     //   console.log("★ open DR message case");
//     //     //   // res.status(200); //=ack();

//     //     //   //send DR message
//     //     //   msg.drMsg(user_id, channel_id, trigger_id, process.env.SLACK_BOT_TOKEN)
//     //     //   .then(result => {
//     //     //     console.log(result.data)
//     //     //     return console.log("★ Modal posted");
          
//     //     //   })
//     //     //   .catch(err => {
//     //     //     console.error(err);
//     //     //   })


//     //     //   //create cache for pre-populateURL
//     //     //   var DRJotUrl = {
//     //     //     "head": "https://form.jotform.com/201670438940455",
//     //     //     "day": {
//     //     //       "input22[month]": "",
//     //     //       "input22[day]": "",
//     //     //       "input22[year]": ""
//     //     //     },
//     //     //     "time": {
//     //     //       "timeSchedule": "08.00-17.00"
//     //     //     },
//     //     //     "SE": {
//     //     //       "SEName[first]": "",
//     //     //       "SEName[last]": "",
//     //     //       "SEPosition": "วิศวกรควบคุมงานก่อสร้าง",
//     //     //       "SESlackID": ""
//     //     //     },
//     //     //     "PM": {
//     //     //       "PMName[first]": "",
//     //     //       "PMName[last]": "",
//     //     //       "PMPosition": "ผู้จัดการโครงการ"
//     //     //     },
//     //     //     "staff": {
//     //     //       "q146_staffTable[0][0]": ""
//     //     //     },
//     //     //     "dc": {
//     //     //       "q39_DCTable[0][0]": ""
//     //     //     },
//     //     //     "progress100": {
//     //     //       "q33_input33[0][0]":""
//     //     //     },
//     //     //     "misc": {
//     //     //       "DRProjectQuery":"",
//     //     //       "DRDateQuery":"",
//     //     //       "DRPrepopulatedURL":""
//     //     //     }
//     //     //   };
//     //     //   const DRcache = await fs.DRPrepopURLDocRef(user_id).set(DRJotUrl);
//     //     //   console.log(DRcache);

//     //     // break;
      
//     //     // case "open_rbMsg":
//     //     //   console.log("==SEND RB MESSAGE==");
//     //     //   res.sendStatus(204);
          
//     //     //   await msg.rbMsg(user_id, trigger_id)
//     //     //   .then(result => {
//     //     //     console.log(result.data);
//     //     //     return console.log(`★ RB modal posted!`)
//     //     //   })
//     //     //   .catch(err => {
//     //     //     console.error(err);
//     //     //   })
      
//     //     //   //create cache document in Firestore
//     //     //   //const DR_prepopDocPath = `cache/${user_id}/RB/pre-populateURL`;
//     //     //   var RBJotUrl = {
//     //     //     "head": "https://form.jotform.com/203231001397038",
//     //     //     "day": {
//     //     //       "date[month]": today.split("-")[1].trim(),
//     //     //       "date[day]": today.split("-")[0].trim(),
//     //     //       "date[year]": today.split("-")[2].trim()
//     //     //     },
//     //     //     "refDocument": {
//     //     //       "refDoc": "",
//     //     //       "workName": ""
//     //     //     },
//     //     //     "description": {
//     //     //       "q54_description[0][0]": ""
//     //     //     },
//     //     //     "resource": {
//     //     //       "q28_resource[0][0]": ""
//     //     //     },
//     //     //     "sumBudget": {
//     //     //       "originalBudget": "",
//     //     //       "orderedBudget": ""
//     //     //     },
//     //     //     "CE": {
//     //     //       "CEName[first]": "",
//     //     //       "CEName[last]": "",
//     //     //       "CEPosition": "วิศวกรควบคุมต้นทุน",
//     //     //       "CESlackID": ""
//     //     //     },
//     //     //     "PM": {
//     //     //       "PMName[first]": "",
//     //     //       "PMName[last]": "",
//     //     //       "PMPosition": "ผู้จัดการโครงการ",
//     //     //       "PMSlackID": ""
//     //     //     },
//     //     //     "AirtableData": {
//     //     //       "MS400ID": "",
//     //     //       "viewName": ""
//     //     //     },
//     //     //     "misc": {
//     //     //       "RBProjectQuery":"",
//     //     //       "RBRefDocQuery":"",
//     //     //       "RBPrepopulatedURL":""
//     //     //     }
//     //     //   };
      
//     //     //   const RBcache = await fs.RBPrepopURLDocRef(user_id).set(RBJotUrl);
//     //     //   console.log(RBcache);

//     //     // break;
//     //   }

//     // break;

//     case "view_submission":
      
//     //   const payload = JSON.parse(req.body.payload);

//     //   const metadata = JSON.parse(payload.view.private_metadata);
//     //   console.log(`★ metadata = ${JSON.stringify(metadata)}`);

//     //   const viewName = metadata.viewName;
//     //   console.log(`★ viewName = ${viewName}`);
//     //   const channel_id = metadata.channel_id; 
//     //   console.log(`★ channel_id = ${channel_id}`);
//     //   const user_id = payload.user.id;
//     //   console.log(`★ user_id = ${user_id}`);
//     //   const submissionValue = payload.view.state.values;
//     //   console.log(`★ submissionValue = ${JSON.stringify(submissionValue)}`);
        
      

//       //Specific actions only for view submission that has 'viewName' in private_metadata
//     //   switch(viewName) {
//     //     //User hit 'Submit' button in DR input modal => 1.Verify project name & date, if "OK" then 2.Generate pre-populated Jotform URL 3.Push new view with prepopulated Jotform URL
//     //     case "DR_prepopInput":
          
//     //       console.log("★ case DR_pre-populate URL");
//     //       let today = new Date();

//     //       //pop-up warning message if 'project' is not selected , OR 'date' is in the future
//     //       //1. get data from DB => return datafields
//     //       let data = await fs.DRPrepopURLDocRef(user_id).get().then(documentSnapshot => {
//     //         let fields = documentSnapshot.data();
//     //         return fields;
//     //       })
//     //       console.log(`★ data from DB = `);
//     //       console.log(JSON.stringify(data));
          
//     //       //2. check the date (if data.misc.DRDateQuery = "" => data.misc.DRDateQuery = date)
//     //       var date = new Date(new Date().toLocaleString("en-AU", {timeZone: "Asia/Bangkok"}));
//     //       let day = dateFormat(date, "yyyy-mm-dd");
          
//     //       if(!data.misc.DRDateQuery) {
//     //         console.log(`★ There is no date from DB, assign date`);
//     //         data.misc.DRDateQuery = day;

//     //         //store data into object 
//     //         data.day["input22[year]"] = day.split("-")[0].trim()
//     //         data.day["input22[month]"] = day.split("-")[1].trim()
//     //         data.day["input22[day]"] = day.split("-")[2].trim()
            
//     //         console.log(`★ input22[day] = ${data.day["input22[day]"]}`);
//     //         console.log(`★ input22[month] = ${data.day["input22[month]"]}`);
//     //         console.log(`★ input22[year] = ${data.day["input22[year]"]}`);
            
//     //       }
          
//     //       //2.5 Store project & date variable for output message
//     //       let drProject = data.misc.DRProjectQuery;
//     //       let drDate = data.misc.DRDateQuery 

//     //       //3. check, get other infos, save URL to Firestore cache, push new view with prepopulated Jotform URL
//     //       if(!(data.misc.DRProjectQuery) || (new Date(data.misc.DRDateQuery)>today)) {
//     //         console.log("-----error case, no project chosen ,or date is in the future");
//     //         res.send(await msg.drErrorMsg(user_id, channel_id))
//     //         console.log('★ msg sent!');
//     //       }
//     //       else{
//     //         console.log("★ input checked! continue");

//     //         //NOT USED
//     //         // console.log(`★ Clear modal view(s)`);
//     //         // res.send({
//     //         //   "response_action": "clear"
//     //         // });
            
//     //         //find other infos
//     //         //1.get DC & staff data from Airtable
//     //         const staffAndDCData = await fn.DR_getMultipleRecordsByFormula(baseDR, "บันทึกเวลาเข้าออก", `AND( {วันที่ (Text)}="${data.misc.DRDateQuery}", IF(SEARCH("${data.misc.DRProjectQuery}",ARRAYJOIN({โครงการ}))=BLANK(),FALSE(),TRUE()))`)
//     //         if(staffAndDCData) {
              
//     //           if(Object.keys(staffAndDCData.staff).length>0) {
//     //             console.log(`★ staffData from Airtable = ${JSON.stringify(staffAndDCData.staff)}`);
//     //             data.staff = staffAndDCData.staff;
//     //             console.log(`★ Updated staff data`);
//     //           }
//     //           else {
//     //             console.log("★ found no staff data = delete data.staff key");
//     //             delete data.staff;
//     //           }
              
//     //           if(Object.keys(staffAndDCData.dc).length>0) {
//     //             console.log(`★ DCData from Airtable = ${JSON.stringify(staffAndDCData.dc)}`);
//     //             data.dc = staffAndDCData.dc;
//     //             console.log(`★ DC data updated`);
//     //           }
//     //           else {
//     //             console.log("★ found no DC data = delete data.dc key");
//     //             delete data.dc;
//     //           }
              
//     //         }
//     //         else{
//     //           console.log(`★ No staff or DC data on this day, delete staff and dc keys`);
//     //           delete data.staff;
//     //           delete data.dc;
//     //         }
            
//     //         //2.get progress100% (ยังไม่ทำเพราะ base เก็บข้อมูล DR ยังไม่มา)
//     //         const progressData = undefined;
//     //         if(progressData) {
//     //           console.log(`★ There are progress 100% from other DR`);
//     //         }
//     //         else {
//     //           console.log(`★ No progress100% this week, delete progress tree`);
//     //           delete data.progress100;
//     //         }
            
//     //         //delete unused data
//     //         delete data.misc;
//     //         console.log(`★ finished data = ${JSON.stringify(data)}`)
            
//     //         //transform and merge into URL
//     //         const key = Object.keys(data)
//     //         console.log(`★ data keys = ${key}`);

//     //         //concat URL part from every keys except head
//     //         var URLparam = [];
//     //         for (var o in data) {
//     //           console.log(`★ data key = ${o}`);
//     //           if(o != "head") {
//     //             let entries = Object.entries(data[o]);
//     //             entries = entries.map(n => n.join("=")).join("&");
//     //             console.log(entries);
//     //             URLparam = URLparam.concat(entries);
//     //           }
//     //           else {
//     //             console.log(`★ data keys = head, do nothing`);
//     //           }
//     //         }
//     //         URLparam = URLparam.join("&")
//     //         console.log(`★ Finished URLparam = ${URLparam}`);

//     //         //merge URL
//     //         URL = `${data.head}?${URLparam}`
//     //         console.log(`★ URL = ${URL}`);
            
//     //         //Shorten URL
//     //         let URLshort = await TinyURL.shorten(URL); 
//     //         console.log(`★ URLshort = ${URLshort}`);
            
//     //         //save URL to Firestore cache
//     //         let DRcacheUpdate = await fs.DRPrepopURLDocRef(user_id).update({"misc.DRPrepopulatedURL":URLshort});
//     //         console.log(`★ cache update result = ${JSON.stringify(DRcacheUpdate)}`);



//     //         //Push new modal view that contains PrepopulatedURL
//     //         console.log(`★ drProject = ${drProject}`);
//     //         console.log(`★ drDate = ${drDate}`);

//     //         // let pushURLviewResult = await axios.post(`https://slack.com/api/views.push`,msg.drPrepopulatedURL(user_id, channel_id, drProject, drDate, URLshort));

//     //         // console.log(`★ pushURLviewResult = ${JSON.stringify(pushURLviewResult.data)}`);
//     //         try {
//     //           res.send(await msg.drPrepopulatedURL(user_id, channel_id, drProject, drDate, URLshort));
//     //           console.log('★ New modal view pushed!');              
//     //         } catch (error) {
//     //           console.error(error);
//     //         }

//     //         /* NOT USED
//     //         //Send URL message
//     //         let responseURL = payload.response_urls[0].response_url;
//     //         console.log(`★ responseURL = ${responseURL}`);


//     //         try {

              
//     //           let URLmessageResult = await axios.post( `${responseURL}` , msg.drPrepopMsg(drProject, drDate, URLshort) );

  
//     //           console.log(`★ URLmessageResult = ${JSON.stringify(URLmessageResult.data)}`);
//     //           console.log(`★ message posted`)
//     //         } catch (error) {
//     //           console.log(error);

//     //         }
//     //         */
//     //       }
          
//     //     break;
//       }

//       //******รอ assign viewName แล้วย้ายขึ้นไปด้านบนให้เหมือนกัน********
//       if(submissionValue) {

//         //Check DR approve action in DR approve requested message
//         if(submissionValue.DR_approveAction) {
//           //User hit 'submit' button in reject comment modal => 1.update cache and 2.send reject message to SE
//          if(submissionValue.DR_approveAction.DR_rejectComment.value) {
//            res.sendStatus(204); //ack;
  
//            console.log(`★ Rejected comment received!, update DB & send message to submitter`);
  
//            //update DB
//            let DRno = metadata.DRno;
//            let project = metadata.project;
  
//            const DRApproveResult = await fs.DRListDocRef(project, DRno).update({
//              "status": "ไม่อนุมัติ (RE)",
//              "approveData.approveDate": `${today}`,
//              "approveData.approveResult": "RE",
//              "approveData.approveComment": payload.view.state.values.DR_approveAction.DR_rejectComment.value
//            });
//            console.log(DRApproveResult);
  
//            //send message to submitter 
//              //1. get DB Data
//            console.log(`★ Get all this DR Data from DB to form a reject message`);
  
//            let DRApproveData = await fs.DRListDocRef(project, DRno).get().then(documentSnapshot => {
//              let fields = documentSnapshot.data();
//              return fields;
//            })
//            console.log(`★ data from DB = `);
//            console.log(JSON.stringify(DRApproveData)); 
  
//            //2. send Message
//            let postResult = await axios.post("https://slack.com/api/chat.postMessage", qs.stringify(msg.drRejectMsg(DRApproveData, DRApproveData.submitData.submitterSlackID, process.env.SLACK_BOT_TOKEN)))
  
//            console.log(`★ DM'ed to submitter, there is a result =\n `);
//            console.log(postResult.data);
//          } 
//         }

//       }

      
      
//     break;
//   }