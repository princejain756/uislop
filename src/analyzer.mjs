import fs from 'node:fs';
import path from 'node:path';

export const RULES = [
  {
    id: 'UIS001',
    slug: 'gradient-text-hero',
    category: 'palette',
    severity: 'warn',
    weight: 8,
    title: 'Gradient-clipped hero heading',
    fix: 'Use solid high-contrast foreground typography (`text-zinc-950` or `text-zinc-50`) instead of `bg-clip-text text-transparent bg-gradient-to-*`.'
  },
  {
    id: 'UIS002',
    slug: 'indigo-violet-gradient',
    category: 'palette',
    severity: 'warn',
    weight: 7,
    title: 'Default indigo/purple/pink LLM gradient',
    fix: 'Replace `from-indigo-*/via-purple-*/to-pink-*` with an intentional single-hue surface or semantic CSS custom properties.'
  },
  {
    id: 'UIS003',
    slug: 'indigo-monoculture',
    category: 'palette',
    severity: 'warn',
    weight: 6,
    title: 'Indigo/violet utility monoculture (>35% of chromatic classes)',
    fix: 'Define brand tokens in `tailwind.config` or CSS variables instead of defaulting to `indigo-500`/`violet-600`/`purple-500`.'
  },
  {
    id: 'UIS004',
    slug: 'floating-blur-blobs',
    category: 'palette',
    severity: 'info',
    weight: 5,
    title: 'Decorative blurred background glow orb',
    fix: 'Remove `blur-3xl rounded-full opacity-20` background orbs or replace with structural grid lines / real product media.'
  },
  {
    id: 'UIS005',
    slug: 'lucide-cliche-cluster',
    category: 'icons',
    severity: 'warn',
    weight: 7,
    title: 'AI-cliche icon pack cluster (Sparkles, Zap, Rocket, Shield, Brain, Wand2)',
    fix: 'Replace generic metaphor icons (`Sparkles`, `Rocket`, `Zap`) with domain-specific diagrams, real UI previews, or plain typography.'
  },
  {
    id: 'UIS006',
    slug: 'sparkle-eyebrow-pill',
    category: 'icons',
    severity: 'warn',
    weight: 6,
    title: 'Sparkle or pulsing-dot hero eyebrow pill',
    fix: 'Remove the `rounded-full` `<Sparkles />` / `animate-ping` pill badge above the `<h1>`, or link to a concrete changelog entry.'
  },
  {
    id: 'UIS007',
    slug: 'tinted-squircle-icon-grid',
    category: 'icons',
    severity: 'info',
    weight: 5,
    title: 'Repeated tinted-squircle icon badge grid',
    fix: 'Vary feature presentation instead of repeating `bg-*-500/10 p-3 rounded-xl` icon boxes on every card.'
  },
  {
    id: 'UIS008',
    slug: 'three-col-card-monotony',
    category: 'layout',
    severity: 'info',
    weight: 6,
    title: 'Repeated 3-column uniform card grids in a single view',
    fix: 'Break up consecutive `grid-cols-1 md:grid-cols-3` sections with asymmetric splits, tables, or interactive walkthroughs.'
  },
  {
    id: 'UIS009',
    slug: 'glass-lift-card-clone',
    category: 'layout',
    severity: 'info',
    weight: 5,
    title: 'Glassmorphism hover-lift card template (`backdrop-blur` + `hover:-translate-y-1`)',
    fix: 'Use crisp 1px borders and restrained surface contrast instead of `backdrop-blur bg-white/5 hover:-translate-y-1` on every card.'
  },
  {
    id: 'UIS010',
    slug: 'ai-hero-buzzwords',
    category: 'copy',
    severity: 'warn',
    weight: 7,
    title: 'Formulaic AI marketing buzzwords in UI copy',
    fix: 'State the concrete mechanism and numbers instead of "Supercharge your", "Unleash the power of", "Built for modern teams", or "Seamless integration".'
  },
  {
    id: 'UIS011',
    slug: 'em-dash-ui-copy',
    category: 'copy',
    severity: 'info',
    weight: 4,
    title: 'Em-dash (`—`) clause splice in visible UI copy',
    fix: 'Split into two short sentences or use a colon/period instead of LLM em-dash clauses.'
  },
  {
    id: 'UIS012',
    slug: 'fake-testimonial-cast',
    category: 'trust',
    severity: 'error',
    weight: 9,
    title: 'Hardcoded placeholder company or synthetic testimonial persona',
    fix: 'Remove fabricated quotes ("Sarah Chen", "Alex Rivera", "Acme Corp", "TechFlow", "Nexus AI") and cite only verifiable users or real benchmark runs.'
  },
  {
    id: 'UIS013',
    slug: 'stock-avatar-urls',
    category: 'trust',
    severity: 'error',
    weight: 8,
    title: 'Memorized Unsplash portrait ID or random avatar generator URL',
    fix: 'Remove `pravatar.cc`, `randomuser.me`, or LLM-memorized Unsplash avatar URLs (`photo-1534528741775...`).'
  },
  {
    id: 'UIS014',
    slug: 'unverified-vanity-triad',
    category: 'trust',
    severity: 'warn',
    weight: 6,
    title: 'Static vanity metric badge ("10,000+ developers", "99.9% uptime", "10x faster")',
    fix: 'Replace generic rounded vanity numbers with measured, reproducible benchmark figures.'
  },
  {
    id: 'UIS015',
    slug: 'dead-anchor-href',
    category: 'wiring',
    severity: 'error',
    weight: 7,
    title: 'Dead anchor link (`href="#"` or `href=""`) without handler',
    fix: 'Point `<a>` elements to real routes/URLs or use a wired `<button type="button">`.'
  },
  {
    id: 'UIS016',
    slug: 'noop-event-handler',
    category: 'wiring',
    severity: 'error',
    weight: 8,
    title: 'Hollow event handler (`onClick={() => {}}`, `console.log`, or fake `setTimeout` submit)',
    fix: 'Wire the control to real state/mutation logic or remove the non-functional UI shell.'
  }
];

const RULE_MAP = new Map(RULES.map((r) => [r.id, r]));

const UI_EXTENSIONS = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.astro', '.html']);
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
  '.vercel',
  'vendor'
]);

const SKIP_FILE_PATTERNS = [
  /\.test\.[jt]sx?$/i,
  /\.spec\.[jt]sx?$/i,
  /\.stories\.[jt]sx?$/i,
  /(?:^|[/-])(?:theme|themes|syntax|highlight|prism|shiki|ansi|terminal-colors)[.-]/i
];

const CHROMATIC_FAMILIES = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

const CLICHE_ICONS = new Set([
  'Sparkles', 'Zap', 'Rocket', 'Shield', 'ShieldCheck', 'Brain', 'Wand2', 'Bot', 'Cpu', 'Flame', 'Stars'
]);

const MEMORIZED_UNSPLASH_IDS = [
  'photo-1534528741775-53994a69daeb',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1494790108377-be9c29b29330',
  'photo-1500648767791-00dcc994a43e',
  'photo-1438761681033-6461ffad8d80',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1517841905240-472988babdf9'
];

export function discoverUiFiles(inputs, options = {}) {
  const includeTests = Boolean(options.includeTests);
  const found = [];

  function walk(target) {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    if (stat.isFile()) {
      const ext = path.extname(target).toLowerCase();
      if (!UI_EXTENSIONS.has(ext)) return;
      if (!includeTests && SKIP_FILE_PATTERNS.some((re) => re.test(target))) return;
      found.push(path.resolve(target));
      return;
    }
    if (!stat.isDirectory()) return;
    const entries = fs.readdirSync(target, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(path.join(target, entry.name));
    }
  }

  for (const inp of inputs) {
    walk(inp);
  }
  return Array.from(new Set(found)).sort();
}

/**
 * Masks out block comments, line comments, <pre>/<code> blocks, and <svg> bodies
 * while preserving exact line numbers (\n) so line citations remain 100% accurate.
 */
export function maskNonUiRegions(source) {
  let masked = source;
  // Mask block comments /* ... */
  masked = masked.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  // Mask HTML comments <!-- ... -->
  masked = masked.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
  // Mask <pre>...</pre>, <code>...</code>, and <svg>...</svg>
  masked = masked.replace(/<(pre|code|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => m.replace(/[^\n]/g, ' '));
  return masked;
}

export function analyzeFileContent(source, filePath = 'Component.tsx') {
  const masked = maskNonUiRegions(source);
  const lines = masked.split('\n');
  const rawLines = source.split('\n');
  const findings = [];

  const addFinding = (ruleId, lineIdx, snippet, detail) => {
    const rule = RULE_MAP.get(ruleId);
    findings.push({
      ruleId: rule.id,
      slug: rule.slug,
      category: rule.category,
      severity: rule.severity,
      weight: rule.weight,
      title: rule.title,
      fix: rule.fix,
      file: filePath,
      line: lineIdx + 1,
      snippet: (snippet || rawLines[lineIdx] || '').trim().slice(0, 110),
      detail
    });
  };

  // Track file-wide statistics
  const colorCounts = new Map();
  let totalChromatic = 0;
  let indigoVioletPurpleCount = 0;
  let firstIndigoLine = -1;

  const squircleLines = [];
  const threeColGridLines = [];
  const importedClicheIcons = new Set();
  let clicheImportLine = -1;

  const colorRegex = /\b(?:bg|text|border|from|via|to|ring|fill|stroke)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:[1-9]00|50|950)\b/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // Count chromatic utilities
    let cm;
    colorRegex.lastIndex = 0;
    while ((cm = colorRegex.exec(line)) !== null) {
      const hue = cm[1];
      colorCounts.set(hue, (colorCounts.get(hue) || 0) + 1);
      totalChromatic++;
      if (hue === 'indigo' || hue === 'violet' || hue === 'purple') {
        indigoVioletPurpleCount++;
        if (firstIndigoLine === -1) firstIndigoLine = i;
      }
    }

    // UIS001: Gradient-clipped hero heading
    if (
      /\bbg-clip-text\b/.test(line) &&
      /\btext-transparent\b/.test(line) &&
      /\bbg-gradient-to-[trbl]{1,2}\b/.test(line)
    ) {
      addFinding('UIS001', i, rawLines[i], 'Gradient-clipped transparent text heading (`bg-clip-text text-transparent bg-gradient-to-*`)');
    }

    // UIS002: Default indigo/purple/pink LLM gradient
    if (
      /\bfrom-(?:indigo|violet|purple)-\d{3}\b/.test(line) &&
      /\b(?:via|to)-(?:indigo|violet|purple|pink|fuchsia|blue)-\d{3}\b/.test(line)
    ) {
      addFinding('UIS002', i, rawLines[i], 'Default multi-stop indigo/purple/pink gradient utility');
    }

    // UIS004: Decorative blurred background glow orb
    if (
      /\bblur-3xl\b/.test(line) &&
      /\brounded-full\b/.test(line) &&
      /\b(?:opacity-[1234]0|bg-(?:indigo|purple|violet|pink|blue)-\d{3}\/[1234]0)\b/.test(line)
    ) {
      addFinding('UIS004', i, rawLines[i], 'Decorative `blur-3xl rounded-full` background glow orb');
    }

    // UIS005: Track lucide-react / heroicons cliche imports
    if (/\bimport\b/.test(line) && /lucide-react|@heroicons\/react/.test(line)) {
      for (const icon of CLICHE_ICONS) {
        const re = new RegExp(`\\b${icon}\\b`);
        if (re.test(line)) {
          importedClicheIcons.add(icon);
          if (clicheImportLine === -1) clicheImportLine = i;
        }
      }
    }

    // UIS006: Sparkle or pulsing-dot hero eyebrow pill
    const window3 = lines.slice(i, Math.min(lines.length, i + 4)).join(' ');
    if (
      /\brounded-full\b/.test(line) &&
      /(?:<Sparkles\b|✨|\banimate-ping\b)/.test(window3) &&
      /(?:<h1\b|text-[456]xl\b)/.test(lines.slice(i, Math.min(lines.length, i + 10)).join(' '))
    ) {
      addFinding('UIS006', i, rawLines[i], 'Hero eyebrow `rounded-full` pill badge with `<Sparkles>` or `animate-ping` dot above heading');
    }

    // UIS007: Tinted-squircle icon badge
    if (
      /\bbg-(?:indigo|violet|purple|blue|emerald|pink)-\d{3}\/(?:10|15|20)\b/.test(line) &&
      /\brounded-(?:xl|2xl|lg)\b/.test(line) &&
      /\b(?:p-[234]|w-1[02]\s+h-1[02])\b/.test(line)
    ) {
      squircleLines.push(i);
    }

    // UIS008: 3-column uniform card grids
    if (/\bgrid-cols-1\b/.test(line) && /\b(?:md|lg):grid-cols-3\b/.test(line)) {
      threeColGridLines.push(i);
    }

    // UIS009: Glassmorphism hover-lift card clone
    if (
      /\bbackdrop-blur(?:-\w+)?\b/.test(line) &&
      /\bhover:(?:-translate-y-1|scale-105|shadow-(?:xl|2xl))\b/.test(line) &&
      /\brounded-(?:2xl|3xl|xl)\b/.test(line)
    ) {
      addFinding('UIS009', i, rawLines[i], 'Glassmorphism + hover-lift card template (`backdrop-blur` + `hover:-translate-y-1`)');
    }

    // UIS010: Formulaic AI hero buzzwords in JSX/HTML copy
    const buzzMatch = line.match(
      /\b(Supercharge your|Unleash the(?:\s+power\s+of)?|Next-Generation|Built for modern teams|Seamless integration|Transform the way you|Unlock the power of|Revolutionize your|All-in-one platform for)\b/i
    );
    if (buzzMatch && !/^\s*(?:import|export|const\s+\w+\s*=\s*require)/.test(line)) {
      addFinding('UIS010', i, rawLines[i], `Formulaic AI copy phrase: "${buzzMatch[1]}"`);
    }

    // UIS011: Em-dash in visible JSX/HTML copy (between words)
    if (/[A-Za-z0-9]\s*—\s*[A-Za-z0-9]/.test(line) && !/^\s*(?:\/\/|\*|import\b)/.test(trimmed)) {
      addFinding('UIS011', i, rawLines[i], 'Em-dash (`—`) clause separator in UI copy');
    }

    // UIS012: Fake testimonial cast & placeholder companies
    const fakeMatch = line.match(
      /\b(Acme Corp|Globex(?:\s+Corp)?|Initech|TechFlow(?:\s+AI)?|Nexus AI|Sarah Chen|Alex Rivera|Elena Rostova|Marcus Vance)\b/
    );
    if (fakeMatch) {
      addFinding('UIS012', i, rawLines[i], `Synthetic placeholder entity/testimonial persona: "${fakeMatch[1]}"`);
    }

    // UIS013: Stock avatar URLs
    const stockAvatar =
      line.match(/\b(i\.pravatar\.cc|pravatar\.cc|randomuser\.me\/api\/portraits)\b/) ||
      MEMORIZED_UNSPLASH_IDS.find((id) => line.includes(id));
    if (stockAvatar) {
      const label = Array.isArray(stockAvatar) ? stockAvatar[1] : stockAvatar;
      addFinding('UIS013', i, rawLines[i], `Stock or LLM-memorized avatar URL (${label})`);
    }

    // UIS014: Unverified vanity metric triad
    const vanityMatch = line.match(
      /\b(10,000\+\s*(?:developers|users|teams|companies)|99\.99?%\s*uptime|500\+\s*(?:enterprise\s+)?teams)\b/i
    );
    if (vanityMatch) {
      addFinding('UIS014', i, rawLines[i], `Hardcoded static vanity metric: "${vanityMatch[1]}"`);
    }

    // UIS015: Dead anchor href="#"
    if (/<a\b[^>]*\bhref\s*=\s*["'](?:#|)["'][^>]*>/i.test(line) && !/\bonClick\s*=/.test(line)) {
      addFinding('UIS015', i, rawLines[i], 'Dead anchor `<a href="#">` without click handler or real route');
    }

    // UIS016: Hollow event handler
    if (
      /\bonClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/.test(line) ||
      /\bonClick\s*=\s*\{\s*\(\s*\)\s*=>\s*console\.log\(/.test(line) ||
      /\bonSubmit\s*=\s*\{\s*\(\s*\w*\s*\)\s*=>\s*\w+\.preventDefault\(\s*\)\s*\}/.test(line)
    ) {
      addFinding('UIS016', i, rawLines[i], 'No-op event handler (`onClick={() => {}}`, `console.log`, or bare `preventDefault`)');
    }
  }

  // File-level aggregate rules
  if (totalChromatic >= 6) {
    const ratio = indigoVioletPurpleCount / totalChromatic;
    if (indigoVioletPurpleCount >= 5 && ratio > 0.35) {
      addFinding(
        'UIS003',
        firstIndigoLine,
        rawLines[firstIndigoLine],
        `Indigo/violet/purple accounts for ${Math.round(ratio * 100)}% (${indigoVioletPurpleCount}/${totalChromatic}) of chromatic utility classes in this file`
      );
    }
  }

  if (importedClicheIcons.size >= 3) {
    addFinding(
      'UIS005',
      clicheImportLine,
      rawLines[clicheImportLine],
      `Imports ${importedClicheIcons.size} cliché AI landing icons (${Array.from(importedClicheIcons).join(', ')})`
    );
  }

  if (squircleLines.length >= 2) {
    addFinding(
      'UIS007',
      squircleLines[0],
      rawLines[squircleLines[0]],
      `Repeats tinted-squircle icon wrapper (${squircleLines.length}x in file)`
    );
  }

  if (threeColGridLines.length >= 2) {
    addFinding(
      'UIS008',
      threeColGridLines[1],
      rawLines[threeColGridLines[1]],
      `${threeColGridLines.length} separate 3-column uniform card grids in the same view`
    );
  }

  return {
    file: filePath,
    totalChromatic,
    indigoVioletPurpleCount,
    colorBreakdown: Object.fromEntries(colorCounts),
    findings
  };
}

export function scoreGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 78) return 'B';
  if (score >= 62) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

export function analyzeCorpus(filePaths, rootDir = process.cwd()) {
  const fileReports = [];
  const allFindings = [];
  const categoryPenalties = {
    palette: 0,
    icons: 0,
    layout: 0,
    copy: 0,
    trust: 0,
    wiring: 0
  };
  const categoryCaps = {
    palette: 24,
    icons: 18,
    layout: 14,
    copy: 14,
    trust: 22,
    wiring: 20
  };

  let totalChromaticTokens = 0;
  let totalIndigoVioletPurple = 0;

  for (const absPath of filePaths) {
    const content = fs.readFileSync(absPath, 'utf8');
    const relPath = path.relative(rootDir, absPath) || path.basename(absPath);
    const res = analyzeFileContent(content, relPath);
    fileReports.push(res);
    totalChromaticTokens += res.totalChromatic;
    totalIndigoVioletPurple += res.indigoVioletPurpleCount;
    for (const f of res.findings) {
      allFindings.push(f);
      categoryPenalties[f.category] = (categoryPenalties[f.category] || 0) + f.weight;
    }
  }

  // Normalize category penalties by corpus size so a 500-file repo is not scored like a 1-file component
  const cosmeticScale = filePaths.length <= 4 ? 1 : Math.min(1, Math.sqrt(4 / filePaths.length));
  const structuralScale = filePaths.length <= 4 ? 1 : Math.min(1, Math.sqrt(12 / filePaths.length));
  for (const cat of Object.keys(categoryPenalties)) {
    const scale = cat === 'trust' || cat === 'wiring' ? structuralScale : cosmeticScale;
    categoryPenalties[cat] = Math.min(
      categoryCaps[cat],
      Math.round(categoryPenalties[cat] * scale)
    );
  }

  const filesWithFindings = fileReports.filter((r) => r.findings.length > 0).length;
  const rawPenalty = Object.values(categoryPenalties).reduce((a, b) => a + b, 0);
  const craftScore = Math.max(0, Math.min(100, 100 - rawPenalty));
  const vibecodeIndex = 100 - craftScore;
  const grade = scoreGrade(craftScore);

  const ruleCounts = {};
  for (const f of allFindings) {
    ruleCounts[f.ruleId] = (ruleCounts[f.ruleId] || 0) + 1;
  }

  return {
    filesScanned: filePaths.length,
    filesWithFindings,
    totalFindings: allFindings.length,
    craftScore,
    vibecodeIndex,
    grade,
    indigoSharePct:
      totalChromaticTokens > 0
        ? Number(((totalIndigoVioletPurple / totalChromaticTokens) * 100).toFixed(1))
        : 0,
    totalChromaticTokens,
    totalIndigoVioletPurple,
    categoryPenalties,
    ruleCounts,
    findings: allFindings,
    files: fileReports
  };
}

export function formatTerminalReport(report, label = '') {
  const lines = [];
  lines.push('UISLOP v0.1.0 · Static Vibecode & AI-UI Slop Auditor');
  lines.push('══════════════════════════════════════════════════════════════════════════════');
  if (label) lines.push(`Target            : ${label}`);
  lines.push(
    `Files scanned     : ${report.filesScanned} UI files · ${report.totalFindings} findings across ${Object.values(report.categoryPenalties).filter((v) => v > 0).length}/6 categories`
  );
  lines.push(
    `Human-Craft Score : ${report.craftScore}/100 (Grade ${report.grade}) · Vibecode Index: ${report.vibecodeIndex}/100`
  );
  lines.push(
    `Palette Entropy   : ${report.totalIndigoVioletPurple}/${report.totalChromaticTokens} chromatic tokens in indigo/violet/purple (${report.indigoSharePct}%)`
  );
  lines.push('');
  lines.push('CATEGORY BREAKDOWN (penalty / cap)');
  lines.push('──────────────────────────────────────────────────────────────────────────────');
  const catOrder = [
    ['palette', 'Palette & Gradient Defaulting', 24],
    ['trust', 'Fake Social Proof & Avatars  ', 22],
    ['wiring', 'Hollow Wiring & Dead Links   ', 20],
    ['icons', 'Icon & Pill Badge Cliches    ', 18],
    ['copy', 'Formulaic AI Hero Copy       ', 14],
    ['layout', 'Bento & Glass Card Monotony  ', 14]
  ];
  for (const [key, name, cap] of catOrder) {
    const pen = report.categoryPenalties[key] || 0;
    const filled = Math.round((pen / cap) * 12);
    const bar = '█'.repeat(filled) + '░'.repeat(Math.max(0, 12 - filled));
    lines.push(`  ${name}  [${bar}]  -${String(pen).padStart(2, ' ')} / ${cap} pts`);
  }

  if (report.findings.length > 0) {
    lines.push('');
    lines.push('TOP LINE-CITED FINDINGS');
    lines.push('──────────────────────────────────────────────────────────────────────────────');
    for (const f of report.findings.slice(0, 12)) {
      lines.push(`  [${f.ruleId}] ${f.file}:${f.line} · ${f.detail}`);
      lines.push(`           Fix: ${f.fix}`);
    }
    if (report.findings.length > 12) {
      lines.push(`  ... and ${report.findings.length - 12} more findings (run with --json for full list)`);
    }
  } else {
    lines.push('');
    lines.push('  ✓ Zero vibecoded UI tells detected.');
  }
  return lines.join('\n');
}

export function formatGithubAnnotations(report) {
  return report.findings
    .map((f) => {
      const level = f.severity === 'error' ? 'error' : f.severity === 'warn' ? 'warning' : 'notice';
      return `::${level} file=${f.file},line=${f.line},title=${f.ruleId} (${f.slug})::${f.detail}. ${f.fix}`;
    })
    .join('\n');
}
