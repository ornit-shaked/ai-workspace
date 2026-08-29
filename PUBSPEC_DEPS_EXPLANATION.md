# pubspec_deps Mechanism — Explained

## What is `pubspec_deps`?

`pubspec_deps` is a **non-destructive dependency injection system** in the flutter-plugin. It modifies the existing `pubspec.yaml` file (created by `flutter create`) by adding packages without overwriting user content.

---

## How It Works

### Step 1: Define Dependencies in manifest.json

```json
{
  "pubspec_deps": {
    "dependencies": {
      "flutter_bloc": "^9.1.1",
      "freezed_annotation": "^3.1.0",
      "go_router": "^17.3.0"
    },
    "dev_dependencies": {
      "bloc_test": "^10.0.0",
      "freezed": "^3.2.5",
      "build_runner": "^2.4.7"
    }
  }
}
```

### Step 2: Plugin Installation Runs

```bash
node index.js install flutter-plugin /path/to/my-app
```

### Step 3: postInstall Hook Executes

The `hooks.js` `postInstall()` function:

1. **Reads** the existing `pubspec.yaml` (created by `flutter create`)
2. **Parses** it as YAML
3. **Checks** each package in `pubspec_deps`:
   - If package already exists → **skip** (don't duplicate)
   - If package doesn't exist → **add** with specified version
4. **Sorts** dependencies alphabetically (required by very_good_analysis lint)
5. **Writes** back to `pubspec.yaml`

---

## Example: Before and After

### BEFORE (flutter create output)

```yaml
name: my_app
description: A new Flutter project.

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
```

### AFTER (flutter-plugin installed)

```yaml
name: my_app
description: A new Flutter project.

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  cupertino_icons: ^1.0.2
  flutter:
    sdk: flutter
  flutter_bloc: ^9.1.1          # ← ADDED
  freezed_annotation: ^3.1.0    # ← ADDED
  go_router: ^17.3.0            # ← ADDED
  json_annotation: ^4.8.1       # ← ADDED
  provider: ^6.1.1              # ← ADDED

dev_dependencies:
  bloc_test: ^10.0.0            # ← ADDED
  build_runner: ^2.4.7          # ← ADDED
  flutter_lints: ^4.0.0
  flutter_test:
    sdk: flutter
  freezed: ^3.2.5               # ← ADDED
  json_serializable: ^6.7.1     # ← ADDED
  mocktail: ^1.0.2              # ← ADDED
  very_good_analysis: ^10.3.0   # ← ADDED
```

**Note:** Dependencies are sorted alphabetically (cupertino_icons, flutter, flutter_bloc, etc.)

---

## Key Behaviors

### ✅ What pubspec_deps Does

| Behavior | Example |
|----------|---------|
| **Adds** new packages | `flutter_bloc: ^9.1.1` added if not present |
| **Skips** existing packages | If `cupertino_icons` already exists, don't add again |
| **Preserves** user content | Original `name:`, `description:`, `environment:` untouched |
| **Sorts** alphabetically | Satisfies `very_good_analysis` lint requirement |
| **Avoids duplicates** | Re-running install doesn't duplicate packages |
| **Logs** each action | Shows "add flutter_bloc" or "skip cupertino_icons" |

### ❌ What pubspec_deps Does NOT Do

| Limitation | Why |
|-----------|-----|
| **Modify flutter: section** | Can only add to `dependencies:` and `dev_dependencies:` |
| **Add assets** | Cannot inject `flutter: assets:` configuration |
| **Add generate: true** | Cannot inject `flutter: generate: true` |
| **Add fonts** | Cannot inject `flutter: fonts:` configuration |
| **Create pubspec.yaml** | Requires file to already exist |

---

## For flutter-plugin-v1.1: The Problem

The delta needs to add to the `flutter:` section:

```yaml
flutter:
  uses-material-design: true
  # generate: true
  assets:
    - assets/images/
    - assets/data/
```

But `pubspec_deps` **only works on `dependencies:` and `dev_dependencies:`**, not on the `flutter:` section.

---

## Solutions for v1.1

### Option A: Extend pubspec_deps (Recommended)

**Add to manifest.json:**
```json
{
  "pubspec_flutter_config": {
    "uses-material-design": true,
    "generate": false,
    "assets": ["assets/images/", "assets/data/"]
  }
}
```

**Update hooks.js:**
- Add new function `injectPubspecFlutterConfig()`
- Inject into `flutter:` section (same non-destructive approach)

**Pros:**
- Consistent with existing pattern
- Non-destructive
- Idempotent (safe to re-run)

**Cons:**
- Requires code changes to installer

---

### Option B: Create pubspec.yaml Template

**Create:** `plugins/flutter-plugin/project/pubspec.template.yaml`

**Pros:**
- Simple to implement
- All config in one place

**Cons:**
- ❌ Overwrites user's pubspec.yaml
- ❌ Requires `--force` flag or manual deletion
- ❌ Breaks idempotency (re-run would lose user changes)
- ❌ Same issue as v1.0.0 known limitation

---

## Recommendation for flutter-plugin-v1.1

**Use Option A:** Extend the pubspec_deps mechanism to support `pubspec_flutter_config`

This maintains the plugin's core principle: **non-destructive, idempotent installation**.

---

## Current v1.0.0 pubspec_deps

```json
"pubspec_deps": {
  "dependencies": {
    "flutter_bloc": "^9.1.1",
    "freezed_annotation": "^3.1.0",
    "json_annotation": "^4.8.1",
    "go_router": "^17.3.0",
    "provider": "^6.1.1"
  },
  "dev_dependencies": {
    "bloc_test": "^10.0.0",
    "freezed": "^3.2.5",
    "json_serializable": "^6.7.1",
    "build_runner": "^2.4.7",
    "very_good_analysis": "^10.3.0",
    "mocktail": "^1.0.2"
  }
}
```

For v1.1, we would add:

```json
"pubspec_flutter_config": {
  "uses-material-design": true,
  "generate": false,
  "assets": ["assets/images/", "assets/data/"]
}
```

And update `dev_dependencies` to include:

```json
"integration_test": {
  "sdk": "flutter"
}
```
