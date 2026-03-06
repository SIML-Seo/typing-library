import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const usage = `Usage:
  node scripts/works-index.mjs generate [--root <path>]
  node scripts/works-index.mjs validate [--root <path>]

Defaults:
  --root works
`;

const command = process.argv[2];

if (!command || !['generate', 'validate'].includes(command)) {
  console.error(usage);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(3));
const rootDir = path.resolve(process.cwd(), args.root ?? 'works');

try {
  const result = await buildIndex({ rootDir });

  if (command === 'generate') {
    await fs.mkdir(path.dirname(result.indexPath), { recursive: true });
    await fs.writeFile(result.indexPath, `${JSON.stringify(result.index, null, 2)}\n`, 'utf8');
    console.log(`Generated ${result.index.length} works -> ${result.indexPath}`);
  } else {
    console.log(`Validated ${result.index.length} works in ${rootDir}`);
  }

  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }
} catch (error) {
  if (Array.isArray(error?.issues)) {
    console.error(`Validation failed with ${error.issues.length} issue(s):`);
    for (const issue of error.issues) {
      console.error(`- ${issue}`);
    }
  } else {
    console.error(error instanceof Error ? error.message : String(error));
  }
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--root') {
      if (!argv[index + 1]) {
        throw new Error(`Missing value for --root\n\n${usage}`);
      }
      parsed.root = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}\n\n${usage}`);
  }

  return parsed;
}

async function buildIndex({ rootDir }) {
  const catalogDir = path.join(rootDir, 'catalog');
  const publicDir = path.join(rootDir, 'public');
  const indexPath = path.join(publicDir, 'works', 'index.json');
  const issues = [];
  const warnings = [];

  await assertDirectoryExists(catalogDir, `Catalog directory not found: ${catalogDir}`);
  await assertDirectoryExists(publicDir, `Public directory not found: ${publicDir}`);

  const catalogFiles = (await collectJsonFiles(catalogDir)).sort();

  if (catalogFiles.length === 0) {
    issues.push(`No catalog JSON files found in ${catalogDir}`);
  }

  const seenIds = new Set();
  const index = [];

  for (const filePath of catalogFiles) {
    const relativeCatalogPath = path.relative(rootDir, filePath);
    const raw = await fs.readFile(filePath, 'utf8');
    const metadata = parseJson(raw, relativeCatalogPath, issues);

    if (!metadata) {
      continue;
    }

    await validateCatalogEntry({
      metadata,
      relativeCatalogPath,
      publicDir,
      seenIds,
      issues,
      warnings,
    });

    if (issues.length > 0 && issues.some((issue) => issue.startsWith(`${relativeCatalogPath}:`))) {
      continue;
    }

    try {
      index.push(await toIndexEntry({ metadata, rootDir, publicDir }));
    } catch (error) {
      issues.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (issues.length > 0) {
    throw { issues };
  }

  index.sort((left, right) => left.id.localeCompare(right.id, 'en'));

  return {
    index,
    indexPath,
    warnings,
  };
}

async function collectJsonFiles(directoryPath) {
  const results = [];
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await collectJsonFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results;
}

function parseJson(raw, label, issues) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    issues.push(`${label}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

async function validateCatalogEntry({
  metadata,
  relativeCatalogPath,
  publicDir,
  seenIds,
  issues,
  warnings,
}) {
  if (!isPlainObject(metadata)) {
    issues.push(`${relativeCatalogPath}: top-level value must be an object`);
    return;
  }

  const entryIssues = [];
  const id = requireNonEmptyString(metadata.id, `${relativeCatalogPath}: id`, entryIssues);
  requireNonEmptyString(metadata.title, `${relativeCatalogPath}: title`, entryIssues);
  requireNonEmptyString(metadata.copyrightProof, `${relativeCatalogPath}: copyrightProof`, entryIssues);
  optionalString(metadata.author, `${relativeCatalogPath}: author`, entryIssues);
  optionalString(metadata.language, `${relativeCatalogPath}: language`, entryIssues);
  optionalString(metadata.source, `${relativeCatalogPath}: source`, entryIssues);

  if (id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    entryIssues.push(`${relativeCatalogPath}: id must be kebab-case lowercase`);
  }

  if (id && seenIds.has(id)) {
    entryIssues.push(`${relativeCatalogPath}: duplicate id "${id}"`);
  }

  if (id) {
    seenIds.add(id);
  }

  const hasTextPath = typeof metadata.textPath === 'string' && metadata.textPath.trim().length > 0;
  const hasParts = Array.isArray(metadata.parts) && metadata.parts.length > 0;

  if (hasTextPath === hasParts) {
    entryIssues.push(`${relativeCatalogPath}: exactly one of textPath or parts must be defined`);
  }

  if (hasTextPath) {
    await validateTextPath(metadata.textPath, `${relativeCatalogPath}: textPath`, publicDir, entryIssues);
  }

  if (metadata.parts !== undefined) {
    if (!Array.isArray(metadata.parts) || metadata.parts.length === 0) {
      entryIssues.push(`${relativeCatalogPath}: parts must be a non-empty array`);
    } else {
      const seenPartIds = new Set();

      for (const [index, part] of metadata.parts.entries()) {
        const partLabel = `${relativeCatalogPath}: parts[${index}]`;

        if (!isPlainObject(part)) {
          entryIssues.push(`${partLabel}: part must be an object`);
          continue;
        }

        const partId = requireNonEmptyString(part.id, `${partLabel}.id`, entryIssues);
        optionalString(part.title, `${partLabel}.title`, entryIssues);
        const partPath = requireNonEmptyString(part.path, `${partLabel}.path`, entryIssues);

        if (partId && seenPartIds.has(partId)) {
          entryIssues.push(`${partLabel}: duplicate part id "${partId}"`);
        }

        if (partId) {
          seenPartIds.add(partId);
        }

        if (partId && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(partId)) {
          entryIssues.push(`${partLabel}.id: part id must be kebab-case lowercase`);
        }

        if (partPath) {
          await validateTextPath(partPath, `${partLabel}.path`, publicDir, entryIssues);
        }
      }
    }
  }

  if (typeof metadata.textPath === 'string' && id) {
    const fileName = path.basename(metadata.textPath, path.extname(metadata.textPath));

    if (fileName !== id) {
      warnings.push(`${relativeCatalogPath}: textPath basename "${fileName}" differs from id "${id}"`);
    }
  }

  if (entryIssues.length > 0) {
    issues.push(...entryIssues);
  }
}

async function toIndexEntry({ metadata, rootDir, publicDir }) {
  const entry = pickDefined(metadata, [
    'id',
    'title',
    'author',
    'language',
    'source',
    'copyrightProof',
    'textPath',
  ]);

  if (Array.isArray(metadata.parts)) {
    entry.parts = metadata.parts.map((part) =>
      pickDefined(part, ['id', 'title', 'path']),
    );
  }

  entry.checksum = await buildChecksum(metadata, rootDir, publicDir);

  return entry;
}

async function buildChecksum(metadata, rootDir, publicDir) {
  const hash = createHash('sha256');

  if (typeof metadata.textPath === 'string') {
    const fileContent = await readTextFileByRoutePath(metadata.textPath, rootDir, publicDir);
    hash.update('textPath:');
    hash.update(metadata.textPath);
    hash.update('\n');
    hash.update(fileContent);
    return hash.digest('hex');
  }

  for (const part of metadata.parts) {
    const fileContent = await readTextFileByRoutePath(part.path, rootDir, publicDir);
    hash.update('part:');
    hash.update(part.id);
    hash.update(':');
    hash.update(part.path);
    hash.update('\n');
    hash.update(fileContent);
    hash.update('\n');
  }

  return hash.digest('hex');
}

async function readTextFileByRoutePath(routePath, rootDir, publicDir) {
  const absoluteFilePath = toPublicFilePath(routePath, publicDir);
  const buffer = await fs.readFile(absoluteFilePath);

  if (hasUtf8Bom(buffer)) {
    throw new Error(`${path.relative(rootDir, absoluteFilePath)}: UTF-8 BOM is not allowed`);
  }

  const content = buffer.toString('utf8');

  if (content.includes('\r')) {
    throw new Error(`${path.relative(rootDir, absoluteFilePath)}: CRLF is not allowed; use LF only`);
  }

  return content;
}

function validateTextPath(routePath, label, publicDir, issues) {
  if (typeof routePath !== 'string' || routePath.trim().length === 0) {
    issues.push(`${label}: must be a non-empty string`);
    return;
  }

  if (!routePath.startsWith('/works/')) {
    issues.push(`${label}: must start with /works/`);
    return;
  }

  if (routePath.includes('\\')) {
    issues.push(`${label}: must use forward slashes`);
    return;
  }

  const absoluteFilePath = toPublicFilePath(routePath, publicDir);

  if (!absoluteFilePath.startsWith(path.resolve(publicDir))) {
    issues.push(`${label}: path escapes public directory`);
    return;
  }

  return fs
    .stat(absoluteFilePath)
    .then((stat) => {
      if (!stat.isFile()) {
        issues.push(`${label}: referenced path is not a file`);
      }
    })
    .catch(() => {
      issues.push(`${label}: referenced file does not exist`);
    });
}

function toPublicFilePath(routePath, publicDir) {
  return path.resolve(publicDir, routePath.slice(1));
}

async function assertDirectoryExists(directoryPath, message) {
  try {
    const stat = await fs.stat(directoryPath);
    if (!stat.isDirectory()) {
      throw new Error(message);
    }
  } catch {
    throw new Error(message);
  }
}

function requireNonEmptyString(value, label, issues) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    issues.push(`${label} must be a non-empty string`);
    return null;
  }

  return value.trim();
}

function optionalString(value, label, issues) {
  if (value === undefined) {
    return;
  }

  if (typeof value !== 'string') {
    issues.push(`${label} must be a string when provided`);
  }
}

function pickDefined(source, keys) {
  const target = {};

  for (const key of keys) {
    if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }

  return target;
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasUtf8Bom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}
