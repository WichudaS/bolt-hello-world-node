/* ******************************************************************************
 * Signing Secret Varification
 * 
 * Signing secrets replace the old verification tokens. 
 * Slack sends an additional X-Slack-Signature HTTP header on each HTTP request.
 * The X-Slack-Signature is just the hash of the raw request payload 
 * (HMAC SHA256, to be precise), keyed by your app’s Signing Secret.
 *
 * More info: https://api.slack.com/docs/verifying-requests-from-slack
 *
 * Tomomi Imura (@girlie_mac)
 * ******************************************************************************/

const crypto = require('crypto');
const timingSafeCompare = require('tsscmp');
const qs = require('qs');

// const isVerified = (req) => { 
//   const signature = req.headers['x-slack-signature'];
//   const timestamp = req.headers['x-slack-request-timestamp'];
//   const reqBody = qs.stringify(req.fields,{ format:'RFC1738' });
//   const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
//   const [version, hash] = signature.split('=');

//   // Check if the timestamp is too old
//   const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
//   if (timestamp < fiveMinutesAgo) return false;
  
//   console.log(`req.fieldsURL = ${qs.stringify(req.fields)}`);  
//   console.log(`reqBody = ${reqBody}`);
  
//   hmac.update(`${version}:${timestamp}:${reqBody}`);

//   // check that the request signature matches expected value
//   return timingSafeCompare(hmac.digest('hex'), hash);
// }; 
  
// module.exports = { isVerified };




// fetch this from environment variables
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
let signVerification = (req, res, next) => {
   let slackSignature = req.headers['x-slack-signature'];
   let requestBody = qs.stringify(req.fields, {format : 'RFC1738'});
   let timestamp = req.headers['x-slack-request-timestamp'];
   let time = Math.floor(new Date().getTime()/1000);
   if (Math.abs(time - timestamp) > 300) {
      return res.status(400).send('Ignore this request.');
   }
   if (!slackSigningSecret) {
      return res.status(400).send('Slack signing secret is empty.');
   }
   let sigBasestring = 'v0:' + timestamp + ':' + requestBody;
   let mySignature = 'v0=' + 
                  crypto.createHmac('sha256', slackSigningSecret)
                        .update(sigBasestring, 'utf8')
                        .digest('hex');
   if (crypto.timingSafeEqual(
              Buffer.from(mySignature, 'utf8'),
              Buffer.from(slackSignature, 'utf8'))
      ) {
          next();
   } else {
          return res.status(400).send('Verification failed');
   }
}
module.exports = signVerification;