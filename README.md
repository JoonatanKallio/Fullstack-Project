README.md

# Full stack forum


# Technologies used

This project uses Node.js in its backend. The data is stored in a MongoDB database and it is accessed from the backend with Mongoose. The application uses React in the frontend. React-router is used to route the user and MUI library is used to style the application. There are also Cypress tests that can be run to test the application.

# How to run the project:

**You have to have MongoDB installed on your computer**

</br>

Install packages by typing `npm run install` in the root folder to install the client and server packages.

Then go to the server folder and run `npm run dev`

Then open the client folder and run  `npm run start`

To run the cypress tests, type `npm run test` in the project folder.

**The tests can only be run once successfully, then you need to delete the test posts, comments and users from the database to test again.**
