# shruti.dev — Creative developer portfolio

A warm, playful React + TypeScript portfolio starter for a personal homepage, daily learning journal, GitHub-style activity calendar, projects, toolbox, About/Now pages, and contact links.

## What's implemented in this starter

- Responsive editorial homepage and section navigation
- Creative Playground palette, expressive CSS motion, and dark/light theme toggle
- Journal composer with title, date, notes, tags, entry type and optional link
- Local journal persistence using `localStorage`
- Search and tag filtering for journal posts
- Contribution-style activity graph calculated from saved journal dates
- Project cards and searchable/category-filtered technology cards
- About, Now, and Contact sections
- Reduced-motion support and keyboard focus styles

## Run locally

Requires Node.js 20+ (recommended).

```bash
npm install
npm run dev
```

Open the local URL Vite prints. To check a production build:

```bash
npm run build
npm run preview
```

## Important current limitations

- Journal entries are currently saved in the browser's `localStorage`. They are not synced between devices and clearing browser data can remove them.
- The graph counts journal entries, not GitHub commits. It is intentionally based on real posts rather than invented contribution activity.
- Project content and skills are starter content and should be reviewed/updated by Shruti before publishing.
- Contact links currently include placeholders. Replace `hello@example.com`, the GitHub URL and LinkedIn URL in `src/App.tsx` with your real links.
- The post editor is not protected by authentication yet. Do not deploy this version as a multi-user public posting service.

## Next step: Supabase persistence and private editing

The intended production path is Supabase for database persistence and authentication. Before enabling online posting:

1. Create a Supabase project.
2. Create a `journal_posts` table with `id uuid primary key`, `user_id uuid references auth.users not null`, `post_date date not null`, `title text not null`, `body text not null`, `tags text[] default '{}'`, `kind text not null`, `link text`, `created_at timestamptz default now()`.
3. Enable Row Level Security (RLS).
4. Add a SELECT policy for published posts and INSERT/UPDATE/DELETE policies that require `auth.uid() = user_id` for the owner's posts. Keep editing behind Supabase Auth.
5. Add `@supabase/supabase-js`, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`, and replace the functions in `src/storage.ts` with a Supabase adapter. Never put a service-role key in frontend code.
6. Test the RLS policies using a signed-out browser and a second account before deployment.

## Deployment

After reviewing content and completing the backend/authentication stage, push the repository to GitHub and import it into Vercel. The build command is `npm run build` and output directory is `dist`.
