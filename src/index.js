const { VK } = require('vk-io')
const mysql = require('mysql')

const CONSTANTS = require('../constants.json')

const {
    handleInitCommand,
    handleSendCommand,
    handleBroadcastCommand,
    handleKickCommand,
    handleGrantCommand
} = require('./commands')

// Connecting app to MySQL database

const db = mysql.createConnection({
    host: CONSTANTS.SQL_HOST,
    user: CONSTANTS.MYSQL_USER,
    password: CONSTANTS.MYSQL_PASSWORD,
    database: CONSTANTS.MYSQL_DB_NAME
})

db.connect(error => {
    if (error && CONSTANTS.ENV == 'DEV')
        console.log(error)
})

global.db = db

// Creating VK API instance 

const vkInstance = new VK({
    token: CONSTANTS.VK_TOKEN,
    apiVersion: CONSTANTS.VK_API_VERSION,
})
const { updates, api } = vkInstance

global.vk_api = api
global.vk = vkInstance

// Setting bot commands and callbacks

// messages which start with '/init'
updates.hear(/^\/init/, handleInitCommand)

// messages which start with '/broadcast'
updates.hear(/^\/send/, handleSendCommand)

// messages which start with '/broadcast'
updates.hear(/^\/broadcast/, handleBroadcastCommand)

// messages which start with '/kick'
updates.hear(/^\/kick/, handleKickCommand)

// messages which start with '/grant'
updates.hear(/^\/grant/, handleGrantCommand)

// Start LongPoll
updates.start()