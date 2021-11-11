# IQ180, Battle your brains out! 🧠
Netcentric Architecture Final Project, Group 11

**Production Deployment**: https://iq180.netlify.app/

## Requirements
This project implements `socket.io` to implement real-time game functionalities.
This project is implemented using `create react app` with TypeScript as a single-page application. Material UI is the selected UI framework.

## Installation
To get the project up and running, and view components in the browser, complete the following steps:

1. Download and install Node: <https://nodejs.org/>
2. Clone this repo: `https://github.com/180IQ-Netcentric/iq180-frontend-migrated.git` (HTTPS)
5. Install project dependancies: `npm install`
6. Create `.env` file and add the environment variables according to `.env.example`
7. Start the development environment: `npm run start`
8. Open your browser and visit <http://localhost:3000>

## Development
When developing components, you may want assets automatically compiled and the browser to refresh automatically. To do this, run the following task:

* `npm run start`

## Creating a static build
To create a static instance of this project, run the following task:

* `npm run build`

This will create a folder called `www`, into which the required files will be created.

## Deployment
The project implements continuous deployment using Netlify, which will automatically update the production site according to the main branch.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
tion about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
