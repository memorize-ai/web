# memorize.ai-web
https://memorize.ai

## User creation
When creating a user with email and password:
1. Call Firebase Auth's `createUserWithEmailAndPassword` function
1. Upon completion
    1. Get `uid`
    1. Create `users` node in Firestore
        1. `name` is required
        1. `email` is required
    1. Called `updateProfile` on `userCredential` to set `displayName`

The `slug` will automatically be created from Firebase Functions

## History creation
When creating a history node in `users/abc123/decks/def456/cards/ghi789/history`:
1. Set an ID for the key
1. As a field, set `correct` as `true` or `false`
1. Upon completion
    1. Firebase functions will update the parent card's `last` node, and set the `date`, `elapsed`, and `next` nodes of the history node just created
    1. Observe `date`, `elapsed`, and `next` and update as needed
