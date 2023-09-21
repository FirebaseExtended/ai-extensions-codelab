# Reviewly - starter code

A sample web app that summarizes reviews using the PaLM API and a Firebase AI extension.

https://github.com/FirebaseExtended/ai-extensions-codelab/assets/381495/8d5ebd0d-e464-4f9d-9d5b-06530b8e3909

## To run with a real firebase project (recommended)

Run these commands in your terminal:

1. Navigate to this web app folder and install dependencies:

```sh
cd reviewly-start
npm install
```

2. Specify which project Firebase should use:

```sh
firebase use <name-of-your-project>
# For example: firebase use codelab-ai-extensions
```

3. To deploy the extension used in this web app, run this command in your terminal:

_Note_: If you are asked `Would you like to delete any other extensions`, select **No**.

```sh
firebase deploy --only extensions
```

4. Edit the `js/firebase-config.js` file with your Firebase [configuration](https://console.firebase.google.com/u/0/project/_/settings/general).

5. Deploy the Cloud Function in the [`functions`](./functions/) folder:

```sh
firebase deploy --only functions
```

6. Deploy the Firestore and Cloud Storage Security Rules:

```sh
firebase deploy --only firestore:rules,storage
```

7. Back in your terminal, run this command:

```sh
npm run dev
```

6. And then navigate to the URL shown in your terminal, for example [http://localhost:8080](http://localhost:8080) or [http://localhost:8000](http://localhost:8000).

## To run this locally with emulators (not recommended)

_This has no AI functionality._

This is only useful for codelab authors, or learners who are unable to use a real Firebase project or real Google Cloud services.

1. In your terminal, navigate to this web app folder:

```sh
cd reviewly-start
```

2. Run this command to seed the Firestore emulator with some test data:

```sh
firebase emulators:start --project demo-codelab-ai-extension-reviewly --import=../firestore-export/
```

3. Edit the `js/firebase-config.js` file with your emulator configuration.

4. In your terminal tab, run these commands:

```sh
npm install
npm run dev
```

5. In the file `js/reviews.js`, uncomment the `connectFirestoreEmulator` line:

```js
// Uncomment these lines to use the local emulator
connectFirestoreEmulator(db, "127.0.0.1", 8080);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
```

6. And then navigate to the URL shown in your terminal, for example [http://localhost:8080](http://localhost:8080) or [http://localhost:8000](http://localhost:8000).
