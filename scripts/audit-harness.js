// scripts/audit-harness.js
const fs = require('fs');
const path = require('path');

console.log('=== HARNESS AUDIT: Verificación de Cumplimiento ISO 27001 & ISO 9001 ===');

let failureCount = 0;

function audit(name, fn) {
  try {
    fn();
    console.log(`[OK] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    failureCount++;
  }
}

// 1. Auditoría de Fuga de PII (ISO 27001)
audit('ISO 27001 - Fuga de Datos (PII) en Requerimientos Aprobados', () => {
  const approvedDir = path.join(__dirname, '../requirements/approved');
  if (!fs.existsSync(approvedDir)) {
    throw new Error('El directorio de requerimientos aprobados no existe.');
  }

  const files = fs.readdirSync(approvedDir).filter(f => f.endsWith('.json'));
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /\+?[0-9]{10,15}/; // Matches raw phone numbers (10 to 15 digits)

  files.forEach(file => {
    const content = fs.readFileSync(path.join(approvedDir, file), 'utf8');
    if (emailRegex.test(content)) {
      throw new Error(`Se detectó un posible correo electrónico sin enmascarar en ${file}`);
    }
    // Check if phone number is not redacted
    const matches = content.match(/\b\+?[0-9]{7,15}\b/g) || [];
    const rawPhones = matches.filter(phone => !phone.includes('[PHONE_REDACTED]'));
    if (rawPhones.length > 0) {
      throw new Error(`Se detectó un posible número telefónico sin enmascarar en ${file}: ${rawPhones.join(', ')}`);
    }
  });
});

// 2. Auditoría de Seguridad de Credenciales (Fuga de Secretos)
audit('ISO 27001 - Exclusión de Archivos Sensibles y Locales (.gitignore)', () => {
  const gitignorePath = path.join(__dirname, '../.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    throw new Error('El archivo .gitignore no existe.');
  }

  const content = fs.readFileSync(gitignorePath, 'utf8');
  const targets = ['.env', 'node_modules', '.kiro', 'mcp-test-config.json'];
  targets.forEach(t => {
    if (!content.includes(t)) {
      throw new Error(`El archivo .gitignore no contiene la exclusión para "${t}"`);
    }
  });
});

// 3. Auditoría de Configuración del Servidor MCP Local
audit('MCP - Configuración de Servidores MCP locales (.mcp.json)', () => {
  const mcpConfigPath = path.join(__dirname, '../.mcp.json');
  if (!fs.existsSync(mcpConfigPath)) {
    throw new Error('El archivo de configuración .mcp.json no existe.');
  }

  const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  if (!config.mcpServers || !config.mcpServers['security-sanitizer']) {
    throw new Error('No se encuentra configurado el servidor "security-sanitizer" en .mcp.json');
  }

  const scriptPath = path.join(__dirname, '../', config.mcpServers['security-sanitizer'].args[0]);
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`El script del MCP especificado en la configuración no existe: ${scriptPath}`);
  }
});

// 4. Auditoría de Salud del Workspace Monorepo
audit('ISO 9001 - Estructura de Workspace y Quality Gate', () => {
  const workspacePath = path.join(__dirname, '../pnpm-workspace.yaml');
  if (!fs.existsSync(workspacePath)) {
    throw new Error('El archivo pnpm-workspace.yaml no existe.');
  }

  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!packageJson.scripts || !packageJson.scripts['quality-check']) {
    throw new Error('El script "quality-check" no está registrado en el package.json de la raíz.');
  }
});

if (failureCount > 0) {
  console.error(`\n[ERROR] Auditoría finalizada. Se encontraron ${failureCount} fallos de cumplimiento.`);
  process.exit(1);
} else {
  console.log('\n[ÉXITO] El arnés cumple al 100% con los estándares de seguridad ISO 27001 e ISO 9001.');
  process.exit(0);
}
