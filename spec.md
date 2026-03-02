# PDF Tools

## Current State
- Full-stack PDF + Image tools platform on ICP
- Has a simple footer (Footer.tsx) with brand name, a few tool links, and optional copyright text pulled from AdminSettings
- Profile page allows uploading profile photo and display name, saved to backend
- Header shows profile photo from `useGetProfile()` data -- but only refreshes when the query cache updates, so after saving on ProfilePage, the header may not immediately reflect the new photo
- No Privacy Policy, Contact, About, or Terms pages exist
- Desktop header and layout are complete and should not be changed

## Requested Changes (Diff)

### Add
- `/privacy` -- Privacy Policy page (professional, multi-section)
- `/contact` -- Contact Us page with a simple form (name, email, message) and contact info cards
- `/about` -- About Us page describing the platform, mission, team section placeholder
- `/terms` -- Terms of Service page (professional, multi-section)
- Footer rebuilt as a multi-column professional footer with sections: Tools, Company (About, Contact, Privacy, Terms), and a bottom bar with copyright -- no "Built with caffeine.ai" text anywhere

### Modify
- `Footer.tsx` -- Replace current single-row footer with a proper multi-column footer (Product tools column, Company links column, bottom copyright bar). Must still use AdminSettings footerBrandName/footerCopyright/footerLinks but layout becomes multi-column.
- `App.tsx` -- Add routes for `/privacy`, `/contact`, `/about`, `/terms`
- Profile photo update flow -- After saving profile, invalidate the `getProfile` query cache so the header avatar updates immediately everywhere without a page reload

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/PrivacyPage.tsx` -- full privacy policy with sections
2. Create `src/frontend/src/pages/ContactPage.tsx` -- contact page with form + info cards
3. Create `src/frontend/src/pages/AboutPage.tsx` -- about page with mission + features highlights
4. Create `src/frontend/src/pages/TermsPage.tsx` -- terms of service with sections
5. Rebuild `Footer.tsx` as a multi-column professional footer; keep footerBrandName/footerCopyright from AdminSettings; hardcode Privacy/Contact/About/Terms links in the Company column; put the top tool links in a Tools column; bottom bar shows copyright if set
6. Update `App.tsx` to import and register the 4 new page routes
7. Fix profile photo refresh -- in `ProfilePage.tsx` `handleSave` onSuccess callback, call `queryClient.invalidateQueries` on the `getProfile` query key so header avatar updates instantly
