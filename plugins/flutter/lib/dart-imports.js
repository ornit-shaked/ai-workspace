/**
 * Shared Dart import-block sorter (very_good_analysis compliance), used as a
 * copyFile contentTransformer by every flutter-plugin skill that templates
 * .dart files (base `setup`, `setup-flame`, `setup-rive`).
 */

function sortDartImportBlock(content, targetPath) {
  if (!targetPath.endsWith('.dart')) return content;

  const lines = content.split('\n');
  let i = 0;

  // Find the import block
  while (i < lines.length && !lines[i].startsWith('import ')) i++;
  if (i >= lines.length) return content;

  const start = i;
  while (i < lines.length && (lines[i].startsWith('import ') || lines[i].trim() === '')) i++;
  const end = i;

  if (start === end) return content;

  // Extract imports
  const imports = lines.slice(start, end).filter(line => line.startsWith('import '));

  // Sort: dart: < package: < relative
  const dartImports = imports.filter(imp => imp.includes("'dart:") || imp.includes('"dart:')).sort();
  const packageImports = imports.filter(imp => imp.includes("'package:") || imp.includes('"package:')).sort();
  const relativeImports = imports.filter(imp => !dartImports.includes(imp) && !packageImports.includes(imp)).sort();

  const sorted = [
    ...dartImports,
    dartImports.length > 0 && (packageImports.length > 0 || relativeImports.length > 0) ? '' : null,
    ...packageImports,
    packageImports.length > 0 && relativeImports.length > 0 ? '' : null,
    ...relativeImports
  ].filter(line => line !== null);

  if (sorted.length > 0) {
    return lines.slice(0, start).concat(sorted).concat(lines.slice(end)).join('\n');
  }
  return content;
}

module.exports = { sortDartImportBlock };
