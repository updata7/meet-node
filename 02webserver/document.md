# test-backend-for-updata7

# prepare

To builde and run the project, you will need a few thing:

- Install [Node.js 16.15.1](https://nodejs.org/en/)
- Install [mysql server v8.0.19+](https://www.mysql.com/)

# Getting started

- Clone the repository

```bash
git clone --depth=1 https://github.com/updata7/easy-server.git
```

- Install dependencies

```bash
cd test-backend-for-updata7
npm install
```

- Build the project

```bash
npm run build
```

- Run the project

```bash
npm run dev
```

- Unit Test

**test**
```bash
npm run test
```

**Generate test coverage report**
```bash
npm run cover
```

- Test the API

Navigate to `http://localhost:9091/api/docs`, you would **see** and **test** the API!!!





## The full folder structure of this proejct is explained below:

> **Note!** Make sure you have already built the proejct and using `npm run dev`

| Name               | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **src/config**         | Contains config environment to be used by the config package, such as MongoDB URI, jwtSecret, and etc.                                                        |
| **dist**           | Contains the distributable (or output) from your TypeScript build                                                                                             |
| **node_modules**   | Contains all your npm dependencies                                                                                      |
| **src**            | Contains your source code that will be compiled to the dist dir                                                                                               |
| **src/middlewares** | Contains the middlewares to intercept requests                                                                                                                |
| **src/models**   | Model define Mysql schemas that will be used in storing and retrieving data from Mysql                                                          |
| **src/engines**    | This module will directly operate the database through the model |
| **src/handlers** | This field will be used in router and call the **engines** |
| **src/routers** | The router for client call |
| **src/swaggers** | Swagger UI for API |
| **src/utils** | Some common internal interfaces |
| **src/dictionary** | Define the description of some fields |
| **src/bin/server.ts** | Entry point to your Koa project                                                                                                                      |
| **src/app.ts** | The helper file be used by server.ts |
| package.json       | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                                                    |
| tsconfig.json      | Config settings for compiling server code written in TypeScript                                                                                               |

