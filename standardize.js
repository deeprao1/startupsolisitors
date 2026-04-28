const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const includesDir = path.join(rootDir, 'includes');
const headerPath = path.join(includesDir, 'header.html');
const footerPath = path.join(includesDir, 'footer.html');

const headerContent = fs.readFileSync(headerPath, 'utf8');
const footerContent = fs.readFileSync(footerPath, 'utf8');

// Regex to find the header block
const headerRegex = /<header class="ak-site_header ak-style1 ak-sticky_header">[\s\S]*?<\/header>/i;
// Regex to find the footer block and common scripts
const footerRegex = /<footer class="ak-footer style-1 footer-bg"[\s\S]*?assets\/js\/main\.js"><\/script>/i;

// Note: The footer regex above is a bit aggressive. We want to catch everything from <footer> to the end of our common scripts.
// In index.html, footer starts at line 4322 and common scripts end at 5266.
// Swiper/Video scripts which are specific to the page stay.

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace Header
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, `<!-- HEADER_START -->\n${headerContent}\n<!-- HEADER_END -->`);
        modified = true;
    }

    // Replace Footer (from <footer> to the end of common scripts)
    // We'll try to find the footer and the following scripts.
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, `<!-- FOOTER_START -->\n${footerContent}\n<!-- FOOTER_END -->\n`);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const filePath = path.join(currentPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'includes' && file !== 'node_modules' && file !== 'assets' && file !== '.git') {
                walkDir(filePath);
            }
        } else if (file.endsWith('.html')) {
            processFile(filePath);
        }
    }
}

console.log('Starting standardization...');
walkDir(rootDir);
console.log('Finished standardization.');
