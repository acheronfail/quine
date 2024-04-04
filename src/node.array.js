const q = String.fromCharCode(34);
const lines = [
  "const q = String.fromCharCode(34);",
  "const lines = [",
  "];",
  "for (let i = 0; i < 2; ++i) console.log(lines[i]);",
  "for (let i = 0; i < lines.length; ++i) console.log('  ' + q + lines[i] + q + ',');",
  "for (let i = 2; i < lines.length; ++i) console.log(lines[i]);",
];
for (let i = 0; i < 2; ++i) console.log(lines[i]);
for (let i = 0; i < lines.length; ++i) console.log('  ' + q + lines[i] + q + ',');
for (let i = 2; i < lines.length; ++i) console.log(lines[i]);
