# Auth Setup Checklist

Use this once after deployment to make login/signup/reset smooth and secure.

## 1) Environment variables

Set these in local `.env` and in your hosting provider:

- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_SITE_URL` (your app origin, for example `https://your-domain.com`)

## 2) Supabase email verification requirement

Supabase Dashboard -> Authentication -> Providers -> Email

- Enable Email provider
- Turn on email confirmation requirement

Expected result:
- New users can sign up
- They must verify email before login

## 3) Supabase CAPTCHA

Supabase Dashboard -> Authentication -> Bot Detection

- Enable CAPTCHA protection
- Select Google reCAPTCHA
- Paste your reCAPTCHA secret key

Expected result:
- Signup and signin reject bot requests
- Frontend sends captcha token on both forms

## 4) Redirect URLs

Supabase Dashboard -> Authentication -> URL Configuration

Set these:

- Site URL: `https://your-domain.com`
- Additional Redirect URLs:
  - `https://your-domain.com/login`
  - `https://your-domain.com/profile`
  - `http://localhost:5173/login`
  - `http://localhost:5173/profile`

Expected result:
- Forgot-password email link returns user to app
- Email change verification link returns user to app
- Recovery token flow opens the reset-password screen correctly

## 5) Google reCAPTCHA domain allowlist

Google reCAPTCHA admin console:

- Add your production domain
- Add `localhost` for development

## 6) Quick validation flow

1. Create a new account
2. Try login before verification (should fail with verification message)
3. Verify email and login (should pass)
4. Use forgot password (email link should redirect to `/login` and allow new password)
5. In profile, change password and then login with new password
6. In profile, change email and confirm through verification email

If any link opens but does not complete auth, re-check Supabase redirect URL entries exactly.
