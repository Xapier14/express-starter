# Project Architecture

This document outlines the architectural decisions, project structure, and key patterns used in the `express-starter` project.

## Overview

The project follows a **Modular Monolith** architecture combined with **Clean Architecture** (also known as Hexagonal Architecture or Ports and Adapters) principles. This ensures separation of concerns, maintainability, and testability by isolating business logic from infrastructure details.

## Directory Structure

The source code is located in the `src` directory and is organized into two main categories:

- **`src/modules`**: Contains feature-specific modules (e.g., `users`, `auth`). Each module is a self-contained vertical slice of the application.
- **`src/shared`**: Contains code shared across multiple modules, such as base classes, utilities, and common infrastructure.

### Module Anatomy (`src/modules/<module-name>`)

Each module follows a strict layering strategy:

1.  **`domain/`**: The core business logic.
    -   **Entities**: Pure TypeScript interfaces/classes defining the domain models (e.g., `UserEntity`).
    -   **Repository Interfaces**: Contracts defining how data is accessed (e.g., `IUsersRepository`).
    -   **Domain Services**: Business logic that doesn't fit into a single entity.
    -   *Dependencies*: This layer has **zero** dependencies on outer layers or external libraries (except strictly utility libraries).

2.  **`use-cases/`**: Application-specific business rules.
    -   Contains classes that orchestrate the flow of data to and from the domain entities.
    -   Implements specific user actions (e.g., `RegisterUserUseCase`, `UserSignup`).
    -   *Dependencies*: Depends on the `domain` layer.

3.  **`infrastructure/`**: Implementation details and adapters.
    -   **`persistence/`**: Database implementations of repositories (e.g., `UsersPostgresRepository`), database models, and mappers.
    -   **`http/`**: HTTP controllers, routes, and request validation schemas (Zod).
    -   **`di/`**: Dependency Injection configuration (InversifyJS modules).
    -   *Dependencies*: Depends on `domain` and `use-cases`.

### Shared Kernel (`src/shared`)

-   **`core/`**: Core interfaces and types (e.g., `IBaseRepository`, `FilterQuery`).
-   **`infrastructure/`**: Shared infrastructure implementations.
    -   **`persistence/postgres/`**: Base repository implementations and database connection logic.
    -   **`http/`**: Base router, HTTP utilities, and middlewares (e.g., `requestLogger`, `attachRequestContext`).
    -   **`crypto/`**: Cryptographic utilities (e.g., hashing, token generation).
    -   **`logger/`**: Logging service configuration.
    -   **`di/`**: Global DI container setup.

## Key Technologies & Patterns

### Dependency Injection (DI)
The project uses **InversifyJS** for dependency injection.
-   **Container**: A global `appContainer` is defined in `src/shared/infrastructure/di/Container.ts`.
-   **Modules**: Each feature module exports a `ContainerModule` (e.g., `UsersDIModule`) which binds interfaces to implementations.
-   **Usage**: Dependencies are injected into classes (Repositories, Use Cases) using the `@inject` decorator.

### Repository Pattern
Data access is abstracted using the Repository Pattern.
-   **Interface**: Defined in the Domain layer (e.g., `IUsersRepository`).
-   **Implementation**: Defined in the Infrastructure layer (e.g., `UsersPostgresRepository`).
-   **Base Repository**: A generic `PostgresBaseRepository` in `shared` provides common CRUD operations.

### Validation
**Zod** is used for runtime validation, particularly for HTTP request bodies in the controller/route layer.

### Database
**Postgres** is the underlying database. The project uses **Prisma ORM** for schema definition, migrations, and type-safe database access. The repository layer wraps Prisma Client calls.

### Authentication & Authorization
The `auth` module handles user authentication.
-   **Strategy**: Likely uses JWT (JSON Web Tokens) for stateless authentication.
-   **Crypto**: Shared crypto services handle password hashing (e.g., Argon2 or Bcrypt) and token signing.

## Data Flow

A typical request flows as follows:

1.  **HTTP Request** hits a Route defined in `infrastructure/http`.
2.  **Middlewares** (Global/Route-specific) run (e.g., logging, context attachment).
3.  **Validation** validates the request payload using Zod.
4.  **Use Case** is resolved from the DI container and executed.
5.  **Repository** is called by the Use Case to fetch/save data.
6.  **Domain Entity** is returned/manipulated.
7.  **Response** is sent back to the client.
