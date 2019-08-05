const { conversationRepository, actionRepository, userRoleRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

async function handleBroadcastCommand(context) {
    if (context.peerType == 'chat') {
        context.send('Данная команда недоступна в беседе.')

        let action = {
            type_id: ACTION_TYPES.BROADCAST_MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Попытка отправки broadcast-сообщения из беседы'
        }
        actionRepository.addAction(action)

        return
    }

    isAdministrator = await userRoleRepository.checkIfUserAdministrator(context.senderId)
    if (!isAdministrator) {
        context.send('У вас нет прав на данную команду.')

        let action = {
            type_id: ACTION_TYPES.BROADCAST_MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Нет прав на команду'
        }
        actionRepository.addAction(action)

        return
    }

    // content of received message
    let messageContent = context.text

    if (messageContent == '/broadcast') {
        let action = {
            type_id: ACTION_TYPES.BROADCAST_MESSAGE_SENDING_DENIED,
            vk_user_id: context.senderId,
            details: 'Неверное количество параметров в команде'
        }
        actionRepository.addAction(action)

        context.send('Укажите текст broadcast-сообщения.')
        return
    }

    // text of broadcast message to send
    let broadcastText = messageContent.substr(messageContent.indexOf(' ') + 1)

    conversationRepository.getConversations()
        .then(conversations => {
            conversations.forEach(conversation => {
                vk_api.messages.getConversationMembers({ peer_id: conversation.peer_id })
                    .then(members => {
                        let idString = ''
                        members.profiles.forEach(profile => idString += ('@id' + profile.id + ' '))

                        let messageString = broadcastText + '\n' + idString
                        return messageString
                    })
                    .then(message => vk_api.messages.send({ peer_id: conversation.peer_id, message: message }))
                    .then(() => {
                        let action = {
                            type_id: ACTION_TYPES.BROADCAST_MESSAGE_SENT,
                            vk_user_id: context.senderId
                        }
                        actionRepository.addAction(action)
                    })

            })
        })
        .catch(() => {
            let action = {
                type_id: ACTION_TYPES.BROADCAST_MESSAGE_SENDING_DENIED,
                vk_user_id: context.senderId,
                details: 'Внутренняя ошибка'
            }
            actionRepository.addAction(action)
        })
}

module.exports = handleBroadcastCommand