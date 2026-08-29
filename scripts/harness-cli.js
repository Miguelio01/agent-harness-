// scripts/harness-cli.js
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const inputArg = args.find(arg => arg.startsWith('--input='));

if (!inputArg) {
  console.error('Error: Debes proveer un archivo de entrada con --input=radicado.json');
  process.exit(1);
}

const inputPath = path.resolve(inputArg.split('=')[1]);
if (!fs.existsSync(inputPath)) {
  console.error(`Error: El archivo ${inputPath} no existe.`);
  process.exit(1);
}

const rawContent = fs.readFileSync(inputPath, 'utf8');
const radicado = JSON.parse(rawContent);

// 2.1 Schema validation
const requiredFields = ['radicadoId', 'tramite', 'descripcion', 'entidadPostgres', 'reglasNegocio', 'vistasAngular'];
for (const field of requiredFields) {
  if (!radicado[field]) {
    console.error(`Error de Validación: Campo obligatorio '${field}' ausente en radicado.`);
    process.exit(1);
  }
}

console.log(`Radicado ${radicado.radicadoId} cargado correctamente. Iniciando desensibilización ISO 27001...`);

// Sanitization & Prompt Injection Checks
const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /\b\+?[0-9]{7,15}\b/g
};

const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /ignore rules/i,
  /instead of.*(drop|delete|truncate)/i,
  /system prompt/i
];

function checkInjection(text) {
  if (typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(p => p.test(text));
}

if (checkInjection(radicado.descripcion) || radicado.reglasNegocio.some(checkInjection)) {
  console.error("ALERTA DE SEGURIDAD: Intento de Prompt Injection detectado. Proceso abortado.");
  process.exit(1);
}

// Redact PII
radicado.descripcion = radicado.descripcion
  .replace(PII_PATTERNS.email, '[EMAIL_REDACTED]')
  .replace(PII_PATTERNS.phone, '[PHONE_REDACTED]');

// Create approved output directory
const approvedDir = path.resolve(__dirname, '../requirements/approved');
if (!fs.existsSync(approvedDir)) {
  fs.mkdirSync(approvedDir, { recursive: true });
}

const outputPath = path.join(approvedDir, `${radicado.tramite}-approved.json`);
fs.writeFileSync(outputPath, JSON.stringify(radicado, null, 2), 'utf8');

console.log(`[OK] Radicado sanitizado guardado con éxito en: requirements/approved/${radicado.tramite}-approved.json`);
console.log(`Próximo paso: Ejecute su Agente (Claude Code o OpenCode) para generar el código basado en este archivo.`);
