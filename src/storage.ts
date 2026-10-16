export type JournalPost = {
  id: string
  date: string
  title: string
  body: string
  tags: string[]
  kind: 'learning' | 'building' | 'reflection'
  link?: string
}

const STORAGE_KEY = 'shruti-dev-journal-v1'

export const starterPosts: JournalPost[] = [
  {
    id: 'seed-go', date: new Date().toISOString().slice(0, 10), title: 'Starting my Go chapter',
    body: 'Today I started revisiting programming fundamentals with a new goal: understand what I write, not just make it run. Small steps, more practice, and fewer copy-paste moments.',
    tags: ['Go', 'Learning in public'], kind: 'learning'
  },
  {
    id: 'seed-vibe', date: '2026-10-14', title: 'Revisiting VibeMeme',
    body: 'Thinking about how to present my past projects with more clarity: what problem they solve, what I personally built, and what I would improve next.',
    tags: ['Product thinking', 'Portfolio'], kind: 'reflection'
  },
  {
    id: 'seed-python', date: '2026-10-12', title: 'A tiny Python practice session',
    body: 'Practised breaking a problem into smaller steps before writing code. The plan is to keep a record of the problems that felt difficult and revisit them later.',
    tags: ['Python', 'Problem solving'], kind: 'building'
  }
]

export function loadPosts(): JournalPost[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as JournalPost[]
  } catch { /* storage can be unavailable in private browsing */ }
  return starterPosts
}

export function savePosts(posts: JournalPost[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); return true }
  catch { return false }
}
