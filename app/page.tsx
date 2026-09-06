'use client';
import { useState } from 'react';
import {
  Activity,
  Home,
  Camera,
  FolderHeart,
  UserRound,
  Bell,
  ChevronRight,
  ArrowRight,
  Check,
  CheckCircle2,
  ImagePlus,
  ScanLine,
  BookOpen,
  Crown,
  Building2,
  ShieldCheck,
  CircleHelp,
  Wifi,
  BatteryFull,
  Signal,
  CalendarDays,
  FileImage,
  Sparkles,
  Stethoscope,
  LoaderCircle,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
type Entry = {
  id: number;
  date: string;
  time: string;
  feeling: string;
  note: string;
  image?: string;
  advice?: string[];
};
const initial: Entry[] = [
  {
    id: 1,
    date: 'Sep 4',
    time: '08:32',
    feeling: 'Feeling good',
    note: 'Logged this morning after waking up.',
  },
  {
    id: 2,
    date: 'Sep 3',
    time: '08:46',
    feeling: 'A little tired',
    note: 'Went to bed late last night.',
  },
  {
    id: 3,
    date: 'Sep 2',
    time: '09:15',
    feeling: 'Feeling good',
    note: 'Daily check-in.',
  },
];
export default function Page() {
  const [tab, setTab] = useState('home'),
    [modal, setModal] = useState(''),
    [records, setRecords] = useState(initial),
    [selected, setSelected] = useState<Entry | null>(null),
    [captured, setCaptured] = useState(false),
    [photo, setPhoto] = useState(''),
    [feeling, setFeeling] = useState('Feeling good'),
    [note, setNote] = useState(''),
    [saved, setSaved] = useState(false),
    [reminder, setReminder] = useState(false);
  const advice =
    feeling === 'A little tired'
      ? [
          'Prioritize rest and keep a regular sleep schedule tonight.',
          'Drink water regularly and choose balanced, easy-to-digest meals.',
          'Keep tracking how you feel; seek professional care if fatigue persists or worsens.',
        ]
      : feeling === 'Feeling unwell'
        ? [
            'Rest, stay hydrated, and avoid strenuous activity for now.',
            'Monitor your symptoms and add specific changes to your next check-in.',
            'Contact a healthcare professional promptly if symptoms are severe, unusual, or getting worse.',
          ]
        : [
            'Keep your usual hydration and balanced meal routine.',
            'Continue daily check-ins at a similar time and under similar lighting.',
            'Pay attention to meaningful changes in how you feel over the next few days.',
          ];
  const openRecord = (r: Entry) => {
    setSelected(r);
    setModal('record');
  };
  const save = () => {
    setRecords([
      {
        id: Date.now(),
        date: 'Sep 5',
        time: new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        feeling,
        note: note || 'No notes added',
        image: photo,
        advice,
      },
      ...records,
    ]);
    setSaved(true);
    setCaptured(false);
    setPhoto('');
    setNote('');
    setModal('success');
  };
  const requestAdvice = () => {
    setModal('analyzing');
    window.setTimeout(() => setModal('ai'), 1100);
  };
  const row = (r: Entry) => (
    <button className="record" key={r.id} onClick={() => openRecord(r)}>
      <span className="record-icon">
        <FileImage size={23} />
      </span>
      <span className="record-body">
        <strong>
          {r.date}{' '}
          <span className="pill">
            {r.advice ? 'AI guidance' : r.id < 4 ? 'Sample' : 'New entry'}
          </span>
        </strong>
        <small>
          {r.time} · {r.feeling}
        </small>
      </span>
      <ChevronRight size={17} />
    </button>
  );
  return (
    <main className="stage">
      <header className="brandbar">
        <div className="brand">
          <span className="logo">
            <Activity size={23} />
          </span>
          TongueCare <span className="edition">Basic</span>
        </div>
        <span className="stage-label">DAILY HEALTH JOURNAL</span>
      </header>
      <div className="phone">
        <div className="status">
          <span>9:41</span>
          <span className="status-icons">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={19} />
          </span>
        </div>
        <Tabs
          className="nav-wrap"
          value={tab}
          onValueChange={(v) => setTab(String(v))}
        >
          <div className="content">
            <TabsContent value="home" className="page-panel">
              <div className="topline">
                <span className="eyebrow">SATURDAY, SEP 5</span>
                <button
                  className="iconbutton"
                  aria-label="Notifications"
                  onClick={() => setModal('notifications')}
                >
                  <Bell size={18} />
                </button>
              </div>
              <h1>
                Good morning, Alex <span style={{ fontSize: 22 }}>☀</span>
              </h1>
              <p className="muted welcome">
                A minute for you. A record of today.
              </p>
              <section className="hero">
                <div className="hero-head">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#c3eac6',
                    }}
                  />
                  {saved
                    ? 'Today’s check-in complete'
                    : 'Ready for today’s check-in'}
                </div>
                <h2>
                  {saved
                    ? 'Every check-in counts'
                    : 'A small step for your health'}
                </h2>
                <p>
                  {saved
                    ? 'Your entry is now in your journal'
                    : 'Capture your tongue. Keep track of your day.'}
                </p>
                <button
                  className="primary"
                  onClick={() => setTab(saved ? 'archive' : 'capture')}
                >
                  <Camera size={18} />
                  {saved ? 'View today’s entry' : 'Start today’s check-in'}
                  <ArrowRight size={17} style={{ marginLeft: 'auto' }} />
                </button>
              </section>
              <div className="week">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                  (d, i) => (
                    <div
                      key={d}
                      className={
                        'day ' +
                        (i >= 2 && i <= 4 ? 'done ' : '') +
                        (i === 5 ? 'today' : '')
                      }
                    >
                      <small>{d}</small>
                      <span>
                        {(i >= 2 && i <= 4) || (i === 5 && saved) ? (
                          <Check size={14} />
                        ) : i + 31 > 31 ? (
                          i
                        ) : (
                          i + 31
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="sectionhead">
                <h2>Latest entry</h2>
                <button
                  className="textbutton"
                  onClick={() => setTab('archive')}
                >
                  All entries
                  <ChevronRight size={14} />
                </button>
              </div>
              {row(records[0])}
              <div className="sectionhead">
                <h2>Quick tips</h2>
                <span className="eyebrow" style={{ fontSize: 10 }}>
                  LITTLE THINGS MATTER
                </span>
              </div>
              <button className="learn" onClick={() => setModal('guide')}>
                <span className="learn-icon">
                  <BookOpen size={28} strokeWidth={1.4} />
                </span>
                <span>
                  <strong>3 tips for a clearer photo</strong>
                  <small>Make every photo count · 1 min read</small>
                </span>
                <ChevronRight size={16} />
              </button>
              <p className="footnote">Small moments of care, day after day.</p>
            </TabsContent>
            <TabsContent value="capture" className="page-panel">
              <span className="eyebrow">CAPTURE YOUR DAY</span>
              <h1 className="page-title">Your daily check-in</h1>
              <p className="subtitle">
                One photo. Your own daily health journal.
              </p>
              <div className="steps">
                <span>
                  <b>1</b>Photo
                </span>
                <span>
                  <b>2</b>Check in
                </span>
                <span>
                  <b>3</b>AI advice
                </span>
              </div>
              <div className={'capture-area ' + (captured ? 'ready' : '')}>
                {photo ? (
                  <img src={photo} alt="Tongue photo ready to save" />
                ) : captured ? (
                  <>
                    <CheckCircle2 size={52} strokeWidth={1.3} />
                    <strong>Demo photo captured</strong>
                    <p>Add how you are feeling today</p>
                  </>
                ) : (
                  <>
                    <ScanLine size={66} strokeWidth={1} />
                    <strong>Center your tongue in the frame</strong>
                    <p>Even light · Level camera · Clear photo</p>
                  </>
                )}
              </div>
              {!captured ? (
                <>
                  <button className="primary" onClick={() => setCaptured(true)}>
                    <Camera size={18} />
                    Try a demo capture
                  </button>
                  <label className="secondary" style={{ cursor: 'pointer' }}>
                    <ImagePlus size={17} />
                    Choose a photo
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            setModal('large');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setPhoto(String(reader.result));
                            setCaptured(true);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span className="demo-label">
                    <ShieldCheck size={13} />
                    Demo: photos stay in this browser session
                  </span>
                  <button
                    className="textbutton"
                    style={{ margin: '22px auto' }}
                    onClick={() => setModal('guide')}
                  >
                    View photo guide
                    <ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="textbutton"
                    onClick={() => {
                      setCaptured(false);
                      setPhoto('');
                    }}
                  >
                    Choose another photo
                  </button>
                  <span className="fieldlabel">How are you feeling today?</span>
                  <div className="feelings">
                    {['Feeling good', 'A little tired', 'Feeling unwell'].map(
                      (f) => (
                        <button
                          key={f}
                          aria-pressed={f === feeling}
                          className={f === feeling ? 'selected' : ''}
                          onClick={() => setFeeling(f)}
                        >
                          {f}
                        </button>
                      ),
                    )}
                  </div>
                  <label className="fieldlabel" htmlFor="note">
                    Add a note <span className="muted">(optional)</span>
                  </label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Sleep, meals, or anything you want to note…"
                  />
                  <button
                    className="primary"
                    style={{ marginTop: 16 }}
                    onClick={requestAdvice}
                  >
                    Get AI Doctor advice
                    <Sparkles size={18} />
                  </button>
                  <span className="demo-label">
                    <ShieldCheck size={13} />
                    Simulated wellness guidance for this UI demo
                  </span>
                </>
              )}
            </TabsContent>
            <TabsContent value="archive" className="page-panel">
              <span className="eyebrow">YOUR HEALTH JOURNAL</span>
              <h1 className="page-title">Health journal</h1>
              <p className="subtitle">Get to know your everyday patterns.</p>
              <div className="archive-info">
                <div>
                  <strong>{records.length}</strong>
                  <span> entries</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <CalendarDays size={22} style={{ margin: '0 0 5px auto' }} />
                  <span>September 2026</span>
                </div>
              </div>
              <div className="sectionhead">
                <h2>All entries</h2>
                <span className="muted">Most recent first</span>
              </div>
              <div className="record-list">{records.map(row)}</div>
              <button className="upsell" onClick={() => setModal('vip')}>
                <Crown size={23} />
                <span style={{ flex: 1 }}>
                  Curious about changes over time?
                  <br />
                  <strong>Explore VIP comparisons</strong>
                </span>
                <ChevronRight size={16} />
              </button>
              <p className="footnote">
                Demo entries only. No medical diagnosis.
              </p>
            </TabsContent>
            <TabsContent value="profile" className="page-panel">
              <span className="eyebrow">A LITTLE CARE, EVERY DAY</span>
              <h1 className="page-title">Profile</h1>
              <div className="profile">
                <span className="avatar">
                  <UserRound size={29} />
                </span>
                <div>
                  <h2>Alex</h2>
                  <span className="pill">Basic · Free plan</span>
                </div>
              </div>
              <button className="upsell" onClick={() => setModal('vip')}>
                <Crown size={26} />
                <span style={{ flex: 1 }}>
                  <strong style={{ fontSize: 16 }}>
                    More from your journal
                  </strong>
                  <br />
                  Explore all VIP benefits
                </span>
                <ChevronRight size={17} />
              </button>
              <div className="menu">
                <button className="menu-row" onClick={() => setTab('archive')}>
                  <FolderHeart size={19} />
                  <span>My health journal</span>
                  <ChevronRight size={16} />
                </button>
                <button
                  className="menu-row"
                  onClick={() => setModal('hospital')}
                >
                  <Building2 size={19} />
                  <span>Connect a hospital</span>
                  <small className="muted">Not linked</small>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="menu">
                <div className="menu-row">
                  <Bell size={19} />
                  <label htmlFor="remind" style={{ flex: 1 }}>
                    Check-in reminders{' '}
                    <small
                      style={{
                        display: 'block',
                        color: '#85958c',
                        fontSize: 11,
                      }}
                    >
                      Demo only; no notifications sent
                    </small>
                  </label>
                  <Switch
                    id="remind"
                    checked={reminder}
                    onCheckedChange={setReminder}
                  />
                </div>
                <button
                  className="menu-row"
                  onClick={() => setModal('privacy')}
                >
                  <ShieldCheck size={19} />
                  <span>Privacy & data</span>
                  <ChevronRight size={16} />
                </button>
                <button className="menu-row" onClick={() => setModal('help')}>
                  <CircleHelp size={19} />
                  <span>Help & feedback</span>
                  <ChevronRight size={16} />
                </button>
              </div>
              <p className="footnote">
                TongueCare · A little care, every day
                <br />
                Basic UI demo · v1.0
              </p>
            </TabsContent>
          </div>
          <TabsList className="bottomnav" aria-label="Main navigation">
            {[
              ['home', Home, 'Home'],
              ['capture', Camera, 'Capture'],
              ['archive', FolderHeart, 'Journal'],
              ['profile', UserRound, 'Profile'],
            ].map(([value, Icon, label]) => {
              const I = Icon as typeof Home;
              return (
                <TabsTrigger key={String(value)} value={String(value)}>
                  <I />
                  <span>{String(label)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
      <footer className="stage-footer">
        TongueCare / Basic prototype / Demo data
      </footer>
      <Dialog
        open={!!modal}
        onOpenChange={(o) => {
          if (!o) setModal('');
        }}
      >
        <DialogContent
          className="dialog-inner"
          showCloseButton={modal !== 'analyzing'}
        >
          <DialogTitle>
            {
              (
                {
                  record: 'Entry details',
                  success: 'Entry saved',
                  guide: '3 tips before you capture',
                  vip: 'VIP benefits',
                  hospital: 'Hospital care benefits',
                  privacy: 'Privacy & data',
                  help: 'Help',
                  notifications: 'Notifications',
                  large: 'Photo too large',
                  analyzing: 'AI Doctor is reviewing your check-in',
                  ai: 'Your AI Doctor guidance',
                } as Record<string, string>
              )[modal]
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            TongueCare feature information and entry details
          </DialogDescription>
          {modal === 'record' && selected ? (
            <>
              <div className="detail-box">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt="Photo for this entry"
                    style={{
                      maxHeight: 230,
                      width: '100%',
                      objectFit: 'contain',
                      borderRadius: 12,
                      marginBottom: 12,
                    }}
                  />
                ) : (
                  <FileImage
                    size={40}
                    style={{ margin: '10px auto 20px', color: '#73a084' }}
                  />
                )}
                <strong>
                  {selected.date} · {selected.time}
                </strong>
                <p>Feeling: {selected.feeling}</p>
                <p>Note: {selected.note}</p>
                {selected.advice && (
                  <div className="ai-entry-summary">
                    <strong>AI Doctor guidance</strong>
                    <ul>
                      {selected.advice.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <small className="muted">
                  {selected.id < 4 ? 'Sample entry' : 'Demo entry'} · Only
                  visible to you
                </small>
              </div>
            </>
          ) : modal === 'analyzing' ? (
            <div className="ai-loading" role="status">
              <span className="ai-orb">
                <LoaderCircle size={34} />
              </span>
              <strong>Reviewing your photo and check-in…</strong>
              <p>
                This simulated step shows how AI guidance could appear in the
                final product.
              </p>
            </div>
          ) : modal === 'ai' ? (
            <>
              <div className="ai-card">
                <div className="ai-card-head">
                  <span className="ai-doctor-icon">
                    <Stethoscope size={22} />
                  </span>
                  <span>
                    <strong>AI Doctor</strong>
                    <small>Wellness guidance · Generated just now</small>
                  </span>
                  <span className="ai-badge">AI</span>
                </div>
                <div className="ai-observation">
                  <span>CHECK-IN SUMMARY</span>
                  <strong>{feeling}</strong>
                  <p>
                    Your photo was received successfully. The suggestions below
                    reflect the feeling you selected; your note stays with this
                    entry.
                  </p>
                </div>
                <ul className="ai-list">
                  {advice.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={17} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="ai-disclaimer">
                Demo guidance only. It cannot diagnose disease or replace a
                qualified healthcare professional.
              </p>
              <button className="primary" onClick={save}>
                Save guidance to journal
                <Check size={18} />
              </button>
            </>
          ) : modal === 'success' ? (
            <>
              <div className="success-mark">
                <CheckCircle2 size={38} />
              </div>
              <p className="modal-copy" style={{ textAlign: 'center' }}>
                Your entry and AI guidance are now in your journal.
                <br />
                Demo entries reset when you refresh.
              </p>
              <button
                className="primary"
                onClick={() => {
                  setTab('archive');
                  setModal('');
                }}
              >
                View journal
              </button>
            </>
          ) : (
            <div className="modal-copy">
              {modal === 'guide' ? (
                <>
                  <p>
                    <strong>01 · Find even lighting</strong>
                    <br />
                    Choose a bright spot and avoid shadows across the photo.
                  </p>
                  <p>
                    <strong>02 · Keep the camera level</strong>
                    <br />
                    Center your tongue and use a similar angle each time.
                  </p>
                  <p>
                    <strong>03 · Check before saving</strong>
                    <br />
                    Retake blurry photos and add how you feel today.
                  </p>
                </>
              ) : modal === 'vip' ? (
                <>
                  <p>
                    Basic includes daily photos, check-ins, and your entry
                    history.
                  </p>
                  <div className="detail-box">
                    VIP unlocks
                    <br />· Side-by-side entry comparisons
                    <br />· Trends over time
                    <br />· Full reports and exports
                  </div>
                  <p>
                    Membership features are planned for the VIP version. No
                    purchases or charges are made here.
                  </p>
                </>
              ) : modal === 'hospital' ? (
                <>
                  <p>
                    Use an invitation code from your hospital to connect to a
                    care plan.
                  </p>
                  <div className="detail-box">
                    Enjoy full access during your care plan. With your consent,
                    your linked doctor can view shared entries.
                  </div>
                  <p>Hospital linking is planned for the care plan version.</p>
                </>
              ) : modal === 'privacy' ? (
                <p>
                  This is a UI demo. Selected photos are previewed in this page
                  only. They are not uploaded or shared with doctors. Entries
                  reset when you refresh.
                </p>
              ) : modal === 'notifications' ? (
                <p>
                  You are all caught up.
                  <br />
                  Your daily entries are available in your journal.
                </p>
              ) : modal === 'large' ? (
                <p>Choose an image smaller than 10 MB and try again.</p>
              ) : (
                <>
                  <p>
                    Open Capture to try the demo or select a photo. Add how you
                    feel, save your entry, and find it in Journal.
                  </p>
                  <p>
                    This version demonstrates the interface and user flow. It
                    does not provide a medical diagnosis.
                  </p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
