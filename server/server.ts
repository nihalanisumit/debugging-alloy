import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import db from './db';
import Email from '../model/email';
import User from '../model/user';
import cronJob from './cronJob';
import * as slackBot from './slackBot';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

cronJob.start();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
express.static(path.join(__dirname, '../public'));

app.get('/auth/redirect', async function (req, res) {
  if (!req.query.code) {
    return;
  }
  console.log('code', req.query.code);
  try {
    var data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code,
    };
    const response = await slackBot.getAccessToken(data);
    console.log('Response:::::', response);

    // https://api.slack.com/methods/oauth.v2.access
    if (response.ok === false && response.error) {
      throw new Error(response.error);
    }

    // SN would consider expiring access token after some hours by creating TTL index: https://docs.mongodb.com/manual/tutorial/expire-data/
    const user = {
      userId: response.authed_user.id,
      accessToken: response.access_token,
    };
    const newUser = new User(user);
    await newUser.save();
    res.sendFile(path.resolve(__dirname + '/../../public/success.html'));
  } catch (err) {
    console.log(err);
    res.sendFile(path.resolve(__dirname + '/../../public/failed.html'));
  }
});

app.get('/slack', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../../public/slack.html'));
});

app.post('/event', async function (req, res) {
  try {
    const email = req.body.form_response.answers[0].email;
    const newEmail = new Email({ email: email });
    await newEmail.save();
    await slackBot.sendScrappData();
    res.status(200).send('done');
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

(async function () {
  try {
    await db.dbConnect();
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}!`);
    });
  } catch (err) {
    console.log(err);
  }
})();
