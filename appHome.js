const axios = require('axios');
const qs = require('qs');

//const JsonDB = require('node-json-db');
//const Config = require('node-json-db/dist/lib/JsonDBConfig');
//old version
//const db = new JsonDB('notes', true, false);
//var db = new JsonDB(new Config("notes", true, false, '/'));


const apiUrl = 'https://slack.com/api';

//db.delete("/");

/* DISPLAY HOME VIEW

// Home View - Use Block Kit Builder to compose: https://api.slack.com/tools/block-kit-builder


const updateView = async(user) => {

  // Intro message -

  let blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Welcome!* \nThis is a home for Stickers app. You can add small notes here!"
      },
      accessory: {
        type: "button",
        action_id: "add_note",
        text: {
          type: "plain_text",
          text: "Add a Stickie",
          emoji: true
        }
      }
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: ":wave: Hey, my source code is on <https://glitch.com/edit/#!/apphome-demo-keep|glitch>!"
        }
      ]
    },
    {
      type: "divider"
    }
  ];


  // Append new data blocks after the intro -

  let newData = [];

  try {
    const rawData = db.getData(`/${user}/data/`);

    newData = rawData.slice().reverse(); // Reverse to make the latest first
    newData = newData.slice(0, 50); // Just display 20. BlockKit display has some limit.

  } catch(error) {
    //console.error(error);
  };

  if(newData) {
    let noteBlocks = [];

    for (const o of newData) {

      const color = (o.color) ? o.color : 'yellow';

      let note = o.note;
      if (note.length > 3000) {
        note = note.substr(0, 2980) + '... _(truncated)_'
        console.log(note.length);
      }

      noteBlocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: note
          },
          accessory: {
            type: "image",
            image_url: `https://cdn.glitch.com/0d5619da-dfb3-451b-9255-5560cd0da50b%2Fstickie_${color}.png`,
            alt_text: "stickie note"
          }
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": o.timestamp
            }
          ]
        },
        {
          type: "divider"
        }
      ];
      blocks = blocks.concat(noteBlocks);

    }

  }

  // The final view -

  let view = {
    type: 'home',
    title: {
      type: 'plain_text',
      text: 'Keep notes!'
    },
    blocks: blocks
  }

  return JSON.stringify(view);
};



// Display App Home

const displayHome = async(user, data) => {

  if(data) {
    // Store in a local DB
    db.push(`/${user}/data[]`, data, true);
  }

  const args = {
    token: process.env.SLACK_BOT_TOKEN,
    user_id: user,
    view: await updateView(user)
  };

  const result = await axios.post(`${apiUrl}/views.publish`, qs.stringify(args));

  try {
    if(result.data.error) {
      console.log(result.data.error);
    }
  } catch(e) {
    console.log(e);
  }
};

*/


module.exports = {};
