
const Bottlenecks = () => {
    const rows = [
        ["Enfermería","150","22 min","20 min","77%","warning"],
        ["Servicios Generales","85","34 min","25 min","69%","danger"],
        ["Facturación","130","18 min","20 min","89%","info"],
        ["Camillero","110","9 min","10 min","94%","success"],
    ];

    return (
        <div className="table-wrap"><table><thead><tr><th>Interventor</th><th>Casos</th><th>Promedio</th><th>SLA</th><th>Cumplimiento</th></tr></thead>
            <tbody>{rows.map(r => <tr key={r[0]}><td><span className={`table-avatar ta-${r[5]}`}>{r[0].slice(0,2).toUpperCase()}</span><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><div className="compliance"><span>{r[4]}</span><div><i className={`fill-${r[5]}`} style={{width:r[4]}}/></div></div></td></tr>)}</tbody>
        </table></div>
    )
}

export default Bottlenecks