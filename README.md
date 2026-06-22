# KestCo Game Studio Portal

A first shared hub for Word Architect, Top Tier, and Your Story.

## Current version

- Game picker for all three games
- Brand cards using each game's logo
- Analytics placeholders for the future Supabase bridge
- Supabase-ready analytics reader for shared game stats
- Supabase schema for Top Tier editor draft saving
- Readiness board per game
- Direct links to editor/writer portals and live games

## Supabase setup

1. Run `supabase-schema.sql` in the Supabase SQL editor.
2. Copy `studio-config.example.js` to `studio-config.js`.
3. Add the project URL and public anon key.
4. Use the same URL/key in each game's analytics config or environment variables.

The event table stores counts and behavior signals. The draft table stores editor-created Top Tier puzzle drafts. It should not store player-written story text.

## Next step

Deploy this portal and add the same Supabase URL/key to the game projects so the dashboard becomes live.
