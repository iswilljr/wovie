# What is Wovie?

Wovie is a web app for watching movies easily.

The web works by displaying video files from third-party providers inside an intuitive user interface.

## Running locally for development

To run locally, you must first clone the repository. After that run the following commands in the root of the repository:

```bash
pnpm install
pnpm run dev
```

You have to also make an `.env` file to configure your environment. [See `.env.example`](./.env.example).

To build production files, run:
```bash
pnpm build
```
