'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  FileClock,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Link2,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  Weight,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import styles from './hospital.module.css';

type Patient = {
  id: string;
  name: string;
  age: number;
  sex: string;
  flag: 'Review' | 'Routine' | 'Incomplete';
  reason: string;
  lastSync: string;
  completion: number;
};

const patients: Patient[] = [
  { id: 'MASLD-10482', name: 'Li Wen', age: 48, sex: 'F', flag: 'Review', reason: 'Symptom change + incomplete test', lastSync: '10:42', completion: 83 },
  { id: 'MASLD-10614', name: 'Chen Rui', age: 52, sex: 'M', flag: 'Incomplete', reason: '3 photo tasks overdue', lastSync: '10:38', completion: 54 },
  { id: 'MASLD-10197', name: 'Wang Mei', age: 43, sex: 'F', flag: 'Routine', reason: 'No material change', lastSync: '10:21', completion: 91 },
  { id: 'MASLD-10903', name: 'Zhao Jun', age: 57, sex: 'M', flag: 'Review', reason: 'Persistent coating change', lastSync: '09:56', completion: 72 },
  { id: 'MASLD-10528', name: 'Sun Yi', age: 46, sex: 'F', flag: 'Routine', reason: 'Follow-up on track', lastSync: '09:41', completion: 88 },
];

const weightData = [72.8, 72.3, 72.4, 71.8, 71.5, 71.2, 70.8, 70.6];
const coatingData = [42, 46, 44, 51, 55, 58, 61, 63];

function Sparkline({ values, tone = 'green' }: { values: number[]; tone?: 'green' | 'gold' }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 42 - ((value - min) / Math.max(max - min, 1)) * 34;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className={styles.sparkline} viewBox="0 0 100 48" role="img" aria-label="Eight week trend">
      <path d="M0 43H100" className={styles.sparkGrid} />
      <polyline points={points} className={tone === 'gold' ? styles.sparkGold : styles.sparkGreen} />
      {points.split(' ').map((point, index) => {
        const [cx, cy] = point.split(',');
        return <circle key={index} cx={cx} cy={cy} r="2.1" className={tone === 'gold' ? styles.sparkDotGold : styles.sparkDotGreen} />;
      })}
    </svg>
  );
}

export default function HospitalDashboard() {
  const [selectedId, setSelectedId] = useState('MASLD-10482');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Patient['flag']>('All');
  const [reviewStatus, setReviewStatus] = useState<'Pending' | 'Reviewed' | 'Follow-up'>('Pending');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const selected = patients.find((patient) => patient.id === selectedId) ?? patients[0];
  const filteredPatients = useMemo(() => patients.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === 'All' || patient.flag === filter);
  }), [filter, query]);

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}><span><Activity size={20} /></span><div><strong>TongueCare</strong><small>Clinical workspace</small></div></div>
        <nav aria-label="Hospital navigation">
          <button className={styles.navActive}><LayoutDashboard size={18} />Overview</button>
          <button><UsersRound size={18} />Patient list<span>128</span></button>
          <button><AlertTriangle size={18} />Review queue<span className={styles.alertCount}>4</span></button>
          <button><FileClock size={18} />Follow-up tasks</button>
        </nav>
        <div className={styles.integrationCard}>
          <div><Database size={17} /><span><strong>HIS / EMR API</strong><small>Read-only · Phase 1</small></span></div>
          <p><i />Last sync 11 Sep, 10:42</p>
          <button><RefreshCw size={14} />Sync status</button>
        </div>
        <div className={styles.sidebarBottom}>
          <button><CircleHelp size={17} />Integration guide</button>
          <div><span className={styles.doctorAvatar}>DW</span><span><strong>Dr. Wei</strong><small>Hepatology</small></span><ChevronRight size={15} /></div>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div><span className={styles.breadcrumb}>Hepatology / MASLD follow-up</span><h1>Patient monitoring</h1></div>
          <div className={styles.topActions}>
            <Link href="/" className={styles.patientLink}><ArrowLeft size={15} />Patient demo</Link>
            <button className={styles.iconButton} aria-label="Notifications"><Bell size={18} /><i /></button>
            <span className={styles.systemStatus}><i />Systems operational</span>
          </div>
        </header>

        <div className={styles.statsRow}>
          <article><span className={styles.statIcon}><UsersRound /></span><div><small>Active follow-up</small><strong>128</strong><em>12 added this month</em></div></article>
          <article><span className={`${styles.statIcon} ${styles.statAlert}`}><AlertTriangle /></span><div><small>Needs review</small><strong>4</strong><em>2 new today</em></div></article>
          <article><span className={`${styles.statIcon} ${styles.statBlue}`}><Clock3 /></span><div><small>Incomplete tasks</small><strong>17</strong><em>6 overdue</em></div></article>
          <article><span className={`${styles.statIcon} ${styles.statViolet}`}><HeartPulse /></span><div><small>8-week adherence</small><strong>81%</strong><em>+4.2% from prior period</em></div></article>
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.queuePanel} aria-label="Patient review queue">
            <div className={styles.panelHeading}>
              <div><h2>Patient queue</h2><span>{filteredPatients.length} of {patients.length} shown</span></div>
              <button aria-label="Queue settings"><SlidersHorizontal size={17} /></button>
            </div>
            <div className={styles.queueControls}>
              <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or ID" /></label>
              <div className={styles.filterRow}>{(['All', 'Review', 'Incomplete', 'Routine'] as const).map((item) => <button key={item} className={filter === item ? styles.filterActive : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
            </div>
            <div className={styles.patientList}>
              {filteredPatients.map((patient) => (
                <button key={patient.id} className={patient.id === selected.id ? styles.patientSelected : ''} onClick={() => { setSelectedId(patient.id); setSaved(false); }}>
                  <span className={styles.patientAvatar}>{patient.name.split(' ').map((part) => part[0]).join('')}</span>
                  <span className={styles.patientIdentity}><strong>{patient.name}</strong><small>{patient.id} · {patient.age}{patient.sex}</small><em>{patient.reason}</em></span>
                  <span className={`${styles.flag} ${styles[`flag${patient.flag}`]}`}>{patient.flag}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
              {filteredPatients.length === 0 && <div className={styles.emptyState}>No patients match this search.</div>}
            </div>
          </section>

          <section className={styles.patientPanel} aria-label="Selected patient summary">
            <div className={styles.patientHeader}>
              <div className={styles.patientLead}><span className={styles.largeAvatar}>{selected.name.split(' ').map((part) => part[0]).join('')}</span><div><span className={styles.patientKicker}>Hospital ID {selected.id}</span><h2>{selected.name}</h2><p>{selected.age}-year-old {selected.sex === 'F' ? 'woman' : 'man'} · MASLD follow-up · Next visit 18 Sep 2026</p></div></div>
              <div className={styles.patientHeaderActions}><button><FileText size={16} />Open in EMR</button><button aria-label="More patient actions"><ChevronDown size={17} /></button></div>
            </div>

            <div className={styles.reviewBanner}>
              <span><AlertTriangle size={19} /></span>
              <div><small>REVIEW FLAG · NON-URGENT</small><strong>Clinical review suggested before the next appointment</strong><p>Persistent tongue-feature change, patient-confirmed fatigue, and an incomplete planned liver-function test.</p></div>
              <button onClick={() => document.getElementById('review-control')?.scrollIntoView({ behavior: 'smooth' })}>Review flag<ChevronRight size={15} /></button>
            </div>

            <Tabs defaultValue="summary" className={styles.detailTabs}>
              <TabsList variant="line" className={styles.detailTabList}>
                <TabsTrigger value="summary">Clinical summary</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="records">Source records</TabsTrigger>
                <TabsTrigger value="questions">Patient questions <span className={styles.tabCount}>2</span></TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className={styles.tabPanel}>
                <div className={styles.summaryGrid}>
                  <article className={styles.summaryCard}>
                    <div className={styles.cardTitle}><span><Sparkles size={16} /></span><div><h3>8-week health summary</h3><small>AI-organized · Patient confirmed 10 Sep</small></div></div>
                    <ul className={styles.summaryList}>
                      <li><span className={styles.neutralDot} /><p><strong>Tongue body colour</strong>No persistent change from baseline</p></li>
                      <li><span className={styles.goldDot} /><p><strong>Coating coverage</strong>Persistently increased, mainly in the central region</p></li>
                      <li><span className={styles.goldDot} /><p><strong>Reported symptoms</strong>Fatigue increased over the past two weeks</p></li>
                      <li><span className={styles.neutralDot} /><p><strong>Medication adherence</strong>Three missed doses reported</p></li>
                    </ul>
                  </article>
                  <article className={styles.summaryCard}>
                    <div className={styles.cardTitle}><span><CheckCircle2 size={16} /></span><div><h3>Follow-up completion</h3><small>1 Jun–10 Sep 2026</small></div><strong>{selected.completion}%</strong></div>
                    <div className={styles.progressTrack}><i style={{ width: `${selected.completion}%` }} /></div>
                    <div className={styles.completionRows}>
                      <span><small>Quality-eligible tongue photos</small><strong>25 / 30</strong></span>
                      <span><small>Daily health records</small><strong>46 / 56</strong></span>
                      <span><small>Clinical test uploads</small><strong>3 / 4</strong></span>
                      <span className={styles.overdue}><small>Planned liver-function test</small><strong>Incomplete</strong></span>
                    </div>
                  </article>
                </div>

                <div className={styles.trendPreview}>
                  <div className={styles.panelHeading}><div><h3>Key longitudinal indicators</h3><span>Eight-week view</span></div><button>View all trends<ChevronRight size={15} /></button></div>
                  <div className={styles.trendCards}>
                    <article><div><span className={styles.metricIcon}><Weight size={16} /></span><p><small>Weight</small><strong>70.6 kg</strong><em>−2.2 kg</em></p></div><Sparkline values={weightData} /></article>
                    <article><div><span className={`${styles.metricIcon} ${styles.metricGold}`}><Activity size={16} /></span><p><small>Coating coverage index</small><strong>63</strong><em className={styles.up}>+21 pts</em></p></div><Sparkline values={coatingData} tone="gold" /></article>
                    <article className={styles.labCard}><div><span className={`${styles.metricIcon} ${styles.metricBlue}`}><HeartPulse size={16} /></span><p><small>Latest metabolic markers</small><strong>ALT 58 · AST 36</strong><em>Collected 8 Sep</em></p></div><span className={styles.rangeBadge}>2 outside range</span></article>
                  </div>
                </div>

                <div className={styles.bottomGrid}>
                  <article className={styles.questionsCard}><div className={styles.panelHeading}><div><h3>For the next consultation</h3><span>Submitted by patient</span></div><MessageSquareText size={18} /></div><blockquote>“Should I repeat the liver-function test before my appointment?”</blockquote><blockquote>“Could the recent fatigue relate to my treatment plan?”</blockquote></article>
                  <article className={styles.reviewCard} id="review-control"><div className={styles.panelHeading}><div><h3>Review control</h3><span>AI model TC-LA 2.4.1 · generated 10 Sep, 21:14</span></div><ShieldCheck size={18} /></div><div className={styles.statusPicker}>{(['Pending', 'Reviewed', 'Follow-up'] as const).map((status) => <button key={status} onClick={() => setReviewStatus(status)} className={reviewStatus === status ? styles.statusActive : ''}>{reviewStatus === status && <Check size={13} />}{status}</button>)}</div><label>Clinical note<textarea value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} placeholder="Add a short note for the care team…" /></label><button className={styles.saveButton} onClick={() => setSaved(true)}>{saved ? <><CheckCircle2 size={16} />Saved to demo</> : 'Save review'}</button></article>
                </div>
                <p className={styles.clinicalDisclaimer}>Tongue-image findings are descriptive and non-diagnostic. Review flags prioritize information; they do not diagnose disease, recommend treatment, or replace hospital tests.</p>
              </TabsContent>

              <TabsContent value="trends" className={styles.tabPanel}>
                <div className={styles.fullTrendGrid}>
                  <article><header><div><small>Weight · 8 weeks</small><strong>72.8 → 70.6 kg</strong></div><span>−3.0%</span></header><Sparkline values={weightData} /></article>
                  <article><header><div><small>Tongue coating coverage · 8 weeks</small><strong>Persistent increase</strong></div><span className={styles.trendWarning}>Review</span></header><Sparkline values={coatingData} tone="gold" /></article>
                </div>
                <Table className={styles.dataTable}><TableHeader><TableRow><TableHead>Indicator</TableHead><TableHead>Latest</TableHead><TableHead>Reference</TableHead><TableHead>Change</TableHead><TableHead>Source</TableHead></TableRow></TableHeader><TableBody>{[['ALT', '58 U/L', '7–40', '+12', 'Hospital lab'], ['AST', '36 U/L', '13–35', '+3', 'Hospital lab'], ['Platelets', '210 ×10⁹/L', '150–400', 'Stable', 'Hospital lab'], ['FIB-4', '1.08', 'Clinical review', '−0.04', 'Calculated']].map((row) => <TableRow key={row[0]}>{row.map((cell, index) => <TableCell key={cell} className={index === 0 ? styles.tableStrong : ''}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table>
              </TabsContent>

              <TabsContent value="records" className={styles.tabPanel}>
                <Table className={styles.dataTable}><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Record type</TableHead><TableHead>Summary</TableHead><TableHead>Verification</TableHead></TableRow></TableHeader><TableBody>{[
                  ['10 Sep 2026', 'Tongue photo', 'Quality passed · coating coverage increased', 'AI + patient'],
                  ['9 Sep 2026', 'Daily record', 'Fatigue · 3 missed medication doses', 'Patient confirmed'],
                  ['8 Sep 2026', 'Clinical results', 'ALT 58 · AST 36 · PLT 210', 'Hospital API'],
                  ['3 Sep 2026', 'Activity', '148 min moderate activity this week', 'Patient confirmed'],
                  ['28 Aug 2026', 'Alcohol', 'None reported', 'Patient confirmed'],
                ].map((row) => <TableRow key={row[0]}>{row.map((cell, index) => <TableCell key={cell} className={index === 1 ? styles.tableStrong : ''}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table>
              </TabsContent>

              <TabsContent value="questions" className={styles.tabPanel}>
                <div className={styles.questionDetail}><MessageSquareText size={22} /><div><small>Submitted 10 Sep 2026</small><h3>Should I repeat the liver-function test before my appointment?</h3><p>Patient context: the planned test in the current care plan is marked incomplete.</p></div></div>
                <div className={styles.questionDetail}><MessageSquareText size={22} /><div><small>Submitted 10 Sep 2026</small><h3>Could the recent fatigue relate to my treatment plan?</h3><p>Patient reported increased fatigue over two weeks and three missed medication doses.</p></div></div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </section>
    </main>
  );
}
