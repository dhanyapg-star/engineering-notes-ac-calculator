const branches = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    short: 'CSE',
    icon: '💻',
    description: 'Algorithms, Data Structures, Programming, AI, ML, Networks',
    subjects: [
      {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        code: 'CSE201',
        notes: [
          { id: 'dsa-1', title: 'Arrays & Linked Lists', topics: ['Array operations', 'Singly/Doubly/Circular LL', 'Applications'], content: `# Arrays & Linked Lists

## Arrays
- Contiguous memory allocation
- O(1) random access
- Insertion/Deletion: O(n)
- Types: 1D, 2D, Multi-dimensional

## Linked Lists
- Dynamic memory allocation
- O(n) random access
- Insertion/Deletion: O(1) at head
- Types: Singly, Doubly, Circular

## Comparison
| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access    | O(1)  | O(n)        |
| Insert    | O(n)  | O(1)*       |
| Delete    | O(n)  | O(1)*       |
| Memory    | Fixed | Dynamic     |
*At head` },
          { id: 'dsa-2', title: 'Stacks & Queues', topics: ['LIFO/FIFO', 'Applications', 'Implementations'], content: `# Stacks & Queues

## Stack (LIFO)
- push(), pop(), top(), isEmpty()
- Applications: Expression evaluation, Undo/Redo, DFS

## Queue (FIFO)
- enqueue(), dequeue(), front(), isEmpty()
- Types: Circular Queue, Priority Queue, Deque
- Applications: BFS, Scheduling, Buffers

## Implementation
Both can be implemented using Arrays or Linked Lists.` },
          { id: 'dsa-3', title: 'Trees & Graphs', topics: ['Binary Trees', 'BST', 'Graph traversals'], content: `# Trees & Graphs

## Binary Trees
- Root, Left child, Right child
- Traversals: Inorder, Preorder, Postorder
- Height: O(log n) balanced, O(n) skewed

## Binary Search Tree (BST)
- Left < Root < Right
- Search/Insert/Delete: O(log n) avg

## Graphs
- Directed/Undirected, Weighted/Unweighted
- BFS: O(V+E), DFS: O(V+E)
- Represented via Adjacency Matrix or List` }
        ]
      },
      {
        id: 'os',
        name: 'Operating Systems',
        code: 'CSE301',
        notes: [
          { id: 'os-1', title: 'Process Management', topics: ['PCB', 'Scheduling', 'IPC'], content: `# Process Management

## Process Control Block (PCB)
- Process ID, State, Program Counter, Registers
- Memory limits, List of open files

## Scheduling Algorithms
| Algorithm | Criteria | Characteristics |
|-----------|----------|-----------------|
| FCFS      | Arrival time | Convoy effect |
| SJF        | Burst time  | Starvation possible |
| Round Robin| Time quantum| Preemptive, fair |
| Priority   | Priority    | Starvation possible |

## Inter-Process Communication (IPC)
- Shared Memory
- Message Passing
- Pipes and Sockets` },
          { id: 'os-2', title: 'Memory Management', topics: ['Paging', 'Segmentation', 'Virtual Memory'], content: `# Memory Management

## Paging
- Physical memory divided into frames
- Logical memory divided into pages
- Page table maps pages to frames
- Eliminates external fragmentation

## Segmentation
- Program divided into logical segments
- Segment table with base and limit
- Allows sharing and protection

## Virtual Memory
- Demand Paging
- Page Replacement: FIFO, LRU, Optimal
- Thrashing` }
        ]
      },
      {
        id: 'dbms',
        name: 'Database Management Systems',
        code: 'CSE302',
        notes: [
          { id: 'dbms-1', title: 'ER Model & Relational Schema', topics: ['Entities', 'Relationships', 'Normalization'], content: `# ER Model & Relational Schema

## Entity-Relationship Model
- Entity: Real-world object
- Attributes: Key, Composite, Derived
- Relationships: 1:1, 1:N, M:N

## Normalization
- 1NF: Atomic values
- 2NF: No partial dependency
- 3NF: No transitive dependency
- BCNF: Every determinant is a candidate key` }
        ]
      }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    short: 'ECE',
    icon: '⚡',
    description: 'Circuits, Signals, VLSI, Communication, Embedded Systems',
    subjects: [
      {
        id: 'edc',
        name: 'Electronic Devices & Circuits',
        code: 'ECE201',
        notes: [
          { id: 'edc-1', title: 'Diodes & Transistors', topics: ['PN Junction', 'BJT', 'MOSFET'], content: `# Diodes & Transistors

## PN Junction Diode
- Forward bias: Current flows
- Reverse bias: No current flow
- V-I characteristic: Exponential
- Applications: Rectifiers, Clippers, Clampers

## Bipolar Junction Transistor (BJT)
- NPN and PNP types
- Active, Cutoff, Saturation regions
- Common Emitter, Base, Collector configurations

## MOSFET
- Enhancement and Depletion types
- Threshold voltage (Vth)
- Triode and Saturation regions` }
        ]
      },
      {
        id: 'dsp',
        name: 'Digital Signal Processing',
        code: 'ECE303',
        notes: [
          { id: 'dsp-1', title: 'DFT & FFT', topics: ['Discrete Fourier Transform', 'Fast Fourier Transform'], content: `# DFT & FFT

## Discrete Fourier Transform (DFT)
- X(k) = Σ x(n) e^(-j2πkn/N)
- Computes frequency spectrum
- Computation: O(N²)

## Fast Fourier Transform (FFT)
- Radix-2 DIT algorithm
- Divides problem into smaller DFTs
- Computation: O(N log N)

## Applications
- Spectral analysis
- Filter design
- Data compression` }
        ]
      }
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    short: 'ME',
    icon: '🔧',
    description: 'Thermodynamics, Fluid Mechanics, Design, Manufacturing',
    subjects: [
      {
        id: 'thermo',
        name: 'Thermodynamics',
        code: 'ME201',
        notes: [
          { id: 'thermo-1', title: 'Laws of Thermodynamics', topics: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'], content: `# Laws of Thermodynamics

## Zeroth Law
- If A=B and B=C, then A=C
- Basis for temperature measurement

## First Law (Energy Conservation)
- ΔU = Q - W
- Energy cannot be created or destroyed

## Second Law (Entropy)
- ΔS ≥ 0 for isolated systems
- Heat cannot spontaneously flow from cold to hot
- Clausius and Kelvin-Planck statements

## Third Law
- As T → 0, entropy → 0
- Absolute zero is unattainable` },
          { id: 'thermo-2', title: 'Thermodynamic Cycles', topics: ['Carnot', 'Rankine', 'Otto', 'Diesel'], content: `# Thermodynamic Cycles

## Carnot Cycle
- Most efficient cycle (η = 1 - T₂/T₁)
- Reversible isothermal + adiabatic processes

## Rankine Cycle (Steam Power)
- Boiler → Turbine → Condenser → Pump
- Efficiency improved by reheat and regeneration

## Otto Cycle (SI Engine)
- 4 strokes: Intake, Compression, Power, Exhaust
- η = 1 - 1/(r^(γ-1))

## Diesel Cycle (CI Engine)
- Compression ignition
- Higher compression ratio than Otto` }
        ]
      },
      {
        id: 'som',
        name: 'Strength of Materials',
        code: 'ME202',
        notes: [
          { id: 'som-1', title: 'Stress & Strain', topics: ['Axial loading', 'Bending', 'Torsion'], content: `# Stress & Strain

## Definitions
- Stress (σ) = Force / Area
- Strain (ε) = Change in length / Original length
- Hooke's Law: σ = Eε

## Types of Loading
- Axial: σ = P/A, δ = PL/AE
- Bending: σ = My/I
- Torsion: τ = Tr/J

## Mohr's Circle
- Graphical representation of stress transformation
- Principal stresses and maximum shear stress` }
        ]
      }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    short: 'CE',
    icon: '🏗️',
    description: 'Structures, Geotech, Transportation, Environmental',
    subjects: [
      {
        id: 'structural',
        name: 'Structural Analysis',
        code: 'CE301',
        notes: [
          { id: 'structural-1', title: 'Determinate Structures', topics: ['Beams', 'Trusses', 'Frames'], content: `# Determinate Structures

## Beams
- Simply supported, Cantilever, Overhanging
- SFD and BMD from equilibrium equations

## Trusses
- Method of Joints
- Method of Sections
- Zero-force members identification

## Stability & Determinacy
- Dₛ = 3m + r - 3j (for trusses)
- Statically determinate if Dₛ = 0` }
        ]
      },
      {
        id: 'geotech',
        name: 'Geotechnical Engineering',
        code: 'CE202',
        notes: [
          { id: 'geotech-1', title: 'Soil Properties', topics: ['Index properties', 'Classification', 'Permeability'], content: `# Soil Properties

## Index Properties
- Water content, Specific gravity
- Atterberg limits: LL, PL, SL
- Grain size distribution

## Soil Classification
- IS Classification system
- USCS: GW, GP, GM, GC, SW, SP, SM, SC, CL, CH, etc.

## Permeability
- Darcy's Law: v = ki
- Constant head and Falling head tests
- Factors: Grain size, void ratio, degree of saturation` }
        ]
      }
    ]
  },
  {
    id: 'ee',
    name: 'Electrical Engineering',
    short: 'EE',
    icon: '💡',
    description: 'Power Systems, Machines, Control Systems, Power Electronics',
    subjects: [
      {
        id: 'psa',
        name: 'Power System Analysis',
        code: 'EE301',
        notes: [
          { id: 'psa-1', title: 'Load Flow Analysis', topics: ['Bus classification', 'Gauss-Seidel', 'Newton-Raphson'], content: `# Load Flow Analysis

## Bus Types
- Slack Bus (Vδ): Reference bus
- PV Bus (PV): Voltage controlled
- PQ Bus (Load): Unknown V and δ

## Gauss-Seidel Method
- Iterative solution of power flow equations
- Simple but slow convergence

## Newton-Raphson Method
- Faster convergence (quadratic)
- Uses Jacobian matrix
- More complex but preferred for large systems` }
        ]
      },
      {
        id: 'emach',
        name: 'Electrical Machines',
        code: 'EE202',
        notes: [
          { id: 'emach-1', title: 'DC Machines & Transformers', topics: ['DC Generator', 'DC Motor', 'Transformer'], content: `# DC Machines & Transformers

## DC Generator
- EMF equation: E = (φZNP)/(60A)
- Types: Separately excited, Shunt, Series, Compound

## DC Motor
- Torque equation: T = (φZNIₐ)/(2πA)
- Speed control: Armature resistance, Field control

## Transformer
- EMF equation: E = 4.44 fφN
- Equivalent circuit referred to primary/secondary
- Losses: Copper, Iron (Hysteresis + Eddy current)
- Efficiency: η = Output/Input` }
        ]
      }
    ]
  }
];

const siteConfig = {
  name: 'Engineering Notes Hub',
  tagline: 'Comprehensive study notes for engineering students',
  footer: 'Engineering Notes Hub &copy; 2026'
};
