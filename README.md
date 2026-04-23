# v0 iOS App Preview — Redirect Loop Reproduction

Minimal Next.js app to demonstrate `NSURLErrorDomain -1007 "too many HTTP redirects"` in the v0 iOS app when previewing a GitHub-linked project.

## The Bug

Project-linked v0 chats (GitHub-imported repos) fail to preview in the v0 iOS app with a redirect loop error. Simple (non-GitHub) chats preview fine on the same device.

## Root Cause

- **Project-linked chats** use `vm-*.vusercontent.net` (Vercel Sandbox) which requires a cross-domain OAuth redirect chain: `vusercontent.net → v0.app → vercel.com → v0.app → vusercontent.net`
- **Simple chats** use `*.lite.vusercontent.net` which serves content directly (no auth)
- The v0 iOS app's WKWebView cannot complete the OAuth flow — cookies set with `SameSite=Lax` on `v0.app` are dropped during the cross-site redirect back from `vercel.com`, causing an infinite auth loop

## Evidence

```bash
# Project-linked preview: 302 auth redirect (triggers loop in WKWebView)
curl -s -o /dev/null -w "%{http_code}" "https://<vm-hash>.vusercontent.net/"
# → 302

# Simple chat preview: 200 direct (works fine)
curl -s -o /dev/null -w "%{http_code}" "https://<build-id>.lite.vusercontent.net/"
# → 200
```

## How to Reproduce

1. Import this repo into v0 via GitHub integration
2. Open the project chat in v0 web — preview works fine
3. Open the same project chat in the v0 iOS app — preview fails with:
   ```
   Error loading page
   Domain: NSURLErrorDomain
   Error Code: -1007
   Description: too many HTTP redirects
   ```
4. For comparison, create a simple (non-GitHub) chat in v0 — it previews fine on iOS

## What This App Contains

- Vanilla `create-next-app` with zero modifications
- No auth, no middleware, no redirects, no third-party providers
- Single page with static text

The app content is irrelevant — the 302 auth redirect fires at v0's infrastructure level before any Next.js code executes.
