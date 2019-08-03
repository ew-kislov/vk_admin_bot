const { VK } = require('vk-io')
const CONSTANTS = require('./constants.json')

const vkInstance = new VK({
    token: CONSTANTS.TOKEN,
    apiVersion: CONSTANTS.API_VERSION,
})
const { updates, api } = vkInstance

// mocked db
// TODO: replace to original DB
const conversation_table = [
    { id: 1, peer_id: '2000000002', name: 'Тестирование_бота' },
    { id: 2, peer_id: '2000000005', name: 'Тестирование_бота_2' }
]
const role_table = [
    { id: 1, name: 'administrator' },
    { id: 2, name: 'moderator-extended' },
    { id: 3, name: 'moderator' }
]

updates.start()

// messages which start with '/broadcast'
updates.hear(/^\/broadcast/, context => {
    if (context.peerType == 'chat') {
        context.send('Данная команда недоступна в беседе.')
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
        context.send('Данная команда недоступна в беседе.')
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
        context.send('Данная команда недоступна в чате с ботом.')
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

// messages which start with '/kick'
updates.hear(/^\/kick/, context => {
    if (context.peerType == 'user') {
        context.send('Данная команда недоступна в чате с ботом.')
        //TODO: log init declined action to db
        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    let messageContent = context.text
    let wordArray = messageContent.split(' ')

    if (wordArray.length < 3) {
        context.send('Укажите id участника и причину.')
        //TODO: log init declined action to db
        return
    }

    // user id is in 2nd word - format [idxxxxxxxxxx|@idxxxxxxxxxx]
    let userId = wordArray[1].split('|')[0].replace('[id', '')
    // reason text is string of all words with index = 3
    let reason = wordArray.splice(2).reduce((prev, curr) => prev + ' ' + curr)

    api.messages.removeChatUser({ user_id: userId, chat_id: context.chatId })
        .then(response => {
            // log kick action to db
        })
        .catch(error => {
            // log declined action to db
            context.send('Ошибка. Возможно Вы неверно указали id участника.')
        })
})

// messages which start with '/make'
updates.hear(/^\/make/, context => {
    if (context.peerType == 'user') {
        context.send('Данная команда недоступна в чате с ботом.')
        //TODO: log kick declined action to db
        return
    }

    //TODO: check for roles and log declined action if doesn't have permission

    let messageContent = context.text
    let wordArray = messageContent.split(' ')

    if (wordArray.length != 3) {
        context.send('Ошибка в команде. Укажите id участника и роль.')
        //TODO: log make declined action to db
        return
    }

    // user id is in 2nd word - format [idxxxxxxxxxx|@idxxxxxxxxxx]
    let userId = wordArray[1].split('|')[0].replace('[id', '')
    // role is 3rd word
    let role = wordArray[2]

    // TODO: add new granted user
    // TODO: log grant action
})