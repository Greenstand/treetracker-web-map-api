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

  var output = "```Region       | Tree Count";

{
  const query = {
    text: `select r.name as region_name
      , count(distinct t.id) as trees
    from trees t
    inner join tree_region tr on tr.tree_id = t.id
    inner join region r on r.id = tr.region_id
    where time_created > now() - INTERVAL '1 day'
      and r.id in (6632386, 6632476) -- Kenya and Tanzania
    group by r.id`
  };
  rval = await pool.query(query);
  for(let row of rval.rows){
   console.log(row);
   const string = row.region_name.padEnd(12) + ' | ' + row.trees;
   output = output + "\n" +  string;
  }
  console.log(output);

  
}

{
  const query = {
    text: `Select 'Global Total' as region_name
     , count(distinct t.id) as trees
    from trees t
    where time_created > now() - INTERVAL '1 day'`
  };
  rval = await pool.query(query);
  for(let row of rval.rows){
   console.log(row);
   const string = row.region_name.padEnd(12) + ' | ' + row.trees;
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
            "title": "Trees Planted in the last 24 hours: Tanzania, Kenya and globally ",
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

