# BlogTonic GraphQL Server

This is a Node.js server that provides functionalities for the [BlogTonic client](https://github.com/ramizwd/BlogTonic/). The frontend is using this GraphQL API to perform queries and mutations through this it.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installing

1. Clone the repository
2. Install dependencies using npm or yarn

```bash
npm  i
```

### Configuration

The server needs a configuration file to work properly. Create a `.env` file in the root directory with the following variables:

```dotenv
NODE_ENV=
PORT=3000
DATABASE_URL=
JWT_SECRET=
AUTH_URL=
```

### Running the Server

To start the server in dev mode, run the following command:

```bash
npm  run  dev
```

To build the server, run the following command:

```bash
npm  run  build
```

## Running Tests

1. Write the script in the `package.json` file under `scripts`

```bash
"test": "jest --detectOpenHandles"
```

2. Run tests, use the following command:

```bash
npm t
```

The server will be available at [http://localhost:3000/graphql](http://localhost:3000/graphql).

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
