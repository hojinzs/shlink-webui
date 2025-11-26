# Feature-Sliced Design (FSD) Guidelines

This project follows the [Feature-Sliced Design](https://feature-sliced.design/) methodology.
All new code in `apps/web` should adhere to this structure.

## Layers

The project is organized into the following layers (at the root of `apps/web`):

1.  **`app`**:
    - **Purpose**: Application initialization, global styles, providers, and Next.js App Router entry points (`layout.tsx`, `page.tsx`).
    - **Content**: `globals.css`, `layout.tsx`, `providers.tsx`, `auth.ts`.
    - **Note**: `page.tsx` files in `app` should only import and render a page component from the `views` layer.

2.  **`views`** (Standard FSD `pages`):
    - **Purpose**: Compositional layer for constructing full pages.
    - **Naming**:
      - Use `views` instead of `pages` to avoid conflict with Next.js Pages Router.
      - **Directory Naming**: Use flat structure with `{entity}-{action/feature}` convention (e.g., `auth-login`, `url-list`, `url-create`). Avoid nesting.
    - **Content**: Page components (e.g., `home/ui/Page.tsx`, `auth-login/ui/Page.tsx`).
    - **Rule**: Pages should be composed of Widgets, Features, and Entities. Avoid complex logic here.

3.  **`widgets`**:
    - **Purpose**: Compositional layer that combines entities and features into standalone UI blocks.
    - **Examples**: `Sidebar`, `VisitsChart`, `Header`.
    - **Rule**: Widgets can import from Features, Entities, and Shared.

4.  **`features`**:
    - **Purpose**: User interactions and business logic that brings value to the user.
    - **Examples**: `manage-urls` (create, delete), `auth` (login/logout).
    - **Rule**: Features can import from Entities and Shared.

5.  **`entities`**:
    - **Purpose**: Business domain models and UI elements.
    - **Examples**: `Url`, `Tag`, `Visit`, `User`.
    - **Rule**: Entities can only import from Shared.

6.  **`shared`**:
    - **Purpose**: Reusable code, UI components, and libraries that are not domain-specific.
    - **Examples**: `components` (buttons, inputs), `utils` (helpers, api clients), `config`.
    - **Rule**: Shared cannot import from any other layer.

## Import Rules

- **Direction**: Imports must always go "downwards" (e.g., `widgets` -> `features` -> `entities` -> `shared`).
- **Cross-imports**: Imports between slices in the same layer are forbidden (e.g., `features/auth` cannot import `features/manage-urls`).
- **Public API**: Import only from the public API of a slice (usually `index.ts` or `ui/Component.tsx`).

## Path Aliases

- `@app/*` -> `./app/*`
- `@views/*` -> `./views/*` (also aliased as `@pages/*`)
- `@widgets/*` -> `./widgets/*`
- `@features/*` -> `./features/*`
- `@entities/*` -> `./entities/*`
- `@shared/*` -> `./shared/*`
