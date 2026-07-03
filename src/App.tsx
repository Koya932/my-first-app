import { useMemo, useState } from "react";
import { Activity, Banknote, CalendarCheck, Crown, Gauge, Gem, LineChart as LineIcon, Sparkles, TrendingUp, UsersRound, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Inputs = {
  twoDPrice: number;
  fourDPrice: number;
  monthlyBookings: number;
  twoDRatio: number;
  cancelRate: number;
  paymentFeeRate: number;
  hourlyWage: number;
  baseHourlyWage: number;
  serviceHoursPerBooking: number;
  rent: number;
  machine: number;
  electricity: number;
  consumables: number;
  bookingSystem: number;
  ads: number;
  accounting: number;
  reserve: number;
  technicalScore: number;
  hospitalityScore: number;
  experienceScore: number;
  brandScore: number;
  productivityScore: number;
  technicalCoefficient: number;
  hospitalityCoefficient: number;
  experienceCoefficient: number;
  reviewCoefficient: number;
  revenueCoefficient: number;
  autonomyCoefficient: number;
};

type Field = { key: keyof Inputs; label: string; suffix?: string; min: number; max: number; step: number };

const initialInputs: Inputs = {
  twoDPrice: 15000,
  fourDPrice: 20000,
  monthlyBookings: 132,
  twoDRatio: 40,
  cancelRate: 3.33,
  paymentFeeRate: 2.5,
  hourlyWage: 4500,
  baseHourlyWage: 2000,
  serviceHoursPerBooking: 1,
  rent: 200000,
  machine: 200000,
  electricity: 30000,
  consumables: 10000,
  bookingSystem: 10000,
  ads: 0,
  accounting: 0,
  reserve: 0,
  technicalScore: 16,
  hospitalityScore: 21,
  experienceScore: 17,
  brandScore: 13,
  productivityScore: 18,
  technicalCoefficient: 1.25,
  hospitalityCoefficient: 1.2,
  experienceCoefficient: 1.15,
  reviewCoefficient: 1.15,
  revenueCoefficient: 1.15,
  autonomyCoefficient: 1.1
};

const yen = (value: number) => `${Math.round(value).toLocaleString("ja-JP")}円`;
const pct = (value: number) => `${value.toFixed(1)}%`;
const count = (value: number) => `${value.toFixed(1)}件`;
const div = (a: number, b: number) => (Math.abs(b) < 0.000001 ? 0 : a / b);

function calculate(inputs: Inputs) {
  const twoDRatio = Math.min(Math.max(inputs.twoDRatio, 0), 100) / 100;
  const fourDRatio = 1 - twoDRatio;
  const fixedCost = inputs.rent + inputs.machine + inputs.electricity + inputs.consumables + inputs.bookingSystem + inputs.ads + inputs.accounting + inputs.reserve;
  const effectiveBookings = Math.max(inputs.monthlyBookings * (1 - inputs.cancelRate / 100), 0);
  const twoDRevenue = effectiveBookings * twoDRatio * inputs.twoDPrice;
  const fourDRevenue = effectiveBookings * fourDRatio * inputs.fourDPrice;
  const totalRevenue = twoDRevenue + fourDRevenue;
  const paymentFee = totalRevenue * (inputs.paymentFeeRate / 100);
  const totalServiceHours = effectiveBookings * inputs.serviceHoursPerBooking;
  const laborCost = totalServiceHours * inputs.hourlyWage;
  const profit = totalRevenue - paymentFee - fixedCost - laborCost;
  const profitMargin = div(profit, totalRevenue) * 100;
  const fixedCostPerBooking = div(fixedCost, effectiveBookings);
  const revenuePerBooking = div(totalRevenue, effectiveBookings);
  const profitPerBooking = div(profit, effectiveBookings);
  const twoDContribution = inputs.twoDPrice - inputs.twoDPrice * (inputs.paymentFeeRate / 100) - fixedCostPerBooking - inputs.hourlyWage * inputs.serviceHoursPerBooking;
  const fourDContribution = inputs.fourDPrice - inputs.fourDPrice * (inputs.paymentFeeRate / 100) - fixedCostPerBooking - inputs.hourlyWage * inputs.serviceHoursPerBooking;
  const breakEvenBookings = div(fixedCost, revenuePerBooking - revenuePerBooking * (inputs.paymentFeeRate / 100) - inputs.hourlyWage * inputs.serviceHoursPerBooking);
  const maxAffordableHourlyWage = div(totalRevenue - paymentFee - fixedCost, totalServiceHours);
  const calculatedHourlyWage = inputs.baseHourlyWage * inputs.technicalCoefficient * inputs.hospitalityCoefficient * inputs.experienceCoefficient * inputs.reviewCoefficient * inputs.revenueCoefficient * inputs.autonomyCoefficient;
  const staffScore = Math.min(inputs.technicalScore + inputs.hospitalityScore + inputs.experienceScore + inputs.brandScore + inputs.productivityScore, 100);
  const utilizationScore = Math.min(div(effectiveBookings, 132) * 100, 100);
  const cancellationScore = Math.max(100 - inputs.cancelRate * 10, 0);
  const echoHumanCapitalIndex = profitMargin * 0.35 + staffScore * 0.25 + fourDRatio * 100 * 0.2 + utilizationScore * 0.1 + cancellationScore * 0.1;
  return { fixedCost, effectiveBookings, totalRevenue, paymentFee, laborCost, profit, profitMargin, fixedCostPerBooking, profitPerBooking, twoDContribution, fourDContribution, breakEvenBookings, maxAffordableHourlyWage, calculatedHourlyWage, staffScore, utilizationScore, cancellationScore, echoHumanCapitalIndex, annualRevenue: totalRevenue * 12, annualProfit: profit * 12, fourDRatio };
}

const revenueFields: Field[] = [
  { key: "monthlyBookings", label: "月間予約件数", suffix: "件", min: 0, max: 240, step: 1 },
  { key: "twoDRatio", label: "2D比率", suffix: "%", min: 0, max: 100, step: 1 },
  { key: "twoDPrice", label: "2D単価", suffix: "円", min: 0, max: 50000, step: 500 },
  { key: "fourDPrice", label: "4D単価", suffix: "円", min: 0, max: 60000, step: 500 },
  { key: "cancelRate", label: "キャンセル率", suffix: "%", min: 0, max: 30, step: 0.1 },
  { key: "paymentFeeRate", label: "決済手数料", suffix: "%", min: 0, max: 10, step: 0.1 },
  { key: "hourlyWage", label: "現在時給", suffix: "円", min: 0, max: 10000, step: 100 },
  { key: "baseHourlyWage", label: "基準時給", suffix: "円", min: 1000, max: 4000, step: 100 }
];

const fixedFields: Field[] = [
  { key: "rent", label: "家賃", suffix: "円", min: 0, max: 600000, step: 10000 },
  { key: "machine", label: "機械費", suffix: "円", min: 0, max: 600000, step: 10000 },
  { key: "electricity", label: "電気代", suffix: "円", min: 0, max: 150000, step: 5000 },
  { key: "consumables", label: "消耗品", suffix: "円", min: 0, max: 100000, step: 5000 },
  { key: "bookingSystem", label: "予約システム", suffix: "円", min: 0, max: 100000, step: 5000 },
  { key: "ads", label: "広告費", suffix: "円", min: 0, max: 300000, step: 10000 },
  { key: "accounting", label: "会計ソフト", suffix: "円", min: 0, max: 100000, step: 5000 },
  { key: "reserve", label: "機械積立", suffix: "円", min: 0, max: 300000, step: 10000 }
];

const scoreFields: Field[] = [
  { key: "technicalScore", label: "技術価値", suffix: "点", min: 0, max: 20, step: 1 },
  { key: "hospitalityScore", label: "接客価値", suffix: "点", min: 0, max: 25, step: 1 },
  { key: "experienceScore", label: "感動体験価値", suffix: "点", min: 0, max: 20, step: 1 },
  { key: "brandScore", label: "ブランド・レビュー価値", suffix: "点", min: 0, max: 15, step: 1 },
  { key: "productivityScore", label: "生産性・自律性", suffix: "点", min: 0, max: 20, step: 1 }
];

const coefficientFields: Field[] = [
  { key: "technicalCoefficient", label: "技術係数", min: 1, max: 1.8, step: 0.01 },
  { key: "hospitalityCoefficient", label: "接客係数", min: 1, max: 1.8, step: 0.01 },
  { key: "experienceCoefficient", label: "体験係数", min: 1, max: 1.8, step: 0.01 },
  { key: "reviewCoefficient", label: "レビュー係数", min: 1, max: 1.8, step: 0.01 },
  { key: "revenueCoefficient", label: "収益貢献係数", min: 1, max: 1.8, step: 0.01 },
  { key: "autonomyCoefficient", label: "自律性係数", min: 1, max: 1.8, step: 0.01 }
];

const scoreManuals = [
  ["技術価値", "0-5点: 補助が必要 / 6-10点: 基本対応 / 11-15点: 安定対応 / 16-20点: 指名・紹介につながる品質"],
  ["接客価値", "0-6点: 事務的 / 7-13点: 基本案内 / 14-20点: 家族配慮が安定 / 21-25点: 不安を感動へ変える"],
  ["感動体験価値", "検査で終わらず、赤ちゃんに会えた思い出、心音、写真、会話を体験価値にできるか"],
  ["ブランド・レビュー価値", "Googleレビュー、紹介、SNS投稿、Family Tree Okiらしさへの貢献度"],
  ["生産性・自律性", "予約進行、準備片付け、判断、改善提案を自走できるか"]
];

const coefficientManuals = [
  ["1.00", "研修・補助、または通常業務レベル"],
  ["1.10-1.20", "基本品質を安定して提供できる"],
  ["1.21-1.35", "レビュー、紹介、付帯提案に貢献している"],
  ["1.36-1.50", "利益、4D比率、現場安定に明確に貢献"],
  ["1.51以上", "指名、教育、責任者候補として扱える水準"]
];

export default function App() {
  const [inputs, setInputs] = useState(initialInputs);
  const metrics = useMemo(() => calculate(inputs), [inputs]);
  const update = (key: keyof Inputs, value: number) => setInputs((cur) => ({ ...cur, [key]: key === "twoDRatio" ? Math.min(Math.max(value, 0), 100) : value }));
  const profitTone = metrics.profit >= 0 ? "text-emerald-200" : "text-rose-200";
  const revenueCostData = [
    { name: "売上", value: metrics.totalRevenue, fill: "#f4c76b" },
    { name: "固定費", value: metrics.fixedCost, fill: "#6aa6ff" },
    { name: "人件費", value: metrics.laborCost, fill: "#b596ff" },
    { name: "決済手数料", value: metrics.paymentFee, fill: "#5fd6c9" },
    { name: "営業利益", value: metrics.profit, fill: metrics.profit >= 0 ? "#6ee7a8" : "#fb7185" }
  ];
  const wageSim = [3000, 3500, 4000, 4500, 5000, 5500, 6000].map((hourlyWage) => ({ name: `${hourlyWage}円`, profit: calculate({ ...inputs, hourlyWage }).profit }));
  const staffRadar = [
    { name: "技術", score: inputs.technicalScore / 20 * 100 },
    { name: "接客", score: inputs.hospitalityScore / 25 * 100 },
    { name: "体験", score: inputs.experienceScore / 20 * 100 },
    { name: "レビュー", score: inputs.brandScore / 15 * 100 },
    { name: "自律性", score: inputs.productivityScore / 20 * 100 }
  ];

  return (
    <main className="min-h-screen bg-[#050914] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,199,107,.18),transparent_34%),linear-gradient(135deg,#050914_0%,#07111f_42%,#0d1b2c_100%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-white/10 bg-white/[.045] p-5 shadow-glow backdrop-blur">
          <p className="text-xs font-black uppercase text-amber-300">Family Tree Oki</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-5xl">Echo Human Capital Wage Dashboard</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">時給を市場相場だけで決めるのではなく、スタッフが1時間に生み出す経済価値から逆算する経営ダッシュボードです。売上、利益率、人材価値、レビュー、紹介、ブランド価値をひとつの数式でつなぎます。</p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Kpi title="月間実効売上" value={yen(metrics.totalRevenue)} icon={<Banknote />} />
          <Kpi title="営業利益" value={yen(metrics.profit)} className={profitTone} icon={<TrendingUp />} />
          <Kpi title="営業利益率" value={pct(metrics.profitMargin)} className={profitTone} icon={<Gauge />} />
          <Kpi title="年間売上" value={yen(metrics.annualRevenue)} />
          <Kpi title="年間利益" value={yen(metrics.annualProfit)} className={metrics.annualProfit >= 0 ? "text-emerald-200" : "text-rose-200"} />
          <Kpi title="有効予約件数" value={count(metrics.effectiveBookings)} icon={<CalendarCheck />} />
          <Kpi title="損益分岐件数" value={count(metrics.breakEvenBookings)} icon={<Activity />} />
          <Kpi title="1件あたり利益" value={yen(metrics.profitPerBooking)} />
          <Kpi title="計算上の適正時給" value={yen(metrics.calculatedHourlyWage)} icon={<Sparkles />} />
          <Kpi title="人材価値指数" value={`${metrics.echoHumanCapitalIndex.toFixed(0)}点`} icon={<LineIcon />} />
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-[#101a2a]/90 p-4 shadow-glow lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-lg bg-gradient-to-br from-amber-200 to-emerald-300 p-5 text-slate-950 shadow-overdrive">
            <p className="text-sm font-black">Echo Human Capital Index</p>
            <p className="mt-2 text-6xl font-black leading-none">{metrics.echoHumanCapitalIndex.toFixed(0)}</p>
            <p className="mt-3 text-xl font-black">{metrics.echoHumanCapitalIndex >= 80 ? "高収益モデル" : metrics.echoHumanCapitalIndex >= 60 ? "安定モデル" : metrics.echoHumanCapitalIndex >= 40 ? "改善余地あり" : "再設計必要"}</p>
          </div>
          <div className="grid gap-3">
            <Insight text="このダッシュボードは、スタッフをコストではなく人的資本として見える化します。" />
            <Insight text="役員は昇給・採用・単価判断の根拠を持てて、スタッフは自分の貢献度と成長位置を確認できます。" />
            <Insight text={metrics.calculatedHourlyWage > inputs.hourlyWage ? "計算上の適正時給が現在時給を上回っています。昇給または成果報酬設計の余地があります。" : "現在時給を維持するには、レビュー、紹介、4D比率、稼働率の改善が必要です。"} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Panel title="売上・稼働条件"><Fields fields={revenueFields} inputs={inputs} update={update} /></Panel>
          <Panel title="固定費"><Fields fields={fixedFields} inputs={inputs} update={update} /></Panel>
          <Panel title="スタッフ評価スコア"><Fields fields={scoreFields} inputs={inputs} update={update} /><Manual items={scoreManuals} /></Panel>
          <Panel title="適正時給係数"><Fields fields={coefficientFields} inputs={inputs} update={update} /><Manual items={coefficientManuals} /></Panel>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Chart title="月間収益構造"><ResponsiveContainer width="100%" height={280}><BarChart data={revenueCostData}><CartesianGrid stroke="rgba(255,255,255,.1)" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" tickFormatter={(v) => `${Number(v) / 10000}万`} /><Tooltip formatter={(v) => yen(Number(v))} /><Bar dataKey="value">{revenueCostData.map((d) => <Cell key={d.name} fill={d.fill} />)}</Bar></BarChart></ResponsiveContainer></Chart>
          <Chart title="時給別 営業利益シミュレーション"><ResponsiveContainer width="100%" height={280}><LineChart data={wageSim}><CartesianGrid stroke="rgba(255,255,255,.1)" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" tickFormatter={(v) => `${Number(v) / 10000}万`} /><Tooltip formatter={(v) => yen(Number(v))} /><Line type="monotone" dataKey="profit" stroke="#f4c76b" strokeWidth={3} /></LineChart></ResponsiveContainer></Chart>
          <Chart title="スタッフ価値スコア"><ResponsiveContainer width="100%" height={300}><RadarChart data={staffRadar}><PolarGrid stroke="rgba(255,255,255,.16)" /><PolarAngleAxis dataKey="name" stroke="#cbd5e1" /><PolarRadiusAxis domain={[0, 100]} stroke="#64748b" /><Radar dataKey="score" stroke="#f4c76b" fill="#f4c76b" fillOpacity={0.32} /></RadarChart></ResponsiveContainer></Chart>
          <Chart title="2D / 4D 1件利益"><ResponsiveContainer width="100%" height={280}><BarChart data={[{ name: "2D", value: metrics.fixedCost ? metrics.profitPerBooking : 0, fill: "#f4c76b" }, { name: "4D", value: metrics.profitPerBooking + 5000, fill: "#6ee7a8" }]}><CartesianGrid stroke="rgba(255,255,255,.1)" strokeDasharray="3 3" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip formatter={(v) => yen(Number(v))} /><Bar dataKey="value">{["#f4c76b", "#6ee7a8"].map((fill) => <Cell key={fill} fill={fill} />)}</Bar></BarChart></ResponsiveContainer></Chart>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#101a2a]/90 p-4 shadow-glow">
          <p className="text-xs font-black uppercase text-amber-300">Market Comparison Conclusion</p>
          <h2 className="mt-1 text-2xl font-black text-white">比較調査から見た、このダッシュボードの違いと意義</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">同じような画面を作れる会社はあります。ただし、Family Tree Okiの強みは、利益、単価、人材価値、適正時給、レビュー、紹介、スタッフ成長を同じ判断軸に統合していることです。</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Moat icon={<Crown />} title="価値で時給を説明" text="市場相場ではなく、スタッフが生む売上、安心感、レビュー、紹介から逆算します。" />
            <Moat icon={<UsersRound />} title="役員とスタッフが同じ画面を見る" text="役員は利益を、スタッフは自分の位置と成長項目を確認できます。" />
            <Moat icon={<Gem />} title="体験価値を数値化" text="エコーを単なる撮影ではなく、家族の思い出とLTVの入口として扱います。" />
            <Moat icon={<Wallet />} title="昇給の根拠を作る" text="なぜ4,500円なのか、なぜ5,500円を目指せるのかを説明できます。" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Kpi({ title, value, icon, className = "text-amber-100" }: { title: string; value: string; icon?: React.ReactNode; className?: string }) {
  return <article className="rounded-lg border border-white/10 bg-white/[.055] p-4 shadow-[0_18px_48px_rgba(0,0,0,.28)]"><div className="flex items-start justify-between gap-3"><p className="text-xs font-bold uppercase text-slate-400">{title}</p><div className="h-5 w-5 text-amber-300">{icon}</div></div><p className={`mt-3 text-2xl font-black sm:text-3xl ${className}`}>{value}</p></article>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border border-white/10 bg-[#101a2a]/90 p-4 shadow-glow"><h2 className="text-lg font-black text-white">{title}</h2><div className="mt-4">{children}</div></section>; }
function Chart({ title, children }: { title: string; children: React.ReactNode }) { return <Panel title={title}>{children}</Panel>; }
function Fields({ fields, inputs, update }: { fields: Field[]; inputs: Inputs; update: (key: keyof Inputs, value: number) => void }) { return <div className="grid gap-3 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="grid gap-2 rounded-md border border-white/10 bg-white/[.035] p-3"><span className="flex justify-between gap-3 text-sm font-bold text-slate-300"><span>{field.label}</span><span className="text-amber-200">{inputs[field.key].toLocaleString("ja-JP")}{field.suffix}</span></span><input className="accent-amber-300" type="range" min={field.min} max={field.max} step={field.step} value={inputs[field.key]} onChange={(e) => update(field.key, Number(e.target.value))} /><input className="rounded-md border border-white/10 bg-[#08111f] px-3 py-2 text-right text-sm font-bold text-white outline-none" type="number" min={field.min} max={field.max} step={field.step} value={inputs[field.key]} onChange={(e) => update(field.key, Number(e.target.value))} /></label>)}</div>; }
function Manual({ items }: { items: string[][] }) { return <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/[.06] p-4"><p className="text-xs font-bold uppercase text-amber-300">Manual</p>{items.map(([title, text]) => <div key={title} className="mt-3 rounded-md border border-white/10 bg-[#08111f]/80 p-3"><p className="font-black text-white">{title}</p><p className="mt-2 text-xs leading-5 text-slate-300">{text}</p></div>)}</div>; }
function Insight({ text }: { text: string }) { return <p className="rounded-md border border-white/10 bg-[#08111f] px-3 py-3 text-sm leading-6 text-slate-200">{text}</p>; }
function Moat({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="rounded-lg border border-white/10 bg-[#08111f]/80 p-4"><div className="flex items-center gap-2 text-amber-300"><div className="h-5 w-5">{icon}</div><h3 className="text-sm font-black text-white">{title}</h3></div><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></article>; }
