const puppeteer = require('puppeteer');
const getLinks = require('./getLinks');
const getArticlesData = require('./getArticlesData');
const mongoose = require('mongoose');
const Article = require('./articleModel');

const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'parser'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'

const link = 'https://stopgame.ru/news/all/p';

(async () => {  
   
    async function start() {
        try {    
            
            await mongoose.connect(HostDb, {
                user: UserDB,
                pass: PasswordDB,
                dbName: NameDB,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });    
            
        } catch (e) {
            console.log(e);
        }
    }
    
    start();

    let counter = 1;
    let articles = [];
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
    try {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60 * 1000);
        // while(i < 2) {
            await page.goto(`${link}${counter}`);
            const links = await getLinks(page);
            articles = await getArticlesData(links, page, articles);

            articles.forEach(async (article) => {
                const newArticle = new Article(article);
                await newArticle.save();
            })

            // counter++;
            // i++;
            // console.log(articles);
        // }
        browser.close();

        const res = await Article.find().select('-_id -__v');
        
        console.log(res);


       
    } catch (error) {
        console.log(error);
        await browser.close();
    }
})();

