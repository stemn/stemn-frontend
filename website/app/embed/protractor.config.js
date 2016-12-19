exports.config = {
    directConnect: true,

    specs: [
        'app/_app.spec.js'
    ],

    framework: 'jasmine2',

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://admin.stemn.dev:3000',
};
