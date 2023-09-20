# Chatbot - completed code

An AI chatbot that uses the PaLM API to answer questions.

https://github.com/FirebaseExtended/ai-extensions-codelab/assets/381495/79d943cb-0117-4d79-af2a-c3228c9a4509

## To run with a real firebase project (recommended)

Run these commands in your terminal:

1. Navigate to this web app folder and install dependencies:

```sh
cd chatbot-end
npm install
```

2. Specify which project Firebase should use:

```sh
firebase use <name-of-your-project>
# For example: firebase use codelab-ai-extensions
```

3. Enable the web frameworks experiment:

```sh
firebase experiments:enable webframeworks
```

4. Initialize Firebase hosting:

```sh
firebase init hosting
```

Use default options for all prompts.

5. Deploy the extension used in this web app:

_Note_: If you are asked `Would you like to delete any other extensions`, select **No**.

```sh
firebase deploy --only extensions
```

6. Deploy the Firestore and Cloud Storage Security Rules:

```sh
firebase deploy --only firestore:rules,storage
```

7. In your code editor, edit the `lib/firebase/firebase-config.js` file with your Firebase [configuration](https://console.firebase.google.com/u/0/project/_/settings/general).

8. Back in your terminal, run the web app:

```sh
firebase emulators:start --only hosting
```

9. Open [http://localhost:5000/](http://localhost:5000/) in your browser (or whatever URL is presented to your in your terminal) to see the result.

## To run locally with mock data (not recommended)

_This uses mock data, and has no AI functionality._

This is only useful for codelab authors, or learners who are unable to use a real Firebase project.

1. In your terminal, navigate to this web app folder:

```sh
cd chatbot-end
```

2. Run this command in your terminal:

```sh
firebase emulators:start --project demo-codelab-chatbot --import=../firestore-export/
```

3. In the root of the chatbot project folder you are working in, replace the `.env.development` file with these contents:

```
NEXT_PUBLIC_IS_TEST_MODE=true
```

4. Edit the `lib/firebase/firebase-config.js` file with your emulator configuration.

5. In a new terminal tab:

```sh
npm install
npm run dev
```

6. Open [http://localhost:3000/](http://localhost:3000/) in your browser to see the result.
