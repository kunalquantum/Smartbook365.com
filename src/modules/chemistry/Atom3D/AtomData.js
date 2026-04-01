export const ATOM_DATA = [
    { z: 1, sym: 'H', name: 'Hydrogen', mass: 1, group: 1, diatomic: true },
    { z: 2, sym: 'He', name: 'Helium', mass: 4, group: 18 },
    { z: 3, sym: 'Li', name: 'Lithium', mass: 7, group: 1 },
    { z: 4, sym: 'Be', name: 'Beryllium', mass: 9, group: 2 },
    { z: 5, sym: 'B', name: 'Boron', mass: 11, group: 13 },
    { z: 6, sym: 'C', name: 'Carbon', mass: 12, group: 14 },
    { z: 7, sym: 'N', name: 'Nitrogen', mass: 14, group: 15, diatomic: true },
    { z: 8, sym: 'O', name: 'Oxygen', mass: 16, group: 16, diatomic: true },
    { z: 9, sym: 'F', name: 'Fluorine', mass: 19, group: 17, diatomic: true },
    { z: 10, sym: 'Ne', name: 'Neon', mass: 20, group: 18 },
    { z: 11, sym: 'Na', name: 'Sodium', mass: 23, group: 1 },
    { z: 12, sym: 'Mg', name: 'Magnesium', mass: 24, group: 2 },
    { z: 13, sym: 'Al', name: 'Aluminium', mass: 27, group: 13 },
    { z: 14, sym: 'Si', name: 'Silicon', mass: 28, group: 14 },
    { z: 15, sym: 'P', name: 'Phosphorus', mass: 31, group: 15 },
    { z: 16, sym: 'S', name: 'Sulfur', mass: 32, group: 16 },
    { z: 17, sym: 'Cl', name: 'Chlorine', mass: 35.5, group: 17, diatomic: true },
    { z: 18, sym: 'Ar', name: 'Argon', mass: 40, group: 18 },
    { z: 19, sym: 'K', name: 'Potassium', mass: 39, group: 1 },
    { z: 20, sym: 'Ca', name: 'Calcium', mass: 40, group: 2 },
]

export const getShells = (count) => {
    const shells = []
    let e = Math.max(0, count)
    const capacities = [2, 8, 8, 18, 18, 32]
    for(let i = 0; i < capacities.length; i++) {
        if (e <= 0) break
        const fill = Math.min(e, capacities[i])
        shells.push(fill)
        e -= fill
    }
    return shells
}

export const GEOMETRY_DATA = [
    { 
        name: 'Linear', 
        domains: 2, 
        angle: 180,
        points: [{x: 80, y: 0, z: 0}, {x: -80, y: 0, z: 0}],
        desc: 'Two electron domains around a central atom. e.g., BeCl₂, CO₂'
    },
    { 
        name: 'Trigonal Planar', 
        domains: 3, 
        angle: 120,
        points: [
            {x: 80, y: 0, z: 0}, 
            {x: -40, y: 69.3, z: 0}, 
            {x: -40, y: -69.3, z: 0}
        ],
        desc: 'Three electron domains in one plane. e.g., BF₃, SO₃'
    },
    { 
        name: 'Tetrahedral', 
        domains: 4, 
        angle: 109.5,
        points: [
            {x: 0, y: 80, z: 0}, 
            {x: 75.4, y: -26.7, z: 0}, 
            {x: -37.7, y: -26.7, z: 65.3}, 
            {x: -37.7, y: -26.7, z: -65.3}
        ],
        desc: 'Four electron domains directed towards corners of a tetrahedron. e.g., CH₄, NH₄⁺'
    }
]
