export const generateElectrons = (shells, time, temp = 0, excitation = 0) => {
    let particles = [];
    let segments = [];
    let labels = [];
    
    // Normalize temp to a small jitter factor (0 to 5)
    const jitter = (temp / 1000) * 2.5;
    
    shells.forEach((count, sIdx) => {
        const baseR = 35 + sIdx * 25; 
        const speed = 1.5 + (4 - sIdx) * 0.5; 
        
        // Fixed 3D tilt
        const rx = 65 + (sIdx * 15) * (sIdx % 2 === 0 ? 1 : -1);
        const rz = sIdx * 45;
        
        for (let i = 0; i < count; i++) {
            // Apply excitation to the last electron if active
            let R = baseR;
            if (excitation > 0 && sIdx === shells.length - 1 && i === count - 1) {
                R += excitation * 25;
            }

            let angle = (i / count) * Math.PI * 2 + time * speed;
            
            // Thermal Jitter
            let ex = Math.cos(angle) * R;
            let ez = Math.sin(angle) * R;
            let ey = 0;

            if (jitter > 0) {
                ex += (Math.random() - 0.5) * jitter * 4;
                ey += (Math.random() - 0.5) * jitter * 4;
                ez += (Math.random() - 0.5) * jitter * 4;
            }
            
            // 1. rot X
            const radX = rx * Math.PI / 180;
            let y1 = ey * Math.cos(radX) - ez * Math.sin(radX);
            let z1 = ey * Math.sin(radX) + ez * Math.cos(radX);
            
            // 2. rot Z
            const radZ = rz * Math.PI / 180;
            let x2 = ex * Math.cos(radZ) - y1 * Math.sin(radZ);
            let y2 = ex * Math.sin(radZ) + y1 * Math.cos(radZ);
            
            particles.push({
                sIdx, 
                id: `e-${sIdx}-${i}`, 
                type: 'e', 
                color: excitation > 0 && sIdx === shells.length - 1 && i === count - 1 ? '#FFD700' : '#1D9E75', 
                r: 2.5,
                x: x2, y: y2, z: z1
            });
        }

        // Labels and Rings (Rings are static, don't jitter)
        let lAngle = Math.PI / 4;
        let lx = Math.cos(lAngle) * baseR;
        let lz = Math.sin(lAngle) * baseR;
        let y1l = -lz * Math.sin(rx * Math.PI / 180);
        let z1l = lz * Math.cos(rx * Math.PI / 180);
        let x2l = lx * Math.cos(rz * Math.PI / 180) - y1l * Math.sin(rz * Math.PI / 180);
        let y2l = lx * Math.sin(rz * Math.PI / 180) + y1l * Math.cos(rz * Math.PI / 180);
        labels.push({ sIdx, text: ['K', 'L', 'M', 'N'][sIdx] + ' Shell', x: x2l, y: y2l, z: z1l });

        let prevPt = null;
        for (let i = 0; i <= 40; i++) {
            let angle = (i / 40) * Math.PI * 2;
            let ex = Math.cos(angle) * baseR;
            let ez = Math.sin(angle) * baseR;
            let ey = 0;
            const radX = rx * Math.PI / 180;
            let y1 = ey * Math.cos(radX) - ez * Math.sin(radX);
            let z1 = ey * Math.sin(radX) + ez * Math.cos(radX);
            const radZ = rz * Math.PI / 180;
            let x2 = ex * Math.cos(radZ) - y1 * Math.sin(radZ);
            let y2 = ex * Math.sin(radZ) + y1 * Math.cos(radZ);
            let pt = { x: x2, y: y2, z: z1 };
            if (prevPt) segments.push({ sIdx, type: 'ring', a: prevPt, b: pt });
            prevPt = pt;
        }
    });
    
    return { particles, segments, labels };
};
