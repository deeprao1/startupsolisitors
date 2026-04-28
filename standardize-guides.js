const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const includesDir = path.join(rootDir, 'includes');
const headerContent = fs.readFileSync(path.join(includesDir, 'header.html'), 'utf8');
const footerContent = fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8');

// Guide pages that use custom inline headers/footers instead of the standard site header
const guideFiles = [
  'it-company-setup-guide.html',
  'trademark-filing-manual.html',
  'tax-planning-handbook.html',
  'company-registration-guide.html',
];

// External CSS that the standard header/footer require
const externalCSS = `
  <link rel="stylesheet" href="assets/css/plugins/swiper.min.css" />
  <link rel="stylesheet" href="assets/css/plugins/bootstrap.min.css" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="stylesheet" href="assets/css/floating-buttons.css" />`;

// External JS that the standard footer requires
const externalJS = `
  <script src="assets/js/plugins/jquery-3.7.1.min.js"></script>
  <script src="assets/js/plugins/bootstrap.bundle.min.js"></script>
  <script src="assets/js/plugins/swiper.min.js"></script>
  <script src="assets/js/popup.js"></script>
  <script src="assets/js/plugins/gsap.js"></script>
  <script src="assets/js/plugins/splittext.js"></script>
  <script src="assets/js/plugins/scrolltigger.js"></script>
  <script src="assets/js/plugins/scrolltoplugins.js"></script>
  <script src="assets/js/header-navigation.js"></script>
  <script src="assets/js/main.js"></script>

  <!-- Mega Menu & Dynamic category Helper -->
  <script>
  document.addEventListener('DOMContentLoaded', function () {
    const megaCategories = document.querySelectorAll('.mega-main-category');
    megaCategories.forEach(category => {
      category.addEventListener('mouseenter', function () {
        const target = this.getAttribute('data-target');
        const parentMenu = this.closest('ul');
        parentMenu.querySelectorAll('.mega-main-category').forEach(cat => { cat.classList.remove('active'); });
        this.classList.add('active');
        parentMenu.querySelectorAll('.mega-sub-services').forEach(service => { service.classList.remove('active'); });
        const targetService = parentMenu.querySelector('#' + target);
        if (targetService) { targetService.classList.add('active'); }
      });
    });

    const closeIcons = document.querySelectorAll('.menu-close-icon');
    closeIcons.forEach(icon => {
      icon.addEventListener('click', function () {
        const parentMenu = this.closest('ul');
        if (parentMenu) {
          parentMenu.querySelectorAll('.mega-main-category').forEach(cat => { cat.classList.remove('active'); });
          parentMenu.querySelectorAll('.mega-sub-services').forEach(service => { service.classList.remove('active'); });
        }
      });
    });
  });
  </script>`;

// CSS rules to REMOVE from inline styles (they conflict with the site's style.css)
// We remove: header, .header-inner, .logo-wrap, .logo-area, .header-tagline, nav, .btn-contact,
// .hamburger, .mobile-nav, footer, .footer-inner style blocks
const conflictingCSSPatterns = [
  // Header section
  /\/\*\s*=+\s*HEADER\s*=+\s*\*\/[\s\S]*?(?=\/\*\s*=+\s*HERO)/i,
  // Footer section
  /\/\*\s*Footer\s*\*\/[\s\S]*?\.footer-inner\s*\{[^}]*\}/i,
];

function processGuideFile(filename) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${filename}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = [];

  // 1. Add external CSS links before </head> (if not already present)
  if (!content.includes('assets/css/style.css')) {
    content = content.replace('</head>', externalCSS + '\n</head>');
    changesMade.push('Added external CSS links');
  }

  // 2. Remove conflicting inline CSS (header/footer sections)
  for (const pattern of conflictingCSSPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '/* [Removed: handled by site-wide style.css] */\n');
      changesMade.push('Removed conflicting inline CSS');
    }
  }

  // 3. Replace custom header + mobile nav with standard header
  // Pattern A: <header>...</header> directly followed by <nav class="mobile-nav"...>...</nav>
  const customHeaderRegexA = /<header>\s*<div class="header-inner">[\s\S]*?<\/header>\s*<nav class="mobile-nav"[^>]*>[\s\S]*?<\/nav>/i;
  // Pattern B: HTML-comment-wrapped header (company-registration-guide format)
  const customHeaderRegexB = /<!-- =+[\s\S]*?HEADER[\s\S]*?=+ -->\s*<header>\s*<div class="header-inner">[\s\S]*?<\/header>\s*(?:<!-- Mobile nav[^>]*-->\s*)?<nav class="mobile-nav"[^>]*>[\s\S]*?<\/nav>/i;
  
  // Try pattern B first (more specific), then pattern A
  for (const regex of [customHeaderRegexB, customHeaderRegexA]) {
    if (regex.test(content)) {
      content = content.replace(regex, `<!-- HEADER_START -->\n${headerContent}\n<!-- HEADER_END -->`);
      changesMade.push('Replaced custom header with standard header');
      break;
    }
  }

  // 4. Add standard footer before </body> (if not already present)
  // First check if there's already a standard footer
  if (!content.includes('ak-footer') && !content.includes('FOOTER_START')) {
    // Add footer + external JS before </body>
    content = content.replace('</body>', `<!-- FOOTER_START -->\n${footerContent}\n<!-- FOOTER_END -->\n${externalJS}\n</body>`);
    changesMade.push('Added standard footer and scripts');
  }

  if (changesMade.length > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  UPDATED: ${filename}`);
    changesMade.forEach(c => console.log(`    ✓ ${c}`));
  } else {
    console.log(`  NO CHANGES: ${filename} (already standardized)`);
  }
}

console.log('=== Standardizing Guide Pages ===\n');
for (const file of guideFiles) {
  console.log(`Processing: ${file}`);
  processGuideFile(file);
  console.log('');
}
console.log('=== Done ===');
