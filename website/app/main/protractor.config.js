exports.config = {
    directConnect: true,

    specs: [
        'app/_app.spec.js'
    ],

    framework: 'jasmine2',

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8888',
};