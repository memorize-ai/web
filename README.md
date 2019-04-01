# **memorize.ai**

[**memorize.ai-web**](https://github.com/kenmueller/memorize.ai-web)

[**memorize.ai-ios**](https://github.com/kenmueller/memorize.ai-ios)

[**memorize.ai-android**](https://github.com/kenmueller/memorize.ai-android)

# Users

## User creation

When creating a user with email and password:

1. Call Firebase Auth's `createUserWithEmailAndPassword` function
2. Upon completion
    1. Get `uid`
    2. Create `users` node in Firestore
        1. `name` is required
        2. `email` is required
        3. `slug` is calculated by Firebase Functions, just observe the new user document you've created

The `slug` will automatically be created in the Firestore `users` node and the `displayName` will automatically be updated in Firebase Auth from Firebase Functions.

## User deletion

When deleting a user, delete their Firebase Auth account. The related Firestore and Storage entries will be deleted or archived automatically.

# Decks

## Deck creation

1. Create a new deck in `decks`
   1. `name` (Required)
   2. `description` (Optional)
   3. `public` (Bool)
   4. `count` = 0
   5. `creator` = Current user id
   6. `owner` = Current user id
2. Create a new deck in `users/USER_ID/decks`
   1. `mastered` = 0

## Deck permissions

1. Create a new permission node in `decks/DECK_ID/permissions`
   1. As a key, provide the id of the user you are giving permissions to
   2. `role` = `'viewer'` or `'editor'`
2. The deck will automatically appear in their decks if they do not have it yet

# Cards

## Card creation

1. Create a new card in `decks/DECK_ID/cards`
   1. `front` (Required)
   2. `back` (Required)
2. Do not create a new card in `users/USER_ID/decks/DECK_ID/cards`, firebase functions will create that for you the first time you review a card.

## History creation

When creating a history node in `users/abc123/decks/def456/cards/ghi789/history`:

1. Set an ID for the key
2. Pass in `correct` as a `Bool`
3. Upon completion
    1. Firebase functions will update the parent card's `last` and `next` nodes, and set the `date`, `elapsed`, and `next` nodes of the history node just created
    2. Observe `date`, `elapsed` and `next` and update as needed

## First time reviewing card

Create the first history inside of `users/abc123/decks/def456/cards/ghi789/history`, the card node shouldn't exist yet. Firebase functions will automatically create the card node for you the first time.