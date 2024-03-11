const express = require("express");

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Hello from customer" });
});

app.listen(process.env.PORT, () => {
  console.log("Shopping is Listening to Port 8003");
});
