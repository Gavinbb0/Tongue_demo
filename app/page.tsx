'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Activity, BarChart3, BatteryFull, Bell, Building2, CalendarDays, Camera,
  Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Crown,
  FileHeart, FileImage, FlaskConical, FolderHeart, Home, ImagePlus, Info,
  LockKeyhole, Moon, Pill, ScanFace, ShieldCheck, Signal, Sparkles,
  TrendingUp, UserRound, Utensils, Weight, Wifi,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type WindowName = 'capture' | 'metrics' | 'daily' | null;
type ReportName = 'record' | 'single' | 'monthly' | 'visit' | 'hospital' | 'privacy' | 'help' | null;
type HealthEntry = { id: number; date: string; kind: 'Tongue' | 'Metrics' | 'Daily'; title: string; detail: string };

const starterEntries: HealthEntry[] = [
  { id: 1, date: 'Sep 9 · 08:28', kind: 'Tongue', title: 'Morning tongue record', detail: 'Image quality passed · Basic analysis ready' },
  { id: 2, date: 'Sep 8 · 20:10', kind: 'Daily', title: 'Daily health record', detail: 'Sleep 6.5 hr · Activity 32 min · No medication change' },
  { id: 3, date: 'Sep 6 · 09:02', kind: 'Metrics', title: 'Laboratory indicators', detail: 'ALT, AST, GGT and TG updated' },
];

const tongueFeatures = [
  ['Tongue color', 'Light red', 'Within your recent range'],
  ['Coating', 'Thin white', 'Slightly lighter than last month'],
  ['Body shape', 'Regular', 'No clear longitudinal change'],
  ['Moisture', 'Moderate', 'Stable across recent records'],
  ['Cracks & marks', 'Minor tooth marks', 'Continue consistent capture'],
];

export default function Page() {
  const [tab, setTab] = useState('home');
  const [windowName, setWindowName] = useState<WindowName>(null);
  const [reportName, setReportName] = useState<ReportName>(null);
  const [plan, setPlan] = useState<'basic' | 'vip'>('basic');
  const [reminder, setReminder] = useState(true);
  const [hospitalLinked, setHospitalLinked] = useState(false);
  const [photo, setPhoto] = useState('');
  const [entries, setEntries] = useState(starterEntries);
  const [selectedEntry, setSelectedEntry] = useState<HealthEntry | null>(null);
  const [done, setDone] = useState({ capture: false, metrics: false, daily: false });
  const [metrics, setMetrics] = useState({ bmi: '23.7', alt: '38', ast: '29', ggt: '42', tg: '1.6' });
  const [daily, setDaily] = useState({ sleep: '7.0', activity: '35', meals: 'Balanced', medication: 'Taken as planned', alcohol: 'None', symptoms: 'No new symptoms' });
  const isVip = plan === 'vip';
  const completed = Object.values(done).filter(Boolean).length;
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', weekday: 'long' }).format(new Date(2026, 8, 10)), []);

  const addEntry = (kind: HealthEntry['kind'], title: string, detail: string) => setEntries((current) => [
    { id: Date.now(), date: 'Sep 10 · Just now', kind, title, detail }, ...current,
  ]);

  const loadPhoto = (file?: File) => {
    if (!file || file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  };

  const saveCapture = () => {
    setDone((state) => ({ ...state, capture: true }));
    addEntry('Tongue', 'Today’s tongue record', 'Image quality passed · Analysis report ready');
    setWindowName(null);
    setReportName('single');
  };
  const saveMetrics = () => {
    setDone((state) => ({ ...state, metrics: true }));
    addEntry('Metrics', 'Health indicators updated', `BMI ${metrics.bmi} · ALT ${metrics.alt} · AST ${metrics.ast}`);
    setWindowName(null);
  };
  const saveDaily = () => {
    setDone((state) => ({ ...state, daily: true }));
    addEntry('Daily', 'Today’s health record', `Sleep ${daily.sleep} hr · Activity ${daily.activity} min · ${daily.meals}`);
    setWindowName(null);
  };

  const taskRows = [
    { value: 'capture', icon: Camera, title: 'Tongue capture', note: done.capture ? 'Completed today · Report ready' : '2 min · Best before breakfast', action: 'Start capture', open: () => setWindowName('capture' as const), complete: done.capture },
    { value: 'metrics', icon: FlaskConical, title: 'Health indicators', note: done.metrics ? 'Updated today' : 'BMI and 4 laboratory values due', action: 'Enter indicators', open: () => setWindowName('metrics' as const), complete: done.metrics },
    { value: 'daily', icon: ClipboardCheck, title: 'Daily health record', note: done.daily ? 'Completed today' : 'Sleep, activity, meals and medication', action: 'Add daily record', open: () => setWindowName('daily' as const), complete: done.daily },
  ];

  return (
    <main className="stage">
      <header className="brandbar">
        <div className="brand"><span className="logo"><Activity size={22} /></span><span>TongueCare</span><span className={isVip ? 'edition vip' : 'edition'}>{isVip ? 'VIP' : 'Basic'}</span></div>
        <div className="plan-preview" aria-label="Preview membership"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button><button className={isVip ? 'active vip' : ''} onClick={() => setPlan('vip')}><Crown size={13} /> VIP</button></div>
      </header>

      <div className="phone">
        <div className="statusbar"><span>9:41</span><span><Signal size={14} /><Wifi size={14} /><BatteryFull size={19} /></span></div>
        <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="app-shell">
          <div className="screen">
            <TabsContent value="home" className="page">
              <div className="page-top"><div><span className="eyebrow">{todayLabel}</span><h1>Good morning, Alex</h1></div><button className="icon-button" aria-label="Notifications"><Bell size={19} /></button></div>
              <section className="day-overview">
                <div><span className="eyebrow">TODAY</span><strong>{completed} of 3 tasks</strong><p>{completed === 3 ? 'Everything is complete.' : 'A few small steps keep your health record current.'}</p></div>
                <div className="progress-ring" style={{ '--progress': `${(completed / 3) * 360}deg` } as React.CSSProperties}><span>{completed}/3</span></div>
              </section>
              <div className="section-heading"><h2>Today’s tasks</h2><span>Tap to expand</span></div>
              <div className="task-list">
                {taskRows.map((task) => {
                  const Icon = task.icon;
                  return (
                    <details key={task.value} className={task.complete ? 'task-item complete' : 'task-item'}>
                      <summary className="task-trigger"><span className="task-icon">{task.complete ? <Check size={18} /> : <Icon size={19} />}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.note}</small></span><ChevronRight className="task-chevron" size={17} /></summary>
                      <div className="task-content"><p>{task.value === 'capture' ? 'We will guide distance, mouth position, lighting and focus in a separate capture window.' : task.value === 'metrics' ? 'Only the indicators due today appear in the entry window.' : 'Your lifestyle details stay together in one quick form.'}</p><button className="primary compact" onClick={task.open}>{task.complete ? 'Update again' : task.action}<ChevronRight size={17} /></button></div>
                    </details>
                  );
                })}
              </div>
              <button className="latest-report" onClick={() => setReportName('single')}><span className="report-symbol"><FileHeart size={21} /></span><span><small>LATEST REPORT · SEP 9</small><strong>Tongue analysis is ready</strong><em>Coating remained within your recent range</em></span><ChevronRight size={18} /></button>
              <button className="month-preview" onClick={() => setReportName(isVip ? 'monthly' : 'visit')}><div><span className="eyebrow">30-DAY VIEW</span><strong>Health trend</strong><p>{isVip ? 'Tongue and metabolic indicators in one monthly view.' : 'Preview the monthly report available with VIP.'}</p></div><TrendingUp size={25} /></button>
            </TabsContent>

            <TabsContent value="records" className="page">
              <div className="page-top"><div><span className="eyebrow">YOUR HISTORY</span><h1>Health records</h1></div><CalendarDays size={22} /></div>
              <div className="record-summary"><span><strong>{entries.length}</strong><small>records</small></span><span><strong>12</strong><small>tongue images</small></span><span><strong>5</strong><small>health indicators</small></span></div>
              <div className="section-heading"><h2>Recent activity</h2><span>Newest first</span></div>
              <div className="timeline">{entries.map((entry) => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setReportName(entry.kind === 'Tongue' ? 'single' : 'record'); }}><span className={`timeline-icon ${entry.kind.toLowerCase()}`}>{entry.kind === 'Tongue' ? <FileImage size={19} /> : entry.kind === 'Metrics' ? <FlaskConical size={19} /> : <ClipboardCheck size={19} />}</span><span><small>{entry.date}</small><strong>{entry.title}</strong><em>{entry.detail}</em></span><ChevronRight size={16} /></button>)}</div>
              <p className="disclaimer">Demo records remain on this page only and reset when refreshed.</p>
            </TabsContent>

            <TabsContent value="reports" className="page">
              <div className="page-top"><div><span className="eyebrow">ANALYSIS</span><h1>Your reports</h1></div><BarChart3 size={23} /></div>
              <button className="report-card featured" onClick={() => setReportName('single')}><div className="report-card-top"><span className="report-symbol"><ScanFace size={21} /></span><span className="report-tag">LATEST</span></div><strong>Single tongue analysis</strong><p>Sep 9 · Quality passed · 5 visible features summarized</p><div className="report-foot"><span>Open report</span><ChevronRight size={17} /></div></button>
              <button className={isVip ? 'report-card' : 'report-card locked'} onClick={() => setReportName(isVip ? 'monthly' : 'visit')}><div className="report-card-top"><span className="report-symbol"><TrendingUp size={21} /></span>{!isVip && <LockKeyhole size={17} />}</div><strong>September health trend</strong><p>Longitudinal tongue features, metabolic indicators and daily factors.</p><div className="mini-chart" aria-label="Illustrative monthly trend"><i style={{ height: '36%' }} /><i style={{ height: '52%' }} /><i style={{ height: '44%' }} /><i style={{ height: '68%' }} /><i style={{ height: '62%' }} /><i style={{ height: '74%' }} /></div><div className="report-foot"><span>{isVip ? 'Open monthly report' : 'Preview VIP report'}</span><ChevronRight size={17} /></div></button>
              <button className="report-card" onClick={() => setReportName('visit')}><div className="report-card-top"><span className="report-symbol"><ClipboardCheck size={21} /></span><span className="report-tag neutral">PREP</span></div><strong>Visit preparation</strong><p>Review your recent changes and prepare questions for your next appointment.</p><div className="report-foot"><span>Open summary</span><ChevronRight size={17} /></div></button>
              <p className="disclaimer">Reports describe recorded patterns. They do not diagnose disease or replace medical advice.</p>
            </TabsContent>

            <TabsContent value="profile" className="page">
              <span className="eyebrow">ACCOUNT</span><h1>My TongueCare</h1>
              <section className="profile-card"><span className="avatar"><UserRound size={28} /></span><div><strong>Alex</strong><small>{isVip ? 'VIP · Full demo access' : 'Basic · Free plan'}</small></div><ChevronRight size={17} /></section>
              <section className="membership-card"><div><Crown size={20} /><span><strong>{isVip ? 'VIP is active' : 'Basic membership'}</strong><small>{isVip ? 'Deep single reports and monthly trends' : 'Capture, records and basic analysis'}</small></span></div><div className="membership-switch"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button><button className={isVip ? 'active' : ''} onClick={() => setPlan('vip')}>VIP</button></div></section>
              <div className="menu-list">
                <button onClick={() => setReportName('hospital')}><Building2 size={19} /><span><strong>Hospital care plan</strong><small>{hospitalLinked ? 'Connected · VIP care period active' : 'Connect to receive sponsored access'}</small></span><ChevronRight size={16} /></button>
                <div><Bell size={19} /><span><strong>Daily reminders</strong><small>Prompt for unfinished tasks</small></span><Switch checked={reminder} onCheckedChange={setReminder} /></div>
                <button onClick={() => setReportName('privacy')}><ShieldCheck size={19} /><span><strong>Privacy and data</strong><small>Manage how your records are used</small></span><ChevronRight size={16} /></button>
                <button onClick={() => setReportName('help')}><CircleHelp size={19} /><span><strong>Help</strong><small>Using this patient prototype</small></span><ChevronRight size={16} /></button>
              </div>
              <p className="disclaimer">TongueCare patient prototype · Demo data · v2.0</p>
            </TabsContent>
          </div>
          <TabsList className="bottomnav" aria-label="Main navigation"><TabsTrigger value="home"><Home /><span>Home</span></TabsTrigger><TabsTrigger value="records"><FolderHeart /><span>Records</span></TabsTrigger><TabsTrigger value="reports"><FileHeart /><span>Reports</span></TabsTrigger><TabsTrigger value="profile"><UserRound /><span>Me</span></TabsTrigger></TabsList>
        </Tabs>
      </div>
      <footer className="stage-footer">TongueCare · Patient experience prototype</footer>

      <Sheet open={windowName === 'capture'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>Guided tongue capture</SheetTitle><SheetDescription>Follow the live prompts before taking the photo.</SheetDescription></SheetHeader><div className="sheet-body"><div className="capture-frame">{photo ? <Image src={photo} alt="Selected tongue capture" width={420} height={280} unoptimized /> : <ScanFace size={72} />}<span className="capture-guide">{photo ? 'Image centered' : 'Move a little closer · Open your mouth wider'}</span></div><div className="quality-grid"><span><CheckCircle2 size={16} />Lighting</span><span><CheckCircle2 size={16} />Distance</span><span><CheckCircle2 size={16} />Focus</span></div><label className="upload-button"><ImagePlus size={18} />{photo ? 'Choose another photo' : 'Choose a demo photo'}<input type="file" accept="image/*" onChange={(event) => loadPhoto(event.target.files?.[0])} /></label><button className="primary" onClick={saveCapture}>{photo ? 'Analyze this image' : 'Try demo analysis'}<Sparkles size={18} /></button><p className="disclaimer">Capture guidance and analysis are simulated in this prototype.</p></div></SheetContent></Sheet>

      <Sheet open={windowName === 'metrics'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>Health indicators</SheetTitle><SheetDescription>Add values from your latest health check.</SheetDescription></SheetHeader><div className="sheet-body form-grid">{[['bmi', 'BMI', 'kg/m²'], ['alt', 'ALT', 'U/L'], ['ast', 'AST', 'U/L'], ['ggt', 'GGT', 'U/L'], ['tg', 'Triglycerides', 'mmol/L']].map(([key, label, unit]) => <label key={key}><span>{label}<small>{unit}</small></span><input inputMode="decimal" value={metrics[key as keyof typeof metrics]} onChange={(event) => setMetrics({ ...metrics, [key]: event.target.value })} /></label>)}<div className="info-line"><Info size={16} />Use the unit shown on your laboratory report. Reference ranges differ by laboratory.</div><button className="primary" onClick={saveMetrics}>Save indicators<Check size={18} /></button></div></SheetContent></Sheet>

      <Sheet open={windowName === 'daily'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>Daily health record</SheetTitle><SheetDescription>Keep today’s context together in one quick entry.</SheetDescription></SheetHeader><div className="sheet-body daily-form"><label><Moon size={17} /><span>Sleep<input value={daily.sleep} onChange={(event) => setDaily({ ...daily, sleep: event.target.value })} inputMode="decimal" /></span><em>hours</em></label><label><Activity size={17} /><span>Activity<input value={daily.activity} onChange={(event) => setDaily({ ...daily, activity: event.target.value })} inputMode="numeric" /></span><em>minutes</em></label><label><Utensils size={17} /><span>Meals<select value={daily.meals} onChange={(event) => setDaily({ ...daily, meals: event.target.value })}><option>Balanced</option><option>Light</option><option>High fat</option><option>Irregular</option></select></span></label><label><Pill size={17} /><span>Medication<select value={daily.medication} onChange={(event) => setDaily({ ...daily, medication: event.target.value })}><option>Taken as planned</option><option>Missed a dose</option><option>Changed</option><option>Not applicable</option></select></span></label><label><Activity size={17} /><span>Alcohol<select value={daily.alcohol} onChange={(event) => setDaily({ ...daily, alcohol: event.target.value })}><option>None</option><option>1 drink</option><option>2 or more drinks</option></select></span></label><label className="wide"><Info size={17} /><span>Symptoms<textarea value={daily.symptoms} onChange={(event) => setDaily({ ...daily, symptoms: event.target.value })} /></span></label><button className="primary" onClick={saveDaily}>Save today’s record<Check size={18} /></button></div></SheetContent></Sheet>

      <Dialog open={!!reportName} onOpenChange={(open) => !open && setReportName(null)}><DialogContent className="report-dialog"><DialogTitle>{reportName === 'record' ? selectedEntry?.title ?? 'Record details' : reportName === 'single' ? 'Single tongue analysis' : reportName === 'monthly' ? 'September health trend' : reportName === 'visit' ? (isVip ? 'Visit preparation' : 'VIP monthly report') : reportName === 'hospital' ? 'Hospital care plan' : reportName === 'privacy' ? 'Privacy and data' : 'Help'}</DialogTitle><DialogDescription>{reportName === 'record' ? selectedEntry?.date ?? 'Health record' : reportName === 'single' ? 'Sep 10 · Patient report' : 'TongueCare patient experience'}</DialogDescription>
        {reportName === 'record' && selectedEntry ? <div className="dialog-scroll"><div className={`record-detail-hero ${selectedEntry.kind.toLowerCase()}`}>{selectedEntry.kind === 'Metrics' ? <FlaskConical size={26} /> : <ClipboardCheck size={26} />}<span><small>{selectedEntry.kind.toUpperCase()} RECORD</small><strong>{selectedEntry.detail}</strong></span></div>{selectedEntry.kind === 'Metrics' ? <div className="record-detail-grid">{[['BMI', metrics.bmi, 'kg/m²'], ['ALT', metrics.alt, 'U/L'], ['AST', metrics.ast, 'U/L'], ['GGT', metrics.ggt, 'U/L'], ['Triglycerides', metrics.tg, 'mmol/L']].map(([label, value, unit]) => <span key={label}><small>{label}</small><strong>{value}</strong><em>{unit}</em></span>)}</div> : <div className="record-detail-list">{[['Sleep', `${daily.sleep} hours`], ['Activity', `${daily.activity} minutes`], ['Meals', daily.meals], ['Medication', daily.medication], ['Alcohol', daily.alcohol], ['Symptoms', daily.symptoms]].map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}<p className="disclaimer">This is a demonstration record and resets when the page is refreshed.</p></div>
        : reportName === 'single' ? <div className="dialog-scroll"><div className="analysis-hero"><span><ScanFace size={28} /></span><div><small>IMAGE QUALITY</small><strong>Suitable for comparison</strong><p>Lighting, position and focus passed the demo check.</p></div></div><div className="feature-table">{tongueFeatures.slice(0, isVip ? 5 : 3).map(([label, value, trend]) => <div key={label}><span><small>{label}</small><strong>{value}</strong></span><em>{trend}</em></div>)}</div>{!isVip ? <button className="vip-callout" onClick={() => setPlan('vip')}><LockKeyhole size={18} /><span><strong>Unlock the full analysis</strong><small>VIP adds moisture, cracks, tooth marks and deeper longitudinal context.</small></span><ChevronRight size={16} /></button> : <div className="insight"><Sparkles size={18} /><span><strong>VIP longitudinal note</strong><p>Your tongue coating appears slightly lighter than last month. Continue capturing under similar conditions so the trend remains comparable.</p></span></div>}<p className="disclaimer">This describes visible features and recorded change. It does not identify a cause or provide a diagnosis.</p></div>
        : reportName === 'monthly' ? <div className="dialog-scroll"><div className="monthly-score"><span><small>RECORD COMPLETION</small><strong>25 / 30</strong><em>days</em></span><TrendingUp size={30} /></div><div className="trend-block"><div><span>Coating appearance</span><strong>Mostly stable</strong></div><div className="trend-line"><i /><i /><i /><i /><i /><i /><i /></div><p>Recent images remained within your personal recorded range.</p></div><div className="metric-row"><span><Weight size={17} /><em>Weight</em><strong>68.4 kg</strong><small>−0.7 kg</small></span><span><FlaskConical size={17} /><em>ALT</em><strong>{metrics.alt} U/L</strong><small>Latest value</small></span></div><div className="insight"><Info size={18} /><span><strong>Review at your next visit</strong><p>One laboratory value changed from the previous report. Keep the original report available for professional interpretation.</p></span></div><p className="disclaimer">Trend information is for follow-up preparation and does not estimate disease stage.</p></div>
        : reportName === 'visit' ? <div className="dialog-scroll">{!isVip ? <><div className="vip-cover"><Crown size={30} /><strong>Monthly trend reports are a VIP feature</strong><p>Combine tongue records, health indicators and daily factors in one longitudinal view.</p></div><button className="primary" onClick={() => { setPlan('vip'); setReportName('monthly'); }}>Preview VIP report<Crown size={17} /></button></> : <><div className="visit-list"><span><CheckCircle2 size={17} /><p><strong>25 of 30 check-ins completed</strong>Good record continuity this month.</p></span><span><FlaskConical size={17} /><p><strong>Five indicators available</strong>Bring your original laboratory report.</p></span><span><Moon size={17} /><p><strong>Fatigue followed shorter sleep twice</strong>This is a recorded pattern, not a confirmed cause.</p></span></div><label className="question-box">Question for my next visit<textarea defaultValue="Could shorter sleep be contributing to my recent fatigue?" /></label></>}</div>
        : reportName === 'hospital' ? <div className="dialog-scroll"><div className="hospital-panel"><Building2 size={28} /><strong>{hospitalLinked ? 'Care plan connected' : 'Connect a hospital care plan'}</strong><p>{hospitalLinked ? 'Your sponsored VIP care period is active until Nov 30, 2026.' : 'Enter a hospital invitation code to activate sponsored VIP access for the care period.'}</p></div>{!hospitalLinked && <><label className="code-field">Invitation code<input placeholder="e.g. TONGUE-2026" /></label><button className="primary" onClick={() => { setHospitalLinked(true); setPlan('vip'); setReportName(null); }}>Connect demo care plan<Check size={17} /></button></>}<p className="disclaimer">This prototype simulates patient access only. It does not connect to a real hospital system.</p></div>
        : reportName === 'privacy' ? <div className="dialog-scroll"><div className="info-line"><ShieldCheck size={18} />Photos and health information remain inside this demo page and reset when refreshed.</div><p>You would control consent before data is used for longitudinal analysis or shared with a connected care programme.</p></div>
        : <div className="dialog-scroll"><p>Expand a task on Home, then open its focused window. Reports and history remain in their own tabs so the home screen stays simple.</p><p>This prototype simulates capture guidance and analysis. It does not provide medical diagnosis or emergency monitoring.</p></div>}
      </DialogContent></Dialog>
    </main>
  );
}
