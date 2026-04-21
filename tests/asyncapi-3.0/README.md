# AsyncAPI v3.0 Test Suite

This directory contains test cases for AsyncAPI v3.0 specification compliance.

## Structure

```
tests/asyncapi-3.0/
├── Info Object/
│   ├── valid-basic.yaml
│   ├── invalid-missing-title.yaml
│   └── invalid-missing-version.yaml
├── Channels Object/
│   ├── valid-basic-channel.yaml
│   ├── valid-multiple-messages.yaml
│   └── invalid-missing-address.yaml
├── Operations Object/
│   ├── valid-receive-operation.yaml
│   ├── valid-send-operation.yaml
│   ├── invalid-missing-action.yaml
│   └── invalid-missing-channel.yaml
├── Message Object/
│   ├── valid-with-payload.yaml
│   ├── valid-with-headers.yaml
│   └── invalid-payload-type.yaml
├── Server Object/
│   ├── valid-basic-server.yaml
│   └── valid-with-security.yaml
└── Components Object/
    ├── valid-reusable-schemas.yaml
    └── valid-reusable-messages.yaml
```

## Test Coverage

### Implemented Components

- ✅ **Info Object**: Basic validation, required fields (title, version)
- ✅ **Channels Object**: Channel definitions, messages, address field
- ✅ **Operations Object**: Send/receive operations, action and channel references
- ✅ **Message Object**: Payload schemas, headers, content types
- ✅ **Server Object**: Server definitions, protocols, security
- ✅ **Components Object**: Reusable schemas and messages

### Test Categories

1. **Valid Examples**: Correctly formatted AsyncAPI v3.0 documents
2. **Invalid Examples**: Documents with intentional errors to test validation

## Running Tests

```bash
# Install dependencies
npm install

# Run all v3.0 tests
npm run test:v3

# Or directly
node runner/test-v3.js
```

## Test Naming Convention

- `valid-*.yaml`: Documents that should pass validation
- `invalid-*.yaml`: Documents that should fail validation

## Adding New Tests

1. Create a new YAML file in the appropriate component directory
2. Follow the naming convention (valid-* or invalid-*)
3. Add comments explaining what is being tested
4. Run tests to verify

## Next Steps

To make this production-ready:

1. Integrate with AsyncAPI JSON Schema validator
2. Add more edge cases and complex scenarios
3. Add tests for:
   - Security Schemes
   - Parameter Objects
   - Correlation IDs
   - Message Traits
   - Operation Traits
   - Server Variables
   - Tags
   - External Documentation

## References

- [AsyncAPI v3.0 Specification](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
- [AsyncAPI v3.0 Release Notes](https://www.asyncapi.com/blog/release-notes-3.0.0)
