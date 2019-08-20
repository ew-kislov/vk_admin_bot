const moment = require('moment')
const fs = require('fs')

const { ACTION_TYPE_STRINGS } = require('../constants')
const { executeQuery } = require('../util')

const ACTION_TABLE = 'action'
const FILE_NAME = 'actions.log'

function addAction(action) {
    let date = moment().format('YYYY-MM-DD hh:mm:ss')

    fs.appendFile(FILE_NAME, `${date} | ${action.vk_user_id} | ${ACTION_TYPE_STRINGS[action.type_id]} | ${action.details || 'Нет деталей'} |\n`, err => {})

    let query
    if (action.details)
        query =
            `INSERT INTO ${ACTION_TABLE}(type_id, creation_date, vk_user_id, details)
            VALUES ('${action.type_id}', '${date}', '${action.vk_user_id}', '${action.details}')`
    else
        query =
            `INSERT INTO ${ACTION_TABLE}(type_id, creation_date, vk_user_id)
            VALUES ('${action.type_id}', '${date}', '${action.vk_user_id}')`

    return executeQuery(query)
}

module.exports = {
    addAction
}