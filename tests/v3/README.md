# AsyncAPI v3.0.0 Compatibility Tests

## Overview

This directory contains test cases for AsyncAPI Specification v3.0.0 compatibility.

## Test Structure

```
tests/v3/
├── valid/           # Valid v3.0.0 documents
│   ├── minimal.yaml
│   ├── with-servers.yaml
│   ├── with-channels.yaml
│   └── with-operations.yaml
└── invalid/         # Invalid documents for validation testing
    ├── missing-asyncapi.yaml
    ├── invalid-version.yaml
    └── invalid-schema.yaml
```

## Valid Test Cases

### 1. Minimal Document

```yaml
asyncapi: 3.0.0
info:
  title: Minimal API
  version: 1.0.0
```

### 2. With Servers

```yaml
asyncapi: 3.0.0
info:
  title: API with Servers
  version: 1.0.0
servers:
  production:
    host: api.example.com
    protocol: https
```

### 3. With Channels

```yaml
asyncapi: 3.0.0
info:
  title: API with Channels
  version: 1.0.0
channels:
  userCreated:
    address: /users/created
    messages:
      userCreated:
        $ref: "#/components/messages/UserCreated"
```

## Running Tests

```bash
npm test -- --spec v3
```

## Contributing

Add new test cases following the existing structure.
