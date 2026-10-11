import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUpRight, Heart, Mail, Send, Sparkles, Flower2, Sun, Cake, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import paper from '@/assets/birthday-paper.jpg';
import { firebaseConfigured, saveWish, watchWishes, wishSchema, type BirthdayWish } from '@/lib/birthday-wishes';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Happy Birthday Pavii — For you, with love' },
    { name: 'description', content: 'An envelope full of love, a special birthday letter, and wishes from everyone who loves Pavii.' },
    { property: 'og:title', content: 'Happy Birthday Pavii — For you, with love' },
    { property: 'og:description', content: 'A little birthday surprise for a very special person. Open your card, Pavii.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!opening) return;
    const timer = setTimeout(() => { setOpened(true); setOpening(false); window.scrollTo(0, 0); }, 1000);
    return () => clearTimeout(timer);
  }, [opening]);

  return <div className="birthday-app">
    <header className="birthday-header">
      <a href="/" className="brand"><Heart size={17} /> <span>for Pavii<span className="brand-comma">,</span> with love</span></a>
      <span className="header-note">A LITTLE SURPRISE. A LOT OF LOVE.</span>
      <span className="header-heart"><Heart size={16} /></span>
    </header>
    {!opened ? <main className={`envelope-page ${opening ? 'is-opening' : ''}`}>
      <img className="paper-background" src={paper} alt="" width={1536} height={1024} />
      <div className="invitation-intro"><span className="eyebrow"><span /> TODAY IS ALL ABOUT YOU <span /></span>
        <h1>Happy birthday, <em>Pavii.</em></h1>
        <p>Some people make the world a little more beautiful.<br />You make mine.</p>
      </div>
      <div className="envelope-wrap" aria-hidden="true">
        <span className="floating-heart heart-one">♡</span><span className="floating-heart heart-two">♡</span>
        <div className="envelope">
          <div className="letter-peek"><span>To my favorite person</span><Heart size={22} /></div>
          <div className="envelope-back" /><div className="envelope-front" /><div className="envelope-flap" />
          <div className="wax-seal"><Heart size={26} fill="currentColor" /></div>
          <div className="envelope-address">Happy birthday Pavii<span>just a little something, from my heart to yours</span></div>
        </div>
        <span className="envelope-caption">sealed with a little extra love</span>
      </div>
      <div className="open-action"><Button size="lg" className="birthday-button" disabled={opening} onClick={() => setOpening(true)}><Mail size={17} />{opening ? 'Opening your surprise…' : 'Open your birthday card'}<ArrowUpRight size={17} /></Button>
      <span>A letter. A few little moments. All for you.</span></div>
      <div className="invitation-bottom"><span className="tiny-sparkle">✧</span><span>MADE FOR ONE VERY SPECIAL PERSON</span><Heart size={12} /></div>
    </main> : <main className="opened-card">
      <section className="card-welcome"><img className="paper-background" src={paper} alt="" width={1536} height={1024} />
        <span className="eyebrow"><Sparkles size={14} /> YOUR DAY. YOUR LITTLE WORLD.</span>
        <span className="script-line">Here's to you, my love</span>
        <h1>Happy birthday,<br /><em>Pavii.</em><Heart className="welcome-heart" size={36} /></h1>
        <p>To the girl who makes ordinary days feel extraordinary.<br />This little corner of the world is yours.</p>
        <Button variant="ghost" className="scroll-cue" onClick={() => document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' })}>A little love, just below<ArrowDown size={18} /></Button>
      </section>
      <section className="love-letter content-section" id="letter"><span className="eyebrow">01 / A NOTE FROM MY HEART</span>
        <div className="letter-layout"><div><h2>My favorite place<br />is <em>with you.</em></h2><span className="script-line">Always has been. Always will be.</span><Heart className="letter-heart" size={44} strokeWidth={1} /></div>
        <div className="letter-copy"><p className="salutation">My dearest Pavii,</p><p>Today, I hope you feel every bit of the love you give so effortlessly. The kind that shows up in your smile, in the little things you do, and in the way you make everything feel a little lighter.</p><p>You deserve the softest days, the biggest dreams, and all the happiness your heart can hold. I’m so lucky to celebrate you — not just today, but in all the ordinary moments in between.</p><p>Here’s to more laughter, more adventures, and more beautiful little memories together.</p><span className="script-line">With all my love,</span><span className="signature">Your favorite person ♡</span></div></div>
      </section>
      <section className="little-things content-section"><span className="eyebrow">02 / IT'S THE LITTLE THINGS</span><h2>So many reasons.<br /><em>One very special you.</em></h2>
        <div className="reasons-grid">{[
          { Icon: Sun, title: 'Your sunshine', text: 'That smile that makes even the most ordinary day feel like something special.' },
          { Icon: Heart, title: 'Your beautiful heart', text: 'The warmth you share, the kindness you give, and the way you care so deeply.' },
          { Icon: Flower2, title: 'Just being you', text: 'All the little things that make you, you. I wouldn’t change a single one.' },
        ].map(({ Icon, title, text }) => <article className="reason" key={title}><Icon size={30} strokeWidth={1.2} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="birthday-wish content-section"><Cake size={37} strokeWidth={1.2} /><span className="eyebrow">03 / MAKE A LITTLE WISH</span><h2>May this next chapter<br />be your <em>most beautiful yet.</em></h2><p>A little more magic. A little more adventure.<br />A whole lot of happiness. You deserve it all.</p><span className="script-line">The best is still to come.</span></section>
      <WishesWall />
      <footer className="birthday-footer"><Heart size={18} /><span>Made with love. Just for Pavii.</span><Button variant="ghost" size="sm" onClick={() => { setOpened(false); window.scrollTo(0, 0); }}><RotateCcw size={13} /> Back to the envelope</Button></footer>
    </main>}
  </div>;
}

function WishesWall() {
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!firebaseConfigured) return;
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    watchWishes((rows) => { if (!disposed) setWishes(rows); }, () => setStatus('The wishes couldn’t load. Please try again later.'))
      .then((stop) => { if (disposed) stop(); else unsubscribe = stop; }).catch(() => setStatus('The wishes couldn’t load. Please try again later.'));
    return () => { disposed = true; unsubscribe?.(); };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSuccess(false);
    const parsed = wishSchema.safeParse({ name, message });
    if (!parsed.success) { setStatus(parsed.error.issues[0]?.message ?? 'Please check your wish.'); return; }
    if (!firebaseConfigured) { setStatus('The shared wishes wall is not connected yet. Your wish hasn’t been saved.'); return; }
    setSending(true); setStatus('');
    try { await saveWish(parsed.data); setName(''); setMessage(''); setSuccess(true); setStatus('Your wish is on its way to Pavii. Thank you!'); }
    catch { setStatus('Your wish couldn’t be saved. Please try again.'); }
    finally { setSending(false); }
  }

  return <section className="wishes-section content-section"><span className="eyebrow">04 / LOVE, FROM EVERYONE</span><h2>A little wall of <em>birthday love.</em></h2><p className="section-subtitle">A few kind words. A favorite memory. A wish for the year ahead.</p>
    <div className="wishes-layout"><form onSubmit={submit} className="wish-form"><h3>Leave a wish for Pavii <Heart size={17} /></h3><label htmlFor="wish-name">Your name</label><input id="wish-name" placeholder="The name she knows you by" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required /><label htmlFor="wish-message">Your birthday wish</label><textarea id="wish-message" placeholder="Dear Pavii, …" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={600} rows={5} required /><span className="character-count">{message.length} / 600</span><Button className="birthday-button" type="submit" disabled={sending}>{sending ? 'Sending your love…' : 'Send a little love'}{success ? <Check size={16} /> : <Send size={16} />}</Button>{status && <p className="form-status" role="status">{status}</p>}{!firebaseConfigured && !status && <p className="connection-note">Shared wishes will be available soon.</p>}</form>
    <div className="wish-wall"><div className="wall-heading"><span>Wishes for Pavii</span><span>{wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} <Heart size={13} /></span></div>{wishes.length ? wishes.map((wish) => <article className="wish-note" key={wish.id}><span className="wish-quote">“</span><p>{wish.message}</p><span className="wish-author">— {wish.name}<Heart size={13} /></span></article>) : <div className="empty-wishes"><Mail size={33} strokeWidth={1} /><h3>A little space for a lot of love.</h3><p>The first birthday wish could be yours.</p><span className="script-line">Let’s make her smile.</span></div>}</div></div>
  </section>;
}
