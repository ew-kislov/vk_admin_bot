const { executeQuery } = require('../util')
const moment = require('moment')

const CONVERSATION_TABLE = 'conversation'

function addConversation(conversation) {
    let date = moment().format('YYYY-MM-DD hh:mm:ss')
    let query = `INSERT into ${CONVERSATION_TABLE}(peer_id, name, init_time) VALUES ('${conversation.peer_id}', '${conversation.name}', '${date}')`
    return executeQuery(query)
}

function getConversationByPeerId(peer_id) {
    let query = `SELECT * FROM ${CONVERSATION_TABLE} WHERE peer_id = '${peer_id}'`
    return executeQuery(query)
}

function getConversationByName(name) {
    let query = `SELECT * FROM ${CONVERSATION_TABLE} WHERE name = '${name}'`
    return executeQuery(query)
}

function getConversations() {
    let query = `SELECT * FROM ${CONVERSATION_TABLE}`
    return executeQuery(query)
}

module.exports = {
    addConversation,
    getConversationByPeerId,
    getConversationByName,
    getConversations
}