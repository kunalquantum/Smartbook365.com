import { useState } from 'react';
import TopicPage from './TopicPage';
import PrefixSum from '../visualizers/arrays/PrefixSum';
import { TwoPointers } from '../visualizers/arrays/TwoPointers';
import { SlidingWindow, Kadane } from '../visualizers/arrays/SlidingKadane';
import MergeSort from '../visualizers/sorting/MergeSort';
import QuickSort from '../visualizers/sorting/QuickSort';
import BinarySearch from '../visualizers/sorting/BinarySearch';
import BST from '../visualizers/trees/BST';
import TreeTraversal from '../visualizers/trees/TreeTraversal';
import Heap from '../visualizers/trees/Heap';
import LinkedList from '../visualizers/linkedlist/LinkedList';
import Stacks from '../visualizers/stacks/Stacks';
import GraphVisualizer from '../visualizers/graphs/GraphVisualizer';

export function ArraysPage() {
  const [active, setActive] = useState('prefix');
  return <TopicPage accent="var(--cyan)" active={active} setActive={setActive} tabs={[
    { id:'prefix',  label:'Prefix Sum',      component: PrefixSum },
    { id:'two',     label:'Two Pointers',    component: TwoPointers },
    { id:'sliding', label:'Sliding Window',  component: SlidingWindow },
    { id:'kadane',  label:"Kadane's",        component: Kadane },
  ]} />;
}

export function SortingPage() {
  const [active, setActive] = useState('merge');
  return <TopicPage accent="var(--violet)" active={active} setActive={setActive} tabs={[
    { id:'merge',  label:'Merge Sort',     component: MergeSort },
    { id:'quick',  label:'Quick Sort',     component: QuickSort },
    { id:'binary', label:'Binary Search',  component: BinarySearch },
  ]} />;
}

export function TreesPage() {
  const [active, setActive] = useState('bst');
  return <TopicPage accent="var(--green)" active={active} setActive={setActive} tabs={[
    { id:'bst',        label:'BST — Insert / Search / Traverse', component: BST },
    { id:'traversal',  label:'BFS Level-Order & Path Sum',        component: TreeTraversal },
    { id:'heap',        label:'Max Heap / Priority Queue',          component: Heap },
  ]} />;
}

export function LinkedListPage() {
  const [active, setActive] = useState('ll');
  return <TopicPage accent="var(--red)" active={active} setActive={setActive} tabs={[
    { id:'ll', label:'Reversal & Cycle Detection', component: LinkedList },
  ]} />;
}

export function StacksPage() {
  const [active, setActive] = useState('stacks');
  return <TopicPage accent="var(--pink)" active={active} setActive={setActive} tabs={[
    { id:'stacks', label:'Monotonic Stack & Min Stack', component: Stacks },
  ]} />;
}

export function GraphsPage() {
  const [active, setActive] = useState('graphs');
  return <TopicPage accent="var(--amber)" active={active} setActive={setActive} tabs={[
    { id:'graphs', label:'BFS · DFS · Dijkstra · Topological Sort', component: GraphVisualizer },
  ]} />;
}
