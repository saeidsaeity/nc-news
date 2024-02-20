# Northcoders News API
This project is to further develop my skills in javascript and psql and is a showcase of what i have learnt so far
## Hosting Location
This Backend Code is hosted on Render Make api calls to this link: 
[Website](https://saeids-interesting-news.onrender.com)
## Configuration
To install Dependencies run this command in terminal:
```javascript
    npm install
```
To configure the database you will need to:
 - install the Dotenv package 
 - create a .env.development and .env.test 
 - specify your database name with PG_DATABASE = 'insert name here' without the quotation marks 

 After creating the files for you databases you will need to run:
```javascript
        npm run setup-dbs
```
## Dependency Versions

- Node.js : v21.5.0
- Postgres : v8.7.3