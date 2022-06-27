# eslint-plugin-no-unresolved-stubs

Disallows Sinon stubs that aren&#39;t restored

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-unresolved-stubs`:

```sh
npm install eslint-plugin-no-unresolved-stubs --save-dev
```

## Usage

Add `no-unresolved-stubs` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-unresolved-stubs"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-unresolved-stubs/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


