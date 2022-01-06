# HTTP Calculator

A web application that can perform basic calculus.

## How To Use

Perform a `GET` call against

```http
https://1venjqkejd.execute-api.eu-central-1.amazonaws.com/default/basic-calculator/calculus?query=<calculation>
```

## Getting Started

### Prerequisits

* Node.js
* yarn

1. Install dependencies:

  ```sh
  yarn install
  ```

## How To Deploy

The code will automatically be deployed when pushed/merged to master branch.
Alternatively you also deploy your changes from a terminal.
For this you need to have the [AWS CLI](https://aws.amazon.com/de/cli/) installed and setup.
If the CLI is setup you can simply run:

```sh
yarn compile
yarn zip
yarn deploy
```
