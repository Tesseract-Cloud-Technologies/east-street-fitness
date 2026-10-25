
## Publishing to GitHub Pages
1. Create a new GitHub repository (e.g. `esf-demo`).
2. Upload all files to the repository root.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, click **Save**.
6. Visit `https://<username>.github.io/esf-demo/`.

## Notes
- All content is placeholder / sample data. No real bookings or payments are processed.
- Forms are front-end only; they validate and show a success state with an optional prefilled WhatsApp link.
- Menu prices, membership estimates, and scheduling are illustrative.
- Replace `images/` placeholders with real photos when ready.
- Signal red is controlled by `--signal-red` in `:root` and can be swapped or removed.

---

### Self-check (6 lines)
1. No horizontal overflow at 320, 360, 390, 768, 1024, 1440, 1920px — `overflow-x: clip` on body plus clipped marquee/watermark containers.
2. Mobile nav uses Bootstrap collapse; sticky Book + WhatsApp bar appears only on phones (≤575.98px).
3. All internal links (`index.html`, `programs.html`, `membership.html`, `schedule.html`, `shop.html`, `book.html`, `contact.html`) resolve correctly relative to root.
4. `prefers-reduced-motion` disables marquee scroll, status pulse, confetti, and transitions.
5. One `<h1>` per page, skip link, visible focus rings, ARIA labels on icon buttons, semantic landmarks.
6. Booking wizard validates and shows a confirmation card with reference; forms are front-end only with prefilled WhatsApp; no data stored.