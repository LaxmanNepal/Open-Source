# Open Source Explorer

A responsive open-source discovery web app for [GitHub](https://github.com/) repositories.

## What is included

- Premium desktop + mobile UI
- Hero search and quick discovery tags
- Platform dividers: Android, macOS, Windows, Linux and Cross-platform
- Categories: AI & Machine Learning, Video Editing, Developer Tools, Productivity, Design, Security, Media & Music and Utilities
- Live GitHub repository discovery
- Popular this month
- Most forked
- Most watched
- Most appreciated / starred
- Search, sorting, platform filters and grid/list views
- Automatic year grouping from each repository's `created_at` date
- Local browser caching when GitHub's API rate limit is reached
- GitHub Actions catalog refresh every 6 hours

## GitHub Pages

This repository is static and can be deployed directly with GitHub Pages using the `main` branch and `/ (root)`.

## Data model

The browser can query GitHub's public repository API directly. The scheduled workflow also builds `data/catalog.json` from GitHub Search API results so the project has a reusable static catalog for future upgrades such as advanced year pages, server-side search, trending history and analytics.

## Important limitation

"All open-source projects on GitHub" is not a finite list that a browser can download. GitHub's search API is used to continuously discover relevant public repositories. The catalog can be expanded with more queries/topics over time.
