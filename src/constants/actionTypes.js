const ACTION_TYPES = {
    CONVERSATION_INITIALIZED: 1,
    CONVERSATION_INITIALIZATION_DENIED: 2,
    MESSAGE_SENT: 3,
    MESSAGE_SENDING_DENIED: 4,
    BROADCAST_MESSAGE_SENT: 5,
    BROADCAST_MESSAGE_SENDING_DENIED: 6,
    USER_KICKED: 7,
    USER_KICK_DENIED: 8,
    USER_GRANTED: 9,
    USER_GRANT_DENIED: 10
}

const ACTION_TYPE_STRINGS = [
    '',
    'Беседа инициализирована',
    'Инициализация беседы - отказано',
    'Сообщение отправлено',
    'Отправление сообщения - отказано',
    'Broadcast-сообщение отправлено',
    'Отправление Broadcast-сообщения - отказано',
    'Пользователь исключен',
    'Исключение пользователя - отказано',
    'Пользователь назначен',
    'Назначение пользователя - отказано'
]

module.exports = { ACTION_TYPES, ACTION_TYPE_STRINGS}