const axios = require('axios').default;
const cheerio = require('cheerio');

const url = 'https://en.wikipedia.org/wiki/Main_Page';

export default async () => {
  try {
    const html = await axios.get(url);
    // Don't know cheerio enough but I know this would be #mp-itm and not #np-itm by quickly checking on developers tools
    // const $ = cheerio.load('html')
    const news = cheerio('#mp-itn', html);
    const newslist = cheerio(' > ul', news);
    return newslist.text();
  } catch (err) {
    console.log('Error Scrapping: ', err);
  }
};
