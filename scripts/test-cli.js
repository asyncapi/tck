const fs = require('fs');
const path = require('path');
const { Parser } = require('@asyncapi/parser');
const yaml = require('js-yaml');

const parser = new Parser();

async function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await walkDir(filePath));
    } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      results.push(filePath);
    }
  }
  return results;
}

async function testFiles() {
  const testsDir = path.join(__dirname, '..', 'tests', 'asyncapi-3.0');
  
  if (!fs.existsSync(testsDir)) {
    console.error(`Tests directory not found: ${testsDir}`);
    process.exit(1);
  }

  const files = await walkDir(testsDir);
  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const filename = path.basename(file);
    const content = fs.readFileSync(file, 'utf8');
    
    let isExpectedValid = false;
    if (filename.startsWith('valid')) {
      isExpectedValid = true;
    } else if (filename.startsWith('invalid')) {
      isExpectedValid = false;
    } else {
      console.warn(`Skipping ${file} - must start with 'valid' or 'invalid'`);
      continue;
    }

    try {
      const { document, diagnostics } = await parser.parse(content);
      const hasErrors = diagnostics && diagnostics.some(d => d.severity === 0); // 0 is Error
      
      if (isExpectedValid && !hasErrors) {
        console.log(`✅ PASS: ${file}`);
        passed++;
      } else if (!isExpectedValid && hasErrors) {
        console.log(`✅ PASS: ${file} (Failed as expected)`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${file}`);
        console.error(`Expected Valid: ${isExpectedValid}, Has Errors: ${hasErrors}`);
        if (hasErrors) console.error(diagnostics);
        failed++;
      }
    } catch (err) {
      if (!isExpectedValid) {
        console.log(`✅ PASS: ${file} (Threw error as expected)`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${file}`);
        console.error(`Expected Valid but threw error:`, err.message);
        failed++;
      }
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

testFiles().catch(err => {
  console.error("Runner error:", err);
  process.exit(1);
});
