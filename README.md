# Distribute Aid Needs Assessment

[![GitHub Actions](https://github.com/DistributeAid/needs-assessment/workflows/Test%20and%20Release/badge.svg)](https://github.com/DistributeAid/needs-assessment/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/distributeaid/needs-assessment)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)
[![React](https://github.com/aleen42/badges/raw/master/src/react.svg)](https://reactjs.org/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-ffffff?labelColor=7952b3)](https://getbootstrap.com/docs/5.0/)
[![CSS modules](https://img.shields.io/badge/CSS-modules-yellow)](https://github.com/css-modules/css-modules)
[![Vite](https://github.com/aleen42/badges/raw/master/src/vitejs.svg)](https://vitejs.dev/)

A single-page application (SPA) that we use to assess needs of the aid
organizations we support developed with [React](https://reactjs.org/) in
[TypeScript](https://www.typescriptlang.org/).

The UI components are themed using
[Bootstrap 5](https://getbootstrap.com/docs/5.0/) and
[CSS modules](https://github.com/css-modules/css-modules).

[Vite](https://vitejs.dev/) is used as the frontend toolchain.

## Project goals

Provide a way for Distribute Aid to run needs assessment using forms that can be
modified using low-code or zero-code approach. These forms need to provide
validation and flow logic.

The first version of the needs assessment was run using Qualtrics, however we
will no longer have access to it without paying, and the license fees are too
expensive for Distribute Aid.

The forms that were built using Qualtrics have been documented
[here](https://drive.google.com/drive/folders/15Kh9WszNG8q9L-ztuboc3rWKT410qlbB?usp=sharing).

### Solution

- Implement a form generator, that allows to describe a form using JSON
  - custom form logic is implemented using [JSONata](https://jsonata.org/)
    expressions.
- Forms runs fully in browser, using local storage.
- Response are stored using the
  [needs assessment storage](https://github.com/distributeaid/needs-assessment-storage)
  project.

## Set up

    npm ci

## Configure

These environment variables must be configured:

- `PUBLIC_STORAGE_URL`: URL to the storage backend
- `PUBLIC_DEFAULT_FORM_URL`: the form ID of the form to use

## Running

    npm start
