import { AlertTriangle, Database, DollarSign, LineChart, MapPinned, ShieldCheck, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const modules = [
  {
    title: "Executive Summary",
    state: "mock",
    note: "Koya and FamilyTreeOki decisions are shown first, with placeholder data clearly marked."
  },
  {
    title: "Source Adapters",
    state: "unknown",
    note: "FRED, BLS, FRB, DFAS, DTMO/OHA, TRICARE, booking data, and sales data are TODO adapters."
  },
  {
    title: "FamilyTreeOki KPI",
    state: "estimated",
    note: "Track bookings, service revenue, reviews, referral rate, 2D/4D mix, postpartum care, babysitting, and LTV."
  },
  {
    title: "Compliance Review",
    state: "unknown",
    note: "TRICARE, medical advertising, qualification, childcare, and babysitting wording require human review."
  }
];

const opportunityRows = [
  { label: "USD", score: 74 },
  { label: "Credit", score: 52 },
  { label: "Oil", score: 41 },
  { label: "OHA", score: 68 },
  { label: "LTV", score: 57 }
];

const services = [
  { name: "2D Echo", price: "15000 JPY", band: "easy" },
  { name: "4D Echo", price: "20000 JPY", band: "normal" },
  { name: "Heartbeat Bear", price: "6000 JPY", band: "easy" },
  { name: "Postpartum Care", price: "60000-75000 JPY/day", band: "premium" },
  { name: "Babysitter", price: "3500-5000 JPY/hour", band: "accessible" }
];

export default function App() {
  return (
    <main className="min-h-screen bg-[#f6f8f4] text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-slate-300 pb-5">
          <p className="text-sm font-black uppercase text-teal-700">Koya Business OS</p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Koya932 FamilyTreeOki Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            A starter dashboard for monitoring US macro risk, Japan-US FX structure, Okinawa US military purchasing power,
            and FamilyTreeOki pricing/LTV decisions. All placeholder values are labeled as mock, estimated, or unknown.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <article key={module.title} className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black">{module.title}</h2>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{module.state}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{module.note}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Panel icon={<LineChart className="h-5 w-5" />} title="Risk / Opportunity Snapshot">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opportunityRows}>
                  <CartesianGrid stroke="#d7ded5" strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0f766e" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel icon={<ShieldCheck className="h-5 w-5" />} title="Build Rules">
            <div className="space-y-3 text-sm leading-6 text-slate-700">
              <Rule icon={<Database className="h-4 w-4" />} text="Do not invent numbers. Keep source_id and fetchedAt fields." />
              <Rule icon={<AlertTriangle className="h-4 w-4" />} text="Separate observed, estimated, mock, fallback, unknown, and blocked_or_failed." />
              <Rule icon={<DollarSign className="h-4 w-4" />} text="Price from US mainland value, military dollar psychology, USD/JPY, yen cost, and experience value." />
              <Rule icon={<MapPinned className="h-4 w-4" />} text="Target Kadena, Okinawa City, Chatan, Yomitan, Ginowan, Uruma, and nearby family housing areas." />
            </div>
          </Panel>
        </section>

        <Panel icon={<Users className="h-5 w-5" />} title="FamilyTreeOki Service Baseline">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {services.map((service) => (
              <article key={service.name} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="font-black">{service.name}</p>
                <p className="mt-2 text-sm text-slate-700">{service.price}</p>
                <p className="mt-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-teal-800">{service.band}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-teal-800">
        {icon}
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Rule({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <span className="mt-1 text-teal-700">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
