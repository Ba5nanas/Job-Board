import { readFileSync } from 'fs';
import * as ts from 'typescript';

const source = readFileSync('app/layout.tsx', 'utf8');
const result = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
console.log(result.diagnostics?.map((d) => d.messageText).join('\n') || 'OK');
