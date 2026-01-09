function About() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          About Analytics Dashboard
        </h2>
        <p className="text-slate-400 mb-6">
          This is a comprehensive analytics dashboard for tracking e-commerce
          sales, revenue, and customer insights.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">
              Features
            </h3>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Real-time sales and revenue tracking</li>
              <li>Regional performance analysis</li>
              <li>Category-wise sales distribution</li>
              <li>Return rate monitoring by region</li>
              <li>Advanced filtering capabilities</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2 mt-6">
              Technology Stack
            </h3>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Frontend: React + Vite + Tailwind CSS</li>
              <li>Backend: FastAPI + MySQL</li>
              <li>Charts: Recharts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
