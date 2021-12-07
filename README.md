# AmazonButClassier

## Table of contents

- [Introduction](#introduction)
- [Team Members](#teammembers)
- [Run](#run)
- [Technology](#technology)

## Introduction

A virtual online clothing website using Node js, Express js, and Mongoose.

## Team Members

- Akshat Maheshwari (AXM210024)
- Deepak Kumar Parameshwarappa Honakeri (DPH200003)
- Aarthi Gunasekaran (AXG200093)

## Run

To run this application, you have to set your own environmental variables. Below are the variables that you need to set in order to run the application:

- MONGO_URI (in the `config/db.js` file): this is the connection string of your MongoDB database.

- SESSION_SECRET (in the `app.js` file): a secret message for the session. You can use any string here.

- ADMIN_EMAIL, ADMIN_PASSWORD (in the `routes/admin.js` file and the `seedDB/admin-seed.js` file): the email and password used to log into the admin panel using AdminBro. You can put any email and password here. This will be your credentials for the admin login

- ADMIN_COOKIE_NAME, ADMIN_COOKIE_PASSWORD (in the `routes/admin.js` file): the cookie name and password used in the AdminBro authentication method. You can put any strings here.

After you've set these variables, you need to run the following commands on your terminal:

```
  npm install
  cd seedDB
  node admin-seed.js
  node category-seed.js
  node product-seed.js
  cd ..
  npm start
```

## Technology

The application is built with:

- Node.js
- MongoDB
- Express.js
- EJS : Used for frontend
- Bootstrap version 4.3.1
- FontAwesome
- Stripe API v3: used for payment in the checkout page (to add the card information)
- AdminBro: used and customized to implement the admin panel
- Passport.js: used for authentication
- Express Validator: used for validations in the signup, signin and the cart checkout
