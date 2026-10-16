import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, BookOpen, BriefcaseBusiness, Check,
  ChevronDown, Code2, Command, Github, Heart, Layers3, Lightbulb, Link as LinkIcon,
  Mail, Menu, Moon, Plus, Search, Send, Sparkles, Sun, X, Zap
} from 'lucide-react'
import { loadPosts, savePosts, type JournalPost } from './storage'

type Section = 'home' | 'journal' | 'projects' | 'stack' | 'about' | 'contact' | 'now'
const navItems: { id: Section; label: string }[] = [
  { id: 'home', label: 'Home' }, { id: 'journal', label: 'Journal' }, { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Toolbox' }, { id: 'about', label: 'About' }, { id: 'now', label: 'Now' }, { id: 'contact', label: 'Contact' }
]
const projects = [
  { name: 'VibeMeme', type: 'AI + wellbeing', emoji: '🌱', color: 'sage', description: 'A mental-health-focused meme platform with mood-based affirmations, coping tools and an exploration feed.', stack: ['React', 'Node.js', 'Express', 'MongoDB'], status: 'Past project', note: 'Revisit & improve' },
  { name: 'Sign language assistant', type: 'Computer vision', emoji: '🤟', color: 'lilac', description: 'An exploration of sign-language recognition and accessible communication using computer vision.', stack: ['Python', 'OpenCV', 'MediaPipe'], status: 'Concept', note: 'Future exploration' },
  { name: 'Go service monitor', type: 'Cloud native', emoji: '🛠️', color: 'butter', description: 'A small service with health checks, request metrics and clear debugging notes — built one concept at a time.', stack: ['Go', 'HTTP', 'Prometheus'], status: 'In progress', note: 'Learning project' }
]
const skills = [
  { name: 'Python', category: 'Languages', level: 'Practised', icon: '🐍' }, { name: 'Java', category: 'Languages', level: 'Practised', icon: '☕' }, { name: 'JavaScript', category: 'Languages', level: 'Practised', icon: '🟨' }, { name: 'HTML & CSS', category: 'Frontend', level: 'Practised', icon: '🎨' }, { name: 'React', category: 'Frontend', level: 'Project experience', icon: '⚛️' }, { name: 'Tailwind CSS', category: 'Frontend', level: 'Familiar', icon: '🌬️' }, { name: 'Bootstrap', category: 'Frontend', level: 'Familiar', icon: '🅱️' }, { name: 'Node.js', category: 'Backend', level: 'Project experience', icon: '🟢' }, { name: 'Express.js', category: 'Backend', level: 'Project experience', icon: '🚂' }, { name: 'Flask', category: 'Backend', level: 'Familiar', icon: '🧪' }, { name: 'Django', category: 'Backend', level: 'Familiar', icon: '🎸' }, { name: 'SQL', category: 'Data', level: 'Practised', icon: '🗃️' }, { name: 'MySQL', category: 'Data', level: 'Familiar', icon: '🐬' }, { name: 'MongoDB', category: 'Data', level: 'Project experience', icon: '🍃' }, { name: 'scikit-learn', category: 'AI & ML', level: 'Practised', icon: '📊' }, { name: 'TensorFlow', category: 'AI & ML', level: 'Familiar', icon: '🧠' }, { name: 'PyTorch', category: 'AI & ML', level: 'Exploring', icon: '🔥' }, { name: 'OpenCV', category: 'AI & ML', level: 'Practised', icon: '👁️' }, { name: 'NLTK', category: 'AI & ML', level: 'Familiar', icon: '📝' }, { name: 'Docker', category: 'Tools', level: 'Familiar', icon: '🐳' }, { name: 'Linux', category: 'Tools', level: 'Practised', icon: '🐧' }, { name: 'Git & GitHub', category: 'Tools', level: 'Practised', icon: '🐙' }, { name: 'Postman', category: 'Tools', level: 'Familiar', icon: '📮' }, { name: 'Figma', category: 'Design', level: 'Project experience', icon: '🪄' }, { name: 'Go', category: 'Languages', level: 'Currently learning', icon: '🐹' }
]
const categories = ['All', 'Languages', 'Frontend', 'Backend', 'AI & ML', 'Data', 'Tools', 'Design']
const kindLabel = { learning: 'LEARNING NOTE', building: 'MADE SOMETHING', reflection: 'A THOUGHT' }
const kindEmoji = { learning: '📚', building: '🧩', reflection: '💭' }
const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function App() {
  const [section, setSection] = useState<Section>('home')
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [posts, setPosts] = useState<JournalPost[]>(loadPosts)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('All')
  const [stackCategory, setStackCategory] = useState('All')
  const [stackSearch, setStackSearch] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().slice(0, 10), body: '', tags: '', kind: 'learning' as JournalPost['kind'], link: '' })

  useEffect(() => { savePosts(posts) }, [posts])
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [dark])

  const allTags = useMemo(() => ['All', ...Array.from(new Set(posts.flatMap(p => p.tags))).sort()], [posts])
  const filteredPosts = useMemo(() => posts.filter(p => {
    const haystack = `${p.title} ${p.body} ${p.tags.join(' ')}`.toLowerCase()
    return haystack.includes(search.toLowerCase()) && (filterTag === 'All' || p.tags.includes(filterTag))
  }).sort((a, b) => b.date.localeCompare(a.date)), [posts, search, filterTag])
  const filteredSkills = useMemo(() => skills.filter(s => (stackCategory === 'All' || s.category === stackCategory) && `${s.name} ${s.category} ${s.level}`.toLowerCase().includes(stackSearch.toLowerCase())), [stackCategory, stackSearch])

  function jump(id: Section) { setSection(id); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  function addPost(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    const post: JournalPost = { id: crypto.randomUUID(), title: form.title.trim(), date: form.date, body: form.body.trim(), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), kind: form.kind, link: form.link.trim() || undefined }
    setPosts(prev => [post, ...prev])
    setForm({ title: '', date: new Date().toISOString().slice(0, 10), body: '', tags: '', kind: 'learning', link: '' })
    setShowComposer(false)
    setSavedMessage('Journal entry saved in this browser ✨')
    window.setTimeout(() => setSavedMessage(''), 3500)
  }

  return <div className={`app-shell ${dark ? 'dark-mode' : ''}`}>
    <div className="paper-grain" aria-hidden="true" />
    <header className="topbar wrap">
      <button className="brand" onClick={() => jump('home')} aria-label="Go home"><span className="brand-mark"><Code2 size={18}/></span><span>shruti<span className="brand-dot">.</span>dev</span><span className="brand-spark">✳</span></button>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(n => <button key={n.id} className={section === n.id ? 'nav-link active' : 'nav-link'} onClick={() => jump(n.id)}>{n.label}</button>)}</nav>
      <div className="top-actions"><button className="icon-btn theme-btn" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button><button className="menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button><button className="small-cta" onClick={() => { setShowComposer(true); setSection('journal') }}><Plus size={15}/> Add a log</button></div>
    </header>
    {menuOpen && <nav className="mobile-nav wrap">{navItems.map(n => <button key={n.id} onClick={() => jump(n.id)}>{n.label}<ArrowUpRight size={14}/></button>)}</nav>}

    <main className="wrap main-content">
      {section === 'home' && <>
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot"/> CURRENTLY CURIOUS ABOUT <span className="mono">AI × HUMAN IDEAS</span></div>
            <h1>Hi, I'm Shruti.<br/>I make things, <span className="scribble">learn things</span><br/>and connect the dots<span className="coral">.</span></h1>
            <p className="hero-lede">A little bit of code, a lot of curiosity. I'm exploring the space where technology, thoughtful design and real-world problems meet.</p>
            <div className="hero-actions"><button className="primary-btn" onClick={() => jump('projects')}>Explore my work <ArrowUpRight size={16}/></button><button className="text-btn" onClick={() => jump('journal')}>Follow the journey <ArrowDownRight size={16}/></button></div>
            <div className="hero-meta"><span><span className="meta-icon">⌘</span> BCA · AI/ML</span><span className="meta-divider"/><span><span className="tiny-spark">✳</span> Building in public</span></div>
          </div>
          <div className="hero-art" aria-label="Decorative creative desk illustration">
            <div className="art-sun"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
            <div className="art-note note-top"><Sparkles size={15}/> currently learning</div>
            <div className="art-window"><div className="window-bar"><span/><span/><span/><small>little-ideas.md</small></div><div className="window-content"><span className="code-muted">01</span> <span className="code-purple">const</span> <span className="code-coral">curiosity</span> = <span className="code-green">"always on"</span>;<br/><span className="code-muted">02</span> <span className="code-purple">while</span> (learning) {'{'}<br/><span className="code-muted">03</span> &nbsp; buildSomething();<br/><span className="code-muted">04</span> &nbsp; tryAgain();<br/><span className="code-muted">05</span> {'}'}</div></div>
            <div className="art-sticker sticker-sun">✳<small>stay curious</small></div><div className="art-sticker sticker-heart">♥</div><div className="art-plant"><span/><span/><span/><i/></div><div className="art-note note-bottom"><span className="note-arrow">↗</span> progress over perfect</div><div className="art-tape"/>
          </div>
        </section>

        <section className="quick-stats">
          <div className="stat-intro"><span className="section-kicker">A WORK IN PROGRESS</span><p>Little steps count.<br/><em>Here's the trail so far.</em></p></div>
          <div className="stat"><strong>{posts.length.toString().padStart(2, '0')}</strong><span>journal entries</span></div><div className="stat"><strong>{projects.length.toString().padStart(2, '0')}</strong><span>project ideas & builds</span></div><div className="stat"><strong>{skills.length.toString().padStart(2, '0')}</strong><span>tools in my toolbox</span></div><div className="stat-badge">tiny steps<br/>↗ big picture</div>
        </section>

        <section className="section-block activity-section">
          <div className="section-heading"><div><span className="section-kicker">THE DAILY DOTS</span><h2>A little progress, <em>every day.</em></h2></div><button className="arrow-link" onClick={() => jump('journal')}>See my journal <ArrowUpRight size={15}/></button></div>
          <ContributionGraph posts={posts}/>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="section-kicker">SELECTED CURIOSITIES</span><h2>Things I've <em>made & imagined.</em></h2></div><button className="arrow-link" onClick={() => jump('projects')}>All projects <ArrowUpRight size={15}/></button></div>
          <ProjectGrid onSelect={() => jump('projects')} compact/>
        </section>

        <section className="split-callout"><div className="callout-icon">✎</div><div><span className="section-kicker">NOTES FROM THE PROCESS</span><h2>Learning out loud,<br/><em>one entry at a time.</em></h2><p>What worked, what broke, and the little lessons in between. No perfect streak required.</p></div><button className="round-arrow" onClick={() => { jump('journal'); setShowComposer(true) }} aria-label="Write a journal entry"><ArrowUpRight/></button><span className="callout-doodle">little by little ↗</span></section>
      </>}

      {section === 'journal' && <section className="page-section">
        <PageIntro kicker="THE LEARNING LOG" title={<>Notes from the <em>in-between.</em></>} subtitle="A running record of experiments, things I learned, tiny wins and the occasional bug that humbled me." sticker="dear diary ✎"/>
        <div className="journal-toolbar"><div className="search-field"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes, tools, ideas…"/></div><button className="primary-btn" onClick={() => setShowComposer(v => !v)}>{showComposer ? <X size={15}/> : <Plus size={15}/>} {showComposer ? 'Close editor' : 'Write a new entry'}</button></div>
        {savedMessage && <div className="success-note"><Check size={16}/>{savedMessage}</div>}
        {showComposer && <form className="composer card-surface" onSubmit={addPost}><div className="composer-top"><div><span className="section-kicker">NEW FIELD NOTE</span><h3>What happened today?</h3></div><span className="composer-emoji">✳</span></div><div className="form-row"><label>Title<input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Finally understood a Go loop"/></label><label>Date<input type="date" required value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></label></div><label>What did you learn or build?<textarea required rows={4} value={form.body} onChange={e => setForm({...form, body:e.target.value})} placeholder="Write like you're explaining it to your future self…"/></label><div className="form-row"><label>Tags <span className="label-hint">comma separated</span><input value={form.tags} onChange={e => setForm({...form,tags:e.target.value})} placeholder="Go, debugging, AI"/></label><label>Entry type<select value={form.kind} onChange={e => setForm({...form,kind:e.target.value as JournalPost['kind']})}><option value="learning">Learning note</option><option value="building">Made something</option><option value="reflection">A thought</option></select></label></div><label>Related link <span className="label-hint">optional</span><input type="url" value={form.link} onChange={e => setForm({...form,link:e.target.value})} placeholder="https://github.com/…"/></label><div className="composer-footer"><span className="label-hint">Saved to this browser for now.</span><button className="primary-btn" type="submit"><Send size={15}/> Publish entry</button></div></form>}
        <div className="tag-filter"><span>FILTER BY TAG</span>{allTags.map(tag => <button key={tag} onClick={() => setFilterTag(tag)} className={filterTag === tag ? 'tag-chip selected' : 'tag-chip'}>{tag}</button>)}</div>
        <div className="journal-layout"><div className="journal-list">{filteredPosts.length ? filteredPosts.map(post => <JournalCard key={post.id} post={post}/>) : <div className="empty-state"><span>🪴</span><h3>No notes found (yet).</h3><p>Try another search or write a new entry.</p></div>}</div><aside className="journal-aside"><div className="aside-card color-card"><span className="aside-scribble">✳</span><span className="section-kicker">A GENTLE REMINDER</span><h3>You don't have to<br/>know it all to<br/><em>start building.</em></h3><p>Document the process, not just the polished result.</p></div><div className="aside-card"><span className="section-kicker">YOUR TOPICS</span><div className="topic-cloud">{Array.from(new Set(posts.flatMap(p => p.tags))).slice(0,12).map((tag,i)=><button key={tag} className={`topic topic-${i%4}`} onClick={() => setFilterTag(tag)}>{tag}</button>)}</div></div></aside></div>
      </section>}

      {section === 'projects' && <section className="page-section"><PageIntro kicker="THE THINGS CORNER" title={<>Made with a little <em>curiosity.</em></>} subtitle="Projects, prototypes and ideas in progress. I'll keep adding context about what I built, what I learned and what I'd do differently." sticker="work in progress ↗"/><ProjectGrid/><div className="project-note"><Lightbulb size={18}/><p><strong>A note on this portfolio:</strong> Some entries are past projects, some are ideas, and some are learning builds. Their status is labelled honestly — a concept isn't the same as a finished product.</p></div></section>}

      {section === 'stack' && <section className="page-section"><PageIntro kicker="MY CREATIVE TOOLBOX" title={<>Tools I use, tools I'm <em>learning.</em></>} subtitle="A living list, not a claim that I'm an expert in everything. Filter by category or search for a specific tool." sticker="open toolbox 🧰"/><div className="stack-controls"><div className="search-field"><Search size={16}/><input value={stackSearch} onChange={e => setStackSearch(e.target.value)} placeholder="Find a tool…"/></div><span className="result-count">{filteredSkills.length} tools & technologies</span></div><div className="category-pills">{categories.map(c=><button key={c} onClick={()=>setStackCategory(c)} className={stackCategory===c?'category-pill active':'category-pill'}>{c}</button>)}</div><div className="skill-grid">{filteredSkills.map((s,i)=><div key={s.name} className={`skill-card skill-tone-${i%5}`}><div className="skill-card-top"><span className="skill-emoji">{s.icon}</span><span className="skill-category">{s.category}</span></div><strong>{s.name}</strong><span className={`skill-level ${s.level==='Currently learning'?'learning-level':''}`}><span/> {s.level}</span></div>)}</div><div className="stack-footnote"><Asterisk size={17}/><span>Skill labels describe my current relationship with each tool, not a certification. I'll update them as I build and practise.</span></div></section>}

      {section === 'about' && <section className="page-section"><PageIntro kicker="A LITTLE ABOUT ME" title={<>Curious by nature, <em>learning by doing.</em></>} subtitle="I'm Shruti — a BCA graduate exploring how technology can solve human problems in thoughtful, useful and creative ways." sticker="nice to meet you ✿"/><div className="about-grid"><div className="about-paper"><span className="paper-stamp">HELLO!<br/>✳</span><h3>Not an expert<br/>in everything.<br/><em>Curious about<br/>a lot of things.</em></h3><p>I believe progress looks less like a straight line and more like a notebook full of messy experiments, new questions and small discoveries.</p><div className="signature">— Shruti ♡</div></div><div className="about-details"><div className="detail-row"><span className="detail-icon">🔎</span><div><strong>Things I'm curious about</strong><p>AI, human-computer interaction, thoughtful product design, accessible technology and systems that make a difference.</p></div></div><div className="detail-row"><span className="detail-icon">🧩</span><div><strong>How I like to work</strong><p>Break big questions into small experiments, learn by building, and write down what I discover.</p></div></div><div className="detail-row"><span className="detail-icon">🌱</span><div><strong>What I'm working on</strong><p>Building consistent coding habits, exploring Go, and creating projects I can explain from the inside out.</p></div></div><div className="detail-row"><span className="detail-icon">☕</span><div><strong>Outside the editor</strong><p>Fiction, music, creative ideas and learning about the world beyond the screen.</p></div></div></div></div></section>}

      {section === 'now' && <section className="page-section"><PageIntro kicker="THE NOW PAGE" title={<>What I'm up to <em>these days.</em></>} subtitle="A small snapshot of my current focus. This page changes as I do." sticker="currently in motion ↗"/><div className="now-grid"><div className="now-card now-big"><span className="now-icon">🧠</span><span className="section-kicker">LEARNING</span><h3>Go, one concept<br/>at a time.</h3><p>Practising fundamentals with a focus on writing code independently, understanding errors and building small programs without rushing through tutorials.</p><div className="progress-label"><span>Current chapter</span><span>Fundamentals</span></div><div className="progress-track"><span style={{width:'28%'}}/></div></div><div className="now-card now-coral"><span className="now-icon">🛠️</span><span className="section-kicker">BUILDING</span><h3>This portfolio.</h3><p>Turning daily learning into a visible trail of progress.</p></div><div className="now-card now-lilac"><span className="now-icon">🧭</span><span className="section-kicker">EXPLORING</span><h3>AI + people.</h3><p>Looking at the intersection of technology, thoughtful design and useful products.</p></div><div className="now-card now-wide"><span className="section-kicker">A NOTE TO FUTURE ME</span><p className="now-quote">“Build things you can explain. Keep the receipts. Be curious enough to change your mind.”</p></div></div></section>}

      {section === 'contact' && <section className="page-section"><PageIntro kicker="THE INTERNET IS A SMALL PLACE" title={<>Have a good idea? <em>Say hello.</em></>} subtitle="Open to thoughtful conversations, collaborative projects and opportunities to learn with good people." sticker="your turn ↘"/><div className="contact-grid"><a className="contact-card contact-mail" href="mailto:hello@example.com"><span className="contact-icon"><Mail/></span><span className="section-kicker">EMAIL</span><strong>Let's talk ideas.</strong><span className="contact-sub">Replace this placeholder with your email.</span><ArrowUpRight className="contact-arrow"/></a><a className="contact-card contact-github" href="https://github.com" target="_blank" rel="noreferrer"><span className="contact-icon"><Github/></span><span className="section-kicker">GITHUB</span><strong>See what I'm building.</strong><span className="contact-sub">Add your GitHub profile URL.</span><ArrowUpRight className="contact-arrow"/></a><a className="contact-card contact-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer"><span className="contact-icon"><BriefcaseBusiness/></span><span className="section-kicker">LINKEDIN</span><strong>Let's connect.</strong><span className="contact-sub">Add your LinkedIn profile URL.</span><ArrowUpRight className="contact-arrow"/></a></div><div className="contact-note"><Heart size={15}/> Made with curiosity, a little CSS, and a lot of trial and error.</div></section>}
    </main>

    <footer className="footer wrap"><button className="footer-brand" onClick={() => jump('home')}>shruti<span>.</span>dev <span className="footer-flower">✳</span></button><span>Built slowly, with curiosity and care.</span><button className="back-top" onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); setSection('home') }}>Back to top ↑</button></footer>
    {savedMessage && section !== 'journal' && <div className="toast"><Check size={15}/>{savedMessage}</div>}
  </div>
}

function PageIntro({kicker,title,subtitle,sticker}:{kicker:string;title:React.ReactNode;subtitle:string;sticker:string}) { return <div className="page-intro"><div><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{subtitle}</p></div><span className="intro-sticker">{sticker}</span></div> }

function ContributionGraph({posts}:{posts:JournalPost[]}) {
  const end = new Date(); end.setHours(12,0,0,0)
  const start = new Date(end); start.setDate(start.getDate()-363); start.setDate(start.getDate()-start.getDay())
  const counts = new Map<string,number>(); posts.forEach(p=>counts.set(p.date,(counts.get(p.date)||0)+1))
  const days: {date:string;count:number;future:boolean}[]=[]
  for(let i=0;i<364;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=d.toISOString().slice(0,10);days.push({date:key,count:counts.get(key)||0,future:d>end})}
  const activeDays = new Set(posts.map(p=>p.date)).size
  const total = posts.length
  return <div className="graph-card"><div className="graph-top"><div><strong>{total} <span>logged moments</span></strong><p>{activeDays} active days in your journal · keep showing up in your own way.</p></div><span className="graph-sticker">every square is a story ✳</span></div><div className="graph-scroll"><div className="graph-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div><div className="graph-main"><div className="graph-weekdays"><span>Mon</span><span>Wed</span><span>Fri</span></div><div className="graph-cells">{days.map((d,i)=><div key={d.date} title={`${d.date}: ${d.count} entr${d.count===1?'y':'ies'}`} className={`graph-cell ${d.future?'future':''} level-${Math.min(d.count,4)}`} style={{animationDelay:`${Math.min(i%52,20)*8}ms`}} onClick={()=>{const el=document.getElementById('journal-day-'+d.date);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}}/>)}</div></div></div><div className="graph-bottom"><span>Less <i className="legend-cell level-0"/><i className="legend-cell level-1"/><i className="legend-cell level-2"/><i className="legend-cell level-3"/><i className="legend-cell level-4"/> More</span><span className="graph-hint">Your pace, your progress.</span></div></div>
}

function JournalCard({post}:{post:JournalPost}) { return <article id={`journal-day-${post.date}`} className="journal-card"><div className="journal-date"><span>{new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US',{month:'short'})}</span><strong>{new Date(`${post.date}T12:00:00`).getDate().toString().padStart(2,'0')}</strong><small>{new Date(`${post.date}T12:00:00`).getFullYear()}</small></div><div className="journal-card-body"><div className="journal-card-meta"><span className={`kind-pill kind-${post.kind}`}>{kindEmoji[post.kind]} {kindLabel[post.kind]}</span><span className="post-date-full">{formatDate(post.date)}</span></div><h3>{post.title}</h3><p>{post.body}</p><div className="post-bottom"><div className="post-tags">{post.tags.map(tag=><span key={tag}>#{tag.replace(/ /g, '')}</span>)}</div>{post.link && <a href={post.link} target="_blank" rel="noreferrer" className="post-link">Open link <ArrowUpRight size={13}/></a>}</div></div></article> }

function ProjectGrid({onSelect,compact=false}:{onSelect?:()=>void;compact?:boolean}) { return <div className={`project-grid ${compact?'compact':''}`}>{projects.slice(0,compact?2:projects.length).map((p,i)=><article key={p.name} className={`project-card project-${p.color}`}><div className="project-visual"><span className="project-index">0{i+1} / FIELD NOTE</span><span className="project-emoji">{p.emoji}</span><div className="project-shape shape-a"/><div className="project-shape shape-b"/><span className="project-sticker">{p.note}</span><ArrowUpRight className="project-open" size={18}/></div><div className="project-card-body"><div className="project-type">{p.type}<span>·</span>{p.status}</div><h3>{p.name}</h3><p>{p.description}</p><div className="project-stack">{p.stack.map(t=><span key={t}>{t}</span>)}</div><button className="project-read" onClick={onSelect||(()=>{})}>Explore project <ArrowRight size={14}/></button></div></article>)}</div> }

export default App
