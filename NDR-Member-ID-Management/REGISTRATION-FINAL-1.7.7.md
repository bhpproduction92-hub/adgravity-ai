# NDR Member ID Management — Registration Final Root Fix 1.7.7

## Problem diagnosed

The registration flow had multiple competing write paths and legacy fallbacks:

1. Final registration was hooked to `init` while also being dispatched through `admin-post.php`. Because WordPress initializes before dispatching admin-post actions, one POST could be processed more than once.
2. A separate REST registration-submit processor existed even though the frontend used admin-post.
3. The final payload builder could fall back to browser `$_FILES` and old session uploads, so large files could be uploaded again during the final submit.
4. Registration error redirects deleted staged files. A validation/database failure therefore forced the applicant to upload the photo/Aadhaar again.
5. Required fields displayed as required in the frontend were not consistently enforced server-side.
6. Application insert and document linking were not atomic. A link failure could require compensation after a partially written application.

## Final architecture

Email OTP verification
→ Registration ticket
→ Immediate private file staging
→ Profile Photo upload confirmation
→ Aadhaar upload confirmation
→ Final form validation
→ Single `admin-post.php` final submit
→ Application database transaction
→ Document linking
→ Application Number
→ Thank You page

The final POST consumes staged server-side files and does not depend on the browser file inputs being uploaded again.

## Implemented fixes

- Removed the duplicate `init` registration submission hook.
- Removed the unused REST registration submit processor.
- Kept `admin_post_nopriv_ndr_mim_application_submit` and `admin_post_ndr_mim_application_submit` as the single final submission dispatch.
- Added runtime application/document schema preflight.
- Preserved staged uploads across validation, processing and database failures.
- Added server-rendered staged-file state so the registration page can restore `Previously uploaded and ready`.
- Added staged asset integrity checks.
- Made the server-side required-field validation consistent with the visible registration form.
- Required a valid six-digit PIN when PIN validation is enabled.
- Required staged Profile Photo and staged Aadhaar for final submission.
- Removed final-submit fallback uploads from `$_FILES`.
- Final-submit JavaScript disables file controls immediately before the POST so staged files are not transmitted again.
- Added transaction + compensation logic around application persistence/document linking.
- Prevented ordinary registration-error redirects from deleting staged files.
- Staging cleanup remains tied to successful finalization or expiry.

## Validation performed

- PHP syntax lint across all plugin PHP files: PASS
- JavaScript syntax check for `assets/portal.js`: PASS
- Single final submit-path static assertion: PASS
- REST registration submit references removed: PASS
- Duplicate init registration hook removed: PASS
- Final ZIP integrity test: PASS

## Runtime limitation

A real Hostinger/WordPress production runtime test cannot be executed from this development container. The final package therefore must be tested once on the live member site for:
file staging, final application insert, document linking, application number, redirect, confirmation email, retry after validation error, and private document access.

## Deliverable

Version: 1.7.7
Package: NDR-Member-ID-Management-v1.7.7-FINAL-REGISTRATION-ROOT-FIX.zip
