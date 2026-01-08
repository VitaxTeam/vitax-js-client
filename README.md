# Vitax JS Client

Официальная клиентская библиотека для работы с API [vitax](https://vitax.su).
Поддерживает Node.js и TypeScript.

## Установка

```bash
npm install @vitax/js
```

## Конфигурация

```js
const client = new VitaxClient({
    // OAuth
    clientId: "ID приложения", // ID приложения
    clientSecret: "Client Secret приложения", // Secret для обмена кода на токен
    redirectUri: "Редирект cсылка, которую вы указали в приложении", // Переадресация после авторизации
    // Bill, etc
    appToken: "Токен приложения", // Для создания платеж. ссылки
    webhookSecret: "Секрет вебхука приложения", // Для проверки X-Signature вебхука
})
```

## Примеры

Смотрите в [/example](/example)

## Лицензия

[GNU](/LICENSE) © [VitaxTeam](https://github.com/VitaxTeam)