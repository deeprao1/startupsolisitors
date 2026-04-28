const fs = require('fs');
const files = [
  'it-company-setup-guide.html',
  'trademark-filing-manual.html',
  'tax-planning-handbook.html',
  'company-registration-guide.html'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // 1. CSS Variables
  c = c.replace(/--bg:\s*#ffffff;[\s\S]*?--scroll-offset:[^;]+;/g, `--bg: #ffffff;
    --text: #1e293b;
    --text-heading: #0f172a;
    --muted: #64748b;
    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --accent-light: #eff6ff;
    --border: #e2e8f0;
    --sidebar-bg: #f8fafc;
    --white: #ffffff;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --radius-md: 12px;
    --radius-lg: 16px;
    --font-main: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    --header-h: 65px;
    --sidebar-left-w: 260px;
    --sidebar-right-w: 300px;
    --gap: 48px;
    --content-max: 1300px;
    --px: 32px;
    --scroll-offset: calc(var(--header-h) + 40px)`);

  // 2. TOC List
  c = c.replace(/\.toc-list li a \{[\s\S]*?\.toc-list li a\.active \{[\s\S]*?\}/g, `.toc-list li a {
    display: block;
    padding: 10px 14px;
    font-size: 14px;
    color: var(--muted);
    text-decoration: none;
    border-radius: 8px;
    transition: var(--transition);
    line-height: 1.4;
    font-weight: 500;
  }
  .toc-list li a:hover { 
    color: var(--accent); 
    background: var(--sidebar-bg); 
    transform: translateX(4px);
  }
  .toc-list li a.active {
    color: var(--accent);
    background: var(--accent-light);
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--accent);
  }`);

  // 3. Right Sidebar
  c = c.replace(/\.right-sidebar \{[\s\S]*?\}/g, `.right-sidebar {
    position: sticky;
    top: calc(var(--header-h) + 24px);
    background: var(--white);
    padding: 24px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }`);

  // 4. Info Card
  c = c.replace(/\.info-card \{[\s\S]*?\.info-card \.ic-body/g, `.info-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 24px;
    margin-bottom: 24px;
    border-left: 4px solid var(--accent);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
  }
  .info-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  .info-card .ic-title { font-weight: 600; font-size: 15px; color: var(--text-heading); margin-bottom: 8px; }
  .info-card .ic-body`);

  // 5. Step List
  c = c.replace(/\.step-list li \{[\s\S]*?\.step-list li \.step-title/g, `.step-list li {
    counter-increment: steps;
    display: flex;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px dashed var(--border);
    align-items: flex-start;
  }
  .step-list li::before {
    content: counter(steps);
    min-width: 32px;
    height: 32px;
    background: var(--accent-light);
    color: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
    box-shadow: 0 0 0 4px var(--white), 0 0 0 5px var(--border);
  }
  .step-list li .step-title`);

  // 6. Highlight Box
  c = c.replace(/\.highlight-box \{[\s\S]*?\}/g, `.highlight-box {
    background: var(--accent-light);
    border-left: 4px solid var(--accent);
    padding: 20px 24px;
    margin: 24px 0;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    font-size: 15px;
    color: #1e3a8a;
  }`);

  // 7. Data Table
  c = c.replace(/\.data-table \{[\s\S]*?\.data-table th \{ background: var\(--sidebar-bg\); font-weight: 600; color: var\(--text\); \}/g, `.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: clamp(13px, 1.4vw, 15px);
    margin: 24px 0;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }
  .data-table th, .data-table td {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }
  .data-table th { background: var(--sidebar-bg); font-weight: 600; color: var(--text-heading); }
  .data-table tr:hover td { background: var(--sidebar-bg); }`);

  // 8. Bottom CTA
  c = c.replace(/\.bottom-cta \{[\s\S]*?\.cta-btn:hover \{[^}]*\}/g, `.bottom-cta {
    text-align: center;
    margin-top: 64px;
    padding: 64px 32px;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  .cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--text-heading);
  }
  .bottom-cta p {
    color: var(--muted);
    max-width: 500px;
    margin: 0 auto 32px;
    font-size: clamp(14px, 1.5vw, 16px);
    line-height: 1.8;
  }
  .cta-btn {
    display: inline-block;
    background: var(--accent);
    color: var(--white);
    font-weight: 700;
    padding: 16px 40px;
    border-radius: 50px;
    text-decoration: none;
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: var(--transition);
    box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
  }
  .cta-btn:hover { 
    background: var(--accent-hover); 
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.23);
  }`);

  // 9. Hero Badge
  c = c.replace(/\.hero-badge \{[\s\S]*?\}/g, `.hero-badge {
    display: inline-block;
    color: #bfdbfe;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    padding: 6px 14px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 600;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 12px;
  }`);

  fs.writeFileSync(f, c);
  console.log('Enhanced ' + f);
});
