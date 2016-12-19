describe('angularjs app', function () {

    beforeEach(function () {
        browser.get('http://admin.stemn.dev:3000/');
    });

    afterEach(function () {
        browser.manage().logs().get('browser').then(function (browserLog) {
            expect(browserLog.length).toEqual(0);
            // Uncomment to actually see the log.
             console.log('log: ' + require('util').inspect(browserLog));
        });
    });

    it('should fail when the console has errors - FAILURE EXPECTED', function () {
//        browser.executeScript(function () {
//            console.error('error from test')
//        });
    });

    it('should pass when the console has non-error logs', function () {
//        browser.executeScript(function () {
//            console.log('hi!')
//        });
    })
});
