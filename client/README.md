
# Tree Tracker Web Map (FrontEnd)

This project is built using React version 16.13.1.

## Requirements

* Check [React prerequisites here](https://reactjs.org/tutorial/tutorial.html#prerequisites).


## React WebApp Development Environment  

To set up your environment for FrontEnd development, follow the steps below:

> NOTE: We recommend all of these tasks to be executed using Visual Studio Code, openning a Terminal session.

1. Install all npm modules, running npm i in the client/ folder

    ```
    cd client
    npm i
    ```

2. Open client/.env file.  It should contain only the following line

    ```
    REACT_APP_API=https://dev-k8s.treetracker.org/webmap/
    ```
3. Start the client
    ```
    cd client
    npm start
    ```
4. Open the web map in the browser with URL: http://localhost:3000  

<br>  

> That's it. Your environment is ready for development!!!  

<br>  


---

Optional:

5. For developers working on the FrontEnd and BackEnd, might be interesting to run the BackEnd solution locally, along with the FronEnd React WebApp. In this case, follow the steps below:

    1. Update client/.env file with: 
    ```
    REACT_APP_API=http://localhost:3000/
    ```

    2. To set up the API development environment locally, follow the steps at the [server folder](./server)


---

## How to enable log on console.

By default, the client just output logs which are level of `warn` or above, this remains the browser console clean for normal users, to display more logs for debuggering, please follow this guide:

1. Open the browser console panel.

2. Open application tab, then open `Local Storage` tab:

3. Add a key-value pair:
    ```
    key: loglevel
    value: DEBUG
    ```

### How to test

We use Jest to build tests.

1. To test client
    ```
    cd client
    npm test
    ```
