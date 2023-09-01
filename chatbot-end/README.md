# Chatbot - completed code

An AI chatbot that uses the PaLM API to answer questions.

## To run with a real firebase project (recommended)

1. In your terminal, navigate to this web app folder:

```sh
cd chatbot-end
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

4. Edit the `lib/firebase/firebase-config.js` file with your Firebase [configuration](https://console.firebase.google.com/u/0/project/_/settings/general).

5. Run these commands in your terminal:

```sh
npm install
npm run dev
```

6. Open [http://localhost:3000/](http://localhost:3000/) in your browser to see the result.

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
