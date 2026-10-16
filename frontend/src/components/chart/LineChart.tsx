
const LineChart = () => {
    return (
        <div className="line-chart">
            <div className="y-labels"><span>120</span><span>90</span><span>60</span><span>30</span></div>
            <div className="chart-area"><div/><div/><div/><div/>
            <svg viewBox="0 0 600 170" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--brand-400)" stopOpacity=".2"/><stop offset="1" stopColor="var(--brand-400)" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0,95 C55,75 75,125 130,102 S205,56 260,76 S340,122 390,83 S470,66 520,48 S570,55 600,30 L600,170 L0,170Z"/><path className="line" d="M0,95 C55,75 75,125 130,102 S205,56 260,76 S340,122 390,83 S470,66 520,48 S570,55 600,30"/><circle cx="520" cy="48" r="5"/></svg>
            <div className="x-labels"><span>1 Jun</span><span>7 Jun</span><span>14 Jun</span><span>21 Jun</span><span>Hoy</span></div>
            </div>
        </div>
    )
}

export default LineChart