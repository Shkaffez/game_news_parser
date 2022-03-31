const puppeteer = require('puppeteer');

const link = 'https://stopgame.ru/news/all/p';

(async () => {
    // let flag = true;
    // let result = [];
    let counter = 1;

    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();

        // while(flag) {
            await page.goto(`${link}${counter}`);
            console.log(counter);

            let links = await page.evaluate(async () => {
                let result = [];

                try {
                    let divs = document.querySelectorAll('div.article-summary')
                    divs.forEach(div => {
                        let a = div.querySelector('a').href;
                        result.push(a);                        
                    });
                } catch (error) {
                    console.log(error);
                }
                return result;
            });

            let articles = [];

            for(let i = 0; i < 3; i++) {
                await page.goto(links[i]);
                let article = await page.evaluate(async () => {
                    let obj;
                    try {
                        const allText = document.querySelectorAll('section.article>p');
                        let text = '';
                        allText.forEach(p => {
                            text += p.textContent;
                        });
                        const allTags = document.querySelectorAll('div.tags');
                        let tags = [];
                        allTags.forEach(a => {
                            tags.push(a.textContent);
                        });

                        obj = {
                            link: window.location.href,
                            author: document.querySelector('a.name').innerText,
                            title: document.querySelector('h1.article-title').innerText, 
                            text: text,
                            platforms: tags,                      
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    return obj;
                });
                articles.push(article);
            }

            console.log(articles);

            
            
            // counter++;
        // }
    } catch (error) {
        console.log(error);
        await browser.close();
    }
})();

