# New Zealand place names interactive

This is a small app that makes some of the work done https://github.com/TeHikuMedia/nga-kupu interative.

## Data processing

The `data` directory contains an sql script used to format the output of the nga-kupu projet.
It isn't necesssary to run this script as the output has been checked in.

## Interactive

The interactive is a [React](https://reactjs.org/)
app that uses Uber's [deck.gl](https://uber.github.io/deck.gl/#/) and 
[react-map-gl](https://uber.github.io/react-map-gl/#/).

It is bootstrapped using [create-react-app](https://github.com/facebook/create-react-app)

To run the app all you should need to do is:

    cd interactive
    yarn

Add your mapbox access token to a `.env` file

> REACT_APP_MAPBOXACCESSTOKEN=XXX

The run:

    yarn start


The deploy, embed, and full-deploy commands also expect AWS_REGION, AWS_S3_PATH, and PUBLIC_URL to
be defined in the `.env` file. If you don't want to deploy to an S3 bucket just remove these
commands. These commands also assume you have the aws cli tools installed and that the default
credentials are what you want. (And it has not been tested on windows)
