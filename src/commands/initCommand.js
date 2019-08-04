const { conversationRepository, actionRepository } = require('../repository')
const { ACTION_TYPES } = require('../constants')

function handleInitCommand(context) {
    if (context.peerType == 'user') {
        context.send('Данная команда недоступна в чате с ботом.')

        let action = {
            type_id: ACTION_TYPES.CONVERSATION_INITIALIZATION_DENIED,
            vk_user_id: context.senderId,
            details: 'Попытка инициализации из чата с ботом'
        }
        actionRepository.addAction(action)

        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    vk_api.messages.getConversationsById({ peer_ids: context.peerId })
        .then(response => {
            let peer_id = response.items[0].peer.id
            let name = response.items[0].chat_settings.title
            let conversation = {
                peer_id,
                name
            }
            return conversation
        })
        .then(async conversation => {
            let conversationsByPeerId = await conversationRepository.getConversationByPeerId(conversation.peer_id)
            let conversationsByName = await conversationRepository.getConversationByName(conversation.name)

            if (conversationsByPeerId.length != 0) {
                context.send('Бот уже инициализирован в этой беседе.')

                let action = {
                    type_id: ACTION_TYPES.CONVERSATION_INITIALIZATION_DENIED,
                    vk_user_id: context.senderId,
                    details: 'Бот уже инициализирован в этой беседе'
                }
                actionRepository.addAction(action)
            }
            else if (conversationsByName.length != 0) {
                context.send('Бот уже добавлен в беседу с таким же названием. Измените название.')

                let action = {
                    type_id: ACTION_TYPES.CONVERSATION_INITIALIZATION_DENIED,
                    vk_user_id: context.senderId,
                    details: 'Бот уже добавлен в беседу с таким же названием'
                }
                actionRepository.addAction(action)
            }
            else {
                await conversationRepository.addConversation(conversation)
                context.send('Бот успешно инициализирован.')

                let action = {
                    type_id: ACTION_TYPES.CONVERSATION_INITIALIZED,
                    vk_user_id: context.senderId
                }
                actionRepository.addAction(action)
            }

        })
        .catch(() => {
            let action = {
                type_id: ACTION_TYPES.CONVERSATION_INITIALIZATION_DENIED,
                vk_user_id: context.senderId,
                details: 'Внутренняя ошибка/бот не был назначен администратором'
            }
            actionRepository.addAction(action)

            context.send('Во время инициализации произошла ошибка. Возможно бот не был назначен администратором.')
        })
}

module.exports = handleInitCommand