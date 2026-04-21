#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const TESTS_DIR = path.join(__dirname, '../tests/asyncapi-3.0');

function findTestFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findTestFiles(fullPath));
    } else if (item.name.endsWith('.yaml') || item.name.endsWith('.yml')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function validateAsyncAPIDocument(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.parse(content);
    
    const isValid = path.basename(filePath).startsWith('valid');
    const errors = [];
    
    // Basic validation
    if (!doc.asyncapi) {
      errors.push('Missing asyncapi version');
    } else if (!doc.asyncapi.startsWith('3.0')) {
      errors.push(`Expected version 3.0.x, got ${doc.asyncapi}`);
    }
    
    if (!doc.info) {
      errors.push('Missing info object');
    } else {
      if (!doc.info.title) errors.push('Missing info.title');
      if (!doc.info.version) errors.push('Missing info.version');
    }
    
    return {
      file: path.relative(TESTS_DIR, filePath),
      expected: isValid ? 'valid' : 'invalid',
      errors: errors,
      passed: isValid ? errors.length === 0 : errors.length > 0
    };
  } catch (error) {
    return {
      file: path.relative(TESTS_DIR, filePath),
      expected: 'unknown',
      errors: [error.message],
      passed: false
    };
  }
}

function runTests() {
  console.log('🧪 AsyncAPI v3.0 Test Suite\n');
  
  const testFiles = findTestFiles(TESTS_DIR);
  const results = testFiles.map(validateAsyncAPIDocument);
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`📊 Results: ${passed} passed, ${failed} failed\n`);
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.file} (${result.expected})`);
    if (!result.passed && result.errors.length > 0) {
      result.errors.forEach(err => console.log(`   ⚠️  ${err}`));
    }
  });
  
  console.log(`\n${passed}/${results.length} tests passed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
