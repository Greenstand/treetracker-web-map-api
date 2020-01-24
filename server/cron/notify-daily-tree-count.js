const Config = require('./config/config');
const http = require('http');
const rp = require('request-promise-native');
const { Pool, Client } = require('pg');

const pool = new Pool({
  connectionString: Config.connectionString
});

const Sentry = require('@sentry/node');
Sentry.init({ dsn: Config.sentryDSN });


(async () => {

  var output = "```Tree Count";

{
  const query = {
    text: `select count(distinct t.id) as trees
from trees t
where time_created > now() - INTERVAL ‘1 day’
and t.active = true`
  };
  rval = await pool.query(query);
  for(let row of rval.rows){
   console.log(row);
   const string = ' Total trees tracked ' + row.trees;
   output = output + "\n" +  string;
  }
  console.log(output);

  
}


  output = output + '```';
  if(output != null) {

    var options = {
      method: 'POST',
      uri: Config.slackDailyPlantingsWebhook,

      body: {
        attachments: [
          {
            "title": "Trees Planted in the last 24 hours globally: ",
            "text": output,
          }
        ]
      },

      json: true // Automatically stringifies the body to JSON
    };

    await rp(options);
  }


  console.log('Done ' + new Date());
  pool.end();

})().catch(e => {
  console.log(e);
  Sentry.captureException(e);
  pool.end();

  console.log('notify-slack-reports done with catch');
})

