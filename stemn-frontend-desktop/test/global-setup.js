import { Application } from 'spectron';
import assert from 'assert';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import electronPath from 'electron-prebuilt';

global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
})

export const setupTimeout = function (test) {
  if (process.env.CI) {
    test.timeout(30000)
  } else {
    test.timeout(10000)
  }
}

export const startApplication = function (subPath) {
  const options =  {
    path: electronPath,
    args: [ path.join(__dirname, subPath) ]
  }
  if (process.env.CI) options.startTimeout = 30000

  const app = new Application(options);
  console.log(app);
  return app.start().then(() => {
    console.log('=======================================');
    console.log('=======================================');
    console.log('=======================================');
    console.log('=======================================');
    console.log('=======================================');
    console.log('=======================================');
    assert.equal(app.isRunning(), true)
    chaiAsPromised.transferPromiseness = app.transferPromiseness
    return app
  })
}

export const stopApplication = function (app) {
  if (!app || !app.isRunning()) return

  return app.stop().then(function () {
    assert.equal(app.isRunning(), false)
  })
}
