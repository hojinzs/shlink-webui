# Shlink Web UI

A modern, self-hosted URL shortener web application built on top of [Shlink](https://shlink.io/). This project aims to provide a superior user experience with enhanced authentication and a sleek UI.

## Project Goals

- **Self-Hosted Solution**: Develop a fully self-hosted URL shortening application using Shlink as the backend.
- **Enhanced Authentication**: Add robust authentication features missing in the original `shlink-web-client`.
- **Modern UI/UX**: Utilize **Shadcn UI** to create a contemporary, responsive, and user-friendly interface.
- **Full Feature Parity**: Implement all existing functionalities of the `shlink-web-client`.
- **Advanced Access Control** (Future Goal): Implement account, team, and project-based permission systems.

## Target Audience

- **Individuals & SOHO**: Freelancers, solopreneurs, and small home office businesses.
- **Small Teams & Marketing Firms**: Agile marketing teams and agencies requiring branded link management.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Monorepo Tooling**: [Turborepo](https://turbo.build/repo)
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend Engine**: [Shlink](https://shlink.io/)
- **Authentication**: [Authentik](https://goauthentik.io/) (OIDC/OAuth2)
- **Infrastructure**: Docker, PostgreSQL, Redis

## Project Structure

This Turborepo includes the following packages/apps:

### Apps

- `apps/web`: The main Next.js web application.
- `apps/docs`: Documentation site (Next.js).

### Packages

- `packages/ui`: Shared React component library.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared TypeScript configurations.

## Architecture

This project follows the **Feature-Sliced Design (FSD)** architecture.
The `apps/web` application is organized into the following layers (at the root of `apps/web`):

- **`app`**: Application-wide settings, styles, and providers. Contains the Next.js App Router setup.
- **`views`**: Page components that compose widgets and features. (Note: Named `views` to avoid conflict with Next.js `pages` directory).
- **`widgets`**: Compositional layers that combine entities and features into meaningful blocks (e.g., `Sidebar`, `VisitsChart`).
- **`features`**: User interactions and business logic (e.g., `manage-urls`).
- **`entities`**: Business domain entities (e.g., `Url`, `Tag`, `Visit`).
- **`shared`**: Reusable code, UI components, and libraries (e.g., `components`, `utils`).

## Development Setup

### 1. Start Infrastructure

Start the required services (Authentik, Shlink, PostgreSQL, Redis) using Docker Compose:

```bash
docker-compose -f docker-compose.development.yaml up -d
```

### 2. Configure Authentik

1.  Access Authentik at [http://localhost:9000/if/flow/initial-setup/](http://localhost:9000/if/flow/initial-setup/) and set up the admin account (`akadmin`).
2.  **Create a Provider**:
    - Go to **Applications** -> **Providers**.
    - Create a new **OAuth2/OpenID Provider**.
    - **Name**: Shlink Provider
    - **Client Type**: Confidential
    - **Redirect URIs**: `http://localhost:3000/api/auth/callback/authentik`
    - **Signing Key**: Select the default certificate.
    - Save and copy the **Client ID** and **Client Secret**.
3.  **Create an Application**:
    - Go to **Applications** -> **Applications**.
    - Create a new Application.
    - **Name**: Shlink
    - **Slug**: `shlink`
    - **Provider**: Select "Shlink Provider".
    - **Launch URL**: `http://localhost:3000`
    - Save.

### 3. Configure Shlink

Generate an API key for Shlink:

```bash
# Replace <shlink-container-name> with the actual container name (e.g., shlink-webui-shlink-1)
docker exec -it shlink-webui-shlink-1 shlink api-key:generate
```

Copy the generated API key.

### 4. Configure Web App

1.  Rename `apps/web/env.local` to `apps/web/.env.local`.
2.  Update `apps/web/.env.local` with the values from Authentik and Shlink:

```env
AUTHENTIK_ISSUER=http://localhost:9000/application/o/shlink/
AUTHENTIK_CLIENT_ID=<your-client-id>
AUTHENTIK_CLIENT_SECRET=<your-client-secret>
SHLINK_URL=http://localhost:8080
SHLINK_API_KEY=<your-shlink-api-key>
NEXTAUTH_SECRET=<random-string> # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 5. Start Development Server

```bash
pnpm dev
```

## Build

To build all apps and packages, run the following command:

```bash
pnpm build
```
