# Video hint - starter code

Get a brief description of a video using the Google Cloud Video Intelligence API.

https://github.com/FirebaseExtended/ai-extensions-codelab/assets/381495/f3313f7f-d8a1-42a7-93d9-41658fc8ebfe

## To run with a real firebase project (recommended)

Run these commands in your terminal:

1. Navigate to this web app folder and install dependencies:

```sh
cd video-hint-start
npm install
(cd functions && npm install)
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

5. Deploy the Firestore and Cloud Storage Security Rules:

```sh
firebase deploy --only firestore:rules,storage
```

6. Deploy the Cloud Functions in the [`functions`](./functions/) folder:

```sh
firebase deploy --only functions
```

7. An [Extensions Manifest](https://firebase.google.com/docs/extensions/manifest) is already provided for you in this folder. However you need to edit the [extensions/storage-label-videos.env](./extensions/storage-label-videos.env) file with your actual bucket name:

```
INPUT_VIDEOS_BUCKET=<your-bucket-name>
OUTPUT_BUCKET=<your-bucket-name>
```

8. You also need to edit the [extensions/text-to-speech.env](./extensions/text-to-speech.env) file with your actual bucket name:

```
BUCKET_NAME=<your-bucket-name>
```

9. To deploy the extensions used in this web app, run this command in your terminal:

_Note_: If you are asked `Would you like to delete any other extensions`, select **No**.

```sh
firebase deploy --only extensions
```

10. Edit the `lib/firebase/firebase-config.js` file with your Firebase [configuration](https://console.firebase.google.com/u/0/project/_/settings/general).

11. Back in your terminal, run the web app:

```sh
firebase emulators:start --only hosting
```

12. Open [http://localhost:5000/](http://localhost:5000/) in your browser (or whatever URL is presented to your in your terminal) to see the result.

## To run locally with local emulators (not recommended)

_This has no AI functionality._

This is only useful for codelab authors, or learners who are unable to use a real Firebase project or real Google Cloud services.

1. In your terminal, navigate to this web app folder:

```sh
cd video-hint-start
```

2. Replace the `.env.development` file with these contents:

```
NEXT_PUBLIC_IS_TEST_MODE=true
```

3. Run this command in your terminal:

```sh
export NEXT_PUBLIC_IS_TEST_MODE=true
```

4. In the same terminal session from the previous step, run this command:

```sh
firebase emulators:start --project demo-codelab-video-hint
```

5. Edit the `lib/firebase/firebase-config.js` file with your emulator configuration.

6. In a new terminal tab, run these commands:

```sh
npm install
npm run dev
```

7. Open [http://localhost:3000/](http://localhost:3000/) in your browser to see the result.

## Video credits

This repository includes [videos](./public/videos/) that are useful for uploading to try out the Video Hint app. You can find sources for the videos in the [`./lib/exampleVideos.js`](./lib/exampleVideos.js) file.
