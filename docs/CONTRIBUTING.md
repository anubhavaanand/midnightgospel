# Contributing to Midnight Gospel 3D Simulator

First off, thank you for considering contributing to Midnight Gospel 3D Simulator! It's people like you that make this Multiverse possible.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.
- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/anubhavaanand/midnightgospel/issues).
- If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.
- Open an issue with a clear title and a detailed description of the suggested enhancement.
- Describe the current behavior and the behavior you expected to see.

### Pull Requests
We use a **Spec-Driven Development (SDD)** process. Before submitting massive architectural PRs, please ensure that you have discussed the feature in an Issue or updated the `SPEC.md` / `plan.md` in the `.specify` directories.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests to `src/__tests__/` or `tests/e2e/`.
3. Ensure the test suite passes (`npm run type-check` and `npx vitest`).
4. Format your code (e.g. `npm run lint`).
5. Issue that pull request!

## Code Style
- Use TypeScript strict mode.
- Use functional components and React Hooks (specifically `Zustand` for global state).
- Favor `@react-three/fiber` declarative syntax over imperative `Three.js` where possible.
- Keep GLSL shaders isolated in their specific `.ts` string literals for ease of transport.

Thank you!
