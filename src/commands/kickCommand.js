const { actionRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

function handleKickCommand(context) {
    if (context.peerType == 'user') {
        context.send('Данная команда недоступна в чате с ботом.')

        let action = {
            type_id: ACTION_TYPES.USER_KICK_DENIED,
            vk_user_id: context.senderId,
            details: 'Попытка отправки сообщения из диалога с ботом'
        }
        actionRepository.addAction(action)

        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    let messageContent = context.text
    let wordArray = messageContent.split(' ')

    if (wordArray.length < 3) {
        context.send('Укажите id участника и причину.')

        let action = {
            type_id: ACTION_TYPES.USER_KICK_DENIED,
            vk_user_id: context.senderId,
            details: 'Неверное количество параметров в команде'
        }
        actionRepository.addAction(action)

        return
    }

    // user id is in 2nd word - format [idxxxxxxxxxx|@idxxxxxxxxxx]
    let userId = wordArray[1].split('|')[0].replace('[id', '')
    // reason text is string of all words with index = 3
    let reason = wordArray.splice(2).reduce((prev, curr) => prev + ' ' + curr)

    vk_api.messages.removeChatUser({ user_id: userId, chat_id: context.chatId })
        .then(() => {
            let action = {
                type_id: ACTION_TYPES.USER_KICKED,
                vk_user_id: context.senderId
            }
            actionRepository.addAction(action)
        })
        .catch(() => {
            let action = {
                type_id: ACTION_TYPES.USER_KICK_DENIED,
                vk_user_id: context.senderId,
                details: 'Внутренняя ошибка'
            }
            actionRepository.addAction(action)

            context.send('Ошибка. Возможно Вы неверно указали id участника.')
        })
}

module.exports =  handleKickCommand