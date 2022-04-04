async function getLinks (page) {
    let links = await page.evaluate(async () => {
        let result = [];

        try {
            let divs = document.querySelectorAll('div.article-summary')
            divs.forEach(div => {
                let a = div.querySelector('a').href;
                result.push(a);                        
            });
        } catch (error) {
            throw error;;
        }
        return result;
    });
    return links;   
}

module.exports = getLinks;