/********************************************************************

Tutorial:        https://github.com/electron/electron/blob/master/docs/tutorial/using-selenium-and-webdriver.md
Run:             `./node_modules/.bin/chromedriver to start`
Then npm run:    `test-e2e`

********************************************************************/
import path from 'path';
import chromedriver from 'chromedriver';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';
import electronPath from 'electron-prebuilt';


chromedriver.start(); // on port 9515
process.on('exit', chromedriver.stop);

const delay = time => new Promise(resolve => setTimeout(resolve, time));
const startDriver = (subPath) => {
  return new webdriver.Builder()
    .usingServer('http://localhost:9515')
    .withCapabilities({
      chromeOptions: {
        binary: electronPath,
        args: [`app=${path.resolve(__dirname, subPath)}`]
      }
    })
    .forBrowser('electron')
    .build();
}

describe('thread: main', function spec() {
  this.timeout(5000);

  before(async () => {
    await delay(1000); // wait chromedriver start time
    this.driver = startDriver('../dist/main')
  });

  after(async () => {
    await this.driver.quit();
  });

  it('should open window', async () => {
    await delay(3000);
    const title = await this.driver.getTitle();
    expect(title).to.equal('Menubar');
  });

});

describe('renderer: menubar', function spec() {
  this.timeout(5000);

  before(async () => {
    await delay(1000); // wait chromedriver start time
    this.driver = startDriver('../dist/renderer/assets/html/menubar.html')
  });

  after(async () => {
    await this.driver.quit();
  });

  it('should open window', async () => {
    await delay(3000);
    const title = await this.driver.getTitle();
    expect(title).to.equal('Menubar');
  });

});

describe('renderer: main', function spec() {
  this.timeout(5000);

  before(async () => {
    await delay(1000); // wait chromedriver start time
    this.driver = startDriver('../dist/renderer/assets/html/main.html')
  });

  after(async () => {
    await this.driver.quit();
  });

  it('should open window', async () => {
    await delay(3000);
    const title = await this.driver.getTitle();
    expect(title).to.equal('STEMN');
  });

});
