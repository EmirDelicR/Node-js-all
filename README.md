# Node-js-all

## content

[Intro](#intro) <br/>
[Basic Concepts](#basic) <br/>
[Express.js](#express) <br/>
[Dynamic Content](#dynamic-content) <br/>

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
