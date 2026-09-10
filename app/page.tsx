'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, BarChart3, BatteryFull, Bell, Building2, CalendarDays, Camera,
  Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Crown,
  FileHeart, FileImage, FlaskConical, FolderHeart, Home, ImagePlus, Info,
  Keyboard, LockKeyhole, Moon, Pill, ScanFace, ShieldCheck, Signal, Sparkles,
  TrendingUp, Upload, UserRound, Utensils, Weight, Wifi,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type WindowName = 'capture' | 'metrics' | 'daily' | null;
type ReportName = 'record' | 'single' | 'monthly' | 'visit' | 'hospital' | 'privacy' | 'help' | null;
type CaptureStep = 'capture' | 'review' | 'analyzing' | 'result';
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

const metricDefinitions = [
  { key: 'bmi', name: '身体质量指数', short: 'BMI', unit: 'kg/m²', range: '18.5–23.9', help: '根据身高和体重计算，用来大致了解体重状况。' },
  { key: 'alt', name: '丙氨酸氨基转移酶', short: 'ALT', unit: 'U/L', range: '7–40', help: '血液中的一种酶，通常与其他检查一起了解肝脏情况。' },
  { key: 'ast', name: '天门冬氨酸氨基转移酶', short: 'AST', unit: 'U/L', range: '13–35', help: '存在于肝脏、心脏和肌肉等组织，需要结合其他指标理解。' },
  { key: 'ggt', name: 'γ-谷氨酰转移酶', short: 'GGT', unit: 'U/L', range: '10–40', help: '常用于了解肝脏和胆道情况，单项结果不能判断具体原因。' },
  { key: 'tg', name: '甘油三酯', short: 'TG', unit: 'mmol/L', range: '0.3–1.7', help: '血液中的一种脂肪，通常是血脂检查的一部分。' },
] as const;

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
  const [metrics, setMetrics] = useState({ bmi: '23.7', alt: '38', ast: '29', ggt: '42', tg: '1.6' });
  const [daily, setDaily] = useState({ sleep: '7.0', activity: '35', meals: 'Balanced', medication: 'Taken as planned', alcohol: 'None', symptoms: 'No new symptoms' });
  const isVip = plan === 'vip';
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', weekday: 'long' }).format(new Date(2026, 8, 10)), []);

  const addEntry = (kind: HealthEntry['kind'], title: string, detail: string) => setEntries((current) => [
    { id: Date.now(), date: 'Sep 10 · Just now', kind, title, detail }, ...current,
  ]);

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
              <div className="page-top"><div><span className="eyebrow">{todayLabel}</span><h1>舌象智能检测</h1></div><button className="icon-button" aria-label="通知"><Bell size={19} /></button></div>
              <section className={done.capture ? 'tongue-focus complete' : 'tongue-focus'}>
                <div className="tongue-focus-top"><span className="focus-icon">{done.capture ? <CheckCircle2 size={30} /> : <ScanFace size={32} />}</span><span className="focus-status">{done.capture ? '今日已完成' : '建议晨起、进食前拍摄'}</span></div>
                <h2>{done.capture ? '今日舌象已完成分析' : '拍摄舌象，获取 AI 分析'}</h2>
                <p>约 2 分钟完成拍摄。AI 将检查照片质量，并识别舌色、舌苔和舌体形态。</p>
                <div className="focus-steps"><span><i>1</i>引导拍摄</span><span><i>2</i>AI 分析</span><span><i>3</i>查看报告</span></div>
                <button className="focus-action" onClick={() => { setCaptureStep(photo ? 'review' : 'capture'); setWindowName('capture'); }}><Camera size={19} />{done.capture ? '再次检测' : '开始舌象检测'}<ChevronRight size={18} /></button>
              </section>
              <button className="latest-report" onClick={() => setReportName('single')}><span className="report-symbol"><FileHeart size={21} /></span><span><small>最近一次 · 9月9日</small><strong>查看舌象 AI 分析报告</strong><em>舌苔较上次稍淡，整体处于近期记录范围</em></span><ChevronRight size={18} /></button>
              <details className="supporting-info">
                <summary><span><strong>辅助信息</strong><small>帮助理解舌象变化的背景，可选择填写</small></span><ChevronRight size={18} /></summary>
                <div className="supporting-actions">
                  <button onClick={() => { setMetricsStep('choose'); setWindowName('metrics'); }}><span><FlaskConical size={18} /></span><div><strong>体检指标</strong><small>{done.metrics ? '今日已更新' : '上传化验单或手动填写'}</small></div><ChevronRight size={16} /></button>
                  <button onClick={() => setWindowName('daily')}><span><ClipboardCheck size={18} /></span><div><strong>生活记录</strong><small>{done.daily ? '今日已记录' : '睡眠、饮食、活动等'}</small></div><ChevronRight size={16} /></button>
                </div>
              </details>
              <button className="month-preview" onClick={() => setReportName(isVip ? 'monthly' : 'visit')}><div><span className="eyebrow">30天舌象趋势</span><strong>观察舌象的连续变化</strong><p>{isVip ? '对比舌色、舌苔与舌体形态的变化。' : 'VIP 可查看连续舌象趋势报告。'}</p></div><TrendingUp size={25} /></button>
            </TabsContent>

            <TabsContent value="records" className="page">
              <div className="page-top"><div><span className="eyebrow">YOUR HISTORY</span><h1>Health records</h1></div><CalendarDays size={22} /></div>
              <div className="record-summary"><span><strong>{entries.length}</strong><small>records</small></span><span><strong>12</strong><small>tongue images</small></span><span><strong>5</strong><small>health indicators</small></span></div>
              <div className="section-heading"><h2>Recent activity</h2><span>Newest first</span></div>
              <div className="timeline">{entries.map((entry) => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setReportName(entry.kind === 'Tongue' ? 'single' : 'record'); }}><span className={`timeline-icon ${entry.kind.toLowerCase()}`}>{entry.kind === 'Tongue' ? <FileImage size={19} /> : entry.kind === 'Metrics' ? <FlaskConical size={19} /> : <ClipboardCheck size={19} />}</span><span><small>{entry.date}</small><strong>{entry.title}</strong><em>{entry.detail}</em></span><ChevronRight size={16} /></button>)}</div>
              <p className="disclaimer">Demo records remain on this page only and reset when refreshed.</p>
            </TabsContent>

            <TabsContent value="reports" className="page">
              <div className="page-top"><div><span className="eyebrow">AI ANALYSIS</span><h1>舌象分析报告</h1></div><BarChart3 size={23} /></div>
              <button className="report-card featured" onClick={() => setReportName('single')}><div className="report-card-top"><span className="report-symbol"><ScanFace size={21} /></span><span className="report-tag">最近一次</span></div><strong>单次舌象智能分析</strong><p>9月9日 · 照片质量合格 · 已归纳 5 项可见特征</p><div className="report-foot"><span>查看分析</span><ChevronRight size={17} /></div></button>
              <button className={isVip ? 'report-card' : 'report-card locked'} onClick={() => setReportName(isVip ? 'monthly' : 'visit')}><div className="report-card-top"><span className="report-symbol"><TrendingUp size={21} /></span>{!isVip && <LockKeyhole size={17} />}</div><strong>30天舌象变化趋势</strong><p>连续对比舌色、舌苔、舌体形态和其他可见特征。</p><div className="mini-chart" aria-label="舌象变化趋势示意"><i style={{ height: '36%' }} /><i style={{ height: '52%' }} /><i style={{ height: '44%' }} /><i style={{ height: '68%' }} /><i style={{ height: '62%' }} /><i style={{ height: '74%' }} /></div><div className="report-foot"><span>{isVip ? '查看趋势报告' : '预览 VIP 趋势'}</span><ChevronRight size={17} /></div></button>
              <p className="disclaimer">分析用于描述照片中的可见舌象特征与记录变化，不提供疾病诊断。</p>
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
          <TabsList className="bottomnav" aria-label="主导航"><TabsTrigger value="home"><Home /><span>检测</span></TabsTrigger><TabsTrigger value="records"><FolderHeart /><span>记录</span></TabsTrigger><TabsTrigger value="reports"><FileHeart /><span>报告</span></TabsTrigger><TabsTrigger value="profile"><UserRound /><span>我的</span></TabsTrigger></TabsList>
        </Tabs>
      </div>
      <footer className="stage-footer">TongueCare · Patient experience prototype</footer>

      <Sheet open={windowName === 'capture'} onOpenChange={(open) => !open && setWindowName(null)}>
        <SheetContent side="bottom" className="task-sheet capture-sheet">
          <SheetHeader>
            <SheetTitle>{captureStep === 'capture' ? '舌象拍摄' : captureStep === 'review' ? '确认照片' : captureStep === 'analyzing' ? 'AI 正在分析' : 'AI 分析完成'}</SheetTitle>
            <SheetDescription>{captureStep === 'capture' ? '按照画面提示拍摄清晰、完整的舌象。' : captureStep === 'review' ? '确认照片清晰后，再开始 AI 分析。' : captureStep === 'analyzing' ? '正在检查照片质量并识别可见舌象特征。' : '先查看分析摘要，再保存本次记录。'}</SheetDescription>
          </SheetHeader>
          <div className="sheet-body">
            {captureStep === 'analyzing' ? (
              <div className="ai-analyzing"><span className="ai-orbit"><Sparkles size={30} /></span><strong>正在分析舌象照片</strong><p>检查光线与清晰度</p><div className="analysis-progress"><i /></div><small>识别舌色、舌苔和舌体形态…</small></div>
            ) : captureStep === 'result' ? (
              <div className="capture-result">
                <div className="ai-result-head"><span><Sparkles size={22} /></span><div><small>AI 分析摘要</small><strong>照片质量良好，可以进行记录比较</strong></div></div>
                <div className="capture-findings"><span><small>舌色</small><strong>淡红</strong><em>在近期记录范围内</em></span><span><small>舌苔</small><strong>薄白</strong><em>较上次稍淡</em></span><span><small>舌体形态</small><strong>基本规则</strong><em>未见明显变化</em></span></div>
                <div className="info-line"><Info size={16} />AI 结果用于记录可见特征和变化趋势，不能代替医生诊断。</div>
                <button className="primary" onClick={saveCapture}>保存并查看完整报告<ChevronRight size={18} /></button>
                <button className="secondary-action" onClick={() => setCaptureStep('review')}>重新分析</button>
              </div>
            ) : (
              <>
                <div className="capture-frame">{photo ? <Image src={photo} alt="Selected tongue capture" width={420} height={280} unoptimized /> : <ScanFace size={72} />}<span className="capture-guide">{photo ? '照片已就位 · 请确认清晰度' : '请靠近一些 · 张大嘴巴 · 舌头自然伸出'}</span></div>
                <div className="quality-grid"><span><CheckCircle2 size={16} />光线</span><span><CheckCircle2 size={16} />距离</span><span><CheckCircle2 size={16} />清晰度</span></div>
                <label className="upload-button"><ImagePlus size={18} />{photo ? '重新拍摄或选择照片' : '拍摄或选择舌象照片'}<input type="file" accept="image/*" capture="environment" onChange={(event) => loadPhoto(event.target.files?.[0])} /></label>
                <button className="primary" onClick={analyzeCapture}>{photo ? '开始 AI 分析' : '使用示例照片体验 AI 分析'}<Sparkles size={18} /></button>
                <p className="disclaimer">本原型中的拍摄引导和 AI 分析为模拟效果。</p>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={windowName === 'metrics'} onOpenChange={(open) => !open && setWindowName(null)}>
        <SheetContent side="bottom" className="task-sheet metric-sheet">
          <SheetHeader>
            <SheetTitle>{metricsStep === 'choose' ? '添加检查结果' : metricsStep === 'upload' ? '上传化验单' : metricsStep === 'manual' ? '手动填写' : '确认识别结果'}</SheetTitle>
            <SheetDescription>{metricsStep === 'choose' ? '不认识指标也没关系，可以直接上传化验单。' : metricsStep === 'confirm' ? '请对照原始化验单确认数值、单位和参考范围。' : '检查结果将加入你的健康档案。'}</SheetDescription>
          </SheetHeader>
          <div className="sheet-body metric-flow">
            {metricsStep === 'choose' ? (
              <div className="entry-methods">
                <button className="entry-method recommended" onClick={() => setMetricsStep('upload')}><span className="method-icon"><Upload size={22} /></span><span><small>推荐</small><strong>拍照或上传化验单</strong><em>自动识别检查名称、数值、单位和参考范围，你只需确认。</em></span><ChevronRight size={18} /></button>
                <button className="entry-method" onClick={() => setMetricsStep('manual')}><span className="method-icon"><Keyboard size={22} /></span><span><strong>手动填写</strong><em>适合已经知道指标在化验单什么位置的用户。</em></span><ChevronRight size={18} /></button>
              </div>
            ) : metricsStep === 'upload' ? (
              <div className="upload-step">
                <button className="back-link" onClick={() => setMetricsStep('choose')}><ArrowLeft size={16} />返回选择</button>
                <label className="lab-upload"><Upload size={34} /><strong>{labFileName || '选择化验单照片或 PDF'}</strong><span>支持 JPG、PNG、PDF · 演示文件不会上传</span><input type="file" accept=".pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setLabFileName(file.name); setMetricsStep('confirm'); } }} /></label>
                <div className="upload-tips"><strong>拍摄时请注意</strong><span><CheckCircle2 size={16} />完整拍下检查名称、数值和参考范围</span><span><CheckCircle2 size={16} />保持光线均匀，避免反光和模糊</span></div>
                <button className="secondary-action" onClick={() => { setLabFileName('demo-lab-report.pdf'); setMetricsStep('confirm'); }}>试用演示化验单</button>
              </div>
            ) : metricsStep === 'manual' ? (
              <div className="manual-metrics">
                <button className="back-link" onClick={() => setMetricsStep('choose')}><ArrowLeft size={16} />返回选择</button>
                {metricDefinitions.map((item) => (
                  <details key={item.key} className="metric-item">
                    <summary><span><strong>{item.name}</strong><small>{item.short} · {item.unit}</small></span><span className="metric-value">{metrics[item.key]}</span><ChevronRight size={16} /></summary>
                    <div className="metric-editor"><p>{item.help}</p><label>化验结果<div><input inputMode="decimal" value={metrics[item.key]} onChange={(event) => setMetrics({ ...metrics, [item.key]: event.target.value })} /><span>{item.unit}</span></div></label><small>请使用化验单上显示的单位和参考范围。</small></div>
                  </details>
                ))}
                <button className="primary" onClick={() => setMetricsStep('confirm')}>检查填写内容<ChevronRight size={17} /></button>
              </div>
            ) : (
              <div className="confirm-metrics">
                <button className="back-link" onClick={() => setMetricsStep(labFileName ? 'upload' : 'manual')}><ArrowLeft size={16} />返回修改</button>
                {labFileName && <div className="source-file"><FileImage size={18} /><span><small>信息来源</small><strong>{labFileName}</strong></span><CheckCircle2 size={18} /></div>}
                <div className="confirm-list">{metricDefinitions.map((item) => <div key={item.key}><span><strong>{item.name}</strong><small>{item.short} · 化验单范围 {item.range} {item.unit}</small></span><span className="confirmed-value"><strong>{metrics[item.key]}</strong><small>{item.unit}</small></span>{item.key === 'ggt' && <em>超出所填参考范围</em>}</div>)}</div>
                <div className="info-line"><Info size={16} />“超出参考范围”不等于确诊疾病。请保留原始化验单，并在复诊时向医生确认。</div>
                <button className="primary" onClick={saveMetrics}>确认并保存<Check size={18} /></button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={windowName === 'daily'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>Daily health record</SheetTitle><SheetDescription>Keep today’s context together in one quick entry.</SheetDescription></SheetHeader><div className="sheet-body daily-form"><label><Moon size={17} /><span>Sleep<input value={daily.sleep} onChange={(event) => setDaily({ ...daily, sleep: event.target.value })} inputMode="decimal" /></span><em>hours</em></label><label><Activity size={17} /><span>Activity<input value={daily.activity} onChange={(event) => setDaily({ ...daily, activity: event.target.value })} inputMode="numeric" /></span><em>minutes</em></label><label><Utensils size={17} /><span>Meals<select value={daily.meals} onChange={(event) => setDaily({ ...daily, meals: event.target.value })}><option>Balanced</option><option>Light</option><option>High fat</option><option>Irregular</option></select></span></label><label><Pill size={17} /><span>Medication<select value={daily.medication} onChange={(event) => setDaily({ ...daily, medication: event.target.value })}><option>Taken as planned</option><option>Missed a dose</option><option>Changed</option><option>Not applicable</option></select></span></label><label><Activity size={17} /><span>Alcohol<select value={daily.alcohol} onChange={(event) => setDaily({ ...daily, alcohol: event.target.value })}><option>None</option><option>1 drink</option><option>2 or more drinks</option></select></span></label><label className="wide"><Info size={17} /><span>Symptoms<textarea value={daily.symptoms} onChange={(event) => setDaily({ ...daily, symptoms: event.target.value })} /></span></label><button className="primary" onClick={saveDaily}>Save today’s record<Check size={18} /></button></div></SheetContent></Sheet>

      <Dialog open={!!reportName} onOpenChange={(open) => !open && setReportName(null)}><DialogContent className="report-dialog"><DialogTitle>{reportName === 'record' ? selectedEntry?.title ?? 'Record details' : reportName === 'single' ? 'Single tongue analysis' : reportName === 'monthly' ? 'September health trend' : reportName === 'visit' ? (isVip ? 'Visit preparation' : 'VIP monthly report') : reportName === 'hospital' ? 'Hospital care plan' : reportName === 'privacy' ? 'Privacy and data' : 'Help'}</DialogTitle><DialogDescription>{reportName === 'record' ? selectedEntry?.date ?? 'Health record' : reportName === 'single' ? 'Sep 10 · Patient report' : 'TongueCare patient experience'}</DialogDescription>
        {reportName === 'record' && selectedEntry ? <div className="dialog-scroll"><div className={`record-detail-hero ${selectedEntry.kind.toLowerCase()}`}>{selectedEntry.kind === 'Metrics' ? <FlaskConical size={26} /> : <ClipboardCheck size={26} />}<span><small>{selectedEntry.kind.toUpperCase()} RECORD</small><strong>{selectedEntry.detail}</strong></span></div>{selectedEntry.kind === 'Metrics' ? <div className="record-detail-grid">{metricDefinitions.map((item) => <span key={item.key}><small>{item.name} · {item.short}</small><strong>{metrics[item.key]}</strong><em>{item.unit}</em></span>)}</div> : <div className="record-detail-list">{[['Sleep', `${daily.sleep} hours`], ['Activity', `${daily.activity} minutes`], ['Meals', daily.meals], ['Medication', daily.medication], ['Alcohol', daily.alcohol], ['Symptoms', daily.symptoms]].map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}<p className="disclaimer">This is a demonstration record and resets when the page is refreshed.</p></div>
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
