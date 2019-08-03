const { VK } = require('vk-io')
const CONSTANTS = require('./constants.json')

const vkInstance = new VK({
    token: CONSTANTS.TOKEN,
    apiVersion: CONSTANTS.API_VERSION,
})
const { updates, api } = vkInstance

// mocked table
// TODO: replace to original DB
const conversation_table = [
    { id: 1, peer_id: '2000000002', name: 'Тестирование_бота' },
    { id: 2, peer_id: '2000000005', name: 'Тестирование_бота_2' }
]

updates.start()

// messages which start with '/broadcast'
updates.hear(/^\/broadcast/, context => {
    if (context.peerType == 'chat') {
        //TODO: log broadcast denied action to db
        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    // content of received message
    let messageContent = context.text

    if (messageContent == '/broadcast') {
        context.send('Укажите текст broadcast-сообщения.')
        return
    }

    // text of broadcast message to send
    let broadcastText = messageContent.substr(messageContent.indexOf(' ') + 1)

    //TODO: fetch conversations for user

    conversation_table.forEach(conversation => {
        api.messages.getConversationMembers({ peer_id: conversation.peer_id })
            .then(members => {
                let idString = ''
                members.profiles.forEach(profile => idString += ('@id' + profile.id + ' '))

                let messageString = broadcastText + '\n' + idString
                return messageString
            })
            .then(message => api.messages.send({ peer_id: conversation.peer_id, message: message }))
            .then(() => {
                //TODO: log broadcast action to db
            })
            .catch(error => {
                //TODO: log error to db
            })
    })
})

// messages which start with '/broadcast'
updates.hear(/^\/send/, context => {
    if (context.peerType == 'chat') {
        //TODO: log broadcast denied action to db
        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    // content of received message
    let messageContent = context.text

    if (messageContent == '/send') {
        context.send('Укажите текст сообщения.')
        return
    }

    // text of message to send
    let messageText = messageContent.substr(messageContent.indexOf(' ') + 1)

    //TODO: fetch conversations for user

    conversation_table.forEach(conversation => {
        api.messages.send({ peer_id: conversation.peer_id, message: messageText })
            .then(() => {
                //TODO: log broadcast action to db
            })
            .catch(error => {
                //TODO: log error to db
            })
    })
})

// messages which start with '/init'
updates.hear(/^\/init/, context => {
    if (context.peerType == 'user') {
        //TODO: log init declined action to db
        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    api.messages.getConversationsById({ peer_ids: context.peerId })
        .then(response => {
            let peer_id = response.items[0].peer.id
            let name = response.items[0].chat_settings.title
            let conversation = {
                peer_id,
                name
            }
            return conversation
        })
        .then(conversation => {
            // TODO: check if conversaion already exists and send message
            // TODO: log declined/init action
        })
        .catch(() => {
            // TODO: log declined action
            context.send('Во время инициализации произошла ошибка. Возможно бот не был назначен администратором.')
        })
})