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

{
  const query = {
    text: `select  TO_CHAR(now() :: DATE, 'dd/mm/yyyy') as date_created
      , r.name as region_name
      , count(distinct t.id) as trees
    from trees t
    inner join tree_region tr on tr.tree_id = t.id
    inner join region r on r.id = tr.region_id
    inner join region_type rt on rt.id = r.type_id
    where date_trunc('day',time_created) =  date_trunc('day', current_date - 1)
      and rt.id not in (2, 5, 7) -- continent, grid 100000 and tanzania_admin_regions
      and r.name IS NOT NULL
      and r.id in (6632386, 6632476) -- Kenya and Tanzania
    group by TO_CHAR(t.time_created :: DATE, 'dd/mm/yyyy')  
     , r.name`
  };
  rval = await pool.query(query);
  var output = "```    date_created | region_name  | trees";
  for(let row of rval.rows){
   console.log(row);
   const string = row.id.toString().padStart(6) + ' | ' + row.date_created_at + ' | ' + row.region_name + ' | ' + row.trees.toString().padStart(3);
   output = output + "\n" +  string;
  }
  output = output + '```';
  console.log(output);

  if(output != null) {

    var options = {
      method: 'POST',
      uri: Config.slackDailyPlantingsWebhook,

      body: {
        attachments: [
          {
            "title": "Trees Planted Yesterday in Tanzania, Kenya and globally ",
            "text": output,
          }
        ]
      },

      json: true // Automatically stringifies the body to JSON
    };

    await rp(options);
  }

}

{
  const query = {
    text: `Select  TO_CHAR(t.time_created :: DATE, 'dd/mm/yyyy')  as date_created
     , 'Global Total' as region_name
     , count(distinct t.id) as trees
    from trees t
    inner join tree_region tr on tr.tree_id = t.id
    inner join region r on r.id = tr.region_id
    inner join region_type rt on rt.id = r.type_id
    where date_trunc('day',time_created) =  date_trunc('day', current_date - 5)
      and rt.id not in (2, 5, 7) -- continent, grid 100000 and tanzania_admin_regions
      and r.name IS NOT NULL
    group by TO_CHAR(t.time_created :: DATE, 'dd/mm/yyyy')` 
  };
  rval = await pool.query(query);
  var output = "```    date_created | region_name  | trees";
  for(let row of rval.rows){
   console.log(row);
   const string = row.id.toString().padStart(6) + ' | ' + row.date_created_at + ' | ' + row.region_name + ' | ' + row.trees.toString().padStart(3);
   output = output + "\n" +  string;
  }
  output = output + '```';
  console.log(output);

  if(output != null) {

    var options = {
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        attachments: [
        {
            "title": "Trees Planted Yesterday in Tanzania, Kenya and Globally ",
            "text": output,
        }
    ]
},
      json: true // Automatically stringifies the body to JSON
    };

    await rp(options);
  }

}

  console.log('Done ' + new Date());
  pool.end();

})().catch(e => {
  console.log(e);
  Sentry.captureException(e);
  pool.end();

  console.log('notify-slack-reports done with catch');
})

