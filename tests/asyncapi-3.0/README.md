# AsyncAPI v3.0 Test Suite

This directory contains a comprehensive test suite for AsyncAPI v3.0 specification compliance.

## Overview

- **27 test cases** covering all major v3.0 components
- Uses official `@asyncapi/parser` for validation
- Includes both valid and invalid test scenarios
- Executable via CLI with detailed reporting

## Test Coverage

### Components Tested

| Component | Valid Tests | Invalid Tests | Total |
|-----------|-------------|---------------|-------|
| Info Object | 1 | 3 | 4 |
| Channels Object | 2 | 1 | 3 |
| Operations Object | 2 | 3 | 5 |
| Message Object | 2 | 1 | 3 |
| Server Object | 2 | 0 | 2 |
| Components Object | 2 | 0 | 2 |
| Security Schemes | 1 | 0 | 1 |
| Message Traits | 1 | 0 | 1 |
| Operation Traits | 1 | 0 | 1 |
| Parameters | 1 | 0 | 1 |
| Server Variables | 1 | 0 | 1 |
| Tags | 1 | 0 | 1 |
| External Documentation | 1 | 0 | 1 |
| Integration | 1 | 0 | 1 |
| **Total** | **18** | **9** | **27** |

## Directory Structure

```
tests/asyncapi-3.0/
├── Channels Object/
│   ├── valid-basic-channel.yaml
│   ├── valid-multiple-messages.yaml
│   └── invalid-messages-type.yaml
├── Operations Object/
│   ├── valid-receive-operation.yaml
│   ├── valid-send-operation.yaml
│   ├── invalid-action-value.yaml
│   ├── invalid-missing-action.yaml
│   └── invalid-missing-channel.yaml
├── Message Object/
│   ├── valid-with-payload.yaml
│   ├── valid-with-headers.yaml
│   └── invalid-payload-type.yaml
├── Info Object/
│   ├── valid-basic.yaml
│   ├── invalid-missing-title.yaml
│   ├── invalid-missing-version.yaml
│   └── invalid-description-type.yaml
├── Server Object/
│   ├── valid-basic-server.yaml
│   └── valid-with-security.yaml
├── Components Object/
│   ├── valid-reusable-schemas.yaml
│   └── valid-reusable-messages.yaml
├── Security Schemes/
│   └── valid-multiple-schemes.yaml
├── Message Traits/
│   └── valid-with-traits.yaml
├── Operation Traits/
│   └── valid-with-traits.yaml
├── Parameters/
│   └── valid-channel-parameters.yaml
├── Server Variables/
│   └── valid-server-variables.yaml
├── Tags/
│   └── valid-with-tags.yaml
├── External Documentation/
│   └── valid-external-docs.yaml
├── Integration/
│   └── valid-complex-example.yaml
└── README.md
```

## Running Tests

### Prerequisites

```bash
npm install
```

### Run All Tests

```bash
npm test
# or
npm run test:v3
```

### Expected Output

```
🧪 AsyncAPI v3.0 Test Suite

Using @asyncapi/parser v3 for validation

📊 Results: 27 passed, 0 failed

📁 Channels Object
  ✅ invalid-messages-type.yaml (invalid)
  ✅ valid-basic-channel.yaml (valid)
  ✅ valid-multiple-messages.yaml (valid)

...

==================================================
📈 Total: 27/27 tests passed

✨ All tests passed!
```

## Test Naming Convention

- `valid-*.yaml`: Documents that should pass validation
- `invalid-*.yaml`: Documents that should fail validation

## Key Features Tested

### AsyncAPI v3.0 Specific Features

1. **Operation/Channel Decoupling**: Operations are now separate from channels
2. **Send/Receive Actions**: Operations use `send` or `receive` actions
3. **Channel Addresses**: Channels have explicit `address` fields
4. **Reusable Components**: Messages, schemas, and traits in components
5. **Server Variables**: Dynamic server configuration
6. **Security Schemes**: Multiple authentication methods
7. **Message/Operation Traits**: Reusable behavior patterns

### Validation Coverage

- ✅ Required fields validation
- ✅ Type checking
- ✅ Reference resolution ($ref)
- ✅ Enum value validation
- ✅ Schema structure validation
- ✅ Cross-component references

## Adding New Tests

1. Create a new YAML file in the appropriate component directory
2. Follow the naming convention (`valid-*` or `invalid-*`)
3. Add descriptive comments explaining what is being tested
4. Run `npm test` to verify

Example:

```yaml
asyncapi: 3.0.0

info:
  title: My Test
  version: 1.0.0

channels:
  my/channel:
    address: my/channel
    messages:
      MyMessage:
        payload:
          type: object
```

## Implementation Details

### Test Runner

The test runner (`runner/test-v3.js`) uses the official `@asyncapi/parser` package to:

1. Parse each YAML document
2. Collect validation diagnostics (errors and warnings)
3. Verify expected outcomes (valid files should have no errors)
4. Generate detailed reports grouped by component

### Parser Integration

```javascript
const { Parser } = require('@asyncapi/parser');
const parser = new Parser();

const { document, diagnostics } = await parser.parse(content);
const errors = diagnostics.filter(d => d.severity === 0);
```

## Future Enhancements

Potential areas for expansion:

- [ ] Bindings tests (Kafka, AMQP, HTTP, etc.)
- [ ] Correlation ID tests
- [ ] Reply/Request-Reply patterns
- [ ] More complex schema validations
- [ ] Multi-protocol scenarios
- [ ] Performance benchmarks
- [ ] JSON format tests (currently YAML only)

## References

- [AsyncAPI v3.0 Specification](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
- [AsyncAPI v3.0 Release Notes](https://www.asyncapi.com/blog/release-notes-3.0.0)
- [@asyncapi/parser Documentation](https://github.com/asyncapi/parser-js)

## Contributing

Contributions are welcome! Please ensure:

1. Tests follow the existing structure
2. Both valid and invalid cases are covered
3. Comments explain what is being tested
4. All tests pass before submitting

## License

Apache 2.0 - See LICENSE file for details
