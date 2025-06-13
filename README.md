# Movies API

REST API для зберігання інформації про фільми, реалізовано на **Express.js** з використанням **Sequelize** та **SQLite**.  
Підтримує авторизацію, CRUD-операції з фільмами, пошук, сортування та імпорт з файлу.  
Ендпоінти створено відповідно до специфікації API для імплементації.

### 1. Завантажити образ з Docker Hub:

docker pull alekstikhonov/movies-api

### 2. Запустити:

docker run --name movies -p 8000:8000 -e PORT=8000 alekstikhonov/movies-api

### 3. API буде доступне за адресою:

http://localhost:8000
