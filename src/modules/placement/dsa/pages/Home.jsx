import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import s from './Home.module.css';

const CARDS = [
  { to:'arrays',      label:'Arrays & Strings',    color:'#00c8e8', icon:'▤', count:'4 viz', algorithms:['Prefix Sum','Two Pointers','Sliding Window',"Kadane's Max Subarray"] },
  { to:'sorting',     label:'Sorting & Searching',  color:'#8b5cf6', icon:'↕', algorithms:['Merge Sort','Quick Sort','Binary Search'] },
  { to:'trees',       label:'Trees & BST',          color:'#22d47a', icon:'⊛', algorithms:['BST Insert/Search','Inorder/Preorder/Postorder','Level-order BFS'] },
  { to:'linked-list', label:'Linked Lists',         color:'#f05060', icon:'⟳', algorithms:['Iterative Reversal',"Floyd's Cycle Detection",'slow/fast pointers'] },
  { to:'stacks',      label:'Stacks & Queues',      color:'#e879a0', icon:'⊟', algorithms:['Monotonic Stack','Next Greater Element','Min Stack O(1)'] },
  { to:'graphs',      label:'Graphs',               color:'#f5a623', icon:'◈', algorithms:['BFS','DFS','Dijkstra SSSP',"Topological Sort (Kahn's)"] },
];

const FEATURES = [
  { icon:'⏯', label:'Play / Pause / Step', desc:'Full transport controls on every visualizer' },
  { icon:'⟺', label:'Scrub to any step', desc:'Drag the timeline to jump instantly' },
  { icon:'⌥', label:'Live pseudocode', desc:'Active line highlights as algorithm runs' },
  { icon:'⚄', label:'Custom & random data', desc:'Type your own input or generate random' },
  { icon:'📊', label:'Live counters', desc:'Comparisons, swaps, depth tracked in real time' },
  { icon:'💡', label:'Insight panels', desc:'Complexity + intuition for every algorithm' },
];

export default function Home() {
  return (
    <div className={s.page}>
      {/* Hero */}
      <motion.div className={s.hero} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
        <div className={s.eyebrow}>
          <span className={s.eyebrowDot} />
          Interactive Algorithm Visualizer
        </div>
        <h1 className={s.heroTitle}>
          See every algorithm<br/>
          <span className={s.heroAccent}>think for itself.</span>
        </h1>
        <p className={s.heroDesc}>
          Step through 13 algorithms across 6 topics. Watch comparisons happen, pointers move,
          trees grow — with live pseudocode, custom data, and full play/pause/scrub controls.
        </p>
        <div className={s.heroStats}>
          {[['6','Topics'],['13','Visualizers'],['∞','Custom Data'],['100%','Animated']].map(([n,l])=>(
            <div key={l} className={s.stat}>
              <div className={s.statNum}>{n}</div>
              <div className={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cards */}
      <div className={s.grid}>
        {CARDS.map((card, i) => (
          <motion.div key={card.to} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:0.1+i*0.06 }}>
            <Link to={card.to} className={s.card} style={{ '--c': card.color }}>
              <div className={s.cardGlow} />
              <div className={s.cardHeader}>
                <div className={s.cardIcon}>{card.icon}</div>
                <div className={s.cardTitle}>{card.label}</div>
                <div className={s.cardArrow}>→</div>
              </div>
              <div className={s.cardAlgos}>
                {card.algorithms.map(a => (
                  <div key={a} className={s.cardAlgo}>{a}</div>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <div className={s.features}>
        <div className={s.featuresTitle}>What makes it different</div>
        <div className={s.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.label} className={s.feature}>
              <div className={s.featureIcon}>{f.icon}</div>
              <div>
                <div className={s.featureLabel}>{f.label}</div>
                <div className={s.featureDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
