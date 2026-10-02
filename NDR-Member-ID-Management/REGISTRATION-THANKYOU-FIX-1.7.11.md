# NDR Member ID Management v1.7.11 — Registration Thank-You/Error Token Fix

Confirmed issue in v1.7.10:
Registration success/error state used mixed-case random tokens when writing WordPress transients, but the registration page read the query token with sanitize_key(), which lowercased it. The transient could therefore not be found after redirect.

Fix:
- Success tokens are now generated with bin2hex(random_bytes(16)), producing stable lowercase hexadecimal tokens.
- Error tokens use the same lowercase-safe generation.
- Success and error query parameters are read with a strict allow-list regex that preserves case for backward compatibility with older links.
- This prevents successful registration from falling back to the registration form when the application was already saved.
- It also restores the stored error message/pending form state for older mixed-case error URLs.

Validation:
- class-ndr-mim.php PHP lint: PASS
- main plugin PHP lint: PASS
- token-generation assertions: PASS
- ZIP integrity: PASS

Version: 1.7.11