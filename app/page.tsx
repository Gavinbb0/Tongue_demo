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
type ReportName = 'record' | 'single' | 'monthly' | 'visit' | 'clinician' | 'hospital' | 'privacy' | 'help' | null;
type CaptureStep = 'capture' | 'review' | 'analyzing' | 'result';
type HealthEntry = { id: number; date: string; kind: 'Tongue' | 'Metrics' | 'Daily'; title: string; detail: string };

const starterEntries: HealthEntry[] = [
  { id: 1, date: '9月9日 · 08:28', kind: 'Tongue', title: '晨间舌象记录', detail: '照片质量合格 · 基础分析已完成' },
  { id: 2, date: '9月8日 · 20:10', kind: 'Daily', title: '每日生活记录', detail: '睡眠 6.5 小时 · 活动 32 分钟 · 用药无变化' },
  { id: 3, date: '9月6日 · 09:02', kind: 'Metrics', title: '体检指标', detail: 'ALT、AST、GGT 和 TG 已更新' },
];

const tongueFeatures = [
  ['舌色', '淡红', '处于近期记录范围内'],
  ['舌苔', '薄白', '较上月稍淡'],
  ['舌体形态', '基本规则', '连续记录中未见明显变化'],
  ['湿润度', '适中', '近期记录较稳定'],
  ['裂纹与齿痕', '轻微齿痕', '建议继续保持相同条件拍摄'],
];

const metricDefinitions = [
  { key: 'bmi', name: '身体质量指数', short: 'BMI', unit: 'kg/m²', range: '18.5–23.9', help: '根据身高和体重计算，用来大致了解体重状况。' },
  { key: 'alt', name: '丙氨酸氨基转移酶', short: 'ALT', unit: 'U/L', range: '7–40', help: '血液中的一种酶，通常与其他检查一起了解肝脏情况。' },
  { key: 'ast', name: '天门冬氨酸氨基转移酶', short: 'AST', unit: 'U/L', range: '13–35', help: '存在于肝脏、心脏和肌肉等组织，需要结合其他指标理解。' },
  { key: 'ggt', name: 'γ-谷氨酰转移酶', short: 'GGT', unit: 'U/L', range: '10–40', help: '常用于了解肝脏和胆道情况，单项结果不能判断具体原因。' },
  { key: 'tg', name: '甘油三酯', short: 'TG', unit: 'mmol/L', range: '0.3–1.7', help: '血液中的一种脂肪，通常是血脂检查的一部分。' },
] as const;

const medicalDisclaimer = '本摘要只整理舌象照片中的可见特征和历史记录变化，不能用于诊断MASLD或判断病情进展，也不能代替医院检查和医生评估';

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
  const [daily, setDaily] = useState({ sleep: '7.0', activity: '35', meals: '均衡', medication: '按计划服用', alcohol: '无', symptoms: '没有新症状' });
  const [visitPrep, setVisitPrep] = useState({
    recent: '近期舌苔以薄白为主，与上次相比稍淡，整体处于个人记录范围内。',
    concern: '最近睡眠时间较短时更容易感到疲劳。',
    doctorNote: '想请医生结合检查结果说明这些变化是否需要继续观察。',
  });
  const [visitSaved, setVisitSaved] = useState(false);
  const isVip = plan === 'vip';
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(2026, 8, 10)), []);

  const addEntry = (kind: HealthEntry['kind'], title: string, detail: string) => setEntries((current) => [
    { id: Date.now(), date: '9月10日 · 刚刚', kind, title, detail }, ...current,
  ]);

  const generateVisitSummary = () => isVip
    ? `近30天完成25次舌象记录。舌象照片AI整理显示：舌色多为淡红，舌苔以薄白为主，最近一周较月初稍淡，舌体形态整体较稳定。健康记录显示最近睡眠${daily.sleep}小时、活动${daily.activity}分钟，饮食为${daily.meals}，用药情况为${daily.medication}；最近一次体检记录中GGT为${metrics.ggt} U/L，超出所填参考范围。以上变化的原因需要由医生结合医院检查评估。`
    : `近7天完成4次舌象记录。最近一次舌象照片AI整理为舌色淡红、舌苔薄白，较上次稍淡；最近生活记录为睡眠${daily.sleep}小时、活动${daily.activity}分钟。`;

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
    addEntry('Tongue', '今日舌象记录', '照片质量合格 · 智能分析报告已完成');
    setWindowName(null);
    setReportName('single');
  };
  const saveMetrics = () => {
    setDone((state) => ({ ...state, metrics: true }));
    addEntry('Metrics', '体检指标已更新', `BMI ${metrics.bmi} · ALT ${metrics.alt} · AST ${metrics.ast}`);
    setWindowName(null);
  };
  const saveDaily = () => {
    setDone((state) => ({ ...state, daily: true }));
    addEntry('Daily', '今日生活记录', `睡眠 ${daily.sleep} 小时 · 活动 ${daily.activity} 分钟 · ${daily.meals}`);
    setWindowName(null);
  };

  return (
    <main className="stage">
      <header className="brandbar">
        <div className="brand"><span className="logo"><Activity size={22} /></span><span>舌康舌象记录</span><span className={isVip ? 'edition vip' : 'edition'}>{isVip ? '高级版' : '基础版'}</span></div>
        <div className="plan-preview" aria-label="会员版本预览"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>基础版</button><button className={isVip ? 'active vip' : ''} onClick={() => setPlan('vip')}><Crown size={13} /> 高级版</button></div>
      </header>

      <div className="phone">
        <div className="statusbar"><span>9:41</span><span><Signal size={14} /><Wifi size={14} /><BatteryFull size={19} /></span></div>
        <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="app-shell">
          <div className="screen">
            <TabsContent value="home" className="page">
              <div className="page-top"><div><span className="eyebrow">{todayLabel}</span><h1>每日舌象记录</h1></div><button className="icon-button" aria-label="通知"><Bell size={19} /></button></div>
              <section className={done.capture ? 'tongue-focus complete' : 'tongue-focus'}>
                <div className="tongue-focus-top"><span className="focus-icon">{done.capture ? <CheckCircle2 size={30} /> : <ScanFace size={32} />}</span><span className="focus-status">{done.capture ? '今日已完成' : '建议晨起、进食前拍摄'}</span></div>
                <h2>{done.capture ? '今日舌象记录已整理' : '拍摄舌象，记录每日变化'}</h2>
                <p>约 2 分钟完成拍摄。系统将检查照片质量，并识别舌色、舌苔和舌体形态。</p>
                <div className="focus-steps"><span><i>1</i>引导拍摄</span><span><i>2</i>智能分析</span><span><i>3</i>查看报告</span></div>
                <button className="focus-action" onClick={() => { setCaptureStep(photo ? 'review' : 'capture'); setWindowName('capture'); }}><Camera size={19} />{done.capture ? '再次记录' : '开始舌象记录'}<ChevronRight size={18} /></button>
              </section>
              <button className="latest-report" onClick={() => setReportName('single')}><span className="report-symbol"><FileHeart size={21} /></span><span><small>最近一次 · 9月9日</small><strong>查看舌象智能分析报告</strong><em>舌苔较上次稍淡，整体处于近期记录范围</em></span><ChevronRight size={18} /></button>
              <details className="supporting-info">
                <summary><span><strong>辅助信息</strong><small>帮助理解舌象变化的背景，可选择填写</small></span><ChevronRight size={18} /></summary>
                <div className="supporting-actions">
                  <button onClick={() => { setMetricsStep('choose'); setWindowName('metrics'); }}><span><FlaskConical size={18} /></span><div><strong>体检指标</strong><small>{done.metrics ? '今日已更新' : '上传化验单或手动填写'}</small></div><ChevronRight size={16} /></button>
                  <button onClick={() => setWindowName('daily')}><span><ClipboardCheck size={18} /></span><div><strong>生活记录</strong><small>{done.daily ? '今日已记录' : '睡眠、饮食、活动等'}</small></div><ChevronRight size={16} /></button>
                </div>
              </details>
              <button className="month-preview" onClick={() => setReportName('monthly')}><div><span className="eyebrow">30天舌象趋势</span><strong>观察舌象的连续变化</strong><p>{isVip ? '对比舌色、舌苔与舌体形态的变化。' : '高级版可查看连续舌象趋势报告。'}</p></div><TrendingUp size={25} /></button>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="records" className="page">
              <div className="page-top"><div><span className="eyebrow">历史记录</span><h1>我的舌象记录</h1></div><CalendarDays size={22} /></div>
              <div className="record-summary"><span><strong>{entries.length}</strong><small>全部记录</small></span><span><strong>12</strong><small>舌象照片</small></span><span><strong>5</strong><small>体检指标</small></span></div>
              <div className="section-heading"><h2>最近记录</h2><span>按时间倒序</span></div>
              <div className="timeline">{entries.map((entry) => <button key={entry.id} onClick={() => { setSelectedEntry(entry); setReportName(entry.kind === 'Tongue' ? 'single' : 'record'); }}><span className={`timeline-icon ${entry.kind.toLowerCase()}`}>{entry.kind === 'Tongue' ? <FileImage size={19} /> : entry.kind === 'Metrics' ? <FlaskConical size={19} /> : <ClipboardCheck size={19} />}</span><span><small>{entry.date}</small><strong>{entry.title}</strong><em>{entry.detail}</em></span><ChevronRight size={16} /></button>)}</div>
              <p className="demo-note">当前为演示记录，刷新页面后会恢复初始状态。</p>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="reports" className="page">
              <div className="page-top"><div><span className="eyebrow">记录整理</span><h1>舌象记录报告</h1></div><BarChart3 size={23} /></div>
              <button className="report-overview" onClick={() => setReportName('single')}>
                <div className="overview-top"><span className="overview-icon"><ScanFace size={25} /></span><span className="overview-plan">{isVip ? '高级版深度报告' : '基础健康报告'}</span></div>
                <div className="overview-title"><small>9月9日 · 最近一次记录</small><strong>本次舌象整体较稳定</strong><p>{isVip ? '已完成5项舌象特征与连续变化分析' : '已完成3项核心舌象特征分析'}</p></div>
                <div className="overview-metrics"><span><small>舌色</small><strong>淡红</strong></span><span><small>舌苔</small><strong>薄白</strong></span><span><small>照片质量</small><strong>合格</strong></span></div>
                <div className="overview-action"><span>{isVip ? '查看深度报告' : '查看精简报告'}</span><ChevronRight size={18} /></div>
              </button>
              <div className="report-access-note"><CheckCircle2 size={17} /><p><strong>基础版也能查看健康报告</strong>包含照片质量、舌色、舌苔与舌体形态等核心结论。</p></div>
              <div className="section-heading report-tools-heading"><h2>趋势与复诊工具</h2><span>{isVip ? '高级版已启用' : '基础功能可用'}</span></div>
              <div className="report-tool-list">
                <button onClick={() => setReportName('monthly')}><span className="tool-icon"><TrendingUp size={20} /></span><span className="tool-copy"><strong>30天舌象变化趋势</strong><small>{isVip ? '按周对比并结合辅助信息深度分析' : '查看精简的整体变化趋势'}</small></span><em>{isVip ? '深度版' : '精简版'}</em><ChevronRight size={16} /></button>
                <button onClick={openVisitPrep}><span className="tool-icon gold"><ClipboardCheck size={20} /></span><span className="tool-copy"><strong>复诊前情况整理</strong><small>{isVip ? 'AI整合30天舌象与健康记录' : 'AI概括近7天舌象与健康记录'}</small></span><em>{isVip ? '深度' : '简要'}</em><ChevronRight size={16} /></button>
              </div>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>

            <TabsContent value="profile" className="page">
              <span className="eyebrow">个人中心</span><h1>我的舌康</h1>
              <section className="profile-card"><span className="avatar"><UserRound size={28} /></span><div><strong>小康</strong><small>{isVip ? '高级版 · 完整演示权限' : '基础版 · 免费使用'}</small></div><ChevronRight size={17} /></section>
              <section className="membership-card"><div><Crown size={20} /><span><strong>{isVip ? '高级版已启用' : '基础版会员'}</strong><small>{isVip ? '完整单次报告和连续趋势分析' : '舌象拍摄、记录和基础分析'}</small></span></div><div className="membership-switch"><button className={!isVip ? 'active' : ''} onClick={() => setPlan('basic')}>基础版</button><button className={isVip ? 'active' : ''} onClick={() => setPlan('vip')}>高级版</button></div></section>
              <div className="menu-list">
                <button onClick={() => setReportName('hospital')}><Building2 size={19} /><span><strong>医院关怀计划</strong><small>{hospitalLinked ? '已连接 · 高级版关怀期生效中' : '连接后可获得医院提供的高级版权益'}</small></span><ChevronRight size={16} /></button>
                <div><Bell size={19} /><span><strong>每日提醒</strong><small>提醒完成当天的舌象记录</small></span><Switch checked={reminder} onCheckedChange={setReminder} /></div>
                <button onClick={() => setReportName('privacy')}><ShieldCheck size={19} /><span><strong>隐私与数据</strong><small>管理照片和记录的使用方式</small></span><ChevronRight size={16} /></button>
                <button onClick={() => setReportName('help')}><CircleHelp size={19} /><span><strong>使用帮助</strong><small>了解患者端演示功能</small></span><ChevronRight size={16} /></button>
              </div>
              <p className="demo-note">舌康患者端原型 · 演示数据 · 2.0版</p>
              <p className="disclaimer page-disclaimer">{medicalDisclaimer}</p>
            </TabsContent>
          </div>
          <TabsList className="bottomnav" aria-label="主导航"><TabsTrigger value="home"><Home /><span>今日</span></TabsTrigger><TabsTrigger value="records"><FolderHeart /><span>记录</span></TabsTrigger><TabsTrigger value="reports"><FileHeart /><span>报告</span></TabsTrigger><TabsTrigger value="profile"><UserRound /><span>我的</span></TabsTrigger></TabsList>
        </Tabs>
      </div>
      <footer className="stage-footer">舌康舌象记录 · 患者端体验原型</footer>

      <Sheet open={windowName === 'capture'} onOpenChange={(open) => !open && setWindowName(null)}>
        <SheetContent side="bottom" className="task-sheet capture-sheet">
          <SheetHeader>
            <SheetTitle>{captureStep === 'capture' ? '舌象拍摄' : captureStep === 'review' ? '确认照片' : captureStep === 'analyzing' ? '正在智能分析' : '智能分析完成'}</SheetTitle>
            <SheetDescription>{captureStep === 'capture' ? '按照画面提示拍摄清晰、完整的舌象。' : captureStep === 'review' ? '确认照片清晰后，再开始智能分析。' : captureStep === 'analyzing' ? '正在检查照片质量并识别可见舌象特征。' : '先查看分析摘要，再保存本次记录。'}</SheetDescription>
          </SheetHeader>
          <div className="sheet-body">
            {captureStep === 'analyzing' ? (
              <div className="ai-analyzing"><span className="ai-orbit"><Sparkles size={30} /></span><strong>正在分析舌象照片</strong><p>检查光线与清晰度</p><div className="analysis-progress"><i /></div><small>识别舌色、舌苔和舌体形态…</small></div>
            ) : captureStep === 'result' ? (
              <div className="capture-result">
                <div className="ai-result-head"><span><Sparkles size={22} /></span><div><small>智能分析摘要</small><strong>照片质量良好，可以进行记录比较</strong></div></div>
                <div className="capture-findings"><span><small>舌色</small><strong>淡红</strong><em>在近期记录范围内</em></span><span><small>舌苔</small><strong>薄白</strong><em>较上次稍淡</em></span><span><small>舌体形态</small><strong>基本规则</strong><em>未见明显变化</em></span></div>
                <div className="info-line"><Info size={16} />智能分析用于记录可见特征和变化趋势，不能代替医生诊断。</div>
                <button className="primary" onClick={saveCapture}>保存并查看完整报告<ChevronRight size={18} /></button>
                <button className="secondary-action" onClick={() => setCaptureStep('review')}>重新分析</button>
              </div>
            ) : (
              <>
                <div className="capture-frame">{photo ? <Image src={photo} alt="已选择的舌象照片" width={420} height={280} unoptimized /> : <ScanFace size={72} />}<span className="capture-guide">{photo ? '照片已就位 · 请确认清晰度' : '请靠近一些 · 张大嘴巴 · 舌头自然伸出'}</span></div>
                <div className="quality-grid"><span><CheckCircle2 size={16} />光线</span><span><CheckCircle2 size={16} />距离</span><span><CheckCircle2 size={16} />清晰度</span></div>
                <label className="upload-button"><ImagePlus size={18} />{photo ? '重新拍摄或选择照片' : '拍摄或选择舌象照片'}<input type="file" accept="image/*" capture="environment" onChange={(event) => loadPhoto(event.target.files?.[0])} /></label>
                <button className="primary" onClick={analyzeCapture}>{photo ? '开始智能分析' : '使用示例照片体验智能分析'}<Sparkles size={18} /></button>
                <p className="disclaimer">本原型中的拍摄引导和智能分析为模拟效果。</p>
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
                <label className="lab-upload"><Upload size={34} /><strong>{labFileName || '选择化验单照片或文档'}</strong><span>支持常见图片和文档格式 · 演示文件不会上传</span><input type="file" accept=".pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setLabFileName(file.name); setMetricsStep('confirm'); } }} /></label>
                <div className="upload-tips"><strong>拍摄时请注意</strong><span><CheckCircle2 size={16} />完整拍下检查名称、数值和参考范围</span><span><CheckCircle2 size={16} />保持光线均匀，避免反光和模糊</span></div>
                <button className="secondary-action" onClick={() => { setLabFileName('演示化验单.pdf'); setMetricsStep('confirm'); }}>试用演示化验单</button>
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

      <Sheet open={windowName === 'daily'} onOpenChange={(open) => !open && setWindowName(null)}><SheetContent side="bottom" className="task-sheet"><SheetHeader><SheetTitle>每日生活记录</SheetTitle><SheetDescription>简单记录今天的生活情况，作为舌象变化的辅助信息。</SheetDescription></SheetHeader><div className="sheet-body daily-form"><label><Moon size={17} /><span>睡眠<input value={daily.sleep} onChange={(event) => setDaily({ ...daily, sleep: event.target.value })} inputMode="decimal" /></span><em>小时</em></label><label><Activity size={17} /><span>活动<input value={daily.activity} onChange={(event) => setDaily({ ...daily, activity: event.target.value })} inputMode="numeric" /></span><em>分钟</em></label><label><Utensils size={17} /><span>饮食<select value={daily.meals} onChange={(event) => setDaily({ ...daily, meals: event.target.value })}><option>均衡</option><option>清淡</option><option>高油脂</option><option>不规律</option></select></span></label><label><Pill size={17} /><span>用药<select value={daily.medication} onChange={(event) => setDaily({ ...daily, medication: event.target.value })}><option>按计划服用</option><option>漏服一次</option><option>有所调整</option><option>不适用</option></select></span></label><label><Activity size={17} /><span>饮酒<select value={daily.alcohol} onChange={(event) => setDaily({ ...daily, alcohol: event.target.value })}><option>无</option><option>一杯</option><option>两杯或更多</option></select></span></label><label className="wide"><Info size={17} /><span>身体感受<textarea value={daily.symptoms} onChange={(event) => setDaily({ ...daily, symptoms: event.target.value })} /></span></label><button className="primary" onClick={saveDaily}>保存今日记录<Check size={18} /></button></div></SheetContent></Sheet>

      <Dialog open={!!reportName} onOpenChange={(open) => !open && setReportName(null)}><DialogContent className="report-dialog"><DialogTitle>{reportName === 'record' ? selectedEntry?.title ?? '记录详情' : reportName === 'single' ? '单次舌象记录摘要' : reportName === 'monthly' ? '9月舌象变化趋势' : reportName === 'visit' ? '复诊前情况整理' : reportName === 'clinician' ? '供医生查看的复诊摘要' : reportName === 'hospital' ? '医院关怀计划' : reportName === 'privacy' ? '隐私与数据' : '使用帮助'}</DialogTitle><DialogDescription>{reportName === 'record' ? selectedEntry?.date ?? '健康记录' : reportName === 'single' ? '9月10日 · 患者报告' : reportName === 'visit' ? '编辑近期情况、主要担忧和想向医生说明的内容' : reportName === 'clinician' ? '示例患者 · 已由患者确认' : '舌康患者端体验'}</DialogDescription>
        {reportName === 'record' && selectedEntry ? <div className="dialog-scroll"><div className={`record-detail-hero ${selectedEntry.kind.toLowerCase()}`}>{selectedEntry.kind === 'Metrics' ? <FlaskConical size={26} /> : <ClipboardCheck size={26} />}<span><small>{selectedEntry.kind === 'Metrics' ? '体检指标记录' : '每日生活记录'}</small><strong>{selectedEntry.detail}</strong></span></div>{selectedEntry.kind === 'Metrics' ? <div className="record-detail-grid">{metricDefinitions.map((item) => <span key={item.key}><small>{item.name} · {item.short}</small><strong>{metrics[item.key]}</strong><em>{item.unit}</em></span>)}</div> : <div className="record-detail-list">{[['睡眠', `${daily.sleep} 小时`], ['活动', `${daily.activity} 分钟`], ['饮食', daily.meals], ['用药', daily.medication], ['饮酒', daily.alcohol], ['身体感受', daily.symptoms]].map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}<p className="disclaimer">当前为演示记录，刷新页面后会恢复初始状态。</p></div>
        : reportName === 'single' ? <div className="dialog-scroll"><div className="analysis-hero"><span><ScanFace size={28} /></span><div><small>照片质量</small><strong>适合进行对比</strong><p>光线、位置和清晰度均通过演示检查。</p></div></div><div className="feature-table">{tongueFeatures.slice(0, isVip ? 5 : 3).map(([label, value, trend]) => <div key={label}><span><small>{label}</small><strong>{value}</strong></span><em>{trend}</em></div>)}</div>{!isVip ? <button className="vip-callout" onClick={() => setPlan('vip')}><LockKeyhole size={18} /><span><strong>解锁完整分析</strong><small>高级版增加湿润度、裂纹、齿痕和更详细的连续变化信息。</small></span><ChevronRight size={16} /></button> : <div className="insight"><Sparkles size={18} /><span><strong>连续变化提示</strong><p>与上月相比，你的舌苔看起来稍淡。建议继续在相似条件下拍摄，以便保持趋势可比性。</p></span></div>}<p className="disclaimer">报告描述照片中的可见特征和记录变化，不判断原因，也不提供疾病诊断。</p></div>
        : reportName === 'monthly' ? <div className="dialog-scroll">{!isVip ? <><div className="monthly-score basic"><span><small>近30天记录</small><strong>8</strong><em>次</em></span><TrendingUp size={30} /></div><div className="trend-block"><div><span>舌苔整体趋势</span><strong>较稳定</strong></div><div className="trend-line"><i /><i /><i /><i /><i /><i /><i /></div><p>最近记录中的舌苔以薄白为主，整体未见明显持续变化。</p></div><div className="basic-trend-summary"><span><CheckCircle2 size={17} /><p><strong>舌色</strong>以淡红为主</p></span><span><CheckCircle2 size={17} /><p><strong>舌体形态</strong>近期记录基本一致</p></span></div><div className="vip-callout" role="note"><Crown size={18} /><span><strong>高级版增加深度分析</strong><small>提供按周对比、更多舌象特征，以及体检指标和生活因素的关联整理。</small></span></div><p className="disclaimer">这是基础版精简趋势报告，用于回顾记录变化，不用于疾病诊断。</p></> : <><div className="monthly-score"><span><small>记录完成度</small><strong>25 / 30</strong><em>天</em></span><TrendingUp size={30} /></div><div className="trend-block"><div><span>舌苔表现</span><strong>整体较稳定</strong></div><div className="trend-line"><i /><i /><i /><i /><i /><i /><i /></div><p>近期舌象照片整体处于你的个人记录范围内。</p></div><div className="metric-row"><span><Weight size={17} /><em>体重</em><strong>68.4 千克</strong><small>减少 0.7 千克</small></span><span><FlaskConical size={17} /><em>丙氨酸氨基转移酶</em><strong>{metrics.alt} U/L</strong><small>最近一次结果</small></span></div><div className="insight"><Info size={18} /><span><strong>辅助信息提示</strong><p>一项体检指标与上次记录不同，建议保留原始化验单，需要时请专业人员解读。</p></span></div><p className="disclaimer">趋势信息用于整理连续记录，不用于判断疾病阶段。</p></>}</div>
        : reportName === 'visit' ? <div className="dialog-scroll visit-prep"><div className={isVip ? 'visit-mode premium' : 'visit-mode'}><span>{isVip ? '高级版 · 深度整理' : '基础版 · 简要概括'}</span><small>{isVip ? '整合30天舌象AI结果、生活记录与体检指标' : '概括近7天舌象AI结果与最近健康记录'}</small></div><div className="visit-edit-form"><div className="visit-summary-editor"><div className="visit-field-title"><label htmlFor="recent-summary">近期情况</label><button type="button" onClick={() => { setVisitSaved(false); setVisitPrep({ ...visitPrep, recent: generateVisitSummary() }); }}><Sparkles size={14} />重新生成</button></div><small className="summary-source">由舌象照片AI整理与健康记录自动生成，可继续编辑</small><textarea id="recent-summary" value={visitPrep.recent} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, recent: event.target.value }); }} /></div><label><span>主要担忧</span><textarea value={visitPrep.concern} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, concern: event.target.value }); }} /></label><label><span>想向医生说明的内容</span><textarea value={visitPrep.doctorNote} onChange={(event) => { setVisitSaved(false); setVisitPrep({ ...visitPrep, doctorNote: event.target.value }); }} /></label></div>{isVip ? <button className="clinician-preview-button" onClick={() => setReportName('clinician')}><span><FileHeart size={19} /><span><strong>供医生查看的复诊摘要示例</strong><small>预览整理后的完整就诊材料</small></span></span><ChevronRight size={17} /></button> : <div className="clinician-preview-locked"><LockKeyhole size={16} /><span><strong>高级版可生成完整复诊摘要</strong><small>整合长期舌象、患者自述与相关临床资料。</small></span></div>}<button className="primary" onClick={() => setVisitSaved(true)}>{visitSaved ? '已保存本次整理' : '保存复诊前情况'}<Check size={18} /></button><p className="disclaimer">{medicalDisclaimer}</p></div>
        : reportName === 'clinician' ? <div className="dialog-scroll clinician-summary"><button className="back-link" onClick={() => setReportName('visit')}><ArrowLeft size={16} />返回复诊前情况整理</button><section className="clinician-patient"><span><small>患者</small><strong>李女士，48岁</strong></span><span><small>医院编号</small><strong>MASLD-10482</strong></span><span><small>随访周期</small><strong>2026年6月1日—8月10日</strong></span><span><small>下次预约</small><strong>2026年8月18日</strong></span><em><CheckCircle2 size={15} />患者已确认</em></section><section className="clinician-section"><h3>舌象纵向变化整理</h3><div className="clinician-rows"><span><small>舌体颜色</small><strong>与基线相比未见持续变化</strong></span><span><small>舌苔覆盖范围</small><strong>较基线持续增加</strong></span><span><small>舌苔分布</small><strong>舌中部覆盖范围增加</strong></span><span><small>表面湿润表现</small><strong>未见持续变化</strong></span><span><small>裂纹与舌缘特征</small><strong>未见一致变化</strong></span></div><p className="section-caution">以上为描述性、非诊断性信息，不能单独提示脂肪变性、炎症、纤维化或MASLD进展。</p></section><section className="clinician-section"><h3>患者自述信息</h3><ul><li>过去两周疲劳感增加。</li><li>自述漏服药物3次。</li></ul></section><section className="clinician-section"><h3>相关临床资料</h3><div className="clinical-data"><span><small>ALT</small><strong>58 U/L</strong><em>参考范围：7–40 U/L</em></span><span><small>AST</small><strong>36 U/L</strong><em>参考范围：13–35 U/L</em></span><span><small>血小板计数</small><strong>210 × 10⁹/L</strong></span><span><small>FIB-4</small><strong>1.08</strong><em>使用最新年龄、AST、ALT和血小板数据计算</em></span><span><small>最近一次超声</small><strong>报告提示肝脂肪变性</strong></span><span><small>瞬时弹性成像</small><strong>暂无近期结果</strong></span><span><small>计划中的肝功能检查</small><strong>尚未完成</strong></span></div></section><section className="clinician-section"><h3>患者可编辑的就诊前说明</h3><div className="patient-statements"><p>“过去两周我感觉比平时更容易疲劳。”</p><p>“我漏服了几次药物。”</p><p>“我想和医生讨论是否需要完成另一次肝功能检查。”</p></div></section><section className="review-flag"><span>复核提示</span><strong>非紧急</strong><p>舌象照片中持续出现的特征变化，同时伴有患者确认的症状变化和一项尚未完成的计划检查。</p><small>此提示仅用于帮助医生确定信息查看顺序，不提供诊断，也不建议检查、治疗或提前就诊。</small></section><p className="disclaimer page-disclaimer">{medicalDisclaimer}</p></div>
        : reportName === 'hospital' ? <div className="dialog-scroll"><div className="hospital-panel"><Building2 size={28} /><strong>{hospitalLinked ? '关怀计划已连接' : '连接医院关怀计划'}</strong><p>{hospitalLinked ? '医院提供的高级版权益有效期至2026年11月30日。' : '输入医院邀请码，即可在关怀期内启用医院提供的高级版权益。'}</p></div>{!hospitalLinked && <><label className="code-field">邀请码<input placeholder="请输入医院提供的邀请码" /></label><button className="primary" onClick={() => { setHospitalLinked(true); setPlan('vip'); setReportName(null); }}>连接演示关怀计划<Check size={17} /></button></>}<p className="disclaimer">本原型仅模拟患者端连接流程，尚未接入真实医院系统。</p></div>
        : reportName === 'privacy' ? <div className="dialog-scroll"><div className="info-line"><ShieldCheck size={18} />照片和健康信息仅保留在当前演示页面中，刷新后会恢复初始状态。</div><p>在数据用于连续分析或共享给关怀计划前，患者可以管理自己的授权。</p></div>
        : <div className="dialog-scroll"><p>首页突出每日舌象记录，体检指标与生活记录收在“辅助信息”中。历史记录和报告分别放在独立页面。</p><p>本原型中的拍摄引导和智能分析为模拟效果，不提供疾病诊断或紧急监测。</p></div>}
      </DialogContent></Dialog>
    </main>
  );
}
