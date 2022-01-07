# HTTP Calculator

A web application that can perform basic calculus.

## How To use

```sh
curl --request GET \
  --url 'https://1venjqkejd.execute-api.eu-central-1.amazonaws.com/default/calculus?input=KDErMykgKiA1IC8gMi41'
```

`input` is the arithmetic expression you want to solve. It has to be base64 encoded and may only contain `+`, `-`, `*`, `/`, `(`, `)`, `.`, spaces and numbers. The example expression decodes to `(1+3) * 5 / 2.5`. The result is therefore `8`.

## API Specification

base url: `https://1venjqkejd.execute-api.eu-central-1.amazonaws.com/default/`

### `calculus`

- Description

  Solves an arithmetic expression. The expression needs to be base64 encoded and may only contain supported characters.

- URL

  `calculus/`

- Method

  `GET`

- Query Params

  **Required**:

  `input=<base64_encoded_string>`

- Success Response

  - **Status Code**: `200`
  - **Content**:

    ```json
    {
      "error": false,
      "result": <number>
    }
    ```

- Error Responses
  - **Cause**: unallowed http method
  - **Status Code**: `405`
  - **Content**:

    ```json
    {
      "error": true,
      "message": "method not allowed. Supported methods are: 'GET'."
    }
    ```

  OR

  - **Cause**: required query parameter is missing
  - **Status Code**: `400`
  - **Content**:

    ```json
    {
      "error": true,
      "message": "required query parameter is missing. Required parameters are: 'input'."
    }
    ```

  OR

  - **Cause**: input is not base64 encoded or is using invalid characters in arithmetic expression
  - **Status Code**: `400`
  - **Content**:

    ```json
    {
      "error": true,
      "message": "unsupported symbols used for input expression. Supported symbols are: '+', '-', '*', '/', '(', ')', ' ', '.' and any digits from 0 to 9."
    }
    ```

## Development

### Requirements

- [node.js](https://nodejs.dev/download/) (> v12.0)
- [yarn](https://yarnpkg.com/getting-started/install)

### Install Dependencies

```sh
yarn install
```

### Run Unit Tests

```sh
yarn test
```

### Deploy

The code will automatically be deployed when pushed/merged to master branch.
Alternatively you may also deploy your changes from the terminal.
For this you need to have the [AWS CLI](https://aws.amazon.com/de/cli/) installed and setup.
If the CLI is setup you can simply run:

```sh
yarn deploy
```

This will execute the following steps:

1. build the project into the `compiled/` folder via `yarn build`
2. zip the compiled JavaScript files into `compiled/lambda.zip` via `yarn zip`
3. upload the archive via `yarn upload`

## Future Considerations

- Generate API documentation automatically (e.g. with [Swagger](https://swagger.io/solutions/api-documentation/))
