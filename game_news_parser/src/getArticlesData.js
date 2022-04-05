const client = require('./redisClient');

async function getArticlesData (links, page, articles) {
    
    for(let i = 0; i < links.length; i++) {
        let cacheValue = await client.get(links[i])
        if(cacheValue) {
            let article = JSON.parse(cacheValue);
            articles.push(article);
            links.splice(i, 1);
            i--;
        }
    }

    for(let i = 2; i < links.length; i++) {
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
                const tags = [];
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
                throw error;
            }
            return obj;
        });
        
        await client.set(article.link, JSON.stringify(article));
        articles.push(article);
    }
    return articles;
}

module.exports = getArticlesData;