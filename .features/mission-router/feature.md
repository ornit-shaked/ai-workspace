# Goal — mission-router

Problem:   Every piece of work goes through the same feature → spec → plan flow by hand. A one-line fix costs the same ceremony as a new feature, tests run whenever an agent decides, and simple steps (commit, archive) burn LLM tokens.
Outcome:   lifecycle runs each mission on a track that fits its size (Feature, Task, Patch, Spike), defined as data in one graph file. Each step has a fixed execution mode, model, skill and test scope. The user can always open an HTML page that shows the flow as it will actually run in their project.
Done when: 1. `/lifecycle:run <mission>` prints the resolved plan for any item in work-state, and runs it for Patch and Task end to end.
           2. `.ai-workspace/lifecycle-flow.html` exists after setup and matches graph + project overrides + installed skill sets.
           3. An agent's direct `flutter test` / `npm test` is blocked; tests run only through test-gate at the scope the step allows.
Not doing: lesson capture redesign (dream stays off), plugin rename, guard hook on Devin if Devin has no PreToolUse.
Track:     feature — new public contracts (graph format, scripts, hooks) across every project that installs lifecycle.

Design: [spec.md](spec.md) · Flow: [flow.html](flow.html) (open in a browser) · Graph data: [graph.draft.json](graph.draft.json)
Depends on: lifecycle 3.0.0 (brain merged), PR #10.
