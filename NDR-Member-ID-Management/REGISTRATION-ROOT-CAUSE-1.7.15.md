# NDR Member ID Management v1.7.15 — Root Cause Confirmed

## Before submit
- UI shows Aadhaar as Uploaded and Additional Document as Previously uploaded and ready.
- Network shows successful admin-post upload requests.
- Submit button is active.

## After submit
- Browser redirects to ndr_registration_error.
- Server message says: The staged Aadhaar Card is no longer available.
- This is not a client-side upload failure because the document was already staged before the final POST.

## Root cause
The final submission validated staged documents before checking whether a previous attempt using the same verified registration ticket had already created an application. NDR_MIM_Applications::submit() links the document records to the application by setting application_id. On a retry, application_payload() required application_id=0 and therefore treated the already-linked Aadhaar document as no longer staged.

## v1.7.15 fix
- Check exact same-ticket application before staged-document validation.
- Reuse an existing submitted/under-review application and finish the success redirect.
- Allow a staged document whose application_id is 0 or the same existing/resubmission application ID.
- Recover stage state from the matching application's persisted payload if the transient stage is missing.
- Preserve the existing single admin-post final submit path.

Static verification: all PHP lint clean, portal.js syntax clean, ZIP integrity clean.
Live Hostinger runtime verification remains required.