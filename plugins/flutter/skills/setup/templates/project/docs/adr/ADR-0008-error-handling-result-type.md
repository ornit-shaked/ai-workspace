# ADR-0008: Error Handling with Result<T> Type

**Status:** Accepted  
**Date:** 2026-08-29  
**Deciders:** Flutter Delta Team  
**Context:** Choosing between exceptions and explicit error types for async operations

## Problem

Dart's exception-based error handling (`try/catch`) is verbose and error-prone:

```dart
try {
  final user = await fetchUser(id);
  // use user
} on SocketException catch (e) {
  // handle network error
} on FormatException catch (e) {
  // handle parsing error
} on Exception catch (e) {
  // handle other errors
}
```

This approach:
- ❌ Requires nested catch blocks
- ❌ Easy to forget error cases
- ❌ Mixes success and error paths
- ❌ No compile-time guarantee all errors are handled

## Decision

**Use `Result<T>` sealed class for all async operations** that can fail.

```dart
Future<Result<User>> fetchUser(int id) async {
  try {
    final response = await http.get(...);
    return Result.ok(User.fromJson(response.body));
  } on Exception catch (e) {
    return Result.error(e);
  }
}
```

**Handle results with exhaustive pattern matching:**

```dart
final result = await fetchUser(123);
final user = switch (result) {
  ResultOk(value: final u) => u,
  ResultError(error: final e) => null,  // show error UI
};
```

## Rationale

1. **Exhaustive matching** — Sealed class forces compiler to check all cases
2. **Type-safe** — Generic `Result<T>` works with any return type
3. **No null ambiguity** — Explicit success/error, no `null` surprises
4. **Immutable** — Safe to pass around, thread-safe
5. **Idiomatic Dart** — Uses modern Dart 3 features (sealed classes, pattern matching)

## Consequences

### Positive
- ✅ Compile-time safety — Compiler enforces handling both success and error
- ✅ Readable code — Intent is explicit: "this can succeed or fail"
- ✅ Testable — Easy to test both paths without mocking exceptions
- ✅ Composable — Chain operations safely without nested try/catch

### Negative
- ⚠️ More verbose than exceptions (but more explicit)
- ⚠️ Requires learning pattern matching syntax
- ⚠️ Can't use `finally` blocks (use `defer` pattern instead)

## Implementation

**Location:** `lib/utils/result.dart`

**Usage:**
1. All async functions that can fail return `Future<Result<T>>`
2. Handle results with `switch` pattern matching
3. Never throw exceptions from business logic (only for truly exceptional cases)

## References

- [Dart sealed classes](https://dart.dev/language/class-modifiers#sealed)
- [Dart pattern matching](https://dart.dev/language/patterns)
- [Rust Result type](https://doc.rust-lang.org/std/result/) (inspiration)
- [Kotlin Result type](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) (inspiration)

## Related ADRs

- ADR-0001: State Management (Bloc/Cubit) — Result<T> used in repository layer
- ADR-0002: Freezed Everywhere — Result<T> is immutable and testable

## Notes

- `Result<T>` is **not** used for validation errors (use domain models instead)
- `Result<T>` is **only** for operations that can fail (network, file I/O, parsing)
- For simple success-only operations, return `T` directly
