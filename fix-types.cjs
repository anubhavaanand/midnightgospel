const fs = require('fs');
const path = require('path');

// Fix App.tsx
let f = fs.readFileSync('src/App.tsx', 'utf8');
f = f.replace("import React, { useEffect, useState }", "import { useEffect, useState }");
fs.writeFileSync('src/App.tsx', f);

// Fix useDialogueStore.test.ts
f = fs.readFileSync('src/__tests__/useDialogueStore.test.ts', 'utf8');
f = f.replace("progressMap: {},", "progressMap: {} as any,");
fs.writeFileSync('src/__tests__/useDialogueStore.test.ts', f);

// Fix index.ts
if (fs.existsSync('src/components/ui/index.ts')) {
  f = fs.readFileSync('src/components/ui/index.ts', 'utf8');
  f = f.replace("export { default as LoadingScreen } from './LoadingScreen';", "export { LoadingScreen } from './LoadingScreen';");
  fs.writeFileSync('src/components/ui/index.ts', f);
}

// Fix Episode components
const dirs = ['Hub', 'Episode1', 'Episode2', 'Episode3', 'Episode4', 'Episode5', 'Episode6', 'Episode7', 'Episode8'];
dirs.forEach(d => {
  const dir = path.join('src', 'levels', d);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(path.join(dir, file), 'utf8');
      // Remove unused import
      content = content.replace(/import\s+{\s*[A-Za-z]+ShaderMaterial\s*}\s+from\s+'\.\/[A-Za-z]+Shader';\n/, '');
      
      // Fix icosahedronGeometry
      if (file === 'VengeanceKingdom.tsx') {
        content = content.replace("<icosahedronGeometry args={[15, 64, 64]} />", "<icosahedronGeometry args={[15, 0]} />");
      }
      
      // Fix tubeGeometry
      if (file === 'Trainworld.tsx') {
        content = content.replace("<tubeGeometry args={[15, 64, 64]} />", "<cylinderGeometry args={[15, 15, 64, 64]} />");
      }
      
      fs.writeFileSync(path.join(dir, file), content);
    }
  });
});
