const axios = require('axios').default;
import User from '../model/user';
import wiki from './wiki';
const { WebClient } = require('@slack/web-api');

// Type of the request data input could be defined instead of just taking any

// type AccessTokenRequest = {
//   client_id: string;
//   client_secret: string;
//   code: string;
// };

// type SlackPostMessageRequest = {
//   token: string,
//   channel: string,
//   text: string,
// };

export const getAccessToken = async (data) => {
  console.log('dataaa', data);
  try {
    // const authDetails = await axios.post(
    //   'https://slack.com/api/oauth.v2.access',
    //   data
    // );
    // console.log('response', authDetails.data);
    // return authDetails.data;
    const result = await new WebClient().oauth.v2.access(data);
    console.log(result);
    return result;
  } catch (err) {
    console.error('Error getting access token from slack', err);
    throw new Error(err);
  }
};

export const sendScrappData = async () => {
  try {
    const users = await User.find({});
    const scrappData = await wiki();

    // This could be Promise.all() instead of waiting every request to go through synchronously
    users.forEach(async (user) => {
      const data = {
        token: user.accessToken,
        channel: user.userId,
        text: scrappData,
      };

      await axios.post('https://slack.com/api/chat.postMessage', data);
    });
  } catch (err) {
    console.log(err);
  }
};
