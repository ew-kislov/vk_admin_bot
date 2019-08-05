const { executeQuery } = require('../util')
const { USER_ROLES } = require('../constants')
const conversationRepository = require('./conversationRepository')

const USER_ROLE_TABLE = 'user_role'
const USER_ROLE_CONVERSATION_JOIN_TABLE = 'user_role_conversation_join'
const CONVERSATION_TABLE = 'conversation'

function getUserRoles() {
    let query = `SELECT * FROM ${USER_ROLE_TABLE}`
    return executeQuery(query)
}

function checkIfUserAdministrator(vk_user_id) {
    let query =
        `SELECT r.name as role
        FROM ${USER_ROLE_CONVERSATION_JOIN_TABLE} p
            LEFT JOIN ${USER_ROLE_TABLE} r ON p.user_role_id = r.id
        WHERE p.vk_user_id = '${vk_user_id}' and p.user_role_id = 1`

    return executeQuery(query)
        .then(response => response.length != 0)
}

function getUserPermissions(vk_user_id) {
    let query =
        `SELECT p.user_role_id, c.peer_id as conversation_peer_id
        FROM ${USER_ROLE_CONVERSATION_JOIN_TABLE} p
            LEFT JOIN ${CONVERSATION_TABLE} c on p.conversation_id = c.id
        WHERE p.vk_user_id = '${vk_user_id}'`

    return executeQuery(query)
}

function checkIfUserHasPermissionOnConversation(vk_user_id, conversation_peer_id) {
    return getUserPermissions(vk_user_id)
        .then(permissions => {
            let permissionsFilter = permission =>
                permission.user_role_id == USER_ROLES.ADMINISTRATOR ||
                permission.user_role_id == USER_ROLES.MODERATOR && permission.conversation_peer_id == conversation_peer_id

            if (permissions.find(permissionsFilter) != undefined)
                return true
            else
                return false
        })
}

async function addUserPermission(vk_user_id, role, conversation_peer_id) {
    let selectQuery, insertQuery

    if (role.id == USER_ROLES.ADMINISTRATOR) {
        selectQuery =
            `SELECT * FROM ${USER_ROLE_CONVERSATION_JOIN_TABLE} p
            WHERE p.vk_user_id = '${vk_user_id}' and p.user_role_id = ${role.id}`
        insertQuery =
            `INSERT INTO ${USER_ROLE_CONVERSATION_JOIN_TABLE}(vk_user_id, user_role_id)
            VALUES ('${vk_user_id}', ${role.id})`
    }

    else if (USER_ROLES.MODERATOR) {
        let conversations = await conversationRepository.getConversationByPeerId(conversation_peer_id)
        let conversation_id = conversations[0].id

        selectQuery =
            `SELECT * FROM ${USER_ROLE_CONVERSATION_JOIN_TABLE} p
            WHERE p.vk_user_id = '${vk_user_id}' and p.user_role_id = ${role.id} and p.conversation_id = ${conversation_id}`
        insertQuery =
            `INSERT INTO ${USER_ROLE_CONVERSATION_JOIN_TABLE}(vk_user_id, user_role_id, conversation_id)
            VALUES ('${vk_user_id}', ${role.id}, ${conversation_id})`
    }

    return executeQuery(selectQuery)
        .then(permissions => {
            if (permissions.length != 0)
                throw new Error('Already exists')
            else
                return executeQuery(insertQuery)
        })
}

module.exports = {
    getUserRoles,
    getUserPermissions,
    checkIfUserAdministrator,
    checkIfUserHasPermissionOnConversation,
    addUserPermission
}