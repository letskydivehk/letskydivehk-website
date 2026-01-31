
# Fix 404 Error After Google OAuth Sign-in

## Problem Summary
After signing in with Google OAuth, users see a "404: NOT_FOUND" error. This happens because:
1. The custom domain `letskydivehk.com` may not be properly configured in Supabase's allowed redirect URLs
2. The OAuth callback handling doesn't properly manage the token exchange on custom domains

---

## Solution Overview

### Part 1: Supabase Dashboard Configuration (Manual Step)

You need to update your Supabase project's authentication settings to include all domains:

**Go to**: Supabase Dashboard > Authentication > URL Configuration

**Add these Redirect URLs:**
- `https://letskydivehk.com/**`
- `https://letskydivehk.com/membership`
- `https://letskydivehk.lovable.app/**`
- `https://letskydivehk.lovable.app/membership`
- `https://id-preview--7daa22e3-e313-4c93-a246-134f9c762b55.lovable.app/**`
- `https://id-preview--7daa22e3-e313-4c93-a246-134f9c762b55.lovable.app/membership`

**Set Site URL to:** `https://letskydivehk.com` (your primary production domain)

---

### Part 2: Code Changes

#### 1. Update AuthContext.tsx - Handle OAuth Token from URL Hash

Add logic to extract and process the OAuth access token from the URL hash after redirect. This ensures the session is properly established when returning from Google:

```text
Changes to src/contexts/AuthContext.tsx:
- Add useEffect to detect OAuth callback (URL contains access_token)
- Call supabase.auth.getSession() to exchange the token
- Handle errors gracefully with user feedback
```

#### 2. Create an Auth Callback Route (Optional but Recommended)

Create a dedicated `/auth/callback` page that handles the OAuth redirect more reliably:

```text
New file: src/pages/AuthCallback.tsx
- Extracts session from URL
- Displays loading state while processing
- Redirects to /membership after successful authentication
- Shows error message if authentication fails
```

#### 3. Update App.tsx Routes

Add the auth callback route:

```text
Changes to src/App.tsx:
- Add route: /auth/callback -> AuthCallback component
```

#### 4. Update OAuth Redirect URL in AuthContext

Change the redirect to use the callback handler:

```text
Changes to src/contexts/AuthContext.tsx signInWithGoogle:
- Change redirectTo from /membership to /auth/callback
- The callback page will then redirect to /membership after token exchange
```

---

## Technical Details

### Token Exchange Flow (Current Issue)
```text
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth
3. Google redirects back to Supabase callback
4. Supabase redirects to custom domain with tokens in URL hash
5. ❌ PROBLEM: Page loads but tokens aren't processed, session not established
6. 404 error appears
```

### Fixed Flow
```text
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth
3. Google redirects back to Supabase callback
4. Supabase redirects to /auth/callback with tokens
5. ✅ AuthCallback page extracts tokens
6. ✅ Session established via getSession()
7. ✅ Redirect to /membership with valid session
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/AuthCallback.tsx` | Create | Handle OAuth redirect and token exchange |
| `src/App.tsx` | Modify | Add /auth/callback route |
| `src/contexts/AuthContext.tsx` | Modify | Update redirectTo URL |

---

## Immediate Action Required

Before the code changes will work, you must update the Supabase Dashboard:

1. Go to https://supabase.com/dashboard/project/xmelqjnxllsqofvkoccd/auth/url-configuration
2. Add your custom domain URLs to the Redirect URLs list
3. Verify the Site URL is set correctly

This is the most critical step - without it, OAuth will continue to fail.
