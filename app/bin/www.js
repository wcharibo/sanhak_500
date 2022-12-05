<<<<<<< HEAD
"use stript";

const app = require("../app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("서버 가동");
=======
"use strict"

const app = require("../app");
const logger = require("../src/config/logger");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`${PORT} 포트에서 서버가 가동되었습니다.`);
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
});