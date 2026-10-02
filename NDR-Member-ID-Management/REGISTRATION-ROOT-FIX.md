# NDR Member ID Management — Registration Root Fix

Baseline source is the uploaded NDR plugin ZIP from the working session.

Target registration architecture:

Email verified -> registration ticket -> staged private uploads -> one final submit handler -> validation -> application save -> document linkage -> application number -> thank-you page.

Required engineering rules:
- one final submit processor only
- no duplicate init/admin-post processing
- staged uploads survive validation errors and refreshes within the registration ticket lifetime
- final submit consumes staged files, not browser file inputs
- application/document persistence is atomic or explicitly rolled back
- no cleanup on ordinary validation failure
- cleanup only after successful finalization or ticket expiry
- exact server errors are logged without exposing sensitive document data
- private government documents must never be public Media Library assets
