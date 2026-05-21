# Supabase Authentication Setup Guide

To ensure the "Forgot Password" and "Email Verification" flows work correctly in UrugoStay, please configure your Supabase Dashboard as follows:

## 1. Authentication Settings
Navigate to **Authentication > Settings > Providers > Email**:
- **Enable Email Provider**: ON
- **Confirm Email**: ON (Mandatory for email verification flow)
- **Secure Change Email**: ON

## 2. URL Configuration
Navigate to **Authentication > Settings > URL Configuration**:

### Site URL
- Set this to your primary deployment URL (e.g., `https://urugostay.com` or `http://localhost:3000` for local dev).

### Redirect URLs
Add the following to the **Redirect URLs** list:
- `http://localhost:3000/api/auth/callback/**` (Local Development)
- `https://your-domain.com/api/auth/callback/**` (Production)

> [!IMPORTANT]
> The `/**` wildcard is necessary to handle nested parameters used by the PKCE flow.

## 3. Email Templates (Recommended)
You should update your email templates (**Authentication > Email Templates**) to ensure the links point to the callback route:

- **Confirm Signup**: 
  Link should be: `{{ .ConfirmationURL }}&type=signup`
- **Reset Password**: 
  Link should be: `{{ .ConfirmationURL }}&type=recovery`

> [!NOTE]
> If you have an SMTP provider (like Resend) configured, make sure the "From" address is verified.

## 4. Environment Variables
Ensure your `.env.local` or production environment has these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (Adjust per environment)
```

## 5. Real-World Email Delivery (Crucial)
By default, Supabase uses a built-in email provider with a strict **rate limit** (approx. 3 emails per hour). For production or real testing, you MUST configure an external SMTP provider:

1.  **Register with a provider**: (Recommended: [Resend](https://resend.com), [Postmark](https://postmark.com), or SendGrid).
2.  **Verify your domain**: Follow their instructions to add SPF/DKIM records.
3.  **Enter SMTP Settings**:
    *   Go to **Authentication > Settings > SMTP**.
    *   **Enabled**: ON
    *   **Sender Email**: Your verified email (e.g., `noreply@yourdomain.com`).
    *   **Host**: e.g., `smtp.resend.com`.
    *   **Port**: `587` or `465`.
    *   **User**: The API key or username provided by your SMTP host.
    *   **Password**: The corresponding secret key.

> [!CAUTION]
> If you don't use a custom SMTP, your verification and recovery emails will likely be throttled or blocked by aggressive spam filters.

## 6. Testing Checklist
Verify your setup by ticking these off:
- [ ] Signup sends a real email to your inbox.
- [ ] Forgot Password link arrives and works.
- [ ] The "From" name matches your UrugoStay brand.
