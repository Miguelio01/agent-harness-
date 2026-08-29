// mcp-servers/security-sanitizer.js
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// PII & Injection patterns
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

function sanitize(text) {
  if (typeof text !== 'string') return text;
  let sanitized = text;
  sanitized = sanitized.replace(PII_PATTERNS.email, '[EMAIL_REDACTED]');
  sanitized = sanitized.replace(PII_PATTERNS.phone, '[PHONE_REDACTED]');
  return sanitized;
}

function hasPromptInjection(text) {
  if (typeof text !== 'string') return false;
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

rl.on('line', (line) => {
  try {
    const request = JSON.parse(line);
    const { method, id, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'security-sanitizer',
            version: '1.0.0'
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'sanitize_payload',
              description: 'Validates and sanitizes payload for PII and Prompt Injections.',
              inputSchema: {
                type: 'object',
                properties: {
                  payload: { type: 'string', description: 'The JSON string of the radicado' }
                },
                required: ['payload']
              }
            }
          ]
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      if (name === 'sanitize_payload') {
        const rawPayload = args.payload;
        
        if (hasPromptInjection(rawPayload)) {
          const response = {
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify({ success: false, error: 'PROMPT_INJECTION_DETECTED' }) }],
              isError: true
            }
          };
          process.stdout.write(JSON.stringify(response) + '\n');
          return;
        }

        const parsed = JSON.parse(rawPayload);
        parsed.descripcion = sanitize(parsed.descripcion);
        if (parsed.entidadPostgres && parsed.entidadPostgres.campos) {
          parsed.entidadPostgres.campos = parsed.entidadPostgres.campos.map(c => {
            if (c.nombre.toLowerCase().includes('nit') || c.nombre.toLowerCase().includes('email') || c.nombre.toLowerCase().includes('telefono')) {
              c.sanitized = true;
            }
            return c;
          });
        }

        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify({ success: true, data: parsed }) }]
          }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: err.message }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});
