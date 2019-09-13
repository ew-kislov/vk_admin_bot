# VK Admin Bot

VK бот для администрирования бесед

# Versions

## 1.0.0-alpha.1
**03.08.2019**

Добавлены 3 команды(работающие на mock-нутой БД):

/init - инилиализирует беседу в БД <br/>
/send [текст сообщения] - отправляет сообщение во все беседы, к которым пользователь имеет доступ администратора <br/>
/broadcast [текст сообщения] - отправляет broadcast-сообщение во все беседы, к которым пользователь имеет доступ администратора <br/>

## 1.0.0-alpha.2
**03.08.2019**

Добавлены 2 команды(работающие на mock-нутой БД):

/kick @idxxxxxxxxxx [причина] - удаляет пользователя с определенным id с указанием причины  <br/>
/grant @idxxxxxxxxxx [роль] - назначает роль пользователю с определенным id <br/>

## 1.0.0-alpha.3
**04.08.2019**

Установлено соединение с MySQL <br/>
Бизнес логика обработки команды соединена с БД, кроме проверки ролей

## 1.0.0-beta
**05.08.2019**

Добавлена проверка ролей. Функционал приложения, согласно ТЗ, реализован <br/>

## 1.0.0
**19.08.2019**

Исправлены баги с командами /send /broadcast, добавлена задержка при отправке сообщений с помощью /send /broadcast <br/>

## 1.0.1-beta
**19.08.2019**

Броадкаст сообщение с пустым текстом уведомления. Добавлено логгирование в файл ./src/actions.log <br/>

# Install

1. Установить node.js и npm
``` sudo apt-get install nodejs ```
``` sudo apt-get install npm ```

2. Установить nodemon cli
``` npm install -g nodemon ```

3. Скачать зависимости(выполнять команду из директории проекта)
``` npm install ```

4. В MySQL CLI выполнить команду(заменив значения ``` user ```, ``` url ```, ``` password ```)
``` ALTER USER 'user'@'url' IDENTIFIED WITH mysql_native_password BY 'password'; ```

5. В MySQL CLI выполнить скрипт script.sql, изменив ```id``` администратора с ```xxxxxxxxxx``` на нужный

6. В файле ```constants.json``` заменить константу ```ENV``` c ```DEV``` на ```PROD```

# Run
``` npm start ```

# Author

Евгений Кислов
