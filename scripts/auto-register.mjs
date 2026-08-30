import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const homeDir = os.homedir();
const projectRoot = path.resolve(__dirname, '..');

console.log('=== Global AI CLI MCP & Skills Auto-Registration Protocol ===');

// 1. Read local .mcp.json
const localMcpPath = path.join(projectRoot, '.mcp.json');
let localMcp = { mcpServers: {} };
if (fs.existsSync(localMcpPath)) {
  try {
    localMcp = JSON.parse(fs.readFileSync(localMcpPath, 'utf8'));
    console.log('[Info] Local MCP config loaded successfully.');
  } catch (err) {
    console.error('[Error] Failed to parse local .mcp.json:', err.message);
  }
}

// 2. Register MCP Servers globally for Claude Code & Claude Desktop
const claudePaths = [
  path.join(homeDir, '.claude.json'),
  path.join(homeDir, '.config/claude/config.json'),
  path.join(homeDir, 'Library/Application Support/Claude/config.json')
];

claudePaths.forEach(cfgPath => {
  try {
    const dir = path.dirname(cfgPath);
    if (!fs.existsSync(dir)) {
      // Try creating directory if path is under .config
      if (cfgPath.includes('.config')) {
        fs.mkdirSync(dir, { recursive: true });
      } else {
        return; // Skip if parent directory doesn't exist (e.g. Claude Desktop app not installed)
      }
    }
    
    let config = {};
    if (fs.existsSync(cfgPath)) {
      config = JSON.parse(fs.readFileSync(cfgPath, 'utf8')) || {};
    }
    
    config.mcpServers = { ...(config.mcpServers || {}), ...localMcp.mcpServers };
    
    // Resolve absolute path for local security-sanitizer script inside the cloned repo
    if (config.mcpServers['security-sanitizer']) {
      config.mcpServers['security-sanitizer'].args = [
        path.join(projectRoot, 'mcp-servers/security-sanitizer.js')
      ];
    }
    
    fs.writeFileSync(cfgPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`[OK] Registered MCP servers in Claude config: ${cfgPath}`);
  } catch (err) {
    console.log(`[Skip] Claude config path not accessible: ${cfgPath} (${err.message})`);
  }
});

// 3. Register skills globally for Antigravity / Gemini CLI
const geminiSkillsDir = path.join(homeDir, '.gemini/skills');
try {
  if (!fs.existsSync(geminiSkillsDir)) {
    fs.mkdirSync(geminiSkillsDir, { recursive: true });
  }
  const localSkillsDir = path.join(projectRoot, 'skills');
  if (fs.existsSync(localSkillsDir)) {
    fs.readdirSync(localSkillsDir).forEach(file => {
      const src = path.join(localSkillsDir, file);
      const dest = path.join(geminiSkillsDir, file);
      fs.copyFileSync(src, dest);
    });
    console.log(`[OK] Copied project skills to global Gemini/Antigravity directory: ${geminiSkillsDir}`);
  }
} catch (err) {
  console.log(`[Error] Failed to register Gemini skills globally: ${err.message}`);
}

// 4. Register local workspace in Kiro CLI if available
try {
  execSync('kiro-cli mcp import --file .mcp.json workspace --force', { stdio: 'ignore' });
  console.log('[OK] Registered MCP servers in Kiro CLI workspace.');
} catch (err) {
  console.log('[Skip] Kiro CLI registration skipped (not installed or in path).');
}

// 5. Generate local .cursorrules in project root for Cursor IDE / Codex
try {
  const cursorRulesPath = path.join(projectRoot, '.cursorrules');
  const localSkillsDir = path.join(projectRoot, 'skills');
  let cursorRulesContent = '=== Cursor Project Rules & Skills ===\n';
  
  if (fs.existsSync(localSkillsDir)) {
    fs.readdirSync(localSkillsDir).forEach(file => {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(localSkillsDir, file), 'utf8');
        cursorRulesContent += `\n\n--- Skill: ${file} ---\n${content}`;
      }
    });
    fs.writeFileSync(cursorRulesPath, cursorRulesContent, 'utf8');
    console.log('[OK] Created project-level .cursorrules compiling all localized skills.');
  }
} catch (err) {
  console.log(`[Error] Failed to generate .cursorrules: ${err.message}`);
}

// 6. Generate local .opencode rules
try {
  const opencodeRulesDir = path.join(projectRoot, '.opencode/rules');
  if (!fs.existsSync(opencodeRulesDir)) {
    fs.mkdirSync(opencodeRulesDir, { recursive: true });
  }
  const localSkillsDir = path.join(projectRoot, 'skills');
  if (fs.existsSync(localSkillsDir)) {
    fs.readdirSync(localSkillsDir).forEach(file => {
      const src = path.join(localSkillsDir, file);
      const dest = path.join(opencodeRulesDir, file);
      fs.copyFileSync(src, dest);
    });
    console.log('[OK] Copied localized skills to project-level .opencode/rules/ directory.');
  }
} catch (err) {
  console.log(`[Error] Failed to generate .opencode rules: ${err.message}`);
}

console.log('=============================================================');
