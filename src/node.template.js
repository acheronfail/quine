const q = String.fromCharCode(96);
const s = `const q = String.fromCharCode(96);
const s = _;
console.log(s.replace('_', q+s+q));`;
console.log(s.replace('_', q+s+q));
