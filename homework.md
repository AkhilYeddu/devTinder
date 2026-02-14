# DevTinder Project

- Create a repository
- Initialize the repository
- node_modules, package.json, package-lock.json
- Install express
- Create a server
- Listen to port 3000
- Write request handlers for /test, /hello
- Install nodemon and update scripts inside package.json
- What are dependencies
- What is the use of "-g" while npm install
- Diffrence between caret and tilda (^ vs ~)

- initialize git
- .gitignore
- create a remote repository on github
- push all code to the remote origin
- play with routes and route extensions ex. /hello, /, /hello/2, /xyz etc.
- order of the routes matter a lot
- install postman app, create a workspace/ collection and then test API Calls
- write logic to GET, POST, PUT, PATCH, DELETE and test them on postman
- explore routing and use of ?, +, *, () in the routes
- use of RegEx in routes /a/, /.*fly$/
- reading the query params in the route
- reading the dyanmic routes in the route

- handling multiple route handlers and play with the code
- next()
- next function and errors along with res.send()
- what is a middleware ? Why do we need it ?
- how expressJS basically handles requests behind the scenes
- write a dummy auth middleware for admin
- write a dummy auth middleware for all user routes, expect /user/login
- Error handling using app.use("/",(err, req, res, next)={});

- create a free cluster on mongoDB official website (mongoAtlas)
- install mongoose library
- connect your application to the database connectionURL/devTinder
- call connectDB function and connect to database before starting application on 3000
- create a user schema and userModel
- create a POST /signup API to add data to the database
- push some documents using API calls from postman
- Error handling using try, catch

- JSON V/S JSObject (Difference)
- Add the express.json() to your app
- Make your signup API dynamic to receive data from the end user
- User.findOne() with duplicate emailIds, which document will be returned
- /get API - get  user by Email
- /feed API  - get all users data from the database
- API - get user by ID
- create a delete User API
- Difference between PATCH and PUT
- API - update a user
- Explore the mongoose documentation for model Methods
- What are options is Model.findOneAndUpdate() method, explore more about it
- API - update the user with email ID