'use client';
import { useState } from 'react';
import Image from 'next/image';
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
  TrendingUp,
  ClipboardList,
  LockKeyhole,
  Moon,
  Utensils,
  Dumbbell,
  Weight,
  Pill,
  FlaskConical,
  Flag,
  Target,
  RefreshCw,
  FileText,
  Plus,
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
  health?: {
    weight: string;
    symptoms: string;
    medication: string;
    sleep: string;
    activity: string;
    meals: string;
  };
};
type JournalView = 'entries' | 'trends' | 'visit';
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
    [reminder, setReminder] = useState(false),
    [plan, setPlan] = useState<'basic' | 'vip'>('basic'),
    [journalView, setJournalView] = useState<JournalView>('entries'),
    [hospitalLinked, setHospitalLinked] = useState(false),
    [weightValue, setWeightValue] = useState('68.4'),
    [symptoms, setSymptoms] = useState(''),
    [medication, setMedication] = useState(''),
    [sleep, setSleep] = useState('7.0'),
    [activityMinutes, setActivityMinutes] = useState('32'),
    [meals, setMeals] = useState('Balanced'),
    [visitQuestions, setVisitQuestions] = useState([
      'Could my recent fatigue be related to my sleep pattern?',
      'Should I change how often I record symptoms?',
    ]);
  const isVip = plan === 'vip';
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
        health: {
          weight: weightValue,
          symptoms: symptoms || 'No new symptoms',
          medication: medication || 'No medication changes',
          sleep,
          activity: activityMinutes,
          meals,
        },
      },
      ...records,
    ]);
    setSaved(true);
    setCaptured(false);
    setPhoto('');
    setNote('');
    setSymptoms('');
    setMedication('');
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
  const selectPlan = (nextPlan: 'basic' | 'vip') => {
    setPlan(nextPlan);
    setModal('');
  };
  const updateQuestion = (index: number, value: string) => {
    setVisitQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? value : question,
      ),
    );
  };
  const weeklyCheckIns = [
    { day: 'Mon', date: 'Aug 31', recorded: true },
    { day: 'Tue', date: 'Sep 1', recorded: true },
    { day: 'Wed', date: 'Sep 2', recorded: false },
    { day: 'Thu', date: 'Sep 3', recorded: true },
    { day: 'Fri', date: 'Sep 4', recorded: true },
    { day: 'Sat', date: 'Sep 5', recorded: true },
    { day: 'Sun', date: 'Sep 6', recorded: false },
  ];
  const completedCheckIns = weeklyCheckIns.filter((item) => item.recorded).length;
  const trendsPanel = (
    <div className="feature-stack">
      <section className="trend-card">
        <div className="card-heading">
          <span>
            <small>WEEKLY RECORD COMPLETION</small>
            <strong>{completedCheckIns} of 7 daily check-ins completed</strong>
          </span>
          <TrendingUp size={21} />
        </div>
        <div className="completion-legend" aria-label="Chart legend">
          <span><i className="recorded" /> Saved check-in</span>
          <span><i /> No record</span>
        </div>
        <div className="completion-chart" aria-label={`${completedCheckIns} of 7 daily check-ins completed`}>
          {weeklyCheckIns.map((item) => (
            <div key={item.day} className={item.recorded ? 'recorded' : 'missed'}>
              <span className="completion-box" aria-label={`${item.day}: ${item.recorded ? 'check-in saved' : 'no record'}`}>
                {item.recorded ? <Check size={18} /> : <span>—</span>}
              </span>
              <strong>{item.day}</strong>
              <small>{item.date}</small>
            </div>
          ))}
        </div>
        <p>Each green box means one daily check-in was saved. Grey means no entry. This chart measures recording consistency, not health.</p>
      </section>

      {isVip && (
        <section className="monthly-card">
          <div>
            <small>LAST 30 DAYS</small>
            <strong>82%</strong>
            <span>check-in completion</span>
          </div>
          <div className="month-dots" aria-label="25 of 30 daily check-ins completed">
            {Array.from({ length: 30 }, (_, index) => (
              <i key={index} className={[3, 8, 16, 22, 27].includes(index) ? 'missed' : ''} />
            ))}
          </div>
          <p>25 saved check-ins · 5 days with no record</p>
        </section>
      )}

      <section className="integration-card">
        <div className="sectionhead compact">
          <div>
            <h2>{isVip ? 'Connected factor trends' : "Today’s factors"}</h2>
            <p className="factor-intro">
              {isVip
                ? 'Compare today with your recent records and spot useful patterns.'
                : 'Values entered in today’s check-in.'}
            </p>
          </div>
          <span className={isVip ? 'plan-badge vip' : 'plan-badge'}>
            {isVip ? 'VIP · 30 days' : 'Basic · Today'}
          </span>
        </div>
        <div className="factor-grid">
          {[
            [Moon, 'Sleep', `${sleep} hr`, isVip ? '30-day avg 6.8 hr' : 'Entered today', isVip ? '+0.2 hr' : 'Manual'],
            [Dumbbell, 'Activity', `${activityMinutes} min`, isVip ? '126 of 150 min weekly goal' : 'Entered today', isVip ? '84%' : 'Manual'],
            [Utensils, 'Meals', meals, isVip ? '5 of 7 balanced days' : 'Entered today', isVip ? 'This week' : 'Manual'],
          ].map(([Icon, label, value, detail, status]) => {
            const FactorIcon = Icon as typeof Moon;
            return (
              <div className="factor" key={String(label)}>
                <div className="factor-top">
                  <FactorIcon size={19} />
                  <em>{String(status)}</em>
                </div>
                <small>{String(label)} today</small>
                <strong>{String(value)}</strong>
                <span>{String(detail)}</span>
                {isVip && label === 'Activity' && (
                  <div className="mini-progress" aria-label="84% of weekly activity goal completed"><i /></div>
                )}
              </div>
            );
          })}
        </div>
        {isVip && (
          <div className="factor-insight">
            <span><TrendingUp size={19} /></span>
            <div>
              <small>PATTERN IN YOUR RECORDS</small>
              <strong>Fatigue appeared more often after nights with less than 6 hours of sleep.</strong>
              <p>Based on your last 30 days of check-ins. This is an observation, not a diagnosis.</p>
            </div>
          </div>
        )}
        {!isVip && (
          <button className="locked-feature" onClick={() => setModal('vip')}>
            <LockKeyhole size={18} />
            <span>
              <strong>Unlock 30-day comparisons</strong>
              <small>See averages, goals and relationships between your daily factors.</small>
            </span>
            <ChevronRight size={16} />
          </button>
        )}
      </section>

      <button
        className={isVip ? 'feature-row' : 'feature-row locked'}
        onClick={() => setModal(isVip ? 'reports' : 'vip')}
      >
        <span className="feature-icon"><FlaskConical size={21} /></span>
        <span>
          <strong>Compare test reports</strong>
          <small>{isVip ? '3 reports ready to compare' : 'VIP feature'}</small>
        </span>
        {isVip ? <ChevronRight size={17} /> : <LockKeyhole size={16} />}
      </button>

      <section className={isVip ? 'goal-card' : 'goal-card locked-goal'}>
        <div className="card-heading">
          <span>
            <small>CARE GOAL</small>
            <strong>Build a consistent morning record</strong>
          </span>
          {isVip ? <Target size={22} /> : <LockKeyhole size={18} />}
        </div>
        <div className="goal-progress"><span style={{ width: isVip ? '72%' : '28%' }} /></div>
        <p>
          {isVip
            ? 'Goal set with Dr. Chen · 8 of 11 planned check-ins completed.'
            : 'VIP can turn clinician goals into personalized daily support.'}
        </p>
      </section>
    </div>
  );
  const visitPrepPanel = (
    <div className="feature-stack">
      <section className="visit-card">
        <div className="visit-head">
          <span className="feature-icon"><ClipboardList size={22} /></span>
          <span>
            <small>SMART VISIT PREP</small>
            <strong>{isVip ? 'Personalized visit brief' : 'Basic visit summary'}</strong>
          </span>
          <span className={isVip ? 'plan-badge vip' : 'plan-badge'}>
            {isVip ? 'VIP' : 'Basic'}
          </span>
        </div>
        <div className="summary-grid">
          <div><small>Records</small><strong>{records.length}</strong></div>
          <div><small>Latest feeling</small><strong>{records[0]?.feeling ?? '—'}</strong></div>
          <div><small>Medication changes</small><strong>{medication || 'None noted'}</strong></div>
          <div><small>Next review</small><strong>Sep 18</strong></div>
        </div>
        {isVip && (
          <div className="personalized-note">
            <Sparkles size={17} />
            <span>
              Your fatigue notes appear most often after shorter sleep. Bring this pattern to your next visit.
            </span>
          </div>
        )}
      </section>

      <section className="question-card">
        <div className="sectionhead compact">
          <h2>Questions for your clinician</h2>
          {!isVip && <LockKeyhole size={16} />}
        </div>
        {visitQuestions.map((question, index) =>
          isVip ? (
            <label className="question-edit" key={index}>
              <span>{index + 1}</span>
              <input
                value={question}
                aria-label={`Visit question ${index + 1}`}
                onChange={(event) => updateQuestion(index, event.target.value)}
              />
            </label>
          ) : (
            <div className="question-readonly" key={index}>
              <span>{index + 1}</span>{question}
            </div>
          ),
        )}
        {isVip ? (
          <button
            className="add-question"
            onClick={() => setVisitQuestions((items) => [...items, ''])}
          >
            <Plus size={16} /> Add a question
          </button>
        ) : (
          <button className="locked-feature" onClick={() => setModal('vip')}>
            <LockKeyhole size={18} />
            <span>
              <strong>Edit your visit questions</strong>
              <small>Available with the personalized VIP visit brief.</small>
            </span>
            <ChevronRight size={16} />
          </button>
        )}
      </section>

      <section className="clinical-card">
        <div className="card-heading">
          <span>
            <small>HOSPITAL CARE PROJECT</small>
            <strong>Clinical summary & review flag</strong>
          </span>
          <Flag size={20} />
        </div>
        {hospitalLinked ? (
          <>
            <p>Shared with Dr. Chen · Latest record awaiting review.</p>
            <span className="review-flag"><Flag size={14} /> Review requested</span>
          </>
        ) : (
          <>
            <p>Available in both Basic and VIP when you join a hospital care project and consent to sharing.</p>
            <button className="secondary compact-button" onClick={() => setModal('hospital')}>
              Connect a hospital
            </button>
          </>
        )}
      </section>

      <button className="primary" onClick={() => setModal('visitSummary')}>
        <FileText size={18} /> Open visit summary
      </button>
    </div>
  );
  return (
    <main className="stage">
      <header className="brandbar">
        <div className="brand">
          <span className="logo">
            <Activity size={23} />
          </span>
          TongueCare <span className={isVip ? 'edition vip' : 'edition'}>{isVip ? 'VIP' : 'Basic'}</span>
        </div>
        <div className="plan-preview" aria-label="Preview membership plan">
          <button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button>
          <button className={isVip ? 'active vip' : ''} onClick={() => setPlan('vip')}><Crown size={13} /> VIP</button>
        </div>
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
              <div className="home-feature-grid">
                <button
                  className="home-feature"
                  onClick={() => {
                    setJournalView('trends');
                    setTab('archive');
                  }}
                >
                  <TrendingUp size={20} />
                  <span><strong>Trends</strong><small>{isVip ? '30-day insights' : '7-day preview'}</small></span>
                  <ChevronRight size={15} />
                </button>
                <button
                  className="home-feature"
                  onClick={() => {
                    setJournalView('visit');
                    setTab('archive');
                  }}
                >
                  <ClipboardList size={20} />
                  <span><strong>Visit prep</strong><small>{isVip ? 'Personalized brief' : 'Basic summary'}</small></span>
                  <ChevronRight size={15} />
                </button>
              </div>
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
                  <Image src={photo} alt="Tongue ready to save" width={390} height={263} unoptimized />
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
              {captured && (
                <output className="quality-check">
                  <span className="quality-icon"><CheckCircle2 size={20} /></span>
                  <span>
                    <strong>Image quality passed</strong>
                    <small>Tongue centered · Even light · Clear focus</small>
                  </span>
                  <button
                    aria-label="Retake photo"
                    onClick={() => {
                      setCaptured(false);
                      setPhoto('');
                    }}
                  >
                    <RefreshCw size={15} /> Retake
                  </button>
                </output>
              )}
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
                            if (typeof reader.result === 'string') setPhoto(reader.result);
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
                  <div className="sectionhead compact health-heading">
                    <h2>Health details</h2>
                    <span className="muted">Optional</span>
                  </div>
                  <div className="health-fields">
                    <label>
                      <span><Weight size={15} /> Weight (kg)</span>
                      <input value={weightValue} onChange={(e) => setWeightValue(e.target.value)} inputMode="decimal" />
                    </label>
                    <label>
                      <span><Moon size={15} /> Sleep (hr)</span>
                      <input value={sleep} onChange={(e) => setSleep(e.target.value)} inputMode="decimal" />
                    </label>
                    <label>
                      <span><Dumbbell size={15} /> Activity (min)</span>
                      <input value={activityMinutes} onChange={(e) => setActivityMinutes(e.target.value)} inputMode="numeric" />
                    </label>
                    <label>
                      <span><Utensils size={15} /> Meals</span>
                      <select value={meals} onChange={(e) => setMeals(e.target.value)}>
                        <option>Balanced</option>
                        <option>Light</option>
                        <option>Irregular</option>
                      </select>
                    </label>
                  </div>
                  <label className="fieldlabel" htmlFor="symptoms">
                    Symptoms or changes
                  </label>
                  <input
                    id="symptoms"
                    className="text-input"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. mild fatigue"
                  />
                  <label className="fieldlabel" htmlFor="medication">
                    <Pill size={15} style={{ display: 'inline', marginRight: 6 }} />
                    Medication or test update
                  </label>
                  <input
                    id="medication"
                    className="text-input"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    placeholder="e.g. no changes"
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
              <h1 className="page-title">
                {journalView === 'entries'
                  ? 'Health journal'
                  : journalView === 'trends'
                    ? 'Health trends'
                    : 'Visit preparation'}
              </h1>
              <p className="subtitle">
                {journalView === 'entries'
                  ? 'Record today. Understand changes over time.'
                  : journalView === 'trends'
                    ? 'See your records alongside everyday factors.'
                    : 'Bring a clear, useful summary to your next visit.'}
              </p>
              <div className="journal-switch" aria-label="Journal sections">
                {[
                  ['entries', FolderHeart, 'Entries'],
                  ['trends', TrendingUp, 'Trends'],
                  ['visit', ClipboardList, 'Visit prep'],
                ].map(([value, Icon, label]) => {
                  const SwitchIcon = Icon as typeof FolderHeart;
                  return (
                    <button
                      key={String(value)}
                      className={journalView === value ? 'active' : ''}
                      onClick={() => setJournalView(value as JournalView)}
                    >
                      <SwitchIcon size={16} />{String(label)}
                    </button>
                  );
                })}
              </div>
              {journalView === 'entries' ? (
                <>
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
                  {!isVip && (
                    <button className="upsell" onClick={() => setModal('vip')}>
                      <Crown size={23} />
                      <span style={{ flex: 1 }}>
                        See more of your health story
                        <br />
                        <strong>Explore VIP trends and visit prep</strong>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                  <p className="footnote">Demo entries only. No medical diagnosis.</p>
                </>
              ) : journalView === 'trends' ? trendsPanel : visitPrepPanel}
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
                  <span className={isVip ? 'pill vip-pill' : 'pill'}>
                    {isVip ? 'VIP · Demo access' : 'Basic · Free plan'}
                  </span>
                </div>
              </div>
              <div className="profile-plan-switch">
                <span>
                  <strong>Preview membership</strong>
                  <small>Switch plans to explore this UI prototype.</small>
                </span>
                <div>
                  <button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button>
                  <button className={isVip ? 'active vip' : ''} onClick={() => setPlan('vip')}>VIP</button>
                </div>
              </div>
              {!isVip && (
                <button className="upsell" onClick={() => setModal('vip')}>
                  <Crown size={26} />
                  <span style={{ flex: 1 }}>
                    <strong style={{ fontSize: 16 }}>More from your journal</strong>
                    <br />Long-term trends · Personalized visit prep
                  </span>
                  <ChevronRight size={17} />
                </button>
              )}
              {isVip && (
                <div className="vip-status-card">
                  <Crown size={22} />
                  <span><strong>VIP features are open</strong><small>Full trends, connected factors and personalized visit prep</small></span>
                </div>
              )}
              <div className="menu">
                <button className="menu-row" onClick={() => setTab('archive')}>
                  <FolderHeart size={19} />
                  <span>My health journal & trends</span>
                  <ChevronRight size={16} />
                </button>
                <button
                  className="menu-row"
                  onClick={() => {
                    setJournalView('visit');
                    setTab('archive');
                  }}
                >
                  <ClipboardList size={19} />
                  <span>Smart Visit Prep</span>
                  <small className="muted">{isVip ? 'Personalized' : 'Basic'}</small>
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
                  reports: 'Test report comparison',
                  visitSummary: 'Smart Visit Prep summary',
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
                  <Image
                    src={selected.image}
                    alt="Tongue entry"
                    width={340}
                    height={230}
                    unoptimized
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
                {selected.health && (
                  <div className="entry-health-grid">
                    <span><small>Weight</small><strong>{selected.health.weight} kg</strong></span>
                    <span><small>Sleep</small><strong>{selected.health.sleep} hr</strong></span>
                    <span><small>Activity</small><strong>{selected.health.activity} min</strong></span>
                    <span><small>Meals</small><strong>{selected.health.meals}</strong></span>
                    <span className="wide"><small>Symptoms</small><strong>{selected.health.symptoms}</strong></span>
                    <span className="wide"><small>Medication / tests</small><strong>{selected.health.medication}</strong></span>
                  </div>
                )}
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
            <output className="ai-loading">
              <span className="ai-orb">
                <LoaderCircle size={34} />
              </span>
              <strong>Reviewing your photo and check-in…</strong>
              <p>
                This simulated step shows how AI guidance could appear in the
                final product.
              </p>
            </output>
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
          ) : modal === 'reports' ? (
            <div className="modal-copy">
              <p>VIP compares multiple test reports alongside your health records.</p>
              <div className="report-comparison">
                <div><small>JUN 12</small><strong>Routine blood test</strong><span>Baseline</span></div>
                <div><small>AUG 08</small><strong>Routine blood test</strong><span className="steady">Stable</span></div>
                <div><small>SEP 03</small><strong>Follow-up panel</strong><span className="review">Review</span></div>
              </div>
              <div className="detail-box">
                <strong>Trend note</strong><br />Most tracked values remain stable. One recent item is marked for discussion at your next visit.
              </div>
              <p className="ai-disclaimer">Demo data only. Test results require clinician interpretation.</p>
            </div>
          ) : modal === 'visitSummary' ? (
            <div className="modal-copy">
              <div className="visit-summary-sheet">
                <span className="eyebrow">VISIT BRIEF · SEP 2026</span>
                <h3>Alex’s check-in summary</h3>
                <p><strong>{records.length} records</strong> · Latest feeling: {records[0]?.feeling}</p>
                <hr />
                <strong>What to discuss</strong>
                <ul>
                  {visitQuestions.filter(Boolean).map((question) => <li key={question}>{question}</li>)}
                </ul>
                {isVip && <p><strong>Personalized pattern:</strong> Fatigue notes appear more often after shorter sleep.</p>}
                {hospitalLinked && <span className="review-flag"><Flag size={14} /> Clinician review requested</span>}
              </div>
              <p>{isVip ? 'This personalized VIP version brings trends, daily factors and your questions together.' : 'Basic includes a concise summary. VIP adds editable questions and personalized trend context.'}</p>
            </div>
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
                    Basic includes guided capture, image-quality checks, daily health records, reminders and a basic visit summary.
                  </p>
                  <div className="vip-benefit-list">
                    {[
                      'Longer, more detailed longitudinal trends',
                      'Sleep, activity and nutrition data integration',
                      'Personalized support around clinician goals',
                      'Comparison across multiple test reports',
                      'Personalized Smart Visit Prep with editable questions',
                    ].map((benefit) => (
                      <span key={benefit}><CheckCircle2 size={17} />{benefit}</span>
                    ))}
                  </div>
                  <p>
                    This prototype does not make a real purchase or charge.
                  </p>
                  <button className="primary vip-primary" onClick={() => selectPlan('vip')}>
                    <Crown size={18} /> Preview VIP features
                  </button>
                </>
              ) : modal === 'hospital' ? (
                <>
                  <p>
                    Use an invitation code from your hospital to connect to a
                    care plan.
                  </p>
                  <div className="detail-box">
                    Enjoy full access during your care plan. With your consent,
                    your linked clinician can view the clinical summary and review flags.
                  </div>
                  <p>This prototype uses a simulated hospital connection.</p>
                  <button
                    className="primary"
                    onClick={() => {
                      setHospitalLinked(true);
                      setModal('');
                      setJournalView('visit');
                      setTab('archive');
                    }}
                  >
                    <Building2 size={18} /> Connect demo care plan
                  </button>
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
