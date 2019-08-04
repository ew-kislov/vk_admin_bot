const { actionRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

function handleGrantCommand(context) {
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

    //TODO: check for roles and log declined action if doesn't have permission

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

    // user id is in 2nd word - format [idxxxxxxxxxx|@idxxxxxxxxxx]
    let userId = wordArray[1].split('|')[0].replace('[id', '')
    // role is 3rd word
    let role = wordArray[2]

    // TODO: check if role exists
    // TODO: add new granted user
    // TODO: log grant denied if error

    let action = {
        type_id: ACTION_TYPES.USER_GRANTED,
        vk_user_id: context.senderId
    }
    actionRepository.addAction(action)
}

module.exports = handleGrantCommand