const { actionRepository, userRoleRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

async function handleGrantCommand(context) {
    if (context.peerType == 'user') {
        context.send('Данная команда недоступна в чате с ботом.')

        let action = {
            type_id: ACTION_TYPES.USER_GRANT_DENIED,
            vk_user_id: context.senderId,
            details: 'Попытка отправки сообщения из диалога с ботом'
        }
        actionRepository.addAction(action)

        return
    }

    let messageContent = context.text
    let wordArray = messageContent.split(' ')

    if (wordArray.length != 3) {
        context.send('Ошибка в команде. Укажите id участника и роль.')

        let action = {
            type_id: ACTION_TYPES.USER_GRANT_DENIED,
            vk_user_id: context.senderId,
            details: 'Неверное количество параметров в команде'
        }
        actionRepository.addAction(action)

        return
    }

    let hasPermission = await userRoleRepository.checkIfUserHasPermissionOnConversation(context.senderId, context.peerId)
    if (!hasPermission) {
        context.send('У вас нет прав на данную команду.')

        let action = {
            type_id: ACTION_TYPES.USER_GRANT_DENIED,
            vk_user_id: context.senderId,
            details: 'Нет прав на команду'
        }
        actionRepository.addAction(action)

        return
    }

    // user id is in 2nd word - format [idxxxxxxxxxx|@idxxxxxxxxxx]
    let userId = wordArray[1].split('|')[0].replace('[id', '')
    // role is 3rd word
    let enteredRole = wordArray[2]

    let roles = await userRoleRepository.getUserRoles()
    let role = roles.find(role => role.name == enteredRole)


    if (role == undefined) {
        context.send('Вы указали несуществующую роль.')

        let action = {
            type_id: ACTION_TYPES.USER_GRANT_DENIED,
            vk_user_id: context.senderId,
            details: 'Такой роли не существует'
        }
        actionRepository.addAction(action)

        return
    }

    userRoleRepository.addUserPermission(userId, role, context.peerId)
        .then(() => {
            let action = {
                type_id: ACTION_TYPES.USER_GRANTED,
                vk_user_id: context.senderId
            }
            actionRepository.addAction(action)

            context.send('Пользователь успешно назначен.')
        })
        .catch(() => {
            let action = {
                type_id: ACTION_TYPES.USER_GRANT_DENIED,
                vk_user_id: context.senderId,
                details: 'Внутренняя ошибка сервера/Данная роль уже назначена пользователю'
            }
            actionRepository.addAction(action)

            context.send('Внутренняя ошибка сервера. Возможно данный пользователь уже был назначен на эту роль.')
        })

    let action = {
        type_id: ACTION_TYPES.USER_GRANTED,
        vk_user_id: context.senderId
    }
    actionRepository.addAction(action)
}

module.exports = handleGrantCommand