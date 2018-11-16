# treetracker-map-api

API for web maps of tree plantings.

# Dockerized deployment

## Setup
To run docker on a local machine, you will have to install Docker first. Docker is a linux container technology, so running it on Mac or Windows requires an application with an attached linux VM. Docker provides one for each OS by default.

[Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
[Docker for Windows](https://docs.docker.com/docker-for-windows/install/)

To install on linux, you can run `sudo apt-get install -y docker-ce` but there is [additional setup](https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository) to verify keys, etc.

## Dockerw script

Run `./dockerw build` to build the image of the mobile API locally using defaults, and to run the image use `./dockerw run`.

To see what arguments can be passed, simply run `./dockerw`. In order to use something created in the `build` mode, you must specify the same arguments in the `run` mode or it will attempt to pull the image. There is also an `up` mode that can be used, to build and run in one command with the same arguments.
