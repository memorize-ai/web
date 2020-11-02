# [memorize.ai](https://memorize.ai)

![Deploy](https://github.com/memorize-ai/web/workflows/Deploy/badge.svg)

**memorize.ai Website**

Also see [the iOS repository](https://github.com/memorize-ai/ios)

## Get started

### Clone

#### Production

```bash
git clone https://github.com/memorize-ai/web.git
```

#### Development (to contribute)

```bash
git clone -b staging https://github.com/memorize-ai/web.git
```

### Install dependencies

```bash
yarn run install:all
```

### Start local server

```bash
yarn start
```

## Rules

### General

- Use tabs for indentation
- No semicolons
- Single quotes
- Constants are formatted as follows: `APP_STORE_URL`

### Deploy

**Push to master** or `yarn run deploy`

### `/public`

- Each component gets its own file
- Double quotes for raw JSX attribute values

### Start local server

```bash
yarn start
```

## Notes

- Does not include AI algorithm (closed source)
- Performance rating encoding:
    - `Easy: 0`
    - `Struggled: 1`
    - `Forgot: 2`
