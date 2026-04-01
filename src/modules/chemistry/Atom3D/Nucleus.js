export const generateNucleus = (pCount, nCount) => {
    let particles = [];
    let rMax = Math.pow(pCount + nCount, 1/3) * 5; // radius scales with nucleon count
    
    const addParticles = (count, type, color, rSize) => {
        for (let i = 0; i < count; i++) {
            // Random point in sphere
            let u = Math.random();
            let v = Math.random();
            let theta = u * 2.0 * Math.PI;
            let phi = Math.acos(2.0 * v - 1.0);
            let r = Math.cbrt(Math.random()) * rMax;
            
            particles.push({ 
                id: `${type}-${i}`, 
                type, 
                color, 
                r: rSize,
                x: r * Math.sin(phi) * Math.cos(theta), 
                y: r * Math.sin(phi) * Math.sin(theta), 
                z: r * Math.cos(phi) 
            });
        }
    };
    
    addParticles(pCount, 'p', '#EF9F27', 4.5); // Protons (orange/coral)
    addParticles(nCount, 'n', '#378ADD', 4.5); // Neutrons (blue)
    
    return particles;
};
