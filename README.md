# Morong Crime Mapping

## Run Locally

### Prerequisites

- Install Node.js 20 or newer from [nodejs.org](https://nodejs.org/).
- Open PowerShell or a terminal in the project folder.

### Setup

Install the project dependencies:

```powershell
npm install
```

### Start the development server

```powershell
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

The app will reload automatically when you edit the source files.

### Other commands

```powershell
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Check the code for lint issues
```

## Project Template Notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
