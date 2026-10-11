# Connect Pavii's birthday wishes

The birthday card works without Firebase. Until configured, the form clearly reports that wishes are not saved. No local-only entries are presented as shared wishes.

1. Create a Firebase project and register a web app in Firebase Console.
2. Create a Cloud Firestore database. Publish the rules from `firestore.rules` in the Firestore Rules tab (do not use test mode).
3. Provide the web app's public configuration values as the environment variables listed in `.env.example`. These are public browser configuration, not a service-account private key. Never provide a service-account JSON file.
4. After configuration, test submitting a wish and verify it appears from a second browser. Publish after changes to make the connection available on the public site.

The `birthdayWishes` collection contains `name`, `message`, and a server-generated `createdAt`. The page listens for updates and shows newest wishes first. Text is rendered safely, not as HTML.

## Public guestbook precautions

All wishes and names are public. Do not collect private information. Rules validate fields and prohibit guest edits and deletions, but public submissions are not spam-proof. Before broadly sharing, enable Firebase App Check for the web app and enforce it for Firestore. Add the corresponding browser App Check initialization once the site's domain and provider configuration are available. For stronger protection, add anonymous authentication and a rate-limited write service. The current app does not claim to have rate limiting or moderation; remove unwanted messages through Firebase Console.

## Personal content

The letter and affectionate captions are draft copy, not personal facts supplied by the creator. Personal photographs and other media have intentionally not been invented; the floral paper is decorative artwork.