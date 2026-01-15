# Express Starter Template

A robust **Modular Monolith** template for building scalable Node.js applications using **TypeScript**, **Express**, and **Clean Architecture** principles.

## 🚀 Features

-   **Modular Architecture**: Vertical slice architecture ensuring separation of concerns and scalability.
-   **Clean Architecture**: Domain-centric design with clear boundaries between Domain, Use Cases, and Infrastructure.
-   **Type Safety**: Built with **TypeScript** in `nodenext` mode for modern ESM support.
-   **Dependency Injection**: Powered by **InversifyJS** for loose coupling and testability.
-   **Database**: **PostgreSQL** integration using **Prisma ORM** for type-safe database access and schema management.
-   **Validation**: Runtime request validation using **Zod**.
-   **Linting & Formatting**: Fast and efficient tooling with **Biome**.

## 🛠️ Tech Stack

-   **Runtime**: Node.js (>= 22.18.0)
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **DI Container**: InversifyJS
-   **Database**: PostgreSQL + Prisma ORM
-   **Validation**: Zod
-   **Testing**: Vitest
-   **Tooling**: Biome, tsx, Swagger

For the first version, I'm planning of just using Express.js and InversifyJS. In the future, I plan on using the [InversifyJS framework with the Express v5 adapter](https://inversify.io/framework/docs/introduction/getting-started/) as another branch.

The `inversify-express-utils` package is already deprecated so the focus should be on the new framework package instead.

## 🏁 Getting Started

### Prerequisites

-   Node.js >= 22.18.0
-   npm or yarn
-   PostgreSQL instance

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd express-starter
    ```

2.  Install dependencies:
    ```bash
    yarn install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory (refer to `.env.example` if available, otherwise configure your DB connection details).

4.  Create the initial Prisma migration:
    > Note: Run this command every time you make changes to the Prisma schema.
    ```bash
    yarn prisma:migrate
    ```

5.  Generate Prisma Client:
    > Note: Run this command every time you make changes to the Prisma schema.
    ```bash
    yarn prisma:generate
    ```

6.  Start the development server:
    ```bash
    yarn dev
    ```

### Available Scripts

-   `yarn dev`: Start the development server with hot-reloading (using `tsx`).
-   `yarn build`: Build the project for production.
-   `yarn start`: Start the production server.
-   `yarn lint`: Lint the codebase using Biome.
-   `yarn format`: Format the codebase using Biome.
-   `yarn test`: Run unit tests using Vitest.
-   `yarn coverage`: Run tests with coverage reporting.

## 🧪 Testing

The project uses **Vitest** for unit and integration testing.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn coverage
```

### Test Structure

Tests are **co-located** with the source code they test. This keeps tests close to the implementation and makes it easier to maintain.

-   **File Naming**: `*.spec.ts`
-   **Location**: Same directory as the source file (e.g., `src/modules/users/domain/users.entity.ts` -> `src/modules/users/domain/users.entity.spec.ts`).

### Writing Tests

We use **Vitest** as our test runner, which provides a Jest-compatible API.

1.  **Domain Entities**: Test business logic and invariants within entities.
    -   *Example*: `src/modules/users/domain/users.entity.spec.ts`
2.  **Use Cases**: Test application logic by mocking dependencies (Repositories, Services) using `vi.fn()` or `vi.spyOn()`.
    -   *Example*: `src/modules/auth/use-cases/login-user.spec.ts`
3.  **Shared Infrastructure**: Test generic implementations (fakes) to ensure they behave correctly.
    -   *Example*: `src/shared/infrastructure/persistence/fakes/InMemoryRepository.spec.ts`

## API Documentation

The project uses **Swagger UI** to visualize and interact with the API's resources.

### Accessing Swagger UI

Start the development server (`yarn dev`) and navigate to:
`http://localhost:3000/docs`

This endpoint will only be available if the env var `ENVIRONMENT` is not `production`.

### Defining Routes

We use `swagger-jsdoc` to generate the OpenAPI specification from JSDoc comments directly in the route files.

**Example:**

```typescript
/**
 * @openapi
 * /hello-world:
 *  get:
 *    tags:
 *      - Hello World
 *    summary: Greet the user
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get("/", (req, res) => {
  res.send("Hello world!");
});
```

## 📂 Project Structure

The project is organized into modules and shared components. For a detailed deep-dive into the architecture, please refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

```
src/
├── modules/           # Feature-specific modules (e.g., users, auth)
│   └── users/
│       ├── domain/    # Entities & Repository Interfaces
│       ├── use-cases/ # Application Business Rules
│       └── infrastructure/ # DB, HTTP, DI implementations
├── shared/            # Shared kernel, base classes, utilities
│   ├── core/
│   └── infrastructure/
└── app.ts             # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
