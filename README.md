# politician-tests-api-jest-supertest
Set of politician API tests using jest and supertest. Used with a macOS device, but installation steps should be the same for any unix system.

## Requirements
* node, npm
* unix system (might work without problems in Windows, but haven't tried)

## Setup
```
npm install
npm test
```

## Execution
To execute tests simply write `npm test`   
The results are printed directly to console   
If you would like a test watch as you're modifying them, run `npm test:watch`

## Choices
* used Facebook's `jest` as it is a very popular testing framework
* used `supertest`, complement to the very popular `superagent`
* reason for both these choises is popularity and high probability of these frameworks to already be used by developers, lowering the barrier to entry
* used `jest-expect-message` to create custom error messages
* used `lodash.omit` to remove properties from object without mutating it

## Bugs
* I didn't make any assumptions, only tested the api exactly to the specification
* all test failures are bugs or areas where the specification does not match implementation

## Improvements
* test POST requests with wrong mandatory field types
* organise tests into different files
* implement linting
