const DRCommand = {"token":"iVRZyjzd3S1heaQJCXUXFlX8","team_id":"T0103UNKWUR","team_domain":"kdc2020","channel_id":"C01017F0RM0","channel_name":"engineering-and-coding","user_id":"U010E15TBU0","user_name":"wichuda.korit","command":"/dev","text":"dr","response_url":"https://hooks.slack.com/commands/T0103UNKWUR/1284141497489/6cw9zi52C83HyUyFn1DZWa2j","trigger_id":"1295356526592.1003974676977.10ae62a59e4ab5005a1c148db940d84f"};

const DRProjectPayload = {
  "type": "block_actions",
  "user": {
      "id": "U010E15TBU0",
      "username": "wichuda.korit",
      "name": "wichuda.korit",
      "team_id": "T0103UNKWUR"
  },
  "api_app_id": "A0133FY0YJZ",
  "token": "iVRZyjzd3S1heaQJCXUXFlX8",
  "container": {
      "type": "view",
      "view_id": "V017HN7AHKR"
  },
  "trigger_id": "1276683756596.1003974676977.2b0176d0449082afe4691866f8044be3",
  "team": {
      "id": "T0103UNKWUR",
      "domain": "kdc2020"
  },
  "view": {
      "id": "V017HN7AHKR",
      "team_id": "T0103UNKWUR",
      "type": "modal",
      "blocks": [
          {
              "type": "section",
              "block_id": "ZpDdj",
              "text": {
                  "type": "mrkdwn",
                  "text": "สวัสดีค่าคุณ<@U010E15TBU0>  มากรอก Daily Report กันน้าา :heart:",
                  "verbatim": false
              }
          },
          {
              "type": "divider",
              "block_id": "IrA"
          },
          {
              "type": "section",
              "block_id": "XJE5",
              "text": {
                  "type": "mrkdwn",
                  "text": "เลือกโครงการและวันที่ก่อนนะคt",
                  "verbatim": false
              }
          },
          {
              "type": "actions",
              "block_id": "xaJaK",
              "elements": [
                  {
                      "type": "static_select",
                      "action_id": "DR_projectList",
                      "placeholder": {
                          "type": "plain_text",
                          "text": "โครงการ",
                          "emoji": true
                      },
                      "options": [
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(TEST) test project",
                                  "emoji": true
                              },
                              "value": "TEST"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(WDA) Wedding Avenue",
                                  "emoji": true
                              },
                              "value": "WDA"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(TRD) Tae's Residence",
                                  "emoji": true
                              },
                              "value": "TRD"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(HO9) 201 AVENUE",
                                  "emoji": true
                              },
                              "value": "HO9"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(KTH) Khun-Thien-House",
                                  "emoji": true
                              },
                              "value": "KTH"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(PLM) Mistine Plumeria House",
                                  "emoji": true
                              },
                              "value": "PLM"
                          }
                      ]
                  },
                  {
                      "type": "datepicker",
                      "action_id": "DR_date",
                      "initial_date": "2020-07-29",
                      "placeholder": {
                          "type": "plain_text",
                          "text": "วันที่ใน DR",
                          "emoji": true
                      }
                  }
              ]
          },
          {
              "type": "context",
              "block_id": "in=dS",
              "elements": [
                  {
                      "type": "plain_text",
                      "text": " ",
                      "emoji": true
                  }
              ]
          },
          {
              "type": "context",
              "block_id": "o1X",
              "elements": [
                  {
                      "type": "plain_text",
                      "text": "NOTE:\n     - วันที่คือวันที่ใน DR เช่น การบันทึก DR ของเมื่อวาน ให้ใส่วันที่เมื่อวาน",
                      "emoji": true
                  }
              ]
          }
      ],
      "private_metadata": "",
      "callback_id": "",
      "state": {
          "values": {}
      },
      "hash": "1596047587.xkrYo7q5",
      "title": {
          "type": "plain_text",
          "text": "Daily Report",
          "emoji": true
      },
      "clear_on_close": false,
      "notify_on_close": false,
      "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
      },
      "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
      },
      "previous_view_id": null,
      "root_view_id": "V017HN7AHKR",
      "app_id": "A0133FY0YJZ",
      "external_id": "",
      "app_installed_team_id": "T0103UNKWUR",
      "bot_id": "B013B4Y4UTW"
  },
  "actions": [
      {
          "type": "static_select",
          "action_id": "DR_projectList",
          "block_id": "xaJaK",
          "selected_option": {
              "text": {
                  "type": "plain_text",
                  "text": "(HO9) 201 AVENUE",
                  "emoji": true
              },
              "value": "HO9"
          },
          "placeholder": {
              "type": "plain_text",
              "text": "โครงการ",
              "emoji": true
          },
          "action_ts": "1596047595.367812"
      }
  ]
};

const DRDatePayload = {
  "type": "block_actions",
  "user": {
      "id": "U010E15TBU0",
      "username": "wichuda.korit",
      "name": "wichuda.korit",
      "team_id": "T0103UNKWUR"
  },
  "api_app_id": "A0133FY0YJZ",
  "token": "iVRZyjzd3S1heaQJCXUXFlX8",
  "container": {
      "type": "view",
      "view_id": "V017HN7AHKR"
  },
  "trigger_id": "1294361310384.1003974676977.d6eb1825dbe64844ac90abe33fb87686",
  "team": {
      "id": "T0103UNKWUR",
      "domain": "kdc2020"
  },
  "view": {
      "id": "V017HN7AHKR",
      "team_id": "T0103UNKWUR",
      "type": "modal",
      "blocks": [
          {
              "type": "section",
              "block_id": "ZpDdj",
              "text": {
                  "type": "mrkdwn",
                  "text": "สวัสดีค่าคุณ<@U010E15TBU0>  มากรอก Daily Report กันน้าา :heart:",
                  "verbatim": false
              }
          },
          {
              "type": "divider",
              "block_id": "IrA"
          },
          {
              "type": "section",
              "block_id": "XJE5",
              "text": {
                  "type": "mrkdwn",
                  "text": "เลือกโครงการและวันที่ก่อนนะคt",
                  "verbatim": false
              }
          },
          {
              "type": "actions",
              "block_id": "xaJaK",
              "elements": [
                  {
                      "type": "static_select",
                      "action_id": "DR_projectList",
                      "placeholder": {
                          "type": "plain_text",
                          "text": "โครงการ",
                          "emoji": true
                      },
                      "options": [
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(TEST) test project",
                                  "emoji": true
                              },
                              "value": "TEST"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(WDA) Wedding Avenue",
                                  "emoji": true
                              },
                              "value": "WDA"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(TRD) Tae's Residence",
                                  "emoji": true
                              },
                              "value": "TRD"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(HO9) 201 AVENUE",
                                  "emoji": true
                              },
                              "value": "HO9"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(KTH) Khun-Thien-House",
                                  "emoji": true
                              },
                              "value": "KTH"
                          },
                          {
                              "text": {
                                  "type": "plain_text",
                                  "text": "(PLM) Mistine Plumeria House",
                                  "emoji": true
                              },
                              "value": "PLM"
                          }
                      ]
                  },
                  {
                      "type": "datepicker",
                      "action_id": "DR_date",
                      "initial_date": "2020-07-29",
                      "placeholder": {
                          "type": "plain_text",
                          "text": "วันที่ใน DR",
                          "emoji": true
                      }
                  }
              ]
          },
          {
              "type": "context",
              "block_id": "in=dS",
              "elements": [
                  {
                      "type": "plain_text",
                      "text": " ",
                      "emoji": true
                  }
              ]
          },
          {
              "type": "context",
              "block_id": "o1X",
              "elements": [
                  {
                      "type": "plain_text",
                      "text": "NOTE:\n     - วันที่คือวันที่ใน DR เช่น การบันทึก DR ของเมื่อวาน ให้ใส่วันที่เมื่อวาน",
                      "emoji": true
                  }
              ]
          }
      ],
      "private_metadata": "",
      "callback_id": "",
      "state": {
          "values": {}
      },
      "hash": "1596047587.xkrYo7q5",
      "title": {
          "type": "plain_text",
          "text": "Daily Report",
          "emoji": true
      },
      "clear_on_close": false,
      "notify_on_close": false,
      "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
      },
      "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
      },
      "previous_view_id": null,
      "root_view_id": "V017HN7AHKR",
      "app_id": "A0133FY0YJZ",
      "external_id": "",
      "app_installed_team_id": "T0103UNKWUR",
      "bot_id": "B013B4Y4UTW"
  },
  "actions": [
      {
          "type": "datepicker",
          "action_id": "DR_date",
          "block_id": "xaJaK",
          "selected_date": "2020-07-30",
          "initial_date": "2020-07-29",
          "action_ts": "1596048212.088294"
      }
  ]
};

const DRViewSubmission = {"type":"view_submission","team":{"id":"T0103UNKWUR","domain":"kdc2020"},"user":{"id":"U010E15TBU0","username":"wichuda.korit","name":"wichuda.korit","team_id":"T0103UNKWUR"},"api_app_id":"A0133FY0YJZ","token":"iVRZyjzd3S1heaQJCXUXFlX8","trigger_id":"1298286504608.1003974676977.5e02f688431632090159904932f27756","view":{"id":"V01812636R3","team_id":"T0103UNKWUR","type":"modal","blocks":[{"type":"section","block_id":"3Yo2H","text":{"type":"mrkdwn","text":"\u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35\u0e04\u0e48\u0e32\u0e04\u0e38\u0e13<@U010E15TBU0>  \u0e21\u0e32\u0e01\u0e23\u0e2d\u0e01 Daily Report \u0e01\u0e31\u0e19\u0e19\u0e49\u0e32\u0e32 :heart:","verbatim":false}},{"type":"divider","block_id":"6Erw"},{"type":"section","block_id":"CIC","text":{"type":"mrkdwn","text":"\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e04\u0e23\u0e07\u0e01\u0e32\u0e23\u0e41\u0e25\u0e30\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e01\u0e48\u0e2d\u0e19\u0e19\u0e30\u0e04\u0e30","verbatim":false}},{"type":"actions","block_id":"DR_ProjectAndDateSelect","elements":[{"type":"static_select","action_id":"DR_projectList","placeholder":{"type":"plain_text","text":"\u0e42\u0e04\u0e23\u0e07\u0e01\u0e32\u0e23","emoji":true},"options":[{"text":{"type":"plain_text","text":"(TEST) test project","emoji":true},"value":"TEST"},{"text":{"type":"plain_text","text":"(WDA) Wedding Avenue","emoji":true},"value":"WDA"},{"text":{"type":"plain_text","text":"(TRD) Tae's Residence","emoji":true},"value":"TRD"},{"text":{"type":"plain_text","text":"(HO9) 201 AVENUE","emoji":true},"value":"HO9"},{"text":{"type":"plain_text","text":"(KTH) Khun-Thien-House","emoji":true},"value":"KTH"},{"text":{"type":"plain_text","text":"(PLM) Mistine Plumeria House","emoji":true},"value":"PLM"}]},{"type":"datepicker","action_id":"DR_date","initial_date":"2020-07-31","placeholder":{"type":"plain_text","text":"\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e43\u0e19 DR","emoji":true}}]},{"type":"context","block_id":"BmWiy","elements":[{"type":"plain_text","text":" ","emoji":true}]},{"type":"context","block_id":"4wa","elements":[{"type":"plain_text","text":"NOTE:\n     - \u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e04\u0e37\u0e2d\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e43\u0e19 DR \u0e40\u0e0a\u0e48\u0e19 \u0e01\u0e32\u0e23\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 DR \u0e02\u0e2d\u0e07\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e27\u0e32\u0e19 \u0e43\u0e2b\u0e49\u0e43\u0e2a\u0e48\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e27\u0e32\u0e19","emoji":true}]}],"private_metadata":"{\"channel_id\":\"D010E15TP8Q\",\"viewName\":\"DR_prepopInput\"}","callback_id":"","state":{"values":{}},"hash":"1596196014.hDQnwioQ","title":{"type":"plain_text","text":"Daily Report","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V01812636R3","app_id":"A0133FY0YJZ","external_id":"","app_installed_team_id":"T0103UNKWUR","bot_id":"B013B4Y4UTW"},"response_urls":[]};

module.exports = { DRCommand, DRProjectPayload, DRDatePayload, DRViewSubmission};