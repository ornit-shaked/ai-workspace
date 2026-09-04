---
name: <slug-in-kebab-case>
description: When <specific trigger condition happens>, invoke this skill to <one-sentence outcome>. Do NOT invoke for <adjacent skill area 1> or <adjacent skill area 2>.
---

# <Human title>

<One paragraph — what this skill does and what it produces. No history, no theory.>

## Inputs
- <upstream artifact path or user input, one per line>

## Output
- Single file: <exact path this skill writes>

## MUST contain
- <positive contract bullet — required section or property>
- <positive contract bullet>

## MUST NOT contain
- <negative contract bullet — reference the adjacent skill that owns this content>
- <negative contract bullet>

## Success criteria
- <measurable, checkable outcome>
- File ≤ <N> lines.

## Procedure
1. <numbered step — short imperative>
2. <numbered step>
3. Save the output. Wait for the user's explicit approval string ("approved" / "looks good" / "yes") before handing off.

## Handoff
- Recommended next skill: <slug>
- FEATURES.md flag to flip after user approval: <flag_name>

## Example
See `_template/examples/<slug>.example.md`.