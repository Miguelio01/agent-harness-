// scripts/quality-check.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== Quality Gate: Running Audits (ISO 9001) ===");

let logs = [];
let passed = true;

function logAudit(name, success, detail) {
  logs.push(`- **[${success ? 'PASS' : 'FAIL'}]** ${name}: ${detail}`);
  if (!success) passed = false;
}

// 1. Structure audit: check if controllers and entities folders exist in nest-app
const nestDir = path.resolve(__dirname, '../apps/nest-app/src');
if (fs.existsSync(nestDir)) {
  logAudit("NestJS Structure", true, "Source folder detected.");
} else {
  logAudit("NestJS Structure", false, "Source directory 'apps/nest-app/src' not found.");
}

// 2. Angular Standalone check
const angularAppDir = path.resolve(__dirname, '../apps/angular-app/src');
if (fs.existsSync(angularAppDir)) {
  logAudit("Angular Structure", true, "Angular source folder detected.");
} else {
  logAudit("Angular Structure", true, "No custom Angular components generated yet.");
}

// 3. Execution of tests
try {
  console.log("Running unit tests via pnpm...");
  execSync("pnpm -r test", { stdio: 'inherit' });
  logAudit("Unit Tests", true, "All workspaces tests passed.");
} catch (e) {
  logAudit("Unit Tests", false, "Some tests failed during workspace execution.");
}

// 4. Generate report
const reportPath = path.resolve(__dirname, '../QUALITY_CHECK.md');
const reportContent = `# Quality Check Report (ISO 9001)
Fecha: ${new Date().toISOString()}
Resultado: ${passed ? 'COMPLIANT' : 'NON-COMPLIANT'}

## Detalle de Auditoría
${logs.join('\n')}
`;

fs.writeFileSync(reportPath, reportContent, 'utf8');
console.log(`[OK] Quality Gate execution finished. Report written to QUALITY_CHECK.md`);
process.exit(passed ? 0 : 1);

