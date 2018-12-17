# treetracker-web

This map is built for other organizations website.
This map allows organization's donors to see their trees.
The user experience is on the other organization's website.


## Development Environment Quick Start

We provide a development environment through docker that can run on your local environment.

### Set Up Docker
To run docker on a local machine, you will have to install Docker first. Docker is a linux container technology, so running it on Mac or Windows requires an application with an attached linux VM. Docker provides one for each OS by default.

[Docker for Mac](https://docs.docker.com/docker-for-mac/install/)

You can alternatively install Docker for Mac using homebrew, using the following command

```
$ brew cask install docker
```

[Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

To install on linux, you can run `sudo apt-get install -y docker-ce` but there is [additional setup](https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository) to verify keys, etc.


### Install, build docker containers and go

Install Node (see Requirements above)

Clone this repository

```
git clone git@github.com:Greenstand/treetracker-web-map.git
cd treetracker-web-map
```

Run the setup script.  This script installs node modules, builds docker containers, and starts them
```
./dev/setup.sh
```


You can now view the treetracker web map at http://localhost:8080
Note: For older OS (eg. win7 ,win8) Docker toolbox should be used and the app can be viewed on http://192.168.99.100:8080
 

To stop the dev environment use

```
./dev/down.sh
```

To start the dev environment back up use

```
./dev/up.sh
```

Now to view the map . Goto client folder than to js folder ,next make a new file and name it config.js and copy the content in config.js.example and paste it in config.js .(If required make the necessary adjustment to address (eg. http://192.168.99.100:8080) else you are ready to view the map)

Just edit as you normally would to view changes in your development environment.



### Alternative setup for MS Windows (Works on Linux and Mac also)
On Windows the easiest way to develop and debug Node.js applications is using Visual Studio Code.
It comes with Node.js support out of the box.

https://code.visualstudio.com/docs





[Wiki](https://github.com/Greenstand/treetracker-web-map/wiki) for Minimum demo and MVP features
## Clustering Basics

For performance and UX purposes, since this map needs to deal with an enormous amount of trees, a clustering strategy is used to group those trees, showing information in a way that is more digestible for the end-user.

Although this feature is already implemented, performance optimizations are a work in progress.

### Overriding clustering and map initial zoom for testing

When there is a need to tweak the clusterization behavior, the **cluster radius** and **zoom** can be overrided specifying query strings.
For example, if you need to load the map with an initial zoom level of 15, and a radius of 0.001 you will access it like this:

dev.treetracker.org?**zoom=15&clusterRadius=0.001**

To find the correct value for the cluster radius in a given zoom level, play with some ranges between 0.1 and 0.00025. However, feel free to experiment however you like.

When these values are overriden, you can zoom and drag the map freely, while keeping the same clusterization behaviors.

Another useful tool to use in conjunction with this is the web browser's console (in Chrome or Firefox, hit F12 to open it). Whenever the map is updated, current zoom level and cluster radius used will be output to the console, so you have a better idea of what is going on.

Future: 
* Filters and Statistics
* View photo together with tree data
* View planter profile. 
