const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Check if this is a subdirectory of src/pages (e.g., src/pages/Chemistry)
            // We want to fix files INSIDE these subdirectories.
            if (path.dirname(filePath) === pagesDir || path.dirname(path.dirname(filePath)) === pagesDir) {
                traverseSubdirectory(filePath);
            } else {
                traverseDirectory(filePath);
            }
        }
    });
}

function traverseSubdirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            traverseSubdirectory(filePath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            fixImports(filePath);
        }
    });
}

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Regex to match imports starting with "../" but NOT "../../"
    // Handles named imports: import { x } from '../path'
    // Handles default imports: import x from '../path'
    // Handles side-effect imports: import '../path'

    // Pattern explanation:
    // (import\s+.*from\s+['"]|import\s+['"])  --> Capture the import part and the opening quote
    // \.\./                                  --> Match exact "../"
    // (?!\.\./)                              --> Negative lookahead: ensure it's NOT followed by another "../" (so we don't match ../../)

    const regex = /(import\s+(?:[\w\s{},*]*\s+from\s+)?['"])\.\.\/(?!\.\.\/)/g;

    content = content.replace(regex, '$1../../');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed imports in: ${filePath}`);
    }
}

// Start traversal from src/pages
// We only want to process subdirectories of src/pages.
try {
    const entries = fs.readdirSync(pagesDir);
    entries.forEach(entry => {
        const fullPath = path.join(pagesDir, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            console.log(`Processing category: ${entry}`);
            traverseSubdirectory(fullPath);
        }
    });
} catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
}
