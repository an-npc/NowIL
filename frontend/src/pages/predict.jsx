import { useState } from 'react'
import '../App.css'
import { Search } from 'react-feather'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts'

const SPORTS = ['Football', 'Basketball', 'Baseball', 'Soccer', 'Golf', 'Volleyball', 'Tennis', 'Gymnastics']

const CONFERENCES = ['SEC', 'ACC', 'Big Ten', 'Pac-12', 'Big 12', 'AAC', 'Mountain West', 'Sun Belt']
const SCHOOLS = [
    'LSU',
    'University of Alabama',
    'University of Georgia',
    'University of Florida',
    'University of Texas',
    'University of Michigan',
    'Ohio State University',
]
const POSITIONS_BY_SPORT = {
    Football: ['QB', 'RB', 'WR', 'TE', 'MLB', 'S', 'DE', 'OL', 'K'],
    Basketball: ['PG', 'SG', 'SF', 'PF', 'C'],
    Baseball: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'],
    Soccer: ['GK', 'DF', 'MF', 'FW'],
    Golf: ['Player'],
    Volleyball: ['OH', 'MB', 'S', 'L', 'OPP'],
    Tennis: ['Singles', 'Doubles'],
    Gymnastics: ['All-Around'],
}
const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']

// Mock historical cohort — replace with API response
const MOCK_COHORT = [
    { rank: 1, name: 'Bnnn Donver', school: 'Duke', value: '$145,000' },
    { rank: 2, name: 'Gary Claw', school: 'Duke', value: '$145,000' },
    { rank: 3, name: 'Hary Hansson', school: 'Duke', value: '$99,000' },
    { rank: 4, name: 'Jhhn Romilton', school: 'Duke', value: '$67,000' },
    { rank: 5, name: 'Havier Donver', school: 'Duke', value: '$67,000' },
]

// Mock 12-week projection — replace with API response
function buildMockTrajectory(baseValue) {
    const points = []
    for (let week = 1; week <= 12; week++) {
        const projected = baseValue * (1 + week * 0.08) + (Math.random() - 0.5) * baseValue * 0.05
        const margin = projected * 0.1
        points.push({
            week,
            projected: Math.round(projected),
            lower: Math.round(projected - margin),
            upper: Math.round(projected + margin),
            band: [Math.round(projected - margin), Math.round(projected + margin)],
        })
    }
    return points
}

function Predict() {
    const [sport, setSport] = useState('Football')
    const [conference, setConference] = useState('')
    const [school, setSchool] = useState('')
    const [position, setPosition] = useState('')
    const [year, setYear] = useState('')

    const [passingYDS, setPassingYDS] = useState('')
    const [ydsAttempt, setYdsAttempt] = useState('')
    const [tds, setTds] = useState('')
    const [ints, setInts] = useState('')

    const [result, setResult] = useState(null)

    function handleSubmit(e) {
        e.preventDefault()

        // TODO: replace with real API call to backend/ml inference endpoint
        // const res = await fetch('/api/predict', { method: 'POST', body: JSON.stringify({...}) })
        const estimated = 650000
        setResult({
            evaluation: estimated,
            tier: 2,
            trajectory: buildMockTrajectory(4500),
            cohort: MOCK_COHORT,
        })
    }

    function handleReset() {
        setConference('')
        setSchool('')
        setPosition('')
        setYear('')
        setPassingYDS('')
        setYdsAttempt('')
        setTds('')
        setInts('')
        setResult(null)
    }

    const positions = POSITIONS_BY_SPORT[sport] || []

    return (
        <main className="predict-page">
            <header className="predict-header">
                <h1>Predict</h1>
                <form className="predict-search">
                    <Search size={18} className="predict-search-icon" />
                    <input
                        type="search"
                        placeholder="Try searching for your favorite player..."
                        className="predict-search-input"
                    />
                </form>
            </header>

            {/* Sport tabs */}
            <nav className="sport-tabs">
                {SPORTS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`sport-tab ${sport === s ? 'sport-tab-active' : ''}`}
                        onClick={() => setSport(s)}
                    >
                        {s}
                    </button>
                ))}
            </nav>

            {/* Input form */}
            <form className="predict-form" onSubmit={handleSubmit}>
                <div className="predict-form-grid">
                    {/* Row 1: context selectors */}
                    <select
                        className="pill-input"
                        value={conference}
                        onChange={(e) => setConference(e.target.value)}
                    >
                        <option value="">CONFERENCE</option>
                        {CONFERENCES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <select
                        className="pill-input"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                    >
                        <option value="">SCHOOL</option>
                        {SCHOOLS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <select
                        className="pill-input"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    >
                        <option value="">POSITION</option>
                        {positions.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>

                    <select
                        className="pill-input"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">YEAR</option>
                        {YEARS.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    {/* Submit spans both rows on the right */}
                    <button type="submit" className="submit-pill">
                        SUBMIT
                    </button>

                    {/* Row 2: stat inputs */}
                    <input
                        type="number"
                        className="pill-input"
                        placeholder="PASSING YDS"
                        value={passingYDS}
                        onChange={(e) => setPassingYDS(e.target.value)}
                    />
                    <input
                        type="number"
                        className="pill-input"
                        placeholder="YDS/ATTEMPT"
                        value={ydsAttempt}
                        onChange={(e) => setYdsAttempt(e.target.value)}
                    />
                    <input
                        type="number"
                        className="pill-input"
                        placeholder="TDS"
                        value={tds}
                        onChange={(e) => setTds(e.target.value)}
                    />
                    <input
                        type="number"
                        className="pill-input"
                        placeholder="INTS"
                        value={ints}
                        onChange={(e) => setInts(e.target.value)}
                    />
                </div>
            </form>

            {/* Results */}
            {result && (
                <section className="predict-results">
                    <div className="eval-row">
                        <div className="eval-block">
                            <h2 className="eval-title">Estimated Evaluation:</h2>
                            <p className="eval-value">${result.evaluation.toLocaleString()}</p>
                        </div>
                        <div className="eval-block">
                            <h2 className="eval-title">NIL Tier Evaluation:</h2>
                            <p className="eval-value">Tier {result.tier}</p>
                        </div>
                    </div>

                    <div className="results-grid">
                        <div className="nil-graph-card">
                            <div className="nil-graph-header">
                                <h3>
                                    NIL
                                    <br />
                                    Graph
                                </h3>
                                <button type="button" className="compare-btn">
                                    Compare
                                </button>
                            </div>
                            <p className="chart-title">NIL Valuation Projection (12-Week Forecast)</p>
                            <ResponsiveContainer width="100%" height={320}>
                                <ComposedChart data={result.trajectory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="week"
                                        label={{ value: 'Weeks Ahead', position: 'insideBottom', offset: -5 }}
                                    />
                                    <YAxis
                                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                        label={{
                                            value: 'Estimated NIL Value ($)',
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="band"
                                        fill="#bbf7d0"
                                        stroke="none"
                                        name="Confidence Interval"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="projected"
                                        stroke="#166534"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Projected NIL Value"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="cohort-card">
                            <h3 className="cohort-title">
                                HISTORICAL COHORT COMPARISON
                                <br />
                                <span className="cohort-subtitle">(Simple View)</span>
                            </h3>
                            <table className="cohort-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>School</th>
                                        <th>NIL Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.cohort.map((p) => (
                                        <tr key={p.rank}>
                                            <td>{p.rank}</td>
                                            <td>{p.name}</td>
                                            <td>{p.school}</td>
                                            <td>{p.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}

export default Predict