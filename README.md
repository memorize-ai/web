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
