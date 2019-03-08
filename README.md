# memorize.ai-web
https://memorize.ai

# Users

## User creation
When creating a user with email and password:
1. Call Firebase Auth's `createUserWithEmailAndPassword` function
1. Upon completion
    1. Get `uid`
    1. Create `users` node in Firestore
        1. `name` is required
        1. `email` is required

The `slug` will automatically be created in the Firestore `users` node and the `displayName` will automatically be updated in Firebase Auth from Firebase Functions.

## User deletion
When deleting a user, delete their Firebase Auth account. The related Firestore and Storage entries will be deleted or archived automatically.

## History creation
When creating a history node in `users/abc123/decks/def456/cards/ghi789/history`:
1. Set an ID for the key
1. As a field, set `correct` as `true` or `false`
1. Upon completion
    1. Firebase functions will update the parent card's `last` node, and set the `date`, `elapsed`, and `next` nodes of the history node just created
    1. Observe `date`, `elapsed`, and `next` and update as needed
    1. `date` and `next` are stored as a `Timestamp`