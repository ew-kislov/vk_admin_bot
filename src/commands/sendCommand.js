const { conversationRepository, actionRepository, userRoleRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

async function handleSendCommand(context) {
    if (context.peerType == 'chat') {
        context.send('Данная команда недоступна в беседе.')

        let action = {
            type_id: ACTION_TYPES.MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Попытка отправки сообщения из беседы'
        }
        actionRepository.addAction(action)

        return
    }

    isAdministrator = await userRoleRepository.checkIfUserAdministrator(context.senderId)
    if (!isAdministrator) {
        context.send('У вас нет прав на данную команду.')

        let action = {
            type_id: ACTION_TYPES.MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Нет прав на команду'
        }
        actionRepository.addAction(action)

        return
    }

    // content of received message
    let messageContent = context.text

    if (messageContent == '/send') {
        let action = {
            type_id: ACTION_TYPES.MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Неверное количество параметров в команде'
        }
        actionRepository.addAction(action)

        context.send('Укажите текст сообщения.')
        return
    }

    // text of message to send
    let messageText = messageContent.substr(messageContent.indexOf(' ') + 1)

    conversationRepository.getConversations()
        .then(conversations => {
            conversations.forEach(conversation => {
                vk_api.messages.send({ peer_id: conversation.peer_id, message: messageText })
                    .then(() => {
                        let action = {
                            type_id: ACTION_TYPES.MESSAGE_SENT,
                            vk_user_id: context.senderId
                        }
                        actionRepository.addAction(action)
                    })
            })
        })
        .catch(() => {
            let action = {
                type_id: ACTION_TYPES.MESSAGE_SENDING_DENIED,
                vk_user_id: context.senderId,
                details: 'Внутренняя ошибка'
            }
            actionRepository.addAction(action)
        })
}

module.exports = handleSendCommand