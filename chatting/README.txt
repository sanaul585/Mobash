COUPLE PRIVATE CHAT - FINAL

Approved Gmail accounts:
1. sanaulislam77@gmail.com
2. islamsanaul77@gmail.com

Firebase project:
proposalchat-2f314
Realtime Database:
https://proposalchat-2f314-default-rtdb.firebaseio.com/

SETUP
1. Firebase Console > Authentication > Sign-in method > Email/Password: ENABLED.
2. Firebase Console > Realtime Database: create the database if not already created.
3. Realtime Database > Rules: paste the contents of firebase-rules.json and Publish.
4. Serve this folder through a web server (VS Code Live Server, localhost, or your hosting). Do not rely on file:// for the real Firebase chat.
5. Open chat.html.
6. For each of the two Gmail addresses, use Create account once with the password you choose. You can use the same password for both accounts, but the password is never stored in this project.
7. Then use Login. Messages are stored in Firebase Realtime Database and appear in real time on both devices.

SECURITY
The frontend only permits the two approved email addresses, and firebase-rules.json also checks the authenticated email on the database server. Do not weaken those rules.

IMPORTANT
The Firebase web API key is not a password/secret; it is normal for it to be present in frontend code. Never put your Firebase Admin SDK private key, service-account JSON, or account password in this folder.

FILE:// DEMO
If chat.html is opened directly from the filesystem, the page falls back to a local Demo Mode. That mode is only local to that browser and is NOT the real two-device chat.
