const puppeteer = require('puppeteer');
const client = require('./redisClient');
const getLinks = require('./getLinks');
const getArticlesData = require('./getArticlesData');

const link = 'https://stopgame.ru/news/all/p';

(async () => {    

    await client.set('key', 'value');
    const value = await client.get('key');

    console.log(value)

    let counter = 1;
    let articles = [];
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60 * 1000);

        // while(counter < 3) {
            await page.goto(`${link}${counter}`);
            const links = await getLinks(page);               
            // console.log(links)         

            articles = await getArticlesData(links, page, articles);
            counter++;
        // }
        browser.close();

        console.log(articles);

    } catch (error) {
        console.log(error);
        await browser.close();
    }
})();

