require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Report Service running on port ${PORT}`);
});
