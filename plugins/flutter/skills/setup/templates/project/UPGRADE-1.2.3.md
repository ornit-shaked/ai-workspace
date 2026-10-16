# Flutter Plugin 1.2.3 Upgrade Guide

This guide is for agents upgrading an existing Flutter project from v1.2.2 to v1.2.3.

## What Changed

- **ADRs:** Minimized to ~5 lines of real content (core decision + consequences + pointer to rules)
- **Integration guide:** Consolidated from standalone `docs/flame-rive-integration.md` into each profile's README
- **Rules:** `rules/flame.md` and `rules/rive.md` are plugin-native (delivered via SessionStart hook, not copied)

## Automatic Updates

When you run `/flutter:setup`, `/flutter:setup-flame`, or `/flutter:setup-rive`, the plugin automatically:
- ✅ Updates `.ai-workspace/plugins/flutter.md` to v1.2.3
- ✅ Copies new/updated ADRs and profile READMEs from the manifest

## Manual Updates Required

### 1. Verify Version
```bash
cat .ai-workspace/plugins/flutter.md
# Should show: v1.2.3
```

### 2. If Flame is Installed (setup-flame)

**Check ADR-0009 line count:**
```bash
wc -l docs/adr/ui/ADR-0009-flame-runtime-boundary.md
# Should be: 21 lines (was 40+ in v1.2.2)
```

**If it's still 40+ lines, replace it with the new minimal version:**
- Remove: detailed boundary table, API lists, verbose explanations
- Keep: Context (1 paragraph), Decision (2 lines), Consequences (1 paragraph), Source (1 line)
- Reference: See `docs/flame-profile.md` for the full boundary rules

**Check flame-profile.md has the new section:**
```bash
grep -A 5 "Using Flame & Rive together" docs/flame-profile.md
# Should exist and reference rules/flame.md and ADR-0010
```

**Delete if it exists:**
```bash
rm -f docs/flame-rive-integration.md
```

### 3. If Rive is Installed (setup-rive)

**Check ADR-0010 line count:**
```bash
wc -l docs/adr/ui/ADR-0010-rive-runtime-boundary.md
# Should be: 23 lines (was 37+ in v1.2.2)
```

**If it's still 37+ lines, replace it with the new minimal version:**
- Remove: detailed state-ownership table, disposal details, examples
- Keep: Context (1 paragraph), Decision (2 lines), Consequences (1 paragraph), Source (1 line)
- Reference: See `docs/rive-profile.md` for the full boundary rules

**Check rive-profile.md has the new section:**
```bash
grep -A 5 "Using Flame & Rive together" docs/rive-profile.md
# Should exist and reference rules/rive.md and ADR-0009
```

**Delete if it exists:**
```bash
rm -f docs/flame-rive-integration.md
```

### 4. If Both Flame and Rive are Installed

- Do all checks from sections 2 and 3 above
- Both profile READMEs should cross-reference each other's ADRs

## Conflicts to Watch For

### ⚠️ ADR Content Conflicts

If your project has **custom modifications** to ADR-0009 or ADR-0010 (beyond the shipped template), the upgrade will overwrite them. **Before upgrading:**

```bash
# Check for local changes
git diff docs/adr/ui/ADR-0009-flame-runtime-boundary.md
git diff docs/adr/ui/ADR-0010-rive-runtime-boundary.md
```

**If you have custom content:**
1. Save your custom sections to a separate file
2. Run the upgrade
3. Manually re-apply your custom content to the new minimal ADR
4. Document why the custom content exists in a comment or a separate decision record

### ⚠️ Profile README Conflicts

If your project has **custom modifications** to `docs/flame-profile.md` or `docs/rive-profile.md`:

```bash
git diff docs/flame-profile.md
git diff docs/rive-profile.md
```

**If you have custom content:**
1. The upgrade will overwrite the file
2. Restore your custom sections from git history
3. Merge them into the new version (the new "Using Flame & Rive together" section should be preserved)

### ⚠️ Integration Guide Deletion

If your project has **references** to `docs/flame-rive-integration.md` in other documentation or code comments:

```bash
grep -r "flame-rive-integration" docs/ lib/ test/
```

**If found:**
1. Update references to point to the relevant profile README's "Using Flame & Rive together" section instead
2. Delete the file: `rm docs/flame-rive-integration.md`

## Rules (No Action Needed)

`rules/flame.md` and `rules/rive.md` are **plugin-native** and delivered via SessionStart hook. They are **not copied into your project** — agents see them automatically. No action needed.

## Verification

After completing all steps:

```bash
# Verify version
cat .ai-workspace/plugins/flutter.md | grep "v1.2.3"

# Verify ADR line counts (if installed)
wc -l docs/adr/ui/ADR-0009-flame-runtime-boundary.md  # Should be 21
wc -l docs/adr/ui/ADR-0010-rive-runtime-boundary.md   # Should be 23

# Verify integration guide is gone
[ ! -f docs/flame-rive-integration.md ] && echo "✓ Deleted" || echo "✗ Still exists"

# Verify profile READMEs have new section
grep "Using Flame & Rive together" docs/flame-profile.md
grep "Using Flame & Rive together" docs/rive-profile.md
```

## Questions?

If you encounter conflicts or unexpected behavior, check:
1. `git status` — are there uncommitted changes?
2. `git log --oneline -5` — what was the last change to each file?
3. `.ai-workspace/plugins/flutter.md` — is the version actually 1.2.3?

If the upgrade doesn't apply changes you expect, re-run the setup skill:
```bash
/flutter:setup-flame  # or setup-rive
```
