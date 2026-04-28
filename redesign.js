const fs = require('fs');
const files = [
  'it-company-setup-guide.html',
  'trademark-filing-manual.html',
  'tax-planning-handbook.html',
  'company-registration-guide.html'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // 1. Root variables -> Use sleek tech background and shadows
  c = c.replace(/--bg:\s*#ffffff;[\s\S]*?--scroll-offset:[^;]+;/g, `--bg: #f1f5f9;
    --text: #334155;
    --text-heading: #0f172a;
    --muted: #64748b;
    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --accent-light: #eff6ff;
    --border: #e2e8f0;
    --sidebar-bg: transparent;
    --white: #ffffff;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05);
    --radius-md: 16px;
    --radius-lg: 24px;
    --font-main: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    --header-h: 65px;
    --sidebar-left-w: 260px;
    --sidebar-right-w: 320px;
    --gap: 40px;
    --content-max: 1350px;
    --px: 32px;
    --scroll-offset: calc(var(--header-h) + 40px)`);

  // 2. Hero Background overlay (making it a premium gradient)
  c = c.replace(/\.hero::before\s*\{[\s\S]*?\}/, `.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,58,138,0.85) 100%);
    z-index: 1;
  }`);

  // 3. Hero Stats (making them glassmorphic)
  c = c.replace(/\.hero-stat\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*\}/, `.hero-stat { 
    display: flex; 
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px 28px;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  .hero-stat:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
  }`);

  // 4. Main content card
  c = c.replace(/main\s*\{\s*min-width:\s*0;\s*\}/, `main { 
    min-width: 0; 
    background: var(--white);
    padding: 48px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
  }`);

  // 5. Section headings (using font-main for a modern sans-serif look)
  c = c.replace(/\.section h2\s*\{[\s\S]*?margin-bottom:\s*16px;\s*\}/, `.section h2 {
    font-family: var(--font-main);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 800;
    color: var(--text-heading);
    line-height: 1.3;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }`);

  // 6. Right Sidebar style upgrade
  c = c.replace(/\.right-sidebar\s*\{[\s\S]*?box-shadow:\s*var\(--shadow-sm\);\s*\}/, `.right-sidebar {
    position: sticky;
    top: calc(var(--header-h) + 24px);
    background: var(--white);
    padding: 32px;
    border-radius: var(--radius-lg);
    border: none;
    box-shadow: var(--shadow-md);
  }`);

  // 7. Mobile overrides for 'main' padding so it doesn't squish on small screens
  // We'll append this to the 767px media query
  if (c.includes('/* Content */')) {
    c = c.replace(/\/\*\s*Content\s*\*\//, `/* Content */
    main { padding: 24px; border-radius: var(--radius-md); border: none; box-shadow: none; border-top: 1px solid var(--border); }`);
  }

  fs.writeFileSync(f, c);
  console.log('Applied new UI/UX design to ' + f);
});
