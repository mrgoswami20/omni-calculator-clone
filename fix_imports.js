const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Processing subdirectory
            const subFiles = fs.readdirSync(fullPath);
            subFiles.forEach(subFile => {
                const subFullPath = path.join(fullPath, subFile);
                if (subFile.endsWith('.jsx')) {
                    let content = fs.readFileSync(subFullPath, 'utf8');
                    let originalContent = content;

                    // Replace ../components with ../../components
                    // We use regex to match both ' and "
                    content = content.replace(/from\s+['"]\.\.\/components/g, match => match.replace('../components', '../../components'));
                    content = content.replace(/import\s+['"]\.\.\/components/g, match => match.replace('../components', '../../components'));

                    // Replace ../assets with ../../assets
                    content = content.replace(/from\s+['"]\.\.\/assets/g, match => match.replace('../assets', '../../assets'));
                    content = content.replace(/import\s+['"]\.\.\/assets/g, match => match.replace('../assets', '../../assets'));

                    if (content !== originalContent) {
                        fs.writeFileSync(subFullPath, content, 'utf8');
                        console.log(`Updated: ${subFullPath}`);
                    }
                }
            });
        }
    });
}

traverseDir(pagesDir);
console.log('Finished updating imports.');
