const { execSync } = require('child_process');
const path = require('path');

// Get the files staged for commit
const files = process.argv.slice(2);

// Map files to their respective service directories
const serviceDirs = new Set();
files.forEach(file => {
  const parts = file.split(path.sep);
  if (parts.length > 1 && parts[0] !== 'node_modules') {
    // Only include directories that contain a package.json
    try {
      if (require('fs').existsSync(path.join(parts[0], 'package.json'))) {
        serviceDirs.add(parts[0]);
      }
    } catch (e) {}
  }
});

// Run lint and test for each identified service
serviceDirs.forEach(dir => {
  console.log(`Checking service: ${dir}`);
  try {
    execSync(`npm run lint --prefix ${dir}`, { stdio: 'inherit' });
    execSync(`npm test --prefix ${dir} -- --findRelatedTests --passWithNoTests`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Checks failed for service: ${dir}`);
    process.exit(1);
  }
});
