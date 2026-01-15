# Code Style Guide

This document outlines the code style, naming conventions, and architectural patterns used in this project. Adhering to these guidelines ensures consistency and maintainability across the codebase.

## 1. General Principles

- **Clean Architecture**: The project follows Clean Architecture principles, separating concerns into Domain, Use Cases, and Infrastructure layers.
- **Dependency Injection**: `inversify` is used for dependency injection. Dependencies are injected via constructor injection. In the case for route handlers and middlewares, dependencies are injected or retrieved via the `Container` or `ContainerModule`'s `get<T>(id: Symbol)` method.
- **ES Modules**: The project uses native ES Modules. All local imports must include the `.js` extension.

## 2. Naming Conventions

### 2.1. Files and Folders

- **Folders**: Use `kebab-case` (e.g., `use-cases`, `hello-world`, `infrastructure`).
- **Files**:
    - **General**: Use `kebab-case` (e.g., `register-user.ts`).
    - **Module Domain Files**: Often prefixed with the entity/module name (e.g., `users.entity.ts`, `users.repo.ts`, `users.service.ts`).
    - **Shared Core Interfaces**: PascalCase, matching the interface name (e.g., `IUseCase.ts`, `IBaseRepository.ts`).
    - **Domain Errors**: PascalCase (e.g., `InvalidEmailFormat.ts`, `UserNotFound.ts`).
    - **DI Modules**: `kebab-case` with `.di` suffix (e.g., `users.di.ts`).

### 2.2. Code Identifiers

- **Classes**: PascalCase (e.g., `UserEntity`, `RegisterUserUseCase`).
- **Interfaces**: PascalCase with `I` prefix (e.g., `IUseCase`, `IUsersRepository`).
    - **Exception**: Module augmentation for external libraries (e.g., `Request` in Express).
- **Types**: PascalCase (e.g., `RegisterUserDTO`, `FilterCriteria`).
- **Variables & Properties**: camelCase (e.g., `userRepo`, `email`, `createdAt`).
- **Functions & Methods**: camelCase (e.g., `execute`, `save`, `hashPassword`).
- **Constants**: UPPER_SNAKE_CASE for global constants; camelCase for local constants.
- **DI Symbols**: PascalCase (e.g., `UsersDomain`, `SharedDomain`).

## 3. Project Structure

The project is organized into `modules` and `shared` directories.

### 3.1. Modules (`src/modules`)

Each feature module (e.g., `users`, `auth`) is self-contained and follows a layered structure:

- **`domain/`**: Contains business logic, entities, repository interfaces, and domain errors.
    - Entities: `*.entity.ts`
    - Repository Interfaces: `*.repo.ts`
    - Errors: `errors/*.ts`
- **`use-cases/`**: Contains application logic.
    - Use Case Classes: `kebab-case.ts` (implement `IUseCase`)
    - DTOs: Defined within the use case file or separately.
- **`infrastructure/`**: Contains implementation details.
    - Persistence: `*.prisma.repo.ts`, `*.in-memory.repo.ts`
    - DI: `di/*.di.ts`
    - HTTP: `http/*.routes.ts`

### 3.2. Shared (`src/shared`)

Contains code shared across modules:

- **`core/`**: Base interfaces and abstract classes (e.g., `IUseCase`, `IBaseRepository`).
- **`infrastructure/`**: Shared infrastructure implementations (e.g., `crypto`, `logger`, `prisma`).
- **`application/`**: Application-level ports and services.

## 4. Coding Standards

### 4.1. Imports

- **Extensions**: You **MUST** use the `.js` extension for all local imports.
  ```typescript
  import { UserEntity } from "./users.entity.js"; // Correct
  import { UserEntity } from "./users.entity";    // Incorrect
  ```
- **Path Aliases**: Use `@/` to refer to the `src` directory.
  ```typescript
  import { IUseCase } from "@/shared/core/IUseCase.js";
  ```

### 4.2. Types & Interfaces

- Prefer **Interfaces** for defining contracts (repositories, services).
- Prefer **Types** for DTOs and data structures (e.g., `RegisterUserDTO`).
- **No Enums**: Avoid TypeScript `enum`. Use union types or constant objects instead (enforced by Biome).

### 4.3. Error Handling

- Use custom error classes extending `Error` for domain-specific errors.
- Place domain errors in `domain/errors/`.

### 4.4. Asynchronous Code

- Use `async/await` for asynchronous operations.
- Avoid raw Promises (`.then()`, `.catch()`) where `await` can be used.

## 5. Tooling

- **Linter/Formatter**: [Biome](https://biomejs.dev/) is used for linting and formatting.
    - Indentation: 2 spaces.
    - Quotes: Double quotes.
    - No explicit `any`.
    - Run `yarn lint` to lint the codebase.
    - Run `yarn format` to format the codebase.
    - These two commands should be ran before committing.
- **Testing**: Vitest (implied by `*.spec.ts` files).
