# blend-promise-utils-es5

This is the ES5 version of the original blend-promise-utils. All tests are passed.

Using this package results in much smaller bundle size compared to the original package because
no polyfill except Promise is required! Also an ES Module bundle is included.

---

promise-utils
=============

[![Build Status](https://circleci.com/gh/blend/promise-utils.svg?style=shield)](https://circleci.com/gh/blend/promise-utils)
[![Coverage Status](https://coveralls.io/repos/github/blend/promise-utils/badge.svg?branch=master)](https://coveralls.io/github/blend/promise-utils?branch=master)
![Minzipped size](https://img.shields.io/bundlephobia/minzip/blend-promise-utils.svg)

Promise-utils is a dependency-free JavaScript/TypeScript library that
provides Lodash-like utility functions for dealing with native ES6
promises.

## Installation

```
$ npm install blend-promise-utils
```

## Usage Example

```js
const promiseUtils = require('blend-promise-utils')
const { promises: fs } = require('fs')
const request = require('request-promise-native');
const isEmpty = require('lodash.isempty');

const MS_IN_SECOND = 1000;

async function main() {
  const cachedResponse = promiseUtils.memoize(
    async (contents) => request(contents.url),
    contents => contents.url,
    15 * MS_IN_SECOND // contents could change
  );

  const fileContents = await promiseUtils.map(
    ['file1', 'file2', 'file3'],
    async fileName => {
      const rawData = await fs.readFile(fileName);
      return JSON.parse(rawData);
    },
  );

  while (true) {
    await promiseUtils.delay(150); // avoid slamming CPU

    await promiseUtils.mapSeries(
      fileContents,
      async contents => {
        const remoteData = await cachedResponse(contents);

        const { results, errors } = await promiseUtils.settleAll([
          asyncFunction1(),
          asyncFunction2(),
          asyncFunction3(),
        ]);

        if (!isEmpty(errors)) {
          throw new Error(`Unable to settle all functions: ${JSON.stringify(errors)}`);
        } else {
          return results;
        }
      }
    )
  }

  await promiseUtils.retry(flakyFunction, { maxAttempts: 3, delayMs: 150 })(flakyFunctionArgument);

  await promiseUtils.timeout(longFunction, 60 * MS_IN_SECOND)(longFunctionArgument);
}

main()
```

## API

- [Documentation][2]
- [Past versions][3]

## Test

```
$ npm test
```

## Documentation

Build docs
```
$ make docs
```

Push docs to Github
```
$ make push-docs
```

## License

[MIT](LICENSE)

[1]: https://blend.github.io/promise-utils
[2]: https://blend.github.io/promise-utils/latest/
[3]: https://blend.github.io/promise-utils/versions.html
