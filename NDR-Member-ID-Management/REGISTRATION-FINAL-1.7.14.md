# NDR Member ID Management v1.7.14

Registration root-fix package rebuilt from the uploaded v1.7.11 source.

Changes:
- registration database preflight
- idempotent retry for the same verified registration ticket
- registration ticket persisted in application payload
- date normalization for Y-m-d, d/m/Y and d-m-Y
- exact server-side required-field errors
- client validation no longer depends on native checkValidity()
- staged Photo/Aadhaar remain the source of truth for final submit
- final submit remains admin-post.php only

Static verification:
- all PHP files: php -l PASS
- portal.js: node --check PASS
- final callback present
- no duplicate init submit path
- no REST registration submit path
- ZIP integrity PASS

Live Hostinger execution still needs to be verified on the site because the development environment cannot execute the production WordPress database/session/upload runtime.