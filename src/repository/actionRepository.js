const { executeQuery } = require('../util')
const moment = require('moment')

const ACTION_TABLE = 'action'

function addAction(action) {
    let date = moment().format('YYYY-MM-DD hh:mm:ss')

    let query
    if (action.details)
        query =
            `INSERT INTO ${ACTION_TABLE}(type_id, creation_date, vk_user_id, details)
            VALUES ('${action.type_id}', '${date}', '${action.vk_user_id}', '${action.details}')`
    else
        query =
            `INSERT INTO ${ACTION_TABLE}(type_id, creation_date, vk_user_id)
            VALUES ('${action.type_id}', '${date}', '${action.vk_user_id}')`

    console.log(query)
    return executeQuery(query)
}

module.exports = {
    addAction
}