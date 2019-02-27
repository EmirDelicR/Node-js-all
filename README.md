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

[TOP](#content)
