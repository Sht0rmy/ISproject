## Для запуску проекту нам потрібно завантажити:

- [Node.js v16](https://github.com/nvm-sh/nvm)
- [yarn >=1.22](https://classic.yarnpkg.com/en/docs/install)
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Встановлення залежностей:

<p>Відкриваємо термінал в руті проекту</p>

```
yarn install # встановлення залежностей 
```

<p>Залежності для клієнтської частини:</p>

```
cd front/myknu # перехід в директорію з клієнтською частиною з кореневої папки
```

```
yarn install
```

<p>Залежності для сервера:</p>

```
cd back/myknu # перехід в директорію з сервером з кореневої папки
```

```
yarn install
```

## Запуск проекту:

<p>Відкриваємо термінал в руті проекту</p>

```
docker compose build # збірка контейнера з БД
```

```
docker compose up # запуск конейнера з БД
```

<p>Переходимо до директорії з сервером</p>

```
yarn start # запуск сервера на Nest.JS
```

<p>Переходимо до директорії з клієнтською частиною</p>

```
yarn start # запуск клієнтської частини на React
```