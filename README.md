# Tree Tracker Web Map (BackEnd - API)

This project is built using Node.js version 12.19.0.

## Requirements

- Node.js 12

## Backend Development

To set up your environment for BackEnd development, follow the steps below:

> NOTE: We recommend all of these tasks to be executed using Visual Studio Code, openning a Terminal session.


1. Install node modules, running npm i in the root
    ```
    npm i
    ```
2. Set up database connection string.  

    
    1. Create a .env file at the folder server.
    2. Add the following content in the .env file

        ```
        DATABASE_URL=postgresql://xxxx:xxxx@dxxxx:25060/treetracker?ssl=no-verify
        ```

        > NOTE: The default mode to run the API in the test environment is connecting with the remote database.
            > * Ask for the db connectiong string on the slack channel.
    

3. Install supervisor globally

    ```
    npm i -g supervisor
    ```

4. <a name="rundev">Run the Backend Development Environment</a>

    Attention:

    - Option 1 is for **BackEnd development only**.
    - Option 2 is for **FrontEnd and BackEnd development**.

    Choose one of the options and      Run the code below on the terminal:

    - **Option 1**:

         > NOTE 1: This command will run server.js with CORS restrictions lifted
         > NOTE 2: For environments running the FrontEnd and BackEnd, do not use this option, because API will run at port 3000 conflicting with the React project. Choose option 2.
       

        ```
        NODE_ENV=dev supervisor server.js
        ```
        

    - **Option 2**: 

        ```
        cd server
        npm run dev
        ```
        > NOTE: 
        > 1. In this way, the server would run on port 3001, and client would run on port 3000.

<br>  

> IMPORTANT NOTE: When running for the first time the API, if the endpoints are not responding, because after the queries there aren't any answer or error, it might be some incompatibility with the node version and pg module. If you are running Node.js 14, downgrade to Node.js 12.19.0.
[How to Upgrade (or Downgrade) Node.js Using npm](https://www.surrealcms.com/blog/how-to-upgrade-or-downgrade-nodejs-using-npm.html)

<br>  



### (Optional) Local Database



* The steps below are required only for scenarios where the API needs to connect with the Postgres database locally.
* The default mode to run the application is connecting with the remote database, but for some specific scenarios, as an exception, the developer might need to have the database running local.
* Do not execute these steps if you are configuring the environment for the first time.

1. Install postgres
2. Install postGIS
3. Create a database named 'treetracker'
4. Import our developer seed into your database.  
    - Ask in slack for the link to the seed.
5. Configure .env to point to your local database.
6. Run the [Backend Development Environmet](#rundev).


---


### How to test

We use Jest to build tests.

1. To test server
```
cd server
npm test
```

