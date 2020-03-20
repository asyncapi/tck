# AsyncAPI tck

AsyncAPI's Test Compatibility Kit (AsyncAPI TCK) provides a way for any AsyncAPI processor to test its compliance with the AsyncAPI 2.0 Spec. AsyncAPI TCK contains a set of AsyncAPI documents meant to be used to test correct and incorrect usage of each AsyncAPI feature.

## Naming convention

- `*valid*.yaml`: valid AsyncAPI file expected to be successfully processed
- `*invalid*.yaml`: invalid AsyncAPI file with syntax/semantic/spec error(s), expected to be unsuccessfully processed (error or exit code returned)

Names of folders' tests reside in correspond to AsyncAPI 2.0 Specification sections names.

Non-AsyncAPI files (libraries, extensions, etc.) must have a `.yml` extension instead of `.yaml`.

## Contributing

We welcome contributions! If you have a new test case in mind, feel free to submit a pull request. More info on how to do that [here](./CONTRIBUTING.md).
