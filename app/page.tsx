'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, BarChart3, BatteryFull, Bell, Building2, CalendarDays, Camera,
  Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Crown,
  FileHeart, FileImage, FlaskConical, FolderHeart, Home, ImagePlus, Info,
  Keyboard, LockKeyhole, Moon, Pill, ScanFace, ShieldCheck, Signal, Sparkles,
  TrendingUp, Upload, UserRound, Utensils, Wifi,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type WindowName = 'capture' | 'metrics' | 'daily' | null;
type ReportName = 'record' | 'single' | 'monthly' | 'visit' | 'clinician' | 'hospital' | 'privacy' | 'help' | null;
type CaptureStep = 'capture' | 'review' | 'analyzing' | 'result';
type HealthEntry = { id: number; date: string; kind: 'Tongue' | 'Metrics' | 'Daily'; title: string; detail: string };

const starterEntries: HealthEntry[] = [
  { id: 1, date: '10 Aug · 08:28', kind: 'Tongue', title: 'Morning tongue record', detail: 'Coating coverage increased from baseline · AI review complete' },
  { id: 2, date: '9 Aug · 20:10', kind: 'Daily', title: 'Recent situation record', detail: 'Increased fatigue over two weeks · 3 missed doses' },
  { id: 3, date: '8 Aug · 09:02', kind: 'Metrics', title: 'Recent clinical data', detail: 'ALT 58 · AST 36 · Platelets 210 · FIB-4 1.08' },
];

const tongueFeatures = [
  ['Tongue-body colour', 'No persistent change', 'No consistent change from baseline'],
  ['Tongue-coating coverage', 'Persistently increased', 'Persistently increased from baseline'],
  ['Coating distribution', 'Increased centrally', 'Coverage increased in the central tongue region'],
  ['Moisture-related appearance', 'No persistent change', 'No persistent change during follow-up'],
  ['Fissures and tongue-edge features', 'No consistent change', 'No consistent change during follow-up'],
];

const metricDefinitions = [
  { key: 'alt', name: 'Alanine aminotransferase', short: 'ALT', unit: 'U/L', range: '7–40', help: 'An enzyme measured in blood and usually interpreted with other tests to understand liver health.' },
  { key: 'ast', name: 'Aspartate aminotransferase', short: 'AST', unit: 'U/L', range: '13–35', help: 'An enzyme found in the liver, heart, and muscles that should be interpreted with other results.' },
  { key: 'platelets', name: 'Platelet count', short: 'PLT', unit: '×10⁹/L', range: 'Use lab report range', help: 'This value is used to calculate FIB-4 in this example.' },
  { key: 'fib4', name: 'FIB-4 index', short: 'FIB-4', unit: '', range: 'Requires clinical assessment', help: 'Calculated here from the latest age, AST, ALT, and platelet data; it cannot diagnose a condition on its own.' },
] as const;

const medicalDisclaimer = 'This summary only organizes visible features in tongue photos and changes in historical records. It cannot diagnose MASLD, assess disease progression, or replace hospital tests and a clinician’s evaluation.';

export default function Page() {
  const [tab, setTab] = useState('home');
  const [windowName, setWindowName] = useState<WindowName>(null);
  const [reportName, setReportName] = useState<ReportName>(null);
  const [plan, setPlan] = useState<'basic' | 'vip'>('basic');
  const [reminder, setReminder] = useState(true);
  const [hospitalLinked, setHospitalLinked] = useState(false);
  const [photo, setPhoto] = useState('');
  const [captureStep, setCaptureStep] = useState<CaptureStep>('capture');
  const [metricsStep, setMetricsStep] = useState<'choose' | 'upload' | 'manual' | 'confirm'>('choose');
  const [labFileName, setLabFileName] = useState('');
  const [entries, setEntries] = useState(starterEntries);
  const [selectedEntry, setSelectedEntry] = useState<HealthEntry | null>(null);
  const [done, setDone] = useState({ capture: false, metrics: false, daily: false });
  const [metrics, setMetrics] = useState({ alt: '58', ast: '36', platelets: '210', fib4: '1.08' });
  const [daily, setDaily] = useState({ sleep: '7.0', activity: '35', meals: 'Balanced', medication: '3 missed doses', alcohol: 'None', symptoms: 'Increased fatigue over the past two weeks' });
  const [visitPrep, setVisitPrep] = useState({
    recent: 'During follow-up, tongue-body colour showed no persistent change. Tongue-coating coverage remained increased from baseline, mainly in the central tongue region. Fatigue increased over the past two weeks, and three medication doses were missed.',
    concern: 'Fatigue increased over the past two weeks, and three medication doses were missed.',
    doctorNote: 'I would like to discuss whether I should complete another liver-function test.',
  });
  const [visitSaved, setVisitSaved] = useState(false);
  const isVip = plan === 'vip';
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(2026, 7, 10)), []);

  const addEntry = (kind: HealthEntry['kind'], title: string, detail: string) => setEntries((current) => [
    { id: Date.now(), date: '10 Aug · Just now', kind, title, detail }, ...current,
  ]);

  const generateVisitSummary = () => isVip
    ? `AI review of tongue photos from 1 June to 10 August 2026 shows no persistent change in tongue-body colour; coating coverage remained increased from baseline, mainly in the central tongue region; moisture-related appearance, fissures, and tongue-edge features showed no consistent persistent change. Health records show ${daily.symptoms}, ${daily.medication}. Latest clinical data: ALT ${metrics.alt} U/L, AST ${metrics.ast} U/L, platelet count ${metrics.platelets} ×10⁹/L, and FIB-4 ${metrics.fib4}. The planned liver-function test has not yet been completed. A clinician should assess these changes together with hospital tests.`
    : `Recent AI review of tongue photos shows no persistent change in tongue-body colour and increased coating coverage from baseline, mainly in the central tongue region. Health records show ${daily.symptoms}, ${daily.medication}.`;

  const openVisitPrep = () => {
    setVisitPrep((current) => ({ ...current, recent: generateVisitSummary() }));
    setVisitSaved(false);
    setReportName('visit');
  };

  const loadPhoto = (file?: File) => {
    if (!file || file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result ?? ''));
      setCaptureStep('review');
    };
    reader.readAsDataURL(file);
  };

  const analyzeCapture = () => {
    setCaptureStep('analyzing');
    window.setTimeout(() => setCaptureStep('result'), 1200);
  };

  const saveCapture = () => {
    setDone((state) => ({ ...state, capture: true }));
    addEntry('Tongue', 'Today’s tongue record', 'Photo quality passed · AI review complete');
    setWindowName(null);
    setReportName('single');
  };
  const saveMetrics = () => {
    setDone((state) => ({ ...state, metrics: true }));
    addEntry('Metrics', 'Clinical data updated', `ALT ${metrics.alt} · AST ${metrics.ast} · Platelets ${metrics.platelets} · FIB-4 ${metrics.fib4}`);
    setWindowName(null);
  };
  const saveDaily = () => {
    setDone((state) => ({ ...state, daily: true }));
    addEntry('Daily', 'Today’s daily health record', `Sleep ${daily.sleep} hours · Activity ${daily.activity} minutes · ${daily.meals}`);
    setWindowName(null);
  };

  return (
    <main className="stage">
      <header className="brandbar">
        <div className="brand"><span className="logo"><Activity size={22} /></span><span>TongueCare</span><span className={isVip ? 'edition vip' : 'edition'}>{isVip ? 'Premium' : 'Basic'}</span></div>
        <div className="plan-preview" aria-label="Plan preview"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button><button className={isVip ? 'active vip' : ''} onClick={() => setPlan('vip')}><Crown size={13} /> Premium</button></div>
      </header>

      <div className="phone">
        <div className="statusbar"><span>9:41</span><span><Signal size={14} /><Wifi size={14} /><BatteryFull size={19} /></span></div>
        <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="app-shell">
          <div className="screen">
            <TabsContent value="home" className="page">
              <div className="page-top"><div><span className="eyebrow">{todayLabel}</span><h1>Daily tongue record</h1></div><button className="icon-button" aria-label="Notifications"><Bell size={19} /></button></div>
              <section className={done.capture ? 'tongue-focus complete' : 'tongue-focus'}>
                <div className="tongue-focus-top"><span className="focus-icon">{done.capture ? <CheckCircle2 size={30} /> : <ScanFace size={32} />}</span><span className="focus-status">{done.capture ? 'Completed today' : 'Best taken in the morning before eating'}</span></div>
                <h2>{done.capture ? 'Today’s tongue record is ready' : 'Photograph your tongue and track daily changes'}</h2>
                <p>Takes about 2 minutes. The app checks photo quality and organizes visible tongue-body colour, coating, and shape features.</p>
                <div className="focus-steps"><span><i>1</i>Guided photo</span><span><i>2</i>AI review</span><span><i>3</i>View report</span></div>
                <button className="focus-action" onClick={() => { setCaptureStep(photo ? 'review' : 'capture'); setWindowName('capture'); }}><Camera size={19} />{done.capture ? 'Record again' : 'Start tongue record'}<ChevronRight size={18} /></button>
              </section>
              <button className="latest-report" onClick={() => setReportName('single')}><span className="report-symbol"><FileHeart size={21} /></span><span><small>Latest · 10 Aug</small><strong>View tongue-image AI report</strong><em>Coating coverage increased from baseline, mainly in the central tongue region</em></span><ChevronRight size={18} /></button>
              <details className="supporting-info">
                <summary><span><strong>Supporting information</strong><small>Optional context that may help explain recorded changes</small></span><ChevronRight size={18} /></summary>
                <div className="supporting-actions">
                  <button onClick={() => { setMetricsStep('choose'); setWindowName('metrics'); }}><span><FlaskConical size={18} /></span><div><strong>Clinical test results</strong><small>{done.metrics ? 'Updated today' : 'Upload a lab report or enter values'}</small></div><ChevronRight size={16} /></button>
                  <button onClick={() => setWindowName('daily')}><span><ClipboardCheck size={18} /></span><div><strong>Daily health record</strong><small>{done.daily ? 'Recorded today' : 'Sleep, meals, activity, and more'}</small></div><ChevronRight size={16} /></button>
                </div>
              </details>
              <button className="month-preview" onClick={() => setReportName('monthly')}><div><span className="eyebrow">30-day tongue trend</span><strong>Review changes over time</strong><p>{isVip ? 'Compare changes in tongue-body colour, coating, and shape.' : 'Premium includes a longitudinal tongue trend report.'}</p></div><TrendingUp size={25} /></button>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="records" className="page">
              <div className="page-top"><div><span className="eyebrow">History</span><h1>My tongue records</h1></div><CalendarDays size={22} /></div>
              <div className="record-summary"><span><strong>{entries.length}</strong><small>Recent records</small></span><span><strong>25</strong><small>Tongue photos</small></span><span><strong>4</strong><small>Clinical measures</small></span></div>
              <div className="section-heading"><h2>Recent activity</h2><span>Newest first</span></div>
              <div className="timeline">{entries.map((entry) => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setReportName(entry.kind === 'Tongue' ? 'single' : 'record'); }}><span className={`timeline-icon ${entry.kind.toLowerCase()}`}>{entry.kind === 'Tongue' ? <FileImage size={19} /> : entry.kind === 'Metrics' ? <FlaskConical size={19} /> : <ClipboardCheck size={19} />}</span><span><small>{entry.date}</small><strong>{entry.title}</strong><em>{entry.detail}</em></span><ChevronRight size={16} /></button>)}</div>
              <p className="demo-note">These are demo records and reset when the page is refreshed.</p>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="reports" className="page">
              <div className="page-top"><div><span className="eyebrow">Record review</span><h1>Tongue health reports</h1></div><BarChart3 size={23} /></div>
              <button className="report-overview" onClick={() => setReportName('single')}>
                <div className="overview-top"><span className="overview-icon"><ScanFace size={25} /></span><span className="overview-plan">{isVip ? 'Premium detailed report' : 'Basic health report'}</span></div>
                <div className="overview-title"><small>10 Aug · Latest record</small><strong>Coating coverage increased from baseline</strong><p>{isVip ? '5 tongue-image features and follow-up changes organized' : '3 core tongue-image features organized'}</p></div>
                <div className="overview-metrics"><span><small>Tongue-body colour</small><strong>No persistent change</strong></span><span><small>Coating coverage</small><strong>Increased</strong></span><span><small>Main area</small><strong>Central tongue</strong></span></div>
                <div className="overview-action"><span>{isVip ? 'View detailed report' : 'View concise report'}</span><ChevronRight size={18} /></div>
              </button>
              <div className="report-access-note"><CheckCircle2 size={17} /><p><strong>Basic users can view a health report</strong>Includes core findings on photo quality, tongue-body colour, coating, and shape.</p></div>
              <div className="section-heading report-tools-heading"><h2>Trends and visit preparation</h2><span>{isVip ? 'Premium enabled' : 'Basic features available'}</span></div>
              <div className="report-tool-list">
                <button onClick={() => setReportName('monthly')}><span className="tool-icon"><TrendingUp size={20} /></span><span className="tool-copy"><strong>30-day tongue-image trend</strong><small>{isVip ? 'Weekly comparisons with supporting health information' : 'View a concise overall trend'}</small></span><em>{isVip ? 'Detailed' : 'Concise'}</em><ChevronRight size={16} /></button>
                <button onClick={openVisitPrep}><span className="tool-icon gold"><ClipboardCheck size={20} /></span><span className="tool-copy"><strong>Pre-visit information</strong><small>{isVip ? 'AI organizes follow-up tongue images and health records' : 'AI summarizes recent tongue images and health records'}</small></span><em>{isVip ? 'Detailed' : 'Brief'}</em><ChevronRight size={16} /></button>
              </div>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="profile" className="page">
              <span className="eyebrow">Profile</span><h1>My TongueCare</h1>
              <section className="profile-card"><span className="avatar"><UserRound size={28} /></span><div><strong>Ms Li · 48 years old</strong><small>Hospital ID MASLD-10482 · {isVip ? 'Premium' : 'Basic'}</small></div><ChevronRight size={17} /></section>
              <section className="membership-card"><div><Crown size={20} /><span><strong>{isVip ? 'Premium enabled' : 'Basic plan'}</strong><small>{isVip ? 'Full single-record reports and longitudinal trend analysis' : 'Tongue photos, records, and basic analysis'}</small></span></div><div className="membership-switch"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>Basic</button><button className={isVip ? 'active' : ''} onClick={() => setPlan('vip')}>Premium</button></div></section>
              <div className="menu-list">
                <button onClick={() => setReportName('hospital')}><Building2 size={19} /><span><strong>Hospital care programme</strong><small>{hospitalLinked ? 'Connected · Next appointment: 18 Aug 2026' : 'Next appointment: 18 Aug 2026'}</small></span><ChevronRight size={16} /></button>
                <div><Bell size={19} /><span><strong>Daily reminder</strong><small>Reminder to complete today’s tongue record</small></span><Switch checked={reminder} onCheckedChange={setReminder} /></div>
                <button onClick={() => setReportName('privacy')}><ShieldCheck size={19} /><span><strong>Privacy and data</strong><small>Manage how photos and records are used</small></span><ChevronRight size={16} /></button>
                <button onClick={() => setReportName('help')}><CircleHelp size={19} /><span><strong>Help</strong><small>Learn about this patient demo</small></span><ChevronRight size={16} /></button>
              </div>
              <p className="demo-note">TongueCare patient prototype · Demo data · Version 3.0</p>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>
          </div>
          <TabsList className="bottomnav" aria-label="Main navigation"><TabsTrigger value="home"><Home /><span>Today</span></TabsTrigger><TabsTrigger value="records"><FolderHeart /><span>Records</span></TabsTrigger><TabsTrigger value="reports"><FileHeart /><span>Reports</span></TabsTrigger><TabsTrigger value="profile"><UserRound /><span>Profile</span></TabsTrigger></TabsList>
        </Tabs>
      </div>
      <footer className="stage-footer">TongueCare · Patient experience prototype</footer>

      <Sheet open={windowName === 'capture'} onOpenChange={(open) => !open && setWindowName(null)}>
        <SheetContent side="bottom" className="task-sheet capture-sheet">
          <SheetHeader>
            <SheetTitle>{captureStep === 'capture' ? 'Tongue photo' : captureStep === 'review' ? 'Review photo' : captureStep === 'analyzing' ? 'AI review in progress' : 'AI review complete'}</SheetTitle>
            <SheetDescription>{captureStep === 'capture' ? 'Follow the on-screen guide to take a clear, complete tongue photo.' : captureStep === 'review' ? 'Check that the photo is clear before starting AI review.' : captureStep === 'analyzing' ? 'Checking photo quality and identifying visible tongue features.' : 'Review the summary before saving this record.'}</SheetDescription>
          </SheetHeader>
          <div className="sheet-body">
            {captureStep === 'analyzing' ? (
              <div className="ai-analyzing"><span className="ai-orbit"><Sparkles size={30} /></span><strong>Reviewing tongue photo</strong><p>Checking lighting and clarity</p><div className="analysis-progress"><i /></div><small>Organizing tongue-body colour, coating, and shape…</small></div>
            ) : captureStep === 'result' ? (
              <div className="capture-result">
                <div className="ai-result-head"><span><Sparkles size={22} /></span><div><small>AI review summary</small><strong>Photo quality is suitable for record comparison</strong></div></div>
                <div className="capture-findings"><span><small>Tongue-body colour</small><strong>No persistent change</strong><em>No consistent change from baseline</em></span><span><small>Tongue-coating coverage</small><strong>Increased</strong><em>Persistently increased from baseline</em></span><span><small>Coating distribution</small><strong>Increased centrally</strong><em>Coverage increased in the central tongue region</em></span></div>
                <div className="info-line"><Info size={16} />AI review records visible features and trends; it does not replace a clinician’s diagnosis.</div>
                <button className="primary" onClick={saveCapture}>Save and view full report<ChevronRight size={18} /></button>
                <button className="secondary-action" onClick={() => setCaptureStep('review')}>Review again</button>
              </div>
            ) : (
              <>
                <div className="capture-frame">{photo ? <Image src={photo} alt="Selected tongue photo" width={420} height={280} unoptimized /> : <ScanFace size={72} />}<span className="capture-guide">{photo ? 'Photo ready · Check clarity' : 'Move closer · Open wide · Extend your tongue naturally'}</span></div>
                <div className="quality-grid"><span><CheckCircle2 size={16} />Lighting</span><span><CheckCircle2 size={16} />Distance</span><span><CheckCircle2 size={16} />Clarity</span></div>
                <label className="upload-button"><ImagePlus size={18} />{photo ? 'Retake or choose another photo' : 'Take or choose a tongue photo'}<input type="file" accept="image/*" capture="environment" onChange={(event) => loadPhoto(event.target.files?.[0])} /></label>
                <button className="primary" onClick={analyzeCapture}>{photo ? 'Start AI review' : 'Try AI review with a sample photo'}<Sparkles size={18} /></button>
                <p className="disclaimer">Photo guidance and AI review are simulated in this prototype.</p>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={windowName === 'metrics'} onOpenChange={(open) => !open && setWindowName(null)}>
        <SheetContent side="bottom" className="task-sheet metric-sheet">
          <SheetHeader>
            <SheetTitle>{metricsStep === 'choose' ? 'Add test results' : metricsStep === 'upload' ? 'Upload lab report' : metricsStep === 'manual' ? 'Enter manually' : 'Confirm extracted results'}</SheetTitle>
            <SheetDescription>{metricsStep === 'choose' ? 'If you do not recognize the measures, simply upload the lab report.' : metricsStep === 'confirm' ? 'Check each value, unit, and reference range against the original lab report.' : 'The results will be added to your health record.'}</SheetDescription>
          </SheetHeader>
          <div className="sheet-body metric-flow">
            {metricsStep === 'choose' ? (
              <div className="entry-methods">
                <button className="entry-method recommended" onClick={() => setMetricsStep('upload')}><span className="method-icon"><Upload size={22} /></span><span><small>Recommended</small><strong>Photograph or upload a lab report</strong><em>The app extracts test names, values, units, and reference ranges for you to confirm.</em></span><ChevronRight size={18} /></button>
                <button className="entry-method" onClick={() => setMetricsStep('manual')}><span className="method-icon"><Keyboard size={22} /></span><span><strong>Enter manually</strong><em>For users who know where to find each measure on their report.</em></span><ChevronRight size={18} /></button>
              </div>
            ) : metricsStep === 'upload' ? (
              <div className="upload-step">
                <button className="back-link" onClick={() => setMetricsStep('choose')}><ArrowLeft size={16} />Back to options</button>
                <label className="lab-upload"><Upload size={34} /><strong>{labFileName || 'Choose a lab report photo or file'}</strong><span>Common image and document formats supported · Demo files are not uploaded</span><input type="file" accept=".pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setLabFileName(file.name); setMetricsStep('confirm'); } }} /></label>
                <div className="upload-tips"><strong>Photo tips</strong><span><CheckCircle2 size={16} />Include the test name, value, and reference range</span><span><CheckCircle2 size={16} />Use even lighting and avoid glare or blur</span></div>
                <button className="secondary-action" onClick={() => { setLabFileName('sample-lab-report.pdf'); setMetricsStep('confirm'); }}>Try the sample lab report</button>
              </div>
            ) : metricsStep === 'manual' ? (
              <div className="manual-metrics">
                <button className="back-link" onClick={() => setMetricsStep('choose')}><ArrowLeft size={16} />Back to options</button>
                {metricDefinitions.map((item) => (
                  <details key={item.key} className="metric-item">
                    <summary><span><strong>{item.name}</strong><small>{item.short} · {item.unit}</small></span><span className="metric-value">{metrics[item.key]}</span><ChevronRight size={16} /></summary>
                    <div className="metric-editor"><p>{item.help}</p><label>Lab result<div><input inputMode="decimal" value={metrics[item.key]} onChange={(event) => setMetrics({ ...metrics, [item.key]: event.target.value })} /><span>{item.unit}</span></div></label><small>Use the unit and reference range shown on your lab report.</small></div>
                  </details>
                ))}
                <button className="primary" onClick={() => setMetricsStep('confirm')}>Review entries<ChevronRight size={17} /></button>
              </div>
            ) : (
              <div className="confirm-metrics">
                <button className="back-link" onClick={() => setMetricsStep(labFileName ? 'upload' : 'manual')}><ArrowLeft size={16} />Back to edit</button>
                {labFileName && <div className="source-file"><FileImage size={18} /><span><small>Source</small><strong>{labFileName}</strong></span><CheckCircle2 size={18} /></div>}
                <div className="confirm-list">{metricDefinitions.map((item) => <div key={item.key}><span><strong>{item.name}</strong><small>{item.short} · {item.range} {item.unit}</small></span><span className="confirmed-value"><strong>{metrics[item.key]}</strong><small>{item.unit}</small></span>{(item.key === 'alt' || item.key === 'ast') && <em>Outside entered reference range</em>}</div>)}</div>
                <div className="info-line"><Info size={16} />“Outside the reference range” does not diagnose a condition. Keep the original report and discuss it with your clinician.</div>
                <button className="primary" onClick={saveMetrics}>Confirm and save<Check size={18} /></button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={windowName === 'daily'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>Daily health record</SheetTitle><SheetDescription>Record today’s routine as optional context for tongue-image changes.</SheetDescription></SheetHeader><div className="sheet-body daily-form"><label><Moon size={17} /><span>Sleep<input value={daily.sleep} onChange={(event) => setDaily({ ...daily, sleep: event.target.value })} inputMode="decimal" /></span><em>hours</em></label><label><Activity size={17} /><span>Activity<input value={daily.activity} onChange={(event) => setDaily({ ...daily, activity: event.target.value })} inputMode="numeric" /></span><em>minutes</em></label><label><Utensils size={17} /><span>Meals<select value={daily.meals} onChange={(event) => setDaily({ ...daily, meals: event.target.value })}><option>Balanced</option><option>Light</option><option>High-fat</option><option>Irregular</option></select></span></label><label><Pill size={17} /><span>Medication<select value={daily.medication} onChange={(event) => setDaily({ ...daily, medication: event.target.value })}><option>Taken as planned</option><option>1 missed dose</option><option>3 missed doses</option><option>Adjusted</option><option>Not applicable</option></select></span></label><label><Activity size={17} /><span>Alcohol<select value={daily.alcohol} onChange={(event) => setDaily({ ...daily, alcohol: event.target.value })}><option>None</option><option>One drink</option><option>Two or more drinks</option></select></span></label><label className="wide"><Info size={17} /><span>Symptoms<textarea value={daily.symptoms} onChange={(event) => setDaily({ ...daily, symptoms: event.target.value })} /></span></label><button className="primary" onClick={saveDaily}>Save today’s record<Check size={18} /></button></div></SheetContent></Sheet>

      <Dialog open={!!reportName} onOpenChange={(open) => !open && setReportName(null)}><DialogContent className="report-dialog"><DialogTitle>{reportName === 'record' ? selectedEntry?.title ?? 'Record details' : reportName === 'single' ? 'Single tongue record summary' : reportName === 'monthly' ? '30-day tongue-image trend' : reportName === 'visit' ? 'Pre-visit information' : reportName === 'clinician' ? 'Clinician summary' : reportName === 'hospital' ? 'Hospital care programme' : reportName === 'privacy' ? 'Privacy and data' : 'Help'}</DialogTitle><DialogDescription>{reportName === 'record' ? selectedEntry?.date ?? 'Health record' : reportName === 'single' ? '10 August · Ms Li' : reportName === 'visit' ? 'Edit the recent situation, main concerns, and what you want to tell your clinician' : reportName === 'clinician' ? 'Ms Li · Patient-confirmed' : 'TongueCare patient experience'}</DialogDescription>
        {reportName === 'record' && selectedEntry ? <div className="dialog-scroll"><div className={`record-detail-hero ${selectedEntry.kind.toLowerCase()}`}>{selectedEntry.kind === 'Metrics' ? <FlaskConical size={26} /> : <ClipboardCheck size={26} />}<span><small>{selectedEntry.kind === 'Metrics' ? 'Clinical test record' : 'Daily health record'}</small><strong>{selectedEntry.detail}</strong></span></div>{selectedEntry.kind === 'Metrics' ? <div className="record-detail-grid">{metricDefinitions.map((item) => <span key={item.key}><small>{item.name} · {item.short}</small><strong>{metrics[item.key]}</strong><em>{item.unit}</em></span>)}</div> : <div className="record-detail-list">{[['Sleep', `${daily.sleep} hours`], ['Activity', `${daily.activity} minutes`], ['Meals', daily.meals], ['Medication', daily.medication], ['Alcohol', daily.alcohol], ['Symptoms', daily.symptoms]].map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}<p className="disclaimer">These are demo records and reset when the page is refreshed.</p></div>
        : reportName === 'single' ? <div className="dialog-scroll"><div className="analysis-hero"><span><ScanFace size={28} /></span><div><small>Photo quality</small><strong>Suitable for longitudinal comparison</strong><p>Lighting, position, and clarity passed the demo checks.</p></div></div><div className="feature-table">{tongueFeatures.slice(0, isVip ? 5 : 3).map(([label, value, trend]) => <div key={label}><span><small>{label}</small><strong>{value}</strong></span><em>{trend}</em></div>)}</div>{!isVip ? <button className="vip-callout" onClick={() => setPlan('vip')}><LockKeyhole size={18} /><span><strong>Unlock full analysis</strong><small>Premium adds moisture-related appearance, fissure and tongue-edge features, and fuller follow-up changes.</small></span><ChevronRight size={16} /></button> : <div className="insight"><Sparkles size={18} /><span><strong>Longitudinal change</strong><p>Tongue-coating coverage remained increased from baseline, mainly in the central tongue region; other visible features showed no consistent persistent change.</p></span></div>}<p className="disclaimer">The report describes visible photo features and record changes. It does not determine their cause or diagnose disease.</p></div>
        : reportName === 'monthly' ? <div className="dialog-scroll">{!isVip ? <><div className="monthly-score basic"><span><small>Records in 30 days</small><strong>8</strong><em>records</em></span><TrendingUp size={30} /></div><div className="trend-block"><div><span>Coating coverage trend</span><strong>Increased from baseline</strong></div><div className="trend-line"><i /><i /><i /><i /><i /><i /><i /></div><p>Recent photos show increased coating coverage, mainly in the central tongue region.</p></div><div className="basic-trend-summary"><span><CheckCircle2 size={17} /><p><strong>Tongue-body colour</strong>No persistent change</p></span><span><CheckCircle2 size={17} /><p><strong>Moisture-related appearance</strong>No persistent change</p></span></div><div className="vip-callout" role="note"><Crown size={18} /><span><strong>Premium adds detailed review</strong><small>Combines follow-up tongue images, patient reports, and clinical data.</small></span></div><p className="disclaimer">This concise Basic trend report reviews recorded changes and is not for diagnosis.</p></> : <><div className="monthly-score"><span><small>Recording completion</small><strong>25 / 30</strong><em>days</em></span><TrendingUp size={30} /></div><div className="trend-block"><div><span>Coating coverage trend</span><strong>Persistently increased</strong></div><div className="trend-line"><i /><i /><i /><i /><i /><i /><i /></div><p>Coverage remained increased from baseline and was more apparent in the central tongue region.</p></div><div className="metric-row"><span><FlaskConical size={17} /><em>ALT</em><strong>{metrics.alt} U/L</strong><small>Reference range 7–40</small></span><span><FlaskConical size={17} /><em>AST</em><strong>{metrics.ast} U/L</strong><small>Reference range 13–35</small></span></div><div className="insight"><Info size={18} /><span><strong>Supporting information</strong><p>Fatigue increased over the past two weeks, three medication doses were missed, and the planned liver-function test has not yet been completed.</p></span></div><p className="disclaimer">Trend information organizes longitudinal records and does not assess disease stage.</p></>}</div>
        : reportName === 'visit' ? <div className="dialog-scroll visit-prep"><div className={isVip ? 'visit-mode premium' : 'visit-mode'}><span>{isVip ? 'Premium · Detailed review' : 'Basic · Brief summary'}</span><small>{isVip ? 'Combines tongue-image AI results, patient reports, and clinical data from 1 June to 10 August' : 'Summarizes recent tongue-image AI results and health records'}</small></div><div className="visit-edit-form"><div className="visit-summary-editor"><div className="visit-field-title"><label htmlFor="recent-summary">Recent situation</label><button type="button" onClick={() => { setVisitSaved(false); setVisitPrep({ ...visitPrep, recent: generateVisitSummary() }); }}><Sparkles size={14} />Regenerate</button></div><small className="summary-source">Generated from tongue-image AI review and health records; you can edit it</small><textarea id="recent-summary" value={visitPrep.recent} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, recent: event.target.value }); }} /></div><label><span>Main concerns</span><textarea value={visitPrep.concern} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, concern: event.target.value }); }} /></label><label><span>What I want to tell my clinician</span><textarea value={visitPrep.doctorNote} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, doctorNote: event.target.value }); }} /></label></div>{isVip ? <button className="clinician-preview-button" onClick={() => setReportName('clinician')}><span><FileHeart size={19} /><span><strong>Example clinician summary</strong><small>Preview Ms Li’s complete visit information</small></span></span><ChevronRight size={17} /></button> : <div className="clinician-preview-locked"><LockKeyhole size={16} /><span><strong>Premium can generate a complete clinician summary</strong><small>Combines longitudinal tongue images, patient reports, and relevant clinical data.</small></span></div>}<button className="primary" onClick={() => setVisitSaved(true)}>{visitSaved ? 'Saved' : 'Save pre-visit information'}<Check size={18} /></button><p className="disclaimer">{medicalDisclaimer}</p></div>
        : reportName === 'clinician' ? <div className="dialog-scroll clinician-summary"><button className="back-link" onClick={() => setReportName('visit')}><ArrowLeft size={16} />Back to pre-visit information</button><section className="clinician-patient"><span><small>Patient</small><strong>Ms Li, 48 years old</strong></span><span><small>Hospital ID</small><strong>MASLD-10482</strong></span><span><small>Follow-up period</small><strong>1 June–10 August 2026</strong></span><span><small>Next appointment</small><strong>18 August 2026</strong></span><em><CheckCircle2 size={15} />Patient-confirmed</em></section><section className="clinician-section"><h3>Longitudinal tongue-image analysis</h3><div className="clinician-rows"><span><small>Tongue-body colour</small><strong>No persistent change from baseline</strong></span><span><small>Tongue-coating coverage</small><strong>Persistently increased from baseline</strong></span><span><small>Coating distribution</small><strong>Increased coverage in the central tongue region</strong></span><span><small>Moisture-related appearance</small><strong>No persistent change</strong></span><span><small>Fissures and tongue-edge features</small><strong>No consistent change</strong></span></div><p className="section-caution">These findings are descriptive and non-diagnostic. They do not independently indicate steatosis, inflammation, fibrosis, or MASLD progression.</p></section><section className="clinician-section"><h3>Patient-reported information</h3><ul><li>Increased fatigue during the previous two weeks.</li><li>Three missed medication doses were reported.</li></ul></section><section className="clinician-section"><h3>Relevant clinical data</h3><div className="clinical-data"><span><small>ALT</small><strong>58 U/L</strong><em>Reference range: 7–40 U/L</em></span><span><small>AST</small><strong>36 U/L</strong><em>Reference range: 13–35 U/L</em></span><span><small>Platelet count</small><strong>210 × 10⁹/L</strong></span><span><small>FIB-4</small><strong>1.08</strong><em>Calculated using the latest available age, AST, ALT, and platelet data</em></span><span><small>Most recent ultrasound</small><strong>Hepatic steatosis reported</strong></span><span><small>Transient elastography</small><strong>No recent result available</strong></span><span><small>Planned liver-function test</small><strong>Not yet completed</strong></span></div></section><section className="clinician-section"><h3>Patient’s editable pre-visit statement</h3><div className="patient-statements"><p>“I have felt more tired during the past two weeks.”</p><p>“I missed several medication doses.”</p><p>“I would like to discuss whether I should complete another liver-function test.”</p></div></section><section className="review-flag"><span>Review Flag</span><strong>Non-urgent</strong><p>Persistent tongue-image feature changes were observed alongside a patient-confirmed symptom change and an incomplete planned assessment.</p><small>This flag prioritizes information for clinical review. It does not provide a diagnosis or recommend a test, treatment, or earlier appointment.</small></section><p className="disclaimer page-disclaimer">{medicalDisclaimer}</p></div>
        : reportName === 'hospital' ? <div className="dialog-scroll"><div className="hospital-panel"><Building2 size={28} /><strong>{hospitalLinked ? 'Care programme connected' : 'Connect hospital care programme'}</strong><p>{hospitalLinked ? 'Ms Li’s next appointment is 18 August 2026.' : 'Hospital ID MASLD-10482 · Next appointment: 18 August 2026.'}</p></div>{!hospitalLinked && <><label className="code-field">Invitation code<input placeholder="Enter the invitation code from your hospital" /></label><button className="primary" onClick={() => { setHospitalLinked(true); setPlan('vip'); setReportName(null); }}>Connect demo care programme<Check size={17} /></button></>}<p className="disclaimer">This prototype simulates the patient connection flow and is not connected to a real hospital system.</p></div>
        : reportName === 'privacy' ? <div className="dialog-scroll"><div className="info-line"><ShieldCheck size={18} />Photos and health information remain only on this demo page and reset when it is refreshed.</div><p>Patients can manage consent before data is used for longitudinal analysis or shared with a care programme.</p></div>
        : <div className="dialog-scroll"><p>The home screen focuses on the daily tongue record. Clinical test results and daily health records are grouped under Supporting information, with History and Reports on separate screens.</p><p>Photo guidance and AI review are simulated. This prototype does not provide diagnosis or emergency monitoring.</p></div>}
      </DialogContent></Dialog>
    </main>
  );
}
