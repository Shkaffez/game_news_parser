async function getArticlesData (links, page, articles) {
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
        articles.push(article);
    }
    return articles;
}

module.exports = getArticlesData;