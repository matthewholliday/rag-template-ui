# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/Node.js template repository designed for use with Claude Code. It provides a foundation for building TypeScript projects with Claude Code agents and configuration files.

## Development Commands

Currently, this is a minimal template. As the project evolves, common commands will be added here.

**Testing:**
```bash
npm test
```

## Project Structure

This is a template repository that can be customized for specific TypeScript/Node.js projects. As the codebase grows, add source files to a `src/` directory and tests to a `test/` or `__tests__/` directory following Node.js conventions.

## Architecture Notes

This template is intentionally minimal to allow flexibility for different project types. When building upon this template:

- Add TypeScript configuration (`tsconfig.json`) with appropriate compiler options for your use case
- Configure a test framework (Jest, Mocha, Vitest, etc.) based on project needs
- Set up build tooling (tsc, esbuild, webpack, etc.) in package.json scripts
- Consider adding linting (ESLint) and formatting (Prettier) configurations
- Add source code structure under `src/` directory