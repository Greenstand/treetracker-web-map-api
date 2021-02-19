const log = require("loglevel");
log.setLevel("debug");
const app = require("./app");
var port = process.env.NODE_PORT || 3000;

app.listen(port, () => {
  log.debug("This is a debug log");
  log.info("This is a info log");
  log.warn("This is a warn log");
  log.info('listening on port ' + port);
});
