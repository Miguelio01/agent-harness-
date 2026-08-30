import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mcpServerPath = path.resolve(__dirname, '../mcp-servers/security-sanitizer.js');

const payload = {
  radicadoId: "RAD-PRUEBA-001",
  tramite: "DeclaracionRetencionIca",
  descripcion: "Estimados, favor radicar la declaracion de retencion de ICA para el contribuyente con NIT 830.092.110-3 correspondiente al periodo de julio de 2026 (202607) por un valor retenido de COP 8450300.00 pesos M/C. El estado inicial debe ser PENDIENTE. Si tienen dudas llamar a Miguel Beltran al +573159998877 o escribir a miguel.beltran@tributos.com para autorizaciones. Saludos."
};

const mcpProcess = spawn('node', [mcpServerPath]);

let output = '';

mcpProcess.stdout.on('data', (data) => {
  output += data.toString();
  try {
    const lines = output.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        const response = JSON.parse(line);
        console.log('\n--- Received JSON-RPC Response ---');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.id === 1) {
          const result = JSON.parse(response.result.content[0].text);
          console.log('\n--- Extracted Sanitized Description ---');
          console.log(result.data.descripcion);
          
          // Verify assertions
          const desc = result.data.descripcion;
          const hasNitRedacted = desc.includes('[NIT_REDACTED]');
          const hasPhoneRedacted = desc.includes('[PHONE_REDACTED]');
          const hasEmailRedacted = desc.includes('[EMAIL_REDACTED]');
          const hasMontoPreserved = desc.includes('8450300.00');
          
          console.log('\n--- Verifications ---');
          console.log(`NIT Redacted: ${hasNitRedacted ? 'PASS' : 'FAIL'}`);
          console.log(`Phone Redacted: ${hasPhoneRedacted ? 'PASS' : 'FAIL'}`);
          console.log(`Email Redacted: ${hasEmailRedacted ? 'PASS' : 'FAIL'}`);
          console.log(`Monto Preserved (No False Positive): ${hasMontoPreserved ? 'PASS' : 'FAIL'}`);
          
          mcpProcess.kill();
          process.exit(hasNitRedacted && hasPhoneRedacted && hasEmailRedacted && hasMontoPreserved ? 0 : 1);
        }
      }
    }
    output = lines[lines.length - 1];
  } catch (err) {}
});

// Send tool call request
const callToolReq = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'sanitize_payload',
    arguments: {
      payload: JSON.stringify(payload)
    }
  }
};

mcpProcess.stdin.write(JSON.stringify(callToolReq) + '\n');
