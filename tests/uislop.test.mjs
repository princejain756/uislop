import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  analyzeFileContent,
  analyzeCorpus,
  discoverUiFiles,
  formatGithubAnnotations
} from '../src/analyzer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('detects all 6 categories of vibecoded UI tells on synthetic SaaS landing page', () => {
  const sampleFile = path.join(__dirname, '..', 'examples', 'vibecoded-landing.tsx');
  const report = analyzeCorpus([sampleFile], path.join(__dirname, '..', 'examples'));

  assert.equal(report.filesScanned, 1);
  assert.ok(report.totalFindings >= 12, `Expected >=12 findings, got ${report.totalFindings}`);
  assert.equal(report.grade, 'F');
  assert.ok(report.craftScore < 30);

  const triggeredRules = new Set(report.findings.map((f) => f.ruleId));
  for (const expected of [
    'UIS001',
    'UIS002',
    'UIS003',
    'UIS004',
    'UIS005',
    'UIS006',
    'UIS007',
    'UIS008',
    'UIS009',
    'UIS010',
    'UIS011',
    'UIS012',
    'UIS013',
    'UIS014',
    'UIS015',
    'UIS016'
  ]) {
    assert.ok(triggeredRules.has(expected), `Missing expected rule ${expected}`);
  }
});

test('ignores code blocks, comments, and SVG internals to prevent false positives', () => {
  const cleanWithCodeSample = `
    // Supercharge your workflow — Sarah Chen at Acme Corp href="#"
    /* bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 */
    export function DocumentationPage() {
      return (
        <main className="max-w-3xl mx-auto py-12 text-zinc-900">
          <h1 className="text-3xl font-semibold tracking-tight"> CLI Reference </h1>
          <pre><code>
            &lt;a href="#"&gt;Supercharge your workflow — Acme Corp&lt;/a&gt;
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500"
          </code></pre>
          <a href="/docs/install" className="underline text-amber-700">Read install guide</a>
        </main>
      );
    }
  `;
  const res = analyzeFileContent(cleanWithCodeSample, 'DocumentationPage.tsx');
  assert.equal(res.findings.length, 0);
});

test('does not flag indigo monoculture when palette is balanced across warm/neutral hues', () => {
  const balancedPalette = `
    export function Dashboard() {
      return (
        <div className="bg-amber-50 text-emerald-900 border-teal-600">
          <span className="bg-rose-500 text-amber-700 border-emerald-500" />
          <span className="bg-sky-600 text-orange-600 border-indigo-500" />
        </div>
      );
    }
  `;
  const res = analyzeFileContent(balancedPalette, 'Dashboard.tsx');
  assert.equal(res.findings.filter((f) => f.ruleId === 'UIS003').length, 0);
});

test('skips syntax-highlighting and theme files by default in discoverUiFiles', () => {
  const files = discoverUiFiles([path.join(__dirname, '..', 'examples')]);
  assert.equal(files.length, 1);
});

test('formats GitHub Actions workflow annotations accurately', () => {
  const sampleFile = path.join(__dirname, '..', 'examples', 'vibecoded-landing.tsx');
  const report = analyzeCorpus([sampleFile], path.join(__dirname, '..', 'examples'));
  const ghOut = formatGithubAnnotations(report);
  assert.match(ghOut, /::error file=vibecoded-landing\.tsx,line=\d+,title=UIS012/);
  assert.match(ghOut, /::warning file=vibecoded-landing\.tsx,line=\d+,title=UIS001/);
});
