require("dotenv").config();
const app = require("./app");
const { getEnv } = require("./config/env");

const { port } = getEnv();

app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`);
});
