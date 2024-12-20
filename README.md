# after-school-classes-backend
An Express.js-based back-end server for managing after-school classes and activities, featuring REST APIs for retrieving lessons, placing orders, and updating availability, with MongoDB Atlas as the database.
# Links
- FrontEnd Repo: https://github.com/JavaBongo/after-school-classes-vue
- BackEnd Repo: https://github.com/JavaBongo/after-school-classes-backend
- Render Service: https://after-school-classes-backend-nvk9.onrender.com
- Github Pages: https://javabongo.github.io/after-school-classes-vue/
- FrontEnd Commits: https://github.com/JavaBongo/after-school-classes-vue/commits/main/
- BackEnd Commits: https://github.com/JavaBongo/after-school-classes-backend/commits/main/
# Commit 1 - Initialize Express basic app
- Added package.json with express dependency.
- Added server.js with basic express app setup.
- Added .gitignore for node_modules/.
# Commit 2 - Setup simple GET request
- Modified server.js to implement simple get request and display information using .json format.
# Commit 3 - Logger Middleware implemented
- Modified server.js to implement logger middleware. Type of requests & response status will be displayed in the server console.
# Commit 4 - Mongodb connection and displaying data using GET
- Modified server.js to implement mongodb connection & display data from database's collections.
# Commit 5 - REST Api PUSH implemented for adding data in databases's collection
- Modified server.js to implement REST Api PUSH method. Data can now be added to database collection.
# Commit 6 - REST Api PUT implemented for updating data in databases's collection
- Modified server.js to implement REST Api PUT method. Data update now possible.
# Commit 7 - Static files for images in assets folder implemented
- Modified .gitignore to ignore .DS_Store
- Added Assets folder with 15 image items.
- Updated server.js to implement static rendering of images in assets folder,
# Commit 8 - Refactor server code into modular functions for routes and middleware
- Updated server.js to refactor code into modular functions
# Commit 9 - Add search functionality for collections based on title and location
- Updated server.js to implement search functionality for getting queried data. Can get title & location of the lessons for now.
# Commit 10 - Fix update logic and add advanced search with aggregation for price and availability
- Updated server.js to implement search function further. Pipeline is defined as it will handle non string (int, float, numner) type data: availability & price. Start by creating data attributes as string attributes, query find, and finaly remove newly created string attributes from the output. Aggregate the pipeline.