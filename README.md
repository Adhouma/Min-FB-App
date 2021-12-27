# Min-FB-APP
Min Facebook App using MEAN STACK (MongoDB / Express.js / Angular / Node.js)<br />

# Key features
- CRUD (Create / Read / Update / Delete ) posts<br />
- Images uploads<br />
- Pagination<br />
- User authentication<br />
- Authorization<br />

# Test the project Locally
- Create cluster on MongoDB Atlas <br />
- Update nodemon.json located in mean-backend/nodemon.json and update MONGODB_ATLAS_USER, MONGODB_ATLAS_PASSWORD with your cluster credentials. <br> 
- Clone this project <br />
- Make sur nodemon is installed locally or globally<br />
```
cd mean-backend
npm install
nodemon server.js

cd mean-frontend
npm install
ng serve --open
```