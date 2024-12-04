# after-school-classes-backend
An Express.js-based back-end server for managing after-school classes and activities, featuring REST APIs for retrieving lessons, placing orders, and updating availability, with MongoDB Atlas as the database.
# Links
- FrontEnd Repo: https://github.com/JavaBongo/after-school-classes-vue
- BackEnd Repo: https://github.com/JavaBongo/after-school-classes-backend
- Render Service: 
- Github Pages: https://javabongo.github.io/after-school-classes-vue/
# Commit 1 - Initialize Express basic app
- Added package.json with express dependency
- Added server.js with basic express app setup
- Added .gitignore for node_modules/
# Commit 2 - Setup simple GET request
- Modified server.js to implement simple get request and display information using .json format
# Commit 3 - Logger Middleware implemented
- Modified server.js to implement logger middleware. Type of requests & response status will be displayed in the server console.
# Commit 4 - Mongodb connection and displaying data using GET
- Modified server.js to implement mongodb connection & display data from database's collections
# Commit 5 - REST Api PUSH implemented for adding data in databases's collection
- Modified server.js to implement REST Api PUSH method. Data can now be added to database collection.
# Commit 6 - REST Api PUT implemented for updating data in databases's collection
- Modified server.js to implement REST Api PUT method. Data update now possible.