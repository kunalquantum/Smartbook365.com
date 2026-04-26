import { SIMULATORS as CHEM_SIMS } from '../modules/chemistry/simulators';
import { SIMULATORS as PHYS_SIMS } from '../modules/physics/simulators';
import { TopicSimulators as MATH_SIMS } from '../modules/maths/simulators';

import { CHAPTERS as CHEM_CH } from '../modules/chemistry/data/chapters';
import { CHAPTERS as PHYS_CH } from '../modules/physics/data/physics';
import { chapters as MATH_CH } from '../modules/maths/data/chapters';

export const getChapterInfo = (subject, id) => {
  const chapters = subject === 'chemistry' ? CHEM_CH : subject === 'physics' ? PHYS_CH : MATH_CH;
  return chapters.find(c => String(c.id) === String(id));
};

export const getDemoSimulator = (subject, chapterId) => {
  if (subject === 'chemistry') {
    const key = `ch${String(chapterId).padStart(2, '0')}_t0`;
    return CHEM_SIMS[key];
  }
  if (subject === 'physics') {
    const key = `ch${String(chapterId).padStart(2, '0')}_t0`;
    return PHYS_SIMS[key];
  }
  if (subject === 'maths') {
    const key = `${chapterId}-0`;
    return MATH_SIMS[key];
  }
  return null;
};
