# Plugin Installation Tests

Tests for ai-workspace plugin installation and functionality.

## Structure

```
test/
├── README.md                 # This file
├── plugin-install.test.js    # Main test suite
└── fixtures/                 # Test fixtures (planned)
    ├── flutter-project/      # Sample Flutter project
    └── dart-project/         # Sample Dart project
```

## Running Tests

### Quick Test (Single Plugin)

```bash
node test/plugin-install.test.js flutter-plugin
node test/plugin-install.test.js project-brain --verbose
```

### With npm

```bash
npm test
```

### Verbose Mode

```bash
node test/plugin-install.test.js flutter-plugin --verbose
```

## What Gets Tested

### project-brain
- `.project-brain/tasks/todo.md` created
- `.project-brain/memory/history.md` created
- `CLAUDE.md` created

### flutter-plugin
- `CLAUDE.md` created
- `AGENTS.md` created
- `pubspec.yaml` modified with dependencies
- Dependencies injected:
  - Runtime: `flutter_bloc`, `freezed_annotation`, `json_annotation`, `go_router`, `provider`
  - Dev: `bloc_test`, `freezed`, `json_serializable`, `build_runner`, `very_good_analysis`, `mocktail`

## Test Output

```
=== Testing flutter-plugin ===
  ✓ CLAUDE.md
  ✓ AGENTS.md
  ✓ pubspec.yaml
  ✓ pubspec.yaml contains flutter_bloc
  ✓ pubspec.yaml contains freezed_annotation
  ✓ pubspec.yaml contains go_router

Result: 6 passed, 0 failed

=== Test Project ===
Location: /tmp/ai-workspace-test/test-flutter-plugin
(kept for inspection; delete manually if needed)
```

## Test Projects

Tests create temporary projects in:
- **Linux/macOS:** `/tmp/ai-workspace-test/`
- **Windows:** `%TEMP%\ai-workspace-test\`

Projects are **not automatically deleted** to allow inspection. Delete manually:

```bash
# Linux/macOS
rm -rf /tmp/ai-workspace-test/

# Windows PowerShell
Remove-Item -Recurse -Force $env:TEMP\ai-workspace-test
```

## Future (Epic 5)

- [ ] Jest/Mocha integration
- [ ] Automated cleanup
- [ ] CI/CD integration
- [ ] Coverage reporting
- [ ] Fixture-based testing
- [ ] Snapshot testing for generated files
