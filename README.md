# Node-js-all

## content

[Intro](#intro) <br/>
[Basic Concepts](#basic) <br/>
[Express.js](#express) <br/>
[Dynamic Content](#dynamic-content) <br/>
[MVC](#mvc) <br/>
[Dynamic Routes & Advance Models](#DRAM) <br/>
[SQL](#sql) <br/>
[Sequelize](#sequelize)<br/>
[NoSQL](#nosql) <br/>
[Mongoose](#mongoose)<br/>
[Sessions and Cookies](#sessions)<br/>
[Authentication](#authentication)<br/>
[Email sending](#email)<br/>
[Validation](#validation)<br/>
[Error handling](#errors)<br/>
[File Upload](#upload)<br/>
[Pagination](#pagination)<br/>
[Payments](#payments)<br/>
[REST API](#rest)<br/>
[Web Socket](#websocket)<br/>
[GraphQL](#graphql)<br/>
[Deployment](#deployment)<br/>
[Testing node](#testing)<br/>

## intro

[Official page](https://nodejs.org/en/docs/)

```console
- update npm
npm install -g npm@latest

- update node
sudo npm install -g n
sudo n latest
- or
sudo n stable
- or
sudo n 10.15.0
```

```console
node
global
process
```

Core module in node:

- **http** <br/>
- **https** <br/>
- **fs** <br/>
- **os** <br/>
- **path** <br/>

To import module use:

```javascript
const http = require("http");
```

**Scripts in package.json**

```console
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node app.js"
},

run: npm start
-- start is reserved name so it can be run this way --
-- custom scripts call with --
run: npm run script-name

```

[TOP](#content)

## basic

[NPM](https://www.npmjs.com/)

**Using npm package:**

```console
> npm install package-name --save-dev

-- adding --save -> save as production dependency
-- adding --save-dev -> save as development dependency
-- adding -g install globally on PC
```

**Setup nodemon**

```console
> npm install nodemon --

-- nodemon is Simple monitor script for use during development of a node.js app
-- Auto refresh server during development
```

```console
In package.json add

"scripts": {
  "start": "nodemon app.js"
},
Run:
> npm start
```

**Setup debugger**

- Quit server

- Press F5

- Set break point

- execute app in browser

Setup launch.json file

```javascript
"configurations": [
{
    "restart": true,
    "runtimeExecutable": "nodemon",
    "console": "integratedTerminal"
}
]
```

Install nodemon globally

```console
sudo npm install nodemon -g
```

Press again F5 now it executed with server and debugger

[TOP](#content)

## express

[Express](https://expressjs.com/en/guide/routing.html)

Install

```console
npm install --save express
```

Core concept of express is use of middleware

```javascript
app.use((req, res, next) => {
  // ... do stuff
  next(); // Continue to next middleware
});
// .use() allows to add new middleware action

app.use((req, res, next) => {
  console.log("In another middleware!");
  /** Sending response */
  res.send("<h1>Hello!</h1>");
});
// res. can use all functions from node like (setHeaders, write ...)

// Remove http by adding
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

**Handling routes**

use() can receive args like (path, callback) path by default is '/'

```javascript
app.use("/test", (req, res, next) => {
  console.log("In 'test-page' middleware!");
  /** Sending response */
  res.send("<h1>Hello from test page!</h1>");
});
/** always put '/' last because code is execute from top-to-bottom */
app.use((req, res, next) => {
  console.log("In another middleware!");
  /** Sending response */
  res.send("<h1>Hello from '/'!</h1>");
});
```

**Parsing request**

Instal body-parser package

```console
npm install --save body-parser
```

```javascript
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/some-form", (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form>"
  );
});

app.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});
```

**Using router**

Create router folder (see in 3-Express)

```javascript
// create routes/shop.js file
const express = require("express");

const router = express.Router();

/** always put '/' last because code is execute from top-to-bottom */
router.get((req, res, next) => {
  /** Sending response */
  res.send("<h1>Hello from '/'!</h1>");
});

module.exports = router;

// in app .js
const shopRoutes = require("./routes/shop");
app.use(shopRoutes);
```

**Handle 404 error page**

```javascript
// At the bottom of all routs (if all routes fail)
app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found!</h1>");
});
```

**Filtering paths**

```javascript
app.use("/admin", adminRoutes);
// now all routes in admin.js file start with /admin/route-name
```

**Serving html pages**

```javascript
// create folder views and add shop.html file
res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
// __dirname -> point to current folder
// ".." -> go up one level
// views -> go to folder
// shop.html -> go to file

// Or create folder util/path.js
const path = require("path");
module.exports = path.dirname(process.mainModule.filename);
// In admin.js
const rootDir = require("../util/path");
res.sendFile(path.join(rootDir, "views", "shop.html"));
```

**Serving files statically**

Serving files like css from public folder

```javascript
app.use(express.static(path.join(__dirname, "public")));
```

[TOP](#content)

## dynamic-content

**Template's Engine**

[Pug Docs:](https://pugjs.org/api/getting-started.html)

[Handlebars Docs:](https://handlebarsjs.com/)

[EJS Docs:](http://ejs.co/#docs)

Installing of EJS ( there are also Handlebars and Pug)

```console
npm install --save ejs
```

set engine

```javascript
app.set("view engine", "ejs");

// Syntax
<%= variable %>
```

[TOP](#content)

## mvc

[More on MVC:](https://developer.mozilla.org/en-US/docs/Web/Apps/Fundamentals/Modern_web_app_architecture/MVC_architecture)

Creating controllers

```javascript
// create file controllers/products.js
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};
// In routes/admin.js
```

Creating models

```javascript
// create file models/product.js
const products = [];

/** Can be done as a function  */
// module.exports = function Product() {}
/** or Class */
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  /**
   * Static make sure that you can call method directly on the class itself
   * and not on instance so basically you dont need instance to call this function
   * like:
   *    let b = new Product("Some title");
   *    b.fetchAll();
   * you can call it like
   *    Product.fetchAll()
   */
  static fetchAll() {
    return products;
  }
};

// In controller/products.js
const Product = require("../models/product");
```

[TOP](#content)

## DRAM

[Official Routing Docs:](https://expressjs.com/en/guide/routing.html)

Creating link with id passed to route

```javascript
<a href="/products/<%= product.id %>">Details</a>;
// create an route
router.get("/products/:productId");
// get params from rout in controller
exports.getProducts = (req, res, next) => {
  const productId = req.params.productId; // this name must be same as in route
};
```

[TOP](#content)

## sql

[MySQL/ SQL in General:](https://www.w3schools.com/sql/)

[Node MySQL Package:](https://github.com/sidorares/node-mysql2)

Install mysql server

```console
sudo apt install mysql-server
sudo apt install net-tools
-- check if server is running
sudo netstat -tap | grep mysql
-- If the server is not running correctly, you can type the following command to start it:
sudo service mysql restart
-- Install mysql workbench
sudo apt install mysql-workbench

-- configure server
cd /etc/mysql
ls
-- find my.cnf
sudo vim my.cnf
-- You can overwrite config if create an file in home/user/my.cnf
```

[MYSQL-Server-config](https://support.rackspace.com/how-to/configuring-mysql-server-on-ubuntu/)

Reset mysql root password

```console
service mysql stop
sudo mysqld_safe --skip-grant-tables &

-- If having problem with this step run
sudo mkdir -p /var/run/mysqld
sudo chown mysql:mysql /var/run/mysqld

-- Rerun pervious command and run
mysql -u root
-- This will add you
mysql>

-- Then run
mysql>FLUSH PRIVILEGES;
mysql>SET PASSWORD FOR root@'localhost' = PASSWORD('password');
-- TO Exit run CTRL+D

-- Now run
service mysql stop
service mysql start

```

[MYSQL-Password reset](https://help.ubuntu.com/community/MysqlPasswordReset)
[Other Option](https://www.vultr.com/docs/reset-mysql-root-password-on-debian-ubuntu)

Install node package for mysql

```console
npm install --save mysql2
```

Create file util/database.js

```javascript
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

module.exports = pool.promise();
```

To work with .env in node

```console
npm install dotenv --save
```

In App.js

```javascript
const dotenv = require("dotenv");
dotenv.config();
```

Execute query in app.js

```javascript
const db = require("./util/database");
db.execute("SELECT * FROM products")
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
```

For DB query's check model/products.js

[TOP](#content)

## sequelize

Sequelize is an Object-Relational Mapping Library

[Sequelize Official Docs](http://docs.sequelizejs.com/)

```console
npm install --save sequelize
```

Creating an model

```javascript
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});
```

Sync (create) all models in database as tables

```javascript
// in app.js
sequelize
  .sync()
  .then(result => {
    console.log("Sequelize result from sync: ", result);
    /** Init server */
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch(err => {
    console.log("Error from Sequelize sync: ", err);
  });
```

Insert data

```javascript
Product.create({
  title: title,
  price: price,
  imageUrl: imageUrl,
  description: description
})
  .then(result => {
    console.log("Product is created!");
    // console.log("Result from Product.create: ", result);
  })
  .catch(err => {
    console.log("postAddProduct error in admin.js: ", err);
  });
```

Creating relations

```javascript
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
```

Creating middleware

```javascript
// in app.js
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log("Error from User middleware: ", err));
});
// so now you can use in admin.js in postAddProduct function
req.user.createProduct({
  title: title,
  price: price,
  imageUrl: imageUrl,
  description: description
});
// createProduct is automatically created from relations
```

[TOP](#content)

## nosql

NoSQL & MongoDB

[MongoDB Official Docs:](https://docs.mongodb.com/manual/core/security-encryption-at-rest/https://docs.mongodb.com/manual/)

[SQL vs NoSQL:](https://academind.com/learn/web-dev/sql-vs-nosql/)

[Learn more about MongoDB:](https://academind.com/learn/mongodb)

Setup: Go to MongoDB create a account and create a new cluster

In mongoDb we have: database, collections (tables) and documents (data)

Installing drivers

```console
npm install --save mongodb
```

Check connection in util/database and in app.js

[TOP](#content)

## mongoose

Mongoose is ODM (Object Document Mapping Library)

[Mongoose Official Docs:](https://mongoosejs.com/docs/)

```console
npm install --save mongoose
```

Make an connection look app.js

Make an Schema look at models/product.js user.js

[TOP](#content)

## sessions

[Sessions:](https://www.quora.com/What-is-a-session-in-a-Web-Application)

[Cookies:](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

[Express-session Docs:](https://github.com/expressjs/session)

**Cookies** is way of authentication set in browser (client)

When to use cookies:

1. To track users <br/>
2. Do not store sensitive data in cookie<br/>

```javascript
// Setting cookie
res.setHeader("Set-Cookie", "isLoggedIn=true");
```

**Sessions** is way of authentication set on server (back-end)

```console
npm install --save express-session
```

```javascript
const session = require("express-session");
app.use(
  session({
    secret: process.env.MY_HASH_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
// To access and set session
req.session.isLoggedIn = true;
```

To use session with MongoDB

```console
npm install --save connect-mongodb-session
```

```javascript
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_URL,
  collection: "sessions"
});

app.use(
  session({
    secret: process.env.MY_HASH_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Can also add cookie after store
cookie: {
  data...
}
```

[TOP](#content)

## authentication

[Bcrypt Official Docs:](https://github.com/dcodeIO/bcrypt.js)

[CSRF Attacks:](https://www.acunetix.com/websitesecurity/csrf-attacks/)

**Encrypting password**

```console
npm install --save bcryptjs
```

```javascript
const bcrypt = require("bcryptjs");

// This returns promises
bcrypt.hash(password, 12)
  .then(hashPass => {
    ...
  });

// Compare passwords
bcrypt
  .compare(password, user.password)
  .then(passwordMatch => {
    if(!passwordMatch) {
      return res.redirect('/login')
    }
  })
```

**Route protection**

```javascript
// Create an middleware
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

// In routes folder
const isAuth = require("../middleware/is-auth");
router.get("/add-product", isAuth, adminController.getAddProduct);
```

**CSRF**

Cross-Site Request Forgery

```console
npm install --save csurf
```

```javascript
const csrf = require("csurf");
const csrfProtection = csrf();
// Add this line after session init
app.use(csrfProtection);
// Generate token and pass to view (shop.js getIndex function)
csrfToken: req.csrfToken();
// Add this to every view
<input type="hidden" name="_csrf" value="<%= csrfToken %>" />;
```

Show user error message using session

```console
npm install --save connect-flash
```

```javascript
const flash = require("connect-flash");
// Add this after session init
app.use(flash());
// Use in code during redirect (look in controllers/auth.js in 12-Authentication)
req.flash("error", "Invalid email or password!");
res.redirect("/");
// Now go to getLogin function
errorMessage: req.flash("error");
// Set in view (login.ejs)
<% if(errorMessage) { %>
  <div class="user-message user-message--error"><%= errorMessage %></div>
<% } %>
```

**Password Reset**

see in module 12-Authentication

1. Create an view (reset.ejs), controller (auth.js / getReset)

2. Make an action postReset in auth.js

```javascript
// This is build in NODE.js
const crypto = require("crypto");
// See rest of code in controllers/auth.js actions
// getReset and postReset
// also getNewPassword and post NewPassword
```

**Authorization**

Restricting user for some functionality (edit post from other users)

```javascript
// Add filter for product
Product.find({ userId: req.user._id });
```

[TOP](#content)

## email

[Nodemailer Official Docs:](https://nodemailer.com/about/)

[SendGrid Official Docs:](https://sendgrid.com/docs/)

```console
npm install --save nodemailer nodemailer-sendgrid-transport
```

```javascript
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

// Go to SendGrid site to settings / API Keys and create API key
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: API_KEY
    }
  })
);

// TO use
transporter
  .sendMail({
    to: email,
    from: "test@test.com",
    subject: "Subject",
    html: "<h1>Welcome!</h1>"
  })
  .then()
  .catch();
```

[TOP](#content)

## validation

[Express-Validator Docs:](https://express-validator.github.io/docs/)

[Validator.js Docs:](https://github.com/chriso/validator.js)

1. Validate on Client Side (Optional: Improve user experience)

2. Validate on Server Side (Required)

```console
npm install --save express-validator
```

```javascript
// in roures/auth.js module 13-Validation
const { check } = require("express-validator/check");
router.post("/signup", check("email").isEmail(), authController.postSignup);

// in controllers/auth.js
const { validationResult } = require("express-validator/check");

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errors.array()
  });
}
```

Sanitizing data - modify data to be valid

[TOP](#content)

## errors

[http-status-code](https://httpstatuses.com/)

[Error Handling in Express.js](https://expressjs.com/en/guide/error-handling.html)

**_Synchronous code use_**

**try-catch**

Can throw error like:

```javascript
throw new Error("Message");
// or
try {
  // logic
} catch (err) {
  // log err
}
```

**_Asynchronous code use_**

**then()-catch()**

Can throw error like:

```javascript
.then(res => {
  // ...logic
}).catch(err => {
  // log err
})
```

[TOP](#content)

## upload

[Multer Official Docs:](https://github.com/expressjs/multer)

[Streaming Files:](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93)

[Generating PDF-s with PDFKit:](http://pdfkit.org/docs/getting_started.html)

In frontend create an image picker

```html
<form method="POST" enctype="multipart/form-data">
  <div class="form-control">
    <label for="image">Image</label>
    <input type="file" name="image" id="image" />
  </div>
</form>
```

To read file data (binary) install package

```console
npm install --save multer
```

```javascript
// in app.js
const multer = require("multer");
// image is name of file picker
// single || multi
app.use(multer().single("image"));

// To access file in controller
image: req.file;
// req.file will give buffer
// to make an folder and give random hash name add config to multer
app.use(multer({ dest: "images" }).single("image"));
// This will add (path) folder images and store image inside
```

Other better setup

```javascript
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // provide err or null if wont to ignore
    // 'images' is folder to store image
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // provide err or null if wont to ignore
    // new Date().toISOString is current time in string (create unique image)
    // file.originalname is name of image with extension
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

app.use(multer({ storage: fileStorage }).single("image"));
```

To filter files

```javascript
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // provide err or null to ignore
    // true if want to store, false to not store
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
```

Serving images on web site

1. Use static way

```javascript
app.use("/images", express.static(path.join(__dirname, "images")));
// In all views where you load image add / before like '/product.imageUrl'
```

2. Serving files not static way (Download invoices)

Create link for download

```html
<a target="_blank" href="/orders/<%= order._id %>">Invoice</a>
```

Create an route (routes/shop.js)

```javascript
router.get("/orders/:orderId", isAuth, shopController.getInvoice);
```

Create na controller (controllers/shop.js) **See getInvoice**

**Generate PDF (PDFKit - create PDF on Node server)**

```console
npm install --save pdfkit
```

```javascript
const PDFDocument = require("pdfkit");

// Create PDF-s
const pdfDoc = new PDFDocument();
res.setHeader("Content-Type", "application/pdf");
// inline - open inline
// attachment - download directly
res.setHeader("Content-Disposition", `inline; filename='${invoiceName}'`);
// Store on server
pdfDoc.pipe(fs.createWriteStream(invoicePath));
// Pipe to client
pdfDoc.pipe(res);
```

Delete Files (util/file.js)

In controllers/admin.js

```javascript
const fileHelper = require("../util/file");
fileHelper.deleteFile(product.imageUrl);
```

[TOP](#content)

## pagination

[pagination in SQL code:](https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging)

[Sequelize, how to add pagination:](http://docs.sequelizejs.com/manual/tutorial/querying.html#pagination-limiting)

Fetching data in Chunks

In controllers/shop.js function getIndex

```javascript
const ITEMS_PRE_PAGE = 2;

Product.find()
  .skip((page - 1) * ITEMS_PRE_PAGE)
  .limit(ITEMS_PRE_PAGE);
```

Pass data to view look at pagination.ejs

**_Side note_**

Look at 15-Pagination-Payments implementation of async delete of product

1. go to public/js/admin.js
2. routes/admin the rout for delete is changed
3. controllers/admin.js function deleteProduct is changed

[More on the fetch API:](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)

[More on AJAX Requests:](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)

[TOP](#content)

## payments

[Official Stripe.js Docs:](https://stripe.com/docs)

Stripe - create an account and use API key

```html
<form action="/create-order" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js"
    class="stripe-button"
    data-key="AddAPIKeyHere"
    data-amount="<%= totalSum * 100 %>"
    data-name="Your Order"
    data-description="All the items you ordered"
    data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
    data-locale="auto"
    data-currency="usd"
  ></script>
</form>
```

Add stripe to project

```console
npm install --save stripe
```

```javascript
// look controllers/shop.js
// 'sk_test_hash' is an secret key from stripe
const stripe = require("stripe")("sk_test_hash");
// Look controllers/shop.js function postOrder
```

Resolve csrf token problem by moving route to app.js

```javascript
// This
router.post("/create-order", isAuth, shopController.postOrder);
// move to app.js
app.post("/create-order", isAuth, shopController.postOrder);
```

[TOP](#content)

## rest

Rest - Representational State Transfer (stateless, client-independent)

CORS - Cross-Origin Resource Sharing

```javascript
// Remove CORS error (on server side)
app.use((req, res, next) => {
  // Set this to your client site like localhost:8000/
  // * means allow to all
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
```

Create react client

```console
npx create-react-app client-react
```

Create vue client

```console
vue create client-vue
```

[TOP](#content)

## websocket

[Socket.io Official Docs](https://socket.io/get-started/chat/)

[Alternative Websocket Library:](https://www.npmjs.com/package/express-ws)

On server side:

```console
npm install --save socket.io
```

```javascript
// Look file util/websocket.js
let io;

const init = server => {
  io = require("socket.io")(server);
  return io;
};

const connect = server => {
  const io = init(server);
  io.on("connection", socket => {
    console.log("Client connected with WebSocket!");
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  init,
  connect,
  getIO
};

// Use this function in util/db.js when you establish connection
const io = require("./websocket");
io.connect(server);

// If some errors ocurred set this headers (3000 is client)
res.header("Access-Control-Allow-Origin", "http://localhost:3000");
res.header("Access-Control-Allow-Credentials", "true");
```

On client side:

```console
npm install --save socket.io-client
```

```javascript
// Look file pages/Feed/Feed.js
import openSocket from "socket.io-client";

// in componentDidMount
openSocket(process.env.REACT_APP_DOMAIN);
```

To use in controller in server side (feed.js)

```javascript
// During the creation of post
// emit - send message to all users connected
// broadcast - exclude user that make an post
io.getIO().emit("posts", { action: "create", post: post });
// "posts" - name of the function (I use module here)
// { } - data tha you pass to client that listening this function
```

To use on client side and update view

```javascript
// In Feed.js componentDidMount
const socket = openSocket(process.env.REACT_APP_DOMAIN);
socket.on("posts", data => {
  if (data.action === "create") {
    this.addPost(data.post);
  }
});
// addPost is function belows
```

[TOP](#content)

## graphql

GraphQl is stateless, client-independent with higher query flexibility

[Detailed Guide on GraphQL](https://graphql.org)

Only use POST request

```javascript
// GraphQL
{
  // This can be (mutation, subscription)
  query {
    // End point
    user {
      // Fields
      name,
      age
    }
  }
}
```

**Query** - Retrieve data ("GET")

**Mutation** - Manipulate data ("POST", "PUT", "PATCH", "DELETE")

**Subscription** - Real-time connection via web socket

```console
npm install --save graphql express-graphql
```

Create folder qraphql and add two files schema and resolvers

```javascript
// schema.js
const { buildSchema } = require("graphql");

// ! after means mandatory
module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }
`);
```

```javascript
// resolvers.js
module.exports = {
  // name of function need to match RootQuery
  hello() {
    return {
      text: "Hello world!",
      views: 1234
    };
  }
};
```

```javascript
// config.js
const graphqlServer = require("express-graphql");
const Schema = require("./schema");
const Resolver = require("./resolvers");

const setup = app => {
  app.use(
    "/graphql",
    graphqlServer({
      schema: Schema,
      rootValue: Resolver
    })
  );
};

module.exports = {
  setup
};

// in app.js
// Import GraphQL
const graphQl = require("./graphgl/config");
graphQl.setup(app);

// to test qraphql
graphQl.setup(app, true);
// look qraphql/config.js
// now go to http://localhost:8080/graphql
```

**Validation in qraphql**

```console
npm install --save validator
```

Look at graphgl/validation/validator

**Creating query's**

```javascript
/* Mutation */
const queryData = {
  query: `
    mutation UpdateStatus($status: String!) {
      updateStatus(status: $status) {
        name
      }
    }
  `,
  variables: {
    status: this.state.status
  }
};

/* Fetching data */
const queryData = {
  query: `
    query FetchPosts($page: Int) {
      posts(page: $page) {
        posts {
          _id
          title
        }
      } 
    }
  `,
  variables: {
    page: page
  }
};
```

[TOP](#content)

## deployment

**Using environment variables**

Create .env file or .env.development .env.production

or create nodemon.json file

```javascript
{
  "env": {
    "VARIABLE": "KEY",
    ...
  }
}

```

**Secure Response Headers**

Use helmet for node.js

```console
npm install --save helmet
```

```javascript
const helmet = require("helmet");
app.use(helmet());
```

**Compressing assets**

Use compression for node.js

```console
npm install --save compression
```

```javascript
const compression = require("compression");
app.use(compression());
```

**Logger**

Use morgan for node.js

[logging (with higher control)](https://blog.risingstack.com/node-js-logging-tutorial/)

```console
npm install --save morgan
```

```javascript
const morgan = require("morgan");
const fs = require("fs");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" } // "a" means append
);

app.use(morgan("combined", { stream: accessLogStream }));
```

**SSL/TLS**

```console
openssl req -nodes -new -x509 -keyout server.key -out server.cert

# common name must be set to localhost
# when you deploy app you get ssl key (private/public)
# This is just for testing creating your own key
```

```javascript
const https = require("https");
const fs = require("fs");

/*
 * Reading SYNC way will block thread
 * but you need this to be done
 * and not start server until keys are set
 */
const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

https
  .createServer({ key: privateKey, cert: certificate }, app)
  .listen(process.env.PORT || 3000);
```

[TOP](#content)

## testing

[Jest](https://codeburst.io/revisiting-node-js-testing-part-1-84c33bb4d711)

[Mocha](https://mochajs.org/)

[Chai](https://www.chaijs.com/)

[Sinon](https://sinonjs.org/)

**Testing with mocha and chai**

```console
npm install --save-dev mocha chai sinon
```

```javascript
// In package.json
"scripts": {
  "test": "mocha", // add this
  "start": "nodemon app.js",
},
```

Create folder **test** (must be named test) at root of app

```javascript
// Create test (look in test/util.js)
const expect = require("chai").expect;

it("should add numbers correctly", () => {
  const num1 = 2;
  const num2 = 3;
  expect(num1 + num2).to.equal(5);
});
```

```console
npm test
```

[TOP](#content)
