//=============================INITIALIZE APP=============================
/* 
 * Slack API Demo 
 * This example shows how to ustilize the App Home feature
 * October 11, 2019 
 *
 * This example is written in Vanilla-ish JS with Express (No Slack SDK or Framework)
 * To see how this can be written in Bolt, https://glitch.com/edit/#!/apphome-bolt-demo-note
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const qs = require('qs');
//const amplify = require('amplifyjs');

const signature = require('./verifySignature');
const appHome = require('./appHome');
const mom = require('./mom');
const help = require('./help');
const modal = require('./modal');

const app = express();

const apiUrl = 'https://slack.com/api';

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 *
 * Forget this if you're using Bolt framework or either SDK, otherwise you need to implement this by yourself to verify signature!
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));





//=============================FUNCTION DECLARATION=============================





//=============================DECLARE GLOBAL VARIABLE=============================
var viewID = "initial value for viewID";
var private_metadata = "";








//=============================EVENT RESPONSE=============================
app.post('/slack/events', async(req, res) => {
  //LOG REQUEST===============    
      console.log("---------------" + req.body.type +" REQUEST STARTS HERE---------------");
      console.log("----------req type----------");   
      console.log(req.body.type);    
      console.log("----------req.body----------");   
      console.log(req.body);  
      console.log("----------req.context----------");   
      console.log(req.context);       
      console.log("----------req.payload----------");   
      console.log(req.payload);  
      console.log("----------req.body.event.text----------");   
      console.log(req.body.event.text);    
      console.log("---------------" + req.body.type +" REQUEST ENDS HERE---------------");     
  //RESPONSE TO EVENT CASES===============
  switch (req.body.type) {
    //RESPONSE TO URL VERIFICATION===============  
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    //RESPONSE TO EVENT CALLBACK ===============       
    case 'event_callback': {
      // Verify the signing secret
      if (!signature.isVerified(req)) {
        res.sendStatus(404);
        return;
      } 
      //RESPONSE TO message =============== 
      else { 
      }
      break;
    }
  }
});



//=============================SLASH COMMAND RESPONSE (/BOLT)=============================
app.post('/slack/commands', async(req, res) => {
//LOG ACTION REQUEST 
      console.log("---------------/bolt COMMAND REQUEST STARTS HERE---------------");
      console.log("----------req.body----------");  
      console.log(req.body); 
      console.log("----------req.body.context----------");   
      console.log(req.body.context);       
      console.log("----------req.body.payload----------");   
      console.log(req.body.payload);  
      console.log("---------------/bolt COMMAND REQUEST ENDS HERE---------------");       
  
  //CHECK TEXT COMMAND & RETRIVE TRIGGER_ID
  const text = req.body.text;
  console.log("Command text is: " + text);
  const triggerID = req.body.trigger_id;
  console.log("triggerID is: " + triggerID);
  const response_url = req.body.response_url;
  console.log("responseURL is: " + response_url);
  const token = req.body.token;
  console.log("Request token is: " + token);
  
  //if text contains 'mom' => send MOM message
  if (text.includes("mom")||text.includes("บันทึกการประชุม")) {
    res.status(200).end; //=ack();
    res.send(mom.momMsg());
    //console.log(res);
    //console.log(res.data);
    //console.log(res.body);
    /* send modal
    const result = await modal.openModal(triggerID);
    console.log("========== OPEN_MODAL RESPONSE.data STARTS ==========");
    console.log(result.data);   
    console.log("========== OPEN_MODAL RESPONSE.data ENDS ==========");
    viewID = result.data.view.id
    console.log("ViewID in index.js for this modal is " + viewID);
    */
  }
  //else => send help message
  else {
    //res.status(200).end(); //=ack();
    res.send(help.helpMsg());
  }
  
});





//=============================ACTION RESPONSE=============================
app.post('/slack/actions', async(req, res) => {
  //console.log(JSON.parse(req.body.payload));
  //LOG ACTION REQUEST 
      console.log("---------------ACTION REQUEST STARTS HERE---------------");
      console.log("----------req.body----------");  
      console.log(req.body); 
      console.log("----------req.body.actions----------");   
      console.log(req.body.actions);      
      console.log("----------req.body.context----------");   
      console.log(req.body.context);       
      console.log("----------req.body.payload----------");   
      console.log(req.body.payload);  
      console.log("---------------ACTION REQUEST ENDS HERE---------------");     
      
  const { token, trigger_id, user, actions, type, response_url } = JSON.parse(req.body.payload);
   console.log({ token, trigger_id, user, actions, type });
      console.log("response_url = " + response_url);
      console.log("action_id is " + actions[0].action_id);
  switch(actions[0].action_id) {
  //Actions in 'Help Message'==================
    // Open MOM Modal In 'help message'
    case "open_momMsg" : {
      await res.send(mom.momMsgHelp(response_url)); 
      await console.log("MOM message sent!");
      break;
    } 
  
  //Actions in 'MOM Message'==================
    // Update meeting data   
    case "select_meeting" : {
      await res.send(mom.updatemomMsg(response_url)); 
      await console.log("MOM message sent!");
      break;
    }
    default:{ res.sendStatus(404); }
  
  }
 
  
  
  
  
  
  
  
  
  // Modal forms submitted --
/*      
  else if(type === 'view_submission') {
    res.send(''); // Make sure to respond to the server to avoid an error
    
    const ts = new Date();
    const { user, view } = JSON.parse(req.body.payload);

    const data = {
      timestamp: ts.toLocaleString(),
      note: view.state.values.note01.content.value,
      color: view.state.values.note02.color.selected_option.value
    }
    
    appHome.displayHome(user.id, data);
  }
});
*/

});





//=============================LISTEN TO PORT=============================
/* Running Express server */
const server = app.listen(5000, () => {
  console.log('Express web server is running on port %d in %s mode', server.address().port, app.settings.env);
});
app.get('/', async(req, res) => {
  //res.send(message.logData());
  console.log(mom.logData());
});

