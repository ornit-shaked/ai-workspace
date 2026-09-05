---
description: Dart error handling — Result<T> pattern for async operations
globs: "lib/**/*.dart, test/**/*.dart"
---

# Dart Error Handling with Result<T>

> **Scope:** This rule applies to **all Dart projects** (Flutter, backend, CLI, etc.), not just Flutter.
> It's a Dart-specific pattern that can be reused across different frameworks and platforms.
> Future rules for FastAPI, Node.js, etc. will have their own error handling patterns.

## Rule: Use Result<T> for All Async Operations

When writing async code that can fail (network calls, file I/O, parsing), **always return `Result<T>`** instead of throwing exceptions.

### ✅ DO: Return Result<T>

```dart
Future<Result<User>> fetchUser(int id) async {
  try {
    final response = await http.get(Uri.parse('...'));
    final user = User.fromJson(jsonDecode(response.body));
    return Result.ok(user);
  } on Exception catch (e) {
    return Result.error(e);
  }
}
```

### ❌ DON'T: Throw exceptions from business logic

```dart
// Bad: throws exception
Future<User> fetchUser(int id) async {
  final response = await http.get(...);
  return User.fromJson(jsonDecode(response.body));
}
```

## Rule: Handle Results with Pattern Matching

Always use `switch` pattern matching to handle `Result<T>`. This ensures the compiler verifies you handle both success and error cases.

### ✅ DO: Use switch pattern matching

```dart
final result = await userRepository.fetchUser(123);
final user = switch (result) {
  ResultOk(value: final u) => u,
  ResultError(error: final e) => null,
};
```

### ✅ DO: Handle errors explicitly

```dart
final result = await userRepository.fetchUser(123);
switch (result) {
  case ResultOk(value: final user):
    // use user
    state = UserLoaded(user);
  case ResultError(error: final e):
    // handle error
    state = UserError(e.toString());
}
```

### ❌ DON'T: Ignore error cases

```dart
// Bad: doesn't handle error case
if (result case ResultOk(value: final user)) {
  state = UserLoaded(user);
}
// What if result is ResultError? State is undefined!
```

## Rule: Never Nest Try/Catch

Don't use try/catch for `Result<T>` operations. The whole point is to avoid nested try/catch blocks.

### ✅ DO: Chain Result operations

```dart
final userResult = await userRepository.fetchUser(id);
final postsResult = switch (userResult) {
  ResultOk(value: final user) => await postRepository.fetchPosts(user.id),
  ResultError(error: final e) => Result.error(e),
};
```

### ❌ DON'T: Wrap Result in try/catch

```dart
// Bad: defeats the purpose of Result<T>
try {
  final result = await userRepository.fetchUser(id);
  // now what? result is Result<User>, not User
} catch (e) {
  // this won't catch anything from Result
}
```

## Rule: Test Both Paths

When testing functions that return `Result<T>`, test both success and error cases.

### ✅ DO: Test both ResultOk and ResultError

```dart
test('fetchUser returns ResultOk on success', () async {
  final result = await repository.fetchUser(123);
  expect(result, isA<ResultOk<User>>());
  expect(result.asOk.id, equals(123));
});

test('fetchUser returns ResultError on failure', () async {
  final result = await repository.fetchUser(-1);
  expect(result, isA<ResultError<User>>());
  expect(result.asError, isA<Exception>());
});
```

## When NOT to Use Result<T>

- **Validation errors** — Use domain models (e.g., `User.validate()` returns `List<ValidationError>`)
- **Simple operations** — If it can't fail, return `T` directly
- **Truly exceptional cases** — If something is truly exceptional (out of memory, stack overflow), let it throw

## See Also

- **ADR-0008** — Architectural decision and rationale
- **lib/utils/result.dart** — Implementation
- **test/utils/result_test.dart** — Test examples
