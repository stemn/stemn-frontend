import * as helpers from './global-setup';
import path from 'path';

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('multiple windows', function () {
  helpers.setupTimeout(this)

  var app = null

  beforeEach(function () {
    return helpers.startApplication('../dist/main').then(function (startedApp) { app = startedApp })
  })

  afterEach(function () {
    return helpers.stopApplication(app)
  })

  it('launches the application', function () {
    return app.client
      .getWindowCount().should.eventually.equal(2)
      .windowByIndex(1)
        .browserWindow.getBounds().should.eventually.deep.equal({
          x: 25,
          y: 35,
          width: 200,
          height: 100
        })
        .getTitle().should.eventually.equal('Top')
      .windowByIndex(0)
        .browserWindow.getBounds().should.eventually.deep.equal({
          x: 25,
          y: 135,
          width: 300,
          height: 50
        })
        .getTitle().should.eventually.equal('Bottom')
  })
})
