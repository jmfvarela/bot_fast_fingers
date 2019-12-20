const path = require("path");
const puppeteer = require('puppeteer');

openUrl(`file:///${path.join(__dirname, '..', 'web', 'fast_fingers.html')}`);

async function openUrl(url) {
    const browser = await puppeteer.launch({ headless: true, devtools: false });
    const page = (await browser.pages())[0];
    await page.goto(url, { waitUntil: 'networkidle2' });


    const client = await page.target().createCDPSession();
    client.on('Debugger.scriptParsed', async (response) => {
        console.log(`Debugger.scriptParsed: scriptId: ${response.scriptId}, url: ${response.url}`);
        const responseGetScriptSource = await client.send('Debugger.getScriptSource', { scriptId: response.scriptId });
        console.log(`Debugger.getScriptSource: scriptId: ${response.scriptId}, scriptSource: \n${responseGetScriptSource.scriptSource.substring(0, 50)}\n...`);
    });
    await client.send('Debugger.enable', (response) => console.log(response));


    await page.waitFor(100);
    browser.close();
}

