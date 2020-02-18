[![NPM version](https://img.shields.io/npm/v/@launchpadlab/lp-requests.svg?style=flat-square)](https://www.npmjs.com/package/@launchpadlab/lp-requests)

# lp-requests

Promise-based helpers for making HTTP requests.

```js
import { api, configureApi } from '@launchpadlab/lp-requests'

// Make a request
api
  .get('/user', { query: { id: 1 } })
  .then((response) => {
    // handle success
  })
  .catch((error) => {
    // handle error
  })

// Configure defaults
const externalApi = configureApi({
  root: 'https://my-external-api/',
  mode: 'cors',
})

externalApi.get('/user', { query: { id: 1 } })
// -> makes a request to https://my-external-api/user?id=1
```

A full list of available request options may be found in the [documentation](#documentation).

## Relation to axios

`lp-requests` serves the exact same function as [axios](https://github.com/axios/axios)- that is, it provides a thin wrapper around the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Once `axios` has become appropriately stable, it may be used as a replacement for `lp-requests`.

## Documentation

Documentation and usage info can be found in [docs.md](docs.md).

## Migration Guides

- [v4.0.0](migration-guides/v4.0.0.md)

## Contribution

This package follows the Opex [NPM package guidelines](https://github.com/LaunchPadLab/opex/blob/master/gists/npm-package-guidelines.md). Please refer to the linked document for information on contributing, testing and versioning.
