# Node-js-all

## content

[Intro](#intro) <br/>
[Basic Concepts](#basic) <br/>
[Express.js](#express) <br/>

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

[TOP](#content)
