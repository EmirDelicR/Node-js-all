const dotenv = require("dotenv");
dotenv.config({ debug: true });

const express = require("express");
const app = express();

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log(
    `Server running at http://${process.env.HOST_NAME}:${process.env.PORT}/`
  );
});
