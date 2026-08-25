---
feature: {{SLUG}}
slug: {{SLUG}}
title: {{TITLE}} — Specification
owner: {{OWNER}}
created: {{DATE}}
status: specifying
spec_gen: ✅
spec_ok: ⬜
plan_gen: ⬜
plan_ok: ⬜
todo_gen: ⬜
todo_ok: ⬜
done: ⬜
---

# Spec — {{TITLE}}

> **Purpose.** Define exactly WHAT must exist when this feature is complete. WHY-level decisions live in `feature.md`. HOW-level decisions live in `plan.md`.

---

## 0. Handoff Instructions for the Implementation Agent

(Instructions for the agent that will implement this spec)

---

## 1. In Scope / Out of Scope

### 1.1 In scope

### 1.2 Out of scope

---

## 2. Assumptions

The spec assumes the following are true. If any is false, flag it and stop.

---

## 3. Confirmed Requirements

Each requirement is atomic, testable, and traceable to `feature.md`.

---

## 4. User Interface

### 4.1 Screens

List all screens this feature introduces or modifies:

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| (Screen name) | (What user does here) | (Main UI components) |

### 4.2 User Flows

Describe the primary user journeys through these screens:

1. (Flow 1: e.g., "User creates new item")
   - Step 1 → Step 2 → Step 3

### 4.3 UI Components

List reusable components this feature needs:

- (Component 1)
- (Component 2)

---

## 5. Approval Protocol

(If this feature requires specific approval strings or gates, document them here)

---

## 5. Templates

(If this feature introduces templates, document them here)

---

## 6. Acceptance Criteria

1. (Criterion 1)
2. (Criterion 2)

---

## 7. Migration

(If this feature requires migration from existing state, document it here)

---

## 8. Non-Functional Requirements

- **NFR1** (Performance, scalability, etc.)

---

## 9. Testing Plan

1. (Test scenario 1)
2. (Test scenario 2)

---

## 10. Provenance Reference

Canonical provenance table lives in `feature.md` §8. Do not duplicate here.

---

## 11. TBDs — Repository-Specific Decisions

(Questions that require repository inspection to answer)

---

## 12. Contradictions Found

If repo inspection reveals a fact that contradicts §2 Assumptions or §3 Confirmed Requirements, list it here and stop.

*(none)*

---

## 13. Open Decisions Still Pending

Any decision that cannot be resolved from repository inspection alone belongs here.

*(none)*

---

## 14. Next Step After This Spec

Once the user approves this spec:

1. Update `spec_ok: ✅` in `features/{{SLUG}}/feature.md` front-matter.
2. Run `/write-plan {{SLUG}}` to produce `features/{{SLUG}}/plan.md`.
3. Do not begin implementation until `plan_ok = ✅`.
