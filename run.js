import { join } from 'path';
import { readFile, readdir } from 'fs/promises';
import { $ } from 'execa';
import { diffChars } from 'diff';
import printableString from 'printable-string';
import c from 'chalk';

const print = (...messages) => messages.forEach((msg) => process.stdout.write(msg));
const println = (...messages) => print(...messages, '\n');

function hadAnError() {
  process.exitCode = (process.exitCode ?? 0) + 1;
}

function isAQuine(changes, sourceLength) {
  if (changes.length !== 1) return false;
  const { count, added, removed } = changes[0];
  if (added || removed) return false;
  return count === sourceLength;
}

const runners = {
  node: (file) => `node "${file}"`,
  rust: (file, name) => `rustc "${file}" --crate-name "${name}" -o out && ./out`,
  python: (file) => `python3 "${file}"`,
  c: (file) => `gcc "${file}" -o out && ./out`,
  ruby: (file) => `ruby "${file}"`,
};

const $$ = $({ encoding: 'utf8', stripFinalNewline: false, shell: true, reject: false });
const srcDir = 'src';
const entries = await readdir(srcDir);
let skipped = 0;
for (const entry of entries) {
  if (process.argv[2] && !entry.includes(process.argv[2])) {
    skipped++;
    continue;
  }

  const filepath = join(srcDir, entry);

  const [lang, name, _extension] = entry.split('.');
  const command = runners[lang](filepath, name);
  if (!command) {
    println(c.yellow(`No runner for ${lang}`));
    hadAnError();
    continue;
  }

  print(`Running (${c.cyan(lang)}) ${name}...`);
  const { stdout, stderr, failed } = await $$`${command}`;

  if (failed) {
    println(c.red(' failed!'));
    println(c.yellow(stderr.trim()));
    hadAnError();
    continue;
  }

  const source = await readFile(filepath, 'utf-8');
  const changes = diffChars(source, stdout);
  if (!isAQuine(changes, source.length)) {
    println(c.yellow(` not a valid quine`));
    println(c.green('expected:   '), source.trim());
    println(c.red('received:   '), stdout.trim());
    println(
      c.cyan('difference: '),
      changes
        .map((change) => {
          if (change.added) return c.black.bgGreen(printableString(change.value));
          if (change.removed) return c.black.bgRed(printableString(change.value));
          return change.value;
        })
        .join('')
        .trim()
    );
    hadAnError();
    continue;
  }

  println(c.green(' success'));
}

const total = entries.length;
const failed = process.exitCode ?? 0;
const passed = total - skipped - failed;
println(`total:   ${total}`);
println(c.green(`passed:  ${passed}`));
println(c.red(`failed:  ${failed}`));
println(c.yellow(`skipped: ${skipped}`));
