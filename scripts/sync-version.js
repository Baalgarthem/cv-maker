import fs from 'fs';

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = pkg.version;

  const tauriConfigPath = 'src-tauri/tauri.conf.json';
  const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
  tauriConfig.version = version;
  fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');

  const cargoPath = 'src-tauri/Cargo.toml';
  let cargo = fs.readFileSync(cargoPath, 'utf8');
  cargo = cargo.replace(/^version = ".*"$/m, 'version = "' + version + '"');
  fs.writeFileSync(cargoPath, cargo);

  console.log('✅ Tauri versions automatically synchronized to v' + version);
} catch (error) {
  console.error('❌ Failed to synchronize versions:', error);
  process.exit(1);
}
