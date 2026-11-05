#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  discoverUiFiles,
  analyzeCorpus,
  formatTerminalReport,
  formatGithubAnnotations,
  RULES
} from '../src/analyzer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  const args = process.argv.slice(2);
  let demoMode = false;
  let jsonMode = false;
  let format = 'terminal';
  let includeTests = false;
  let failUnder = null;
  let listRules = false;
  const targets = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--demo') {
      demoMode = true;
    } else if (a === '--json') {
      jsonMode = true;
    } else if (a === '--format' && args[i + 1]) {
      format = args[++i];
    } else if (a === '--include-tests') {
      includeTests = true;
    } else if (a === '--fail-under' && args[i + 1]) {
      failUnder = Number(args[++i]);
    } else if (a === '--rules') {
      listRules = true;
    } else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: uislop [dir|file ...] [--demo] [--json] [--format github] [--fail-under <score>] [--include-tests] [--rules]'
      );
      process.exit(0);
    } else if (!a.startsWith('-')) {
      targets.push(a);
    }
  }

  if (listRules) {
    for (const r of RULES) {
      console.log(`${r.id}  [${r.category.padEnd(7)}] (-${r.weight}pt) ${r.slug}: ${r.title}`);
    }
    process.exit(0);
  }

  const scanTargets = demoMode
    ? [path.join(__dirname, '..', 'examples')]
    : targets.length > 0
      ? targets
      : [process.cwd()];

  const files = discoverUiFiles(scanTargets, { includeTests });
  if (files.length === 0) {
    console.error(
      'No UI files (.tsx, .jsx, .vue, .svelte, .astro, .html) found. Run `uislop --demo` to inspect the bundled sample.'
    );
    process.exit(1);
  }

  const rootDir = demoMode
    ? path.join(__dirname, '..', 'examples')
    : targets.length === 1 && fs.existsSync(targets[0]) && fs.statSync(targets[0]).isDirectory()
      ? path.resolve(targets[0])
      : process.cwd();

  const report = analyzeCorpus(files, rootDir);

  if (jsonMode || format === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else if (format === 'github') {
    const out = formatGithubAnnotations(report);
    if (out) console.log(out);
  } else {
    console.log(formatTerminalReport(report, demoMode ? 'examples/ (bundled demo)' : rootDir));
  }

  if (failUnder !== null && !Number.isNaN(failUnder) && report.craftScore < failUnder) {
    process.exit(2);
  }
}

if (
  process.argv[1] &&
  (import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href ||
    process.argv[1].endsWith('uislop') ||
    process.argv[1].endsWith('uislop.mjs'))
) {
  main();
}
