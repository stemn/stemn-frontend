const Promise = require('bluebird');
const range = require('range').range;

const query = require('./index');

Promise.each(range(1, 6), (number) => {
    return query({
        from: `2017-${number}-01`,
        to: `2017-${number + 1}-01`,
        q: 'filename:sldasm'
    });
}).then(() => {
    console.log("DONE");
});
