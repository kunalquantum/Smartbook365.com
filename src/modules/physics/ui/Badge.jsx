const TAG_COLORS = {
    basics: '#1D9E75', accuracy: '#EF9F27', analysis: '#D85A30',
    tools: '#378ADD', vectors: '#7F77DD', calculus: '#D4537E',
    kinematics: '#1D9E75', newton: '#EF9F27', friction: '#D85A30',
    dynamics: '#378ADD', gravity: '#7F77DD', orbits: '#1D9E75',
    energy: '#EF9F27', elastic: '#D85A30', stress: '#378ADD',
    moduli: '#7F77DD', heat: '#D85A30', calorimetry: '#1D9E75',
    transfer: '#EF9F27', gas: '#378ADD', waves: '#7F77DD',
    sound: '#1D9E75', music: '#EF9F27', doppler: '#D85A30',
    geo: '#378ADD', lenses: '#7F77DD', optical: '#1D9E75',
    wave: '#EF9F27', charge: '#D85A30', field: '#378ADD',
    gauss: '#7F77DD', capacitor: '#1D9E75', current: '#EF9F27',
    ohm: '#D85A30', circuit: '#378ADD', power: '#7F77DD',
    magnets: '#1D9E75', matter: '#EF9F27', faraday: '#D85A30',
    self: '#378ADD', ac: '#7F77DD', transformer: '#1D9E75',
    band: '#EF9F27', sc: '#D85A30', diode: '#378ADD',
    devices: '#7F77DD', modulation: '#1D9E75', propagation: '#EF9F27',
    digital: '#D85A30', atomic: '#378ADD', quantum: '#7F77DD',
    nuclear: '#1D9E75', modern: '#EF9F27',
}

export default function Badge({ tag }) {
    const color = TAG_COLORS[tag] || '#888'
    return (
        <span style={{
            fontSize: 10,
            fontFamily: 'var(--mono)',
            color,
            background: color + '18',
            padding: '2px 8px',
            borderRadius: 20,
            display: 'inline-block',
        }}>
            {tag}
        </span>
    )
}