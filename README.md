# **[memorize.ai](https://memorize.ai)**

**memorize.ai Website**

## **Repositories**

**[memorize.ai-web](https://github.com/kenmueller/memorize.ai-web)**

**[memorize.ai-ios](https://github.com/kenmueller/memorize.ai-ios)**

**[memorize.ai-android](https://github.com/kenmueller/memorize.ai-android)**

**[memorize.ai-ios-design](https://github.com/kenmueller/memorize.ai-ios-design)**

## **Links**

**[memorize.ai website](https://memorize.ai)**

**[memorize.ai on the App Store](https://apps.apple.com/us/app/memorize-ai/id1462251805?ls=1)**

## **Download**

```bash
git clone https://github.com/kenmueller/memorize.ai-web.git
```

## **Initialization**

```bash
npm update -g npm
npm i -g firebase-tools
npm update -g firebase-tools
firebase functions:config:set emails.support.email='support@memorize.ai' \
                              emails.support.password='{SUPPORT_EMAIL_PASSWORD}' \
                              algolia.app_id='{ALGOLIA_APP_ID}' \
                              algolia.api_key='{ALGOLIA_API_KEY}'
./build -c
```

## **License**

CLOSED SOURCE SOFTWARE

Copyright (c) [memorize.ai](https://memorize.ai) - All Rights Reserved

Unauthorized copying of any file via any medium is strictly prohibited

Proprietary and confidential

Written by Ken Mueller <[kenmueller0@gmail.com](mailto:kenmueller0@gmail.com)>, June 2019