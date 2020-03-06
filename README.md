# [memorize.ai](https://memorize.ai)

**memorize.ai Website**

## Download

```bash
git clone https://github.com/kenmueller/memorize.ai-web.git
```

## Rules

### General

- Use tabs for indentation
- No semicolons
- Constants are formatted as follows: `APP_STORE_URL`

### Deploy

```bash
npm run deploy # Deploy to production
npm run deploy:dev # Deploy to development
```

### `/public`

- Each component gets its own file

### Start local server

#### Terminal #1

```bash
npm start
```

#### Terminal #2

```bash
npm run watch:css
```

#### File structure

```
-- components
  -- shared
    -- Input.tsx
	-- Button.tsx
  -- App
    -- index.tsx
	-- {helper components private to App}
  -- Home
    -- index.tsx
	-- {helper components private to Home}
-- hooks
  -- useCurrentUser.ts
  -- useDeck.ts
-- models
  -- LoadingState.ts
  -- User.ts
-- css
  -- index.css
  -- base.css
  -- components
    -- input.css
	-- loader.css
-- images
  -- app-store-download.svg
  -- logo.png
```

## License

CLOSED SOURCE SOFTWARE

Copyright (c) [memorize.ai](https://memorize.ai) - All Rights Reserved

Unauthorized copying of any file via any medium is strictly prohibited

Proprietary and confidential

Written by Ken Mueller <[kenmueller0@gmail.com](mailto:kenmueller0@gmail.com)>, October 2019
