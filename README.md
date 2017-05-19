# lp-requests
Request helpers!

## Usage
Documentation and usage information can be found in [docs.md](docs.md). These docs are auto-generated from inline [JSDoc-style](http://usejsdoc.org/) comments using [documentation.js](https://github.com/documentationjs/documentation). Any changes or additions to this library should be accompanied by corresponding changes to the docs, which can be compiled using `yarn run docs`.

## Feature Requests
For new features, please submit an issue or PR with the label of `idea`, and include a description of the change and why it is necessary.

## Pull Requests and Deployments
Pull requests MUST be approved by someone on the team before merging into master. Once the PR is approved, but before it is merged, the implementor should bump the version according to semantic versioning with `yarn version`. Once merged, the master branch will automatically be published the newest version to NPM.

## Development
* `git clone git@github.com:LaunchPadLab/lp-redux-api.git`
* `yarn install`

If you are developing and want to see the results in a local client application:
* Link the local library:
  * `yarn link` in the lp-redux-api directory
  * `yarn link @launchpadlab/lp-requests` in the client directory
* Run the watchful build: `yarn start`

Changes will be immediately compiled and available to the client application.

*Warning:* Remember to unlink the library and use a real version before submitting a pull request for the client application. Forgetting to do so may cause you to push up code which works locally but breaks on the review app.

## Testing
This library uses [Jest](https://facebook.github.io/jest/) for unit testing, run with `yarn run test`.

## Linting
This library uses [ESLint](http://eslint.org/) for linting, run with `yarn run lint`.
