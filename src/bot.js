const path = require("path");
const puppeteer = require('puppeteer');

openUrlAndRunFn(`file:///${path.join(__dirname, '..', 'web', 'fast_fingers.html')}`, fn);

async function openUrlAndRunFn(url, fn) {
  const browser = await puppeteer.launch({headless: false});
  const page = (await browser.pages())[0];
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.evaluate(fn);
  await page.waitFor(() => document.querySelector('#timer').innerText == '0:00', {timeout: 120000});
  await page.screenshot({path: 'output/result.png'});
  await page.waitFor(10000);
  browser.close();
}

function fn() {
  const timer = document.querySelector('#timer').innerText;
  if (timer == '0:00') return;

  const word = document.querySelector('#words .highlight').innerText;
  typeWord(word);

  function typeWord(word) {
	const millis = 0;
    for (let i = 0; i < word.length; i++) {
      setTimeout(() => typeKey(word[i]), i*millis);
    }
    setTimeout(() => typeKey(' '), word.length*millis);
    setTimeout(fn, (word.length + 1)*millis);
  }

  function typeKey(key) {
    const element = document.querySelector('input[type=text][id=inputfield]');
    if (key != ' ') {
	  element.value+=key;
	  element.dispatchEvent(new KeyboardEvent('keyup',{'key':key}));	
    }
    else {
	  element.dispatchEvent(new KeyboardEvent('keyup',{'keyCode':32}));	
    }
  }

}

