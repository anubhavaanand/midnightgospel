const fs = require('fs');
const path = require('path');

const dirs = ['Hub', 'Episode1', 'Episode2', 'Episode3', 'Episode4', 'Episode5', 'Episode6', 'Episode7', 'Episode8'];

dirs.forEach(d => {
  const dir = path.join('src', 'levels', d);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(path.join(dir, file), 'utf8');
      
      const shaderFile = file.replace('.tsx', 'Shader');
      const importStatement = `import './${shaderFile}';\n`;
      
      // If the import doesn't exist, add it after the other imports
      if (!content.includes(`import './${shaderFile}'`)) {
        // Find the last import statement
        const lines = content.split('\n');
        let lastImportIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        lines.splice(lastImportIndex + 1, 0, importStatement);
        content = lines.join('\n');
        fs.writeFileSync(path.join(dir, file), content);
      }
    }
  });
});

console.log('Fixed imports.');
