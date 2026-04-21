#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Parser } = require('@asyncapi/parser');

const TESTS_DIR = path.join(__dirname, '../tests/asyncapi-3.0');
const parser = new Parser();

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

async function validateAsyncAPIDocument(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const isValid = path.basename(filePath).startsWith('valid');
    
    const { document, diagnostics } = await parser.parse(content);
    
    const errors = diagnostics.filter(d => d.severity === 0); // 0 = error
    const warnings = diagnostics.filter(d => d.severity === 1); // 1 = warning
    
    // For valid files: should have no errors
    // For invalid files: should have errors
    const passed = isValid ? errors.length === 0 : errors.length > 0;
    
    return {
      file: path.relative(TESTS_DIR, filePath),
      expected: isValid ? 'valid' : 'invalid',
      errors: errors.map(e => `${e.message} (${e.path?.join('.')})`),
      warnings: warnings.map(w => `${w.message} (${w.path?.join('.')})`),
      passed: passed,
      document: document
    };
  } catch (error) {
    const isValid = path.basename(filePath).startsWith('valid');
    return {
      file: path.relative(TESTS_DIR, filePath),
      expected: isValid ? 'valid' : 'invalid',
      errors: [error.message],
      warnings: [],
      passed: !isValid, // If it's invalid and threw error, that's expected
      document: null
    };
  }
}

async function runTests() {
  console.log('🧪 AsyncAPI v3.0 Test Suite\n');
  console.log('Using @asyncapi/parser v3 for validation\n');
  
  const testFiles = findTestFiles(TESTS_DIR);
  const results = await Promise.all(testFiles.map(validateAsyncAPIDocument));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`📊 Results: ${passed} passed, ${failed} failed\n`);
  
  // Group by component
  const grouped = {};
  results.forEach(result => {
    const component = result.file.split('/')[0];
    if (!grouped[component]) grouped[component] = [];
    grouped[component].push(result);
  });
  
  Object.keys(grouped).sort().forEach(component => {
    console.log(`\n📁 ${component}`);
    grouped[component].forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      const filename = path.basename(result.file);
      console.log(`  ${icon} ${filename} (${result.expected})`);
      
      if (!result.passed) {
        if (result.errors.length > 0) {
          result.errors.slice(0, 3).forEach(err => 
            console.log(`     ⚠️  ${err}`)
          );
          if (result.errors.length > 3) {
            console.log(`     ... and ${result.errors.length - 3} more errors`);
          }
        }
      }
      
      if (result.warnings.length > 0 && result.passed) {
        result.warnings.slice(0, 2).forEach(warn => 
          console.log(`     ⚡ ${warn}`)
        );
      }
    });
  });
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📈 Total: ${passed}/${results.length} tests passed`);
  
  if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed`);
  } else {
    console.log(`\n✨ All tests passed!`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
