# PDF Tools – Multi-Role Marketplace & Creator Platform

## Current State

A full-stack ICP app with:
- 30+ PDF and image processing tools (browser-based)
- Internet Identity authentication
- User profiles (display name + avatar)
- Admin dashboard (Services, Theme, Header, Footer, Users, Sponsors tabs)
- Admin settings persisted to Motoko backend canister
- Tool usage statistics
- Processing history per user
- Stripe integration (monthly/yearly subscription)
- Gemini AI chat
- User dashboard at `/dashboard`
- Upgrade/Premium page at `/upgrade`

## Requested Changes (Diff)

### Add

**User Roles (4 tiers)**
- `guest` – not logged in, can view free content and ads
- `free` – logged in, limited features (5MB files, 10 images/batch, daily usage cap, ads shown)
- `creator` – can list services/projects for sale, set prices, receive tips, manage followers
- `plus` / `premium` – paid subscriber: 200MB files, no watermark, background removal, no ads, priority processing
- `admin` – full platform control (existing, enhanced)

**Creator System**
- Creator profile page at `/creator/:principalId`
- Creator can upload: Resume, PDF, PPT, MBA Project, GitHub Project, Reports
- Creator can set free or paid price per item
- Creator can add payment link
- Creator has followers count, ratings & reviews
- Creator analytics: views, followers, item downloads
- Creator dashboard at `/creator-dashboard`
- Social sharing: QR code, email share, link copy

**Marketplace**
- Browse page at `/marketplace` listing all creator services/products
- Category filter, search, star rating filter
- Product detail page at `/product/:id`
- Like, comment, star rating on products
- Free download for free items, payment link redirect for paid items

**Ads System (Sponsor/Business role)**
- Business profile page at `/business/:principalId`
- Sponsor can create ads: banner image, title, link, coupon, boost flag
- Ads shown to all users (free, creator, guest)
- Ad analytics: click count, like/dislike, comments, star rating
- Ad management dashboard at `/sponsor-dashboard`

**Social Features**
- Follow / Unfollow creators
- Like / Comment on products and ads
- Star rating (1–5)
- QR code generation for profiles and products
- Share via email, link copy

**Subscription & Payments**
- Monthly plan ($9.99/mo) and Yearly plan ($79.99/yr) – already exists at `/upgrade`, extend with role assignment on payment
- Creator commission model (platform takes %, shown in UI)
- Tips ("Thank as money") button on creator profiles
- Subscription status tracked per user role

**Admin Dashboard Enhancements (new tabs)**
- Analytics tab: total users by role, active users, storage usage, daily processing count, top tools
- Subscriptions tab: active subscriptions table, revenue overview, cancel/refund
- Tool Control tab: enable/disable tools, set file size limits per tier, manage watermark
- User Management: view all users, change role, suspend, delete, view subscription status

**New Pages**
- `/marketplace` – browse all creator products
- `/product/:id` – product detail with comments, ratings, download
- `/creator/:principalId` – public creator profile
- `/creator-dashboard` – creator's own dashboard (upload, analytics, earnings)
- `/business/:principalId` – public business/sponsor profile
- `/sponsor-dashboard` – sponsor ad management
- `/follow/:principalId` – follow action (redirects back)
- `/notifications` – platform notifications + admin announcements

**Free User Limitations (enforced in UI)**
- Max file size: 5MB
- Max 10 images/batch
- Limited compression quality
- No background removal (Plus only)
- Watermark added to output
- Daily usage limit (10 operations/day)

### Modify

- `AdminPage.tsx` – add Analytics, Subscriptions, Tool Control tabs; user management with role/suspend/delete
- `Home.tsx` – show sponsored ads carousel, marketplace preview section
- `Header.tsx` – add Marketplace, Creator, Notifications links; show role badge
- `UserDashboard.tsx` – show role, daily usage, subscription status, history
- Backend `main.mo` – add Creator, Product, Ad, Follower, Comment, Rating, Notification data models and CRUD functions
- `UpgradePage.tsx` – show role update on successful Stripe payment

### Remove

Nothing removed (full backward compatibility maintained).

## Implementation Plan

1. Update `main.mo` backend with new stable data structures:
   - `Creator` type: name, bio, category, socialLinks, githubUrl, profileType
   - `Product` type: id, creatorId, title, description, category, fileUrl, price, isFree, tags
   - `Ad` type: id, sponsorId, imageUrl, title, link, coupon, isBoosted
   - `Comment` type: id, authorId, targetId, text, timestamp
   - `Rating` type: authorId, targetId, score (1–5)
   - `Follower` map: followerId → [followedId]
   - `Notification` type: id, targetPrincipal, message, read, timestamp
   - CRUD functions for all above types
   - `getUsersByRole`, `suspendUser`, `setUserRole` for admin
   - `getAdminStats` returning user counts, tool usage, daily ops

2. Frontend new pages: Marketplace, ProductDetail, CreatorProfile, CreatorDashboard, SponsorDashboard, BusinessProfile, Notifications
3. Frontend updates: Home (ads carousel + marketplace preview), Header (role badge + new links), AdminPage (new tabs), UserDashboard (role/subscription status)
4. QR code generation component (using qrcode library)
5. Free tier enforcement: file size check, daily usage counter, watermark injection for free users
6. Social features: Like/Comment/Rating components reused across products and ads
