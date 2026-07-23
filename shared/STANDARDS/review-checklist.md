# Code Review Checklist

Before approving any code change, verify:

## Correctness
- [ ] Does it solve the stated problem?
- [ ] Are edge cases handled?
- [ ] Are error paths covered?

## Quality
- [ ] Is the code readable and well-named?
- [ ] Is there unnecessary complexity?
- [ ] Are there duplicated patterns that should be extracted?

## Testing
- [ ] Are there tests for new functionality?
- [ ] Do existing tests still pass?
- [ ] Are edge cases tested?

## Security
- [ ] No hardcoded secrets or credentials?
- [ ] Input validation present where needed?

## Documentation
- [ ] Are public APIs documented?
- [ ] Is the change reflected in relevant docs?
