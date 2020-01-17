# Contributing

Each test case should contain the following files:
* A valid `*valid*.yaml` file showcasing valid use of the feature under test
* An invalid `*invalid*.yaml` files showcasing invalid use of the feature under test

Please place new tests in one of `tests/asyncapi-2.0` sub-folders. Name of the target folder should correspond to the name of the feature your tests test. E.g. if your new `.yaml` tests `Info Object`, place it in `tests/asyncapi-2.0/Info Object`.

Non-AsyncAPI files (libraries, extensions, etc.) must have a `.yml` extension instead of `.yaml`.

After adding/moving/deleting tck files, manifest has to be regenerated with:
```sh
npm run gen-manifest
```

## Running tests

We've created a separate project called [tck runner](./runner) to run all the tests contained in the AsyncAPI TCK. By following the instructions on that directory, you should be able to test any new test case that you may want to contribute against the different projects that this runner covers.
