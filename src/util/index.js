const { executeQuery } = require('./mysql')
const { delay } = require('./promises')

module.exports = {
    executeQuery,
    delay
}