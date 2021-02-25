require('dotenv').config()
const app = require("./app");
var port = process.env.NODE_PORT || 3000;

app.listen(port, () => {
  console.log('listening on port ' + port);
});
