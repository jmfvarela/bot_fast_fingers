const path = require("path");
const puppeteer = require('puppeteer');

captureUrl(`file:///${path.join(__dirname, '..', 'web', 'fast_fingers.html')}`);

async function captureUrl(url) {
    const browser = await puppeteer.launch({ headless: true, devtools: true });
    const page = (await browser.pages())[0];
    await page.goto(url, { waitUntil: 'networkidle2' });
    const client = await page.target().createCDPSession();

    const functions = await page.evaluate(getAllFunctions);
    const scripts = await getScripts(client);
    functions.forEach(async f => {
        const location = await getFunctionLocation(client, f.name);
        f.script = scripts.find(s => s.scriptId == location.scriptId);
    });
    const functionLocation = await getFunctionLocation(client, 'compare');

    console.log(functions);

    await page.waitFor(100);
    browser.close();
}

function getAllFunctions() {
    const functions = [];
    for (let attr in this) {
        if (this.hasOwnProperty(attr) &&
            this[attr] instanceof Function) {
            functions.push(this[attr]);
        }
    }
    return functions.map((f) => { return { name: f.name }; });
}

async function getFunctionLocation(client, functionName) {
    const evaluation = await client.send('Runtime.evaluate', { expression: functionName });
    const properties = await client.send('Runtime.getProperties', { objectId: evaluation.result.objectId });
    const functionLocation = properties.internalProperties.find((p) => p.name == '[[FunctionLocation]]').value.value;
    //const script = await client.send('Debugger.getScriptSource', { scriptId: location.scriptId });
    //console.log(script);
    return functionLocation;
}

async function getScripts(client) {
    const scripts = [];
    client.on('Debugger.scriptParsed', async (response) => {
        if (response.url == '__puppeteer_evaluation_script__') return;
        scripts.push({ scriptId: response.scriptId, url: response.url });
    });
    await client.send('Debugger.enable', (response) => console.log(response));
    return scripts;
}