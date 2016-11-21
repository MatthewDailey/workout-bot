import bodyParser from 'body-parser';
import config from 'config';
import crypto from 'crypto';
import express from 'express';
import https from 'https';
import request from 'request';

import workouts from './workouts';

/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error('Missing config values');
  process.exit(1);
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response.
 */
function callSendAPI(messageData) {
  return new Promise((resolve, reject) => {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const recipientid = body.recipient_id;
        const messageid = body.message_id;

        if (messageid) {
          console.log('successfully sent message with id %s to recipient %s',
            messageid, recipientid);
        } else {
          console.log('successfully called send api for recipient %s', recipientid);
        }
        resolve();
      } else {
        console.log(response);
        console.error('failed calling send api',
          response.statusCode, response.statusMessage, body.error);
        reject(error);
      }
    });
  });
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
      metadata: 'hey',
    },
  };

  return callSendAPI(messageData);
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  const payload = event.postback.payload;

  console.log('Received postback for user %d and page %d with payload \'%s\' ' +
    'at %d', senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, 'Postback called');
}

function sendNewWorkout(recipientId) {
  const newWorkout = workouts.generateWorkout();

  sendTextMessage(recipientId, newWorkout.core.join('\n'));
  sendTextMessage(recipientId, newWorkout.fullBody.join('\n'));
  sendTextMessage(recipientId, newWorkout.legs.join('\n'));
  sendTextMessage(recipientId, newWorkout.chest.join('\n'));
  sendTextMessage(recipientId, newWorkout.back.join('\n'));
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'This is test text',
          buttons: [
            {
              type: 'web_url',
              url: 'https://www.oculus.com/en-us/rift/',
              title: 'Open Web URL',
            }, {
              type: 'postback',
              title: 'Trigger Postback',
              payload: 'DEVELOPER_DEFINED_PAYLOAD',
            }, {
              type: 'phone_number',
              title: 'Call Phone Number',
              payload: '+16505551234',
            },
          ],
        },
      },
    },
  };

  callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: '10 Push ups',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Start Timer',
          payload: 'payload_start_timer',
        },
        {
          content_type: 'text',
          title: 'Done',
          payload: 'payload_done',
        },
      ],
    },
  };

  callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
  console.log('Sending a read receipt to mark message as seen');

  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen',
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
  console.log('Turning typing indicator on');

  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on',
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
  console.log('Turning typing indicator off');

  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off',
  };

  callSendAPI(messageData);
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log('Received message for user %d and page %d at %d with message:',
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(event));

  const isEcho = message.is_echo;
  const messageId = message.mid;
  const appId = message.app_id;
  const metadata = message.metadata;

  // You may get a text or attachment but not both
  const messageText = message.text;
  const messageAttachments = message.attachments;
  const quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log('Received echo for message %s and app %d with metadata %s',
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    const quickReplyPayload = quickReply.payload;
    console.log('Quick reply for message %s with payload %s',
      messageId, quickReplyPayload);

    sendTextMessage(senderID, 'Quick reply tapped');
    return;
  }

  if (messageText) {
    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'new workout':
        sendNewWorkout(senderID);
        break;

      case 'button':
        sendButtonMessage(senderID);
        break;

      case 'quick reply':
        sendQuickReply(senderID);
        break;

      case 'read receipt':
        sendReadReceipt(senderID);
        break;

      case 'typing on':
        sendTypingOn(senderID);
        break;

      case 'typing off':
        sendTypingOff(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, 'Message with attachment received');
  }
}

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 */
app.post('/webhook', (req, res) => {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      // Iterate over each messaging event
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log('Webhook received unknown messagingEvent: ', messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL.
 */
app.get('/authorize', (req, res) => {
  const accountLinkingToken = req.query.account_linking_token;
  const redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  const authCode = '1234567890';

  // Redirect users to this URI on successful login
  const redirectURISuccess = `${redirectURI}&authorization_code=${authCode}`;

  res.render('authorize', {
    accountLinkingToken,
    redirectURI,
    redirectURISuccess,
  });
});

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), () => {
  console.log('Workout Bot is running on port', app.get('port'));
});

module.exports = app;