# Home Library Service

# PART 2

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download $ Install Docker](https://www.docker.com/products/docker-desktop/)

## How to check

### 1) Clone repository: 
```bash 
git clone https://github.com/MDz1985/nodejs2024Q1-service.git
cd nodejs2024Q1-service
```

### 2) Switch branch to `Home_library_Service_Part_2`:
```bash
git checkout Home_library_Service_Part_2
```
### 3) Install libraries:
```bash
npm i
```
### 4) Run docker (install and run the docker app for your OS) 
### 5) Start current app and check the tests:
```bash
npm run docker:start:test
```
   - if you prefer you can start the app with the command `npm run docker:start` (so you can watch the logs for this app)
   - then you can run tests in the separate terminal window or use 'ctrl + c' to stop logs. To start the tests use `npm run test`
### 6) Show logs to test changes in the src directory
```bash
npm run docker:logs
```
### 7) Test changes 
   Make changes in any file in the `src` directory and save it (for example you can add the `console.log` or add changes to generate an 
   error ) - in the logs you will see, that changes applies 

___
# Additional information from previous part: 

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```


## Documentation

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.
You may also provide the port value into the .env file in the root of the project (look .env.example)

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
