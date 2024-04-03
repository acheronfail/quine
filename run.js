import { join } from 'path';
import { readFile, readdir } from 'fs/promises';
import { $ } from 'execa';
import { diffChars } from 'diff';
import printableString from 'printable-string';
import c from 'chalk';

function hadAnError() {
  process.exitCode = (process.exitCode ?? 0) + 1;
}

const runners = {
  node: (file) => `node "${file}"`,
  rust: (file, name) => `rustc "${file}" --crate-name "${name}" -o out && ./out`,
};

const srcDir = 'src';
for (const entry of await readdir(srcDir)) {
  const filepath = join(srcDir, entry);

  const [lang, name, _extension] = entry.split('.');
  const command = runners[lang](filepath, name);
  if (!command) {
    console.log(c.yellow(`No runner for ${lang}`));
    hadAnError();
    continue;
  }

  console.log(`Running (${c.cyan(lang)}) ${name}...`);
  const { stdout, stderr, failed } = await $({ stripFinalNewline: false, shell: true, reject: false })`${command}`;

  if (failed) {
    console.log(c.yellow(`${entry} did not run successfully\n${stderr.trim()}`));
    hadAnError();
    continue;
  }

  const source = await readFile(filepath);
  const changes = diffChars(source.toString(), stdout.toString());
  const isAQuine = changes.length === 1 && changes[0].count === source.length;
  if (!isAQuine) {
    console.log(c.yellow(`${entry} is not a valid quine`));
    console.log(
      changes
        .map((change) => {
          if (change.added) return c.bgGreen(printableString(change.value));
          if (change.removed) return c.bgRed(printableString(change.value));
          return change.value;
        })
        .join('')
        .trim()
    );
    hadAnError();
    continue;
  }
}
