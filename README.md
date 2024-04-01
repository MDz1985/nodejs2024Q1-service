# Home Library Service

# PART 3

## Prerequisites

### ⚠️ You need to have a good internet connection.

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download $ Install Docker](https://www.docker.com/products/docker-desktop/)

## How to check

### 1) Clone repository:

```bash 
git clone https://github.com/MDz1985/nodejs2024Q1-service.git
cd nodejs2024Q1-service
```

### 2) Switch branch to the `Home_library_Service_Part_3`:

```bash
git checkout Home_library_Service_Part_3
```

### 3) Install libraries:

```bash
npm i
```

### 4) Run docker (install and run the docker app for your OS)

### 4.1) Clean up the docker

⚠️ It is highly recommended to remove all docker containers, images and volumes before checking:

```bash
npm run docker:clean-up-all
```

- You will be asked `Are you sure you want to continue? [y/N]`
- Please enter `y` in the console and press `Enter`

### 5) Start current app:

```bash
npm run docker:start
```

### 6) Start auth tests:

⚠️ When you receive a message with `4000 port is running` you may open new terminal window or stop current process using `ctrl + c` and
then use:

```bash
npm run test:auth
```

### 7) Start refresh tests:

⚠️ When you receive a message with `4000 port is running` you may open new terminal window or stop current process using `ctrl + c` and
then use:

```bash
npm run test:refresh
```

## Logger

### ⚠️ The logger has 4 levels: `DEBUG`, `INFO`, `WARN`, `WARN`.

#### You can change the level in the `.env` file:

#### Example:

```LOG_LEVEL=ERROR```

#### Description:

| Level | Description                                   |
|:------|:----------------------------------------------|
| DEBUG | Includes all logs (DEBUG, DEBUG, WARN, ERROR) |
| INFO  | Includes INFO, WARN and ERROR logs            |
| WARN  | Includes WARN and ERROR logs                  |
| ERROR | Includes ERROR logs only                      |

### Logger file size limit:

you can change the logger file size limit and the logger files directory in the `.env` file:

#### Example:

```
LOG_FILE_SIZE_LIMIT_IN_KB=5
LOG_FOLDER_PATH=./logs
```

#### Description:

##### `LOG_FILE_SIZE_LIMIT_IN_KB` - The maximum size of the logger file in KB. If the size of the logger file exceeds the limit, the new logger file will be created.

##### `LOG_FOLDER_PATH` - The path to the logger files directory, based on the path 'app/' of the docker `mdz1985/nodejs2024q1-service-nextjs` container.

#### Note:

The logger files will be created in the `app/logs` folder of the docker `nextJs` container by default.
You can start tests (`npm run test:auth` or `npm run test:refresh`) and logger files will be created in the `app/logs` folder of the
docker `nextJs` container in the docker app. Or you
can use Postman or other app to test that functionality.

#### Watch logger files:

```bash
npm run docker:show-custom-logs-files
```

#### Watch some logger file:

Next, you can see the content of any file using the command:

```
cat <file_name>
``` 

For example:
`cat 2024-04-01T20:23:13.237Z.log`

#### ⚠️ Also you can see the logger files in the `app/logs` folder of the docker `nextJs` container in the docker app.

### ⚠️⚠️⚠️ If you want to change any variable in the `.env` file, you need to restart the app after that:

```bash
npm run docker:restart
```

___
___

# PART 2

## Prerequisites

### ⚠️ You need to have a good internet connection.

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

### 4.1) Clean up the docker

⚠️ It is highly recommended to remove all docker containers, images and volumes before checking.

```bash
npm run docker:clean-up-all
```

- You will be asked `Are you sure you want to continue? [y/N]`
- Please enter `y` in the console and press `Enter`

### 5) Start current app:

```bash
npm run docker:start
```

### 6) Start tests:

⚠️ When you receive a message with `4000 port is running` you may open new terminal window or stop current process using `ctrl + c` and
then use:

```bash
npm run test
```

### 7) Show logs to test changes in the src directory

```bash
npm run docker:logs
```

### 8) Test changes

Make changes in any file in the `src` directory and save it (for example you can add the `console.log` or add changes to generate an
error ) - in the logs you will see, that changes applies

### 9) Scan image for vulnerabilities

It needs some time to scan the image. Please wait before the process will be finished.

```bash
npm run docker:scan
```

___

## Necessary information

### I used next commands in this project, that was needed to complete the task:

- ```npm run doocker:build``` to build the image
- ```npm run docker:tag``` to tag the image
- ```npm run docker:push-to-hub``` to push the image to the docker hub

### Dockerfiles placed here:

- `./Dockerfile` - for the NextJS app
- `./db/Dockerfile` - for the Postgres database
- `./docker-compose.yml` - for docker compose

### Prisma configuration placed here:

- `./prisma/schema.prisma`
  ⚠️ You can see the prisma relations in the `./prisma/schema.prisma`

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
