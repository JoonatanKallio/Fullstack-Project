README.md

How to run the project:

First install packages by typing `npm run install` in the root folder and it installs client and server packages.

Then run the project server first in windows `SET NODE_ENV=develpoment& npm run dev:server`

Then run the client `npm run dev:client`

To run the cypress tests, type `npm run test`. 

The cypress tests can only be run once and then you need to delete the user from the database that the test creates if you want to run the tests again.
