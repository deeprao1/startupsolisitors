const fs = require('fs');
const files = [
  'it-company-setup-guide.html',
  'trademark-filing-manual.html',
  'tax-planning-handbook.html',
  'company-registration-guide.html'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let regex = /<div class="disclaimer">[\s\S]*?<\/footer>/g;
  if(regex.test(c)){
    c = c.replace(regex, '');
    fs.writeFileSync(f, c);
    console.log('Removed from ' + f);
  } else {
    console.log('Not found in ' + f);
  }
});
