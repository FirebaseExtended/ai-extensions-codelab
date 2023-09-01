# Reviewly - starter code

A sample web app that summarizes reviews using the PaLM API and a Firebase AI extension.

## To run with a real firebase project (recommended)

1. In your terminal, navigate to this web app folder:

```sh
cd reviewly-end
```

2. In your terminal, run this command:

```sh
firebase use <name-of-your-project>
# For example: firebase use codelab-ai-extensions
```

3. To deploy the extension used in this web app, run this command in your terminal:

_Note_: If you are asked `Would you like to delete any other extensions`, select **No**.

```sh
firebase deploy --only extensions --project=<your-project-id>
```

4. Edit the `js/firebase-config.js` file with your Firebase [configuration](https://console.firebase.google.com/u/0/project/_/settings/general).

5. In your terminal tab, run these commands:

```sh
npm install
npm run dev
```

6. And then navigate to the URL shown in your terminal, for example [http://localhost:8080](http://localhost:8080) or [http://localhost:8000](http://localhost:8000).

## To run this locally with emulators (not recommended)

_This has no AI functionality._

This is only useful for codelab authors, or learners who are unable to use a real Firebase project or real Google Cloud services.

1. In your terminal, navigate to this web app folder:

```sh
cd reviewly-end
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
