import { readFileSync } from 'fs';

const files = ['app/components/Navbar.tsx', 'app/components/Button.tsx', 'app/components/Card.tsx', 'app/components/Badge.tsx'];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  if (!content.endsWith('};')) {
    console.error(`ERROR: ${file} does not end with "}"`);
    continue;
  }
  let braceCount = 0;
  let bracketCount = 0;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '{') braceCount++;
    else if (ch === '}') braceCount--;
    else if (ch === '[') bracketCount++;
    else if (ch === ']') bracketCount--;
  }
  if (braceCount !== 0 || bracketCount !== 0) {
    console.error(`ERROR: ${file} has unbalanced braces/brackets`);
    continue;
  }
  const trailingComma = /,\s*}/.test(content.trim());
  if (trailingComma) {
    console.error(`ERROR: ${file} has a trailing comma before closing brace`);
    continue;
  }
  console.log('OK:', file);
}
