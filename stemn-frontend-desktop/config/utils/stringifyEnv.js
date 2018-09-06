const { mapValues } = require('lodash')

module.exports = obj => mapValues(obj, val => JSON.stringify(val))