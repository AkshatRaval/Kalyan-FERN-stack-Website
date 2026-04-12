// constants/Apply.js
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO CONFIGURE A FORM:
//
//  sections: []  — list ONLY the sections you want shown (in order)
//    Available: 'personalInfo' | 'teamInfo' | 'academicInfo' |
//               'guardianInfo' | 'additionalInfo' | 'documents' |
//               'topicSelection'
//
//  fieldOverrides: {}  — per-section field customisation
//    hide:    ['fieldName']  — hide specific fields inside a section
//    require: ['fieldName']  — mark extra fields as required
//
//  topicConfig: {}  — powers the topicSelection section
//    label:         string          — section heading
//    description:   string          — subtitle shown to user
//    selectionMode: 'single'|'multi'
//    maxSelections: number          — (multi only) max topics user can pick
//    groups: []  — topic groups, each:
//      id:     string
//      label:  string              — group heading
//      grades: string[] | '*'      — which grades see this group
//                                    '*' = always visible (open/founders track)
//      topics: []
//        id:          string
//        label:       string
//        description: string        — optional subtitle under the label
// ─────────────────────────────────────────────────────────────────────────────

export const activities = [
  {
    id: 'women-safety-camp',
    title: 'Morbi Women Safety & Self Defence Workshop',
    description:
      'A practical training camp to empower girls and women with vital self-defence skills and safety awareness.',
    image:
      'https://img.freepik.com/premium-photo/diverse-female-construction-workers-hard-hats-generative-ai-raw-illustration_167857-39164.jpg?semt=ais_hybrid&w=740&q=80',
    date: 'To Be Announced',
    duration: '3 hours',
    participants: '300+',
    location: 'Morbi Town Hall',
    fee: 0,
    category: 'workshops',
    status: 'closed',
    features: [
      'Practical self-defence techniques',
      'Safety awareness & confidence building',
      'Empowering fitness-based training',
    ],
    eligibility: ['Open for all girls and women', 'No age limit'],
    pinned: true,
    link: 'women-safety-form',
    sections: ['personalInfo', 'additionalInfo'],
    fieldOverrides: {
      personalInfo: { hide: ['aadhar', 'dateOfBirth'] },
    },
  },

  {
    id: 'gcg-exam',
    title: 'GCG Scholarship Examination',
    description:
      'Our flagship state-level scholarship exam to identify, reward, and mentor outstanding students.',
    image:
      'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'March 15, 2025',
    duration: '3 hours',
    participants: '10,000+ expected',
    location: 'Multiple Centers across Gujarat',
    fee: 0,
    category: 'exams',
    status: 'coming-soon',
    features: [
      'Three-stage: Knowledge Test, Project, and Quiz',
      'Merit-based scholarships',
      'Mentorship for top 100 students',
      'Digital certificates for all participants',
    ],
    eligibility: ['Students in grades 8-12', 'Age: 13-18 years', 'Valid school enrollment'],
    pinned: false,
    link: 'gcgform',
    sections: ['personalInfo', 'academicInfo', 'guardianInfo', 'documents', 'additionalInfo'],
    fieldOverrides: {},
  },

  {
    id: 'writing-competition',
    title: 'Creative Writing Competition',
    description:
      'A literary event encouraging students to express their ideas through the power of writing.',
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'August 25, 2025',
    duration: '2 hours',
    participants: '800+',
    location: 'Online & Offline Centers',
    fee: 0,
    category: 'competitions',
    status: 'coming-soon',
    features: [
      'Essay, story, and poem categories',
      'Judged by renowned authors and educators',
      'Certificates for all participants',
    ],
    eligibility: ['Students aged 12-20 years', 'Individual participation only'],
    pinned: false,
    link: 'writingform',
    sections: ['personalInfo', 'academicInfo', 'additionalInfo'],
    fieldOverrides: {},
  },

  // ─── LOCAL SHARK TANK ──────────────────────────────────────────────────────
  {
    id: 'local-shark-program',
    title: 'Local Shark - Student Innovation Challenge',
    description:
      'An "Invest-Pitch" platform where young innovators pitch ideas to receive funding, mentorship, and exposure.',
    image:
      'https://images.unsplash.com/photo-1759171669032-beafad2287ee?w=600&auto=format&fit=crop&q=60',
    date: 'December 2025',
    duration: '3 days',
    participants: '500+ teams',
    location: 'Ahmedabad & Morbi (Hybrid Event)',
    fee: 100,
    category: 'entrepreneurships',
    status: 'coming-soon',
    features: [
      'Pitch to real investors',
      'Intensive startup mentorship',
      'Funding opportunities for top ideas',
      'Networking with business leaders',
    ],
    eligibility: [
      'School (grade 9-12), college students, and founders (18-30 years)',
      'Solo or team participation (max 4 members)',
      'Fee is payable per team',
    ],
    maxTeamSize: 4,
    pinned: true,
    link: 'sharktankform',

    // topicSelection comes AFTER academicInfo so the grade is known when filtering
    sections: [
      'personalInfo',
      'teamInfo',
      'academicInfo',
      'topicSelection',
      'documents',
      'additionalInfo',
    ],
    fieldOverrides: {
      personalInfo: { require: ['aadhar'] },
    },

    topicConfig: {
      label: 'Innovation Domain',
      description:
        'Select the problem domain your team will pitch on. Available tracks depend on your current grade/level.',
      selectionMode: 'single',

      groups: [
        // ── Grade 9-10 ────────────────────────────────────────────────────
        {
          id: 'school-junior',
          label: 'School Track — Grade 9 & 10',
          grades: ['9', '10'],
          topics: [
            {
              id: 'env-school',
              label: 'Environment & Sustainability',
              description: 'Waste management, clean energy, water conservation',
            },
            {
              id: 'agri-school',
              label: 'Agriculture & Rural Tech',
              description: 'Smart farming, irrigation, crop monitoring',
            },
            {
              id: 'health-basic',
              label: 'Community Health',
              description: 'Local health awareness, hygiene, sanitation',
            },
            {
              id: 'edu-school',
              label: 'Education & Literacy',
              description: 'Learning tools, dropout prevention, digital literacy',
            },
          ],
        },

        // ── Grade 11-12 ───────────────────────────────────────────────────
        {
          id: 'school-senior',
          label: 'School Track — Grade 11 & 12',
          grades: ['11', '12'],
          topics: [
            {
              id: 'fintech-hs',
              label: 'Fintech & Financial Inclusion',
              description: 'Payments, savings tools, microfinance for rural India',
            },
            {
              id: 'health-hs',
              label: 'Health & Medtech',
              description: 'Diagnostics, telemedicine, affordable healthcare',
            },
            {
              id: 'sustain-hs',
              label: 'Sustainability & Clean Energy',
              description: 'Solar, EV, carbon footprint reduction',
            },
            {
              id: 'social-hs',
              label: 'Social Impact',
              description: 'Women empowerment, disability inclusion, skill development',
            },
            {
              id: 'edu-hs',
              label: 'EdTech',
              description: 'Personalised learning, vernacular education, career guidance',
            },
          ],
        },

        // ── College / Graduate ────────────────────────────────────────────
        {
          id: 'college',
          label: 'College / Graduate Track',
          grades: ['Graduate'],
          topics: [
            {
              id: 'ai-ml',
              label: 'AI / ML & Data',
              description: 'Predictive models, automation, NLP applications',
            },
            {
              id: 'deeptech',
              label: 'Deep Tech & Hardware',
              description: 'IoT, robotics, semiconductors, embedded systems',
            },
            {
              id: 'saas',
              label: 'SaaS & Developer Tools',
              description: 'B2B software, APIs, productivity platforms',
            },
            {
              id: 'ecomm',
              label: 'Commerce & Marketplace',
              description: 'D2C brands, supply chain, last-mile logistics',
            },
            {
              id: 'fintech-col',
              label: 'Fintech & Blockchain',
              description: 'DeFi, lending, insurance, payment infrastructure',
            },
            {
              id: 'health-col',
              label: 'Health & Biotech',
              description: 'Genomics, diagnostics, mental health, wearables',
            },
            {
              id: 'climate-col',
              label: 'Climate Tech',
              description: 'Carbon markets, electric mobility, green materials',
            },
          ],
        },

        // ── Open / Founders Track — always visible ────────────────────────
        {
          id: 'founders',
          label: 'Open / Founders Track',
          grades: '*',   // '*' = shown to ALL grades
          topics: [
            {
              id: 'open-any',
              label: 'Open Innovation',
              description: "Any domain — pitch what you're building",
            },
            {
              id: 'govt-civic',
              label: 'GovTech & Civic Innovation',
              description: 'Public services, smart cities, e-governance',
            },
            {
              id: 'creative',
              label: 'Creative & Media Tech',
              description: 'Gaming, AR/VR, creator economy, culture tech',
            },
          ],
        },
      ],
    },
  },

  // ─── SCIENCE FAIR ──────────────────────────────────────────────────────────
  {
    id: 'science-fair',
    title: 'State-Level Science & Innovation Fair',
    description:
      'A premier exhibition for students to showcase creative science models and innovative solutions.',
    image:
      'https://images.unsplash.com/photo-1581093577421-f561a654a353?w=600&auto=format&fit=crop&q=60',
    date: 'November 2025',
    duration: '2 days',
    participants: '2,000+',
    location: 'Rajkot Science City',
    fee: 200,
    category: 'competitions',
    status: 'coming-soon',
    features: [
      'Hands-on project display',
      'Panel judging by scientists and professors',
      'Innovation awards and scholarships',
    ],
    eligibility: ['Students of grades 7-12', 'School nomination required'],
    pinned: false,
    link: 'sciencefairform',

    sections: [
      'personalInfo',
      'academicInfo',
      'topicSelection',
      'guardianInfo',
      'documents',
      'additionalInfo',
    ],
    fieldOverrides: {},

    topicConfig: {
      label: 'Science Category',
      description: 'Choose the category your project belongs to. Options update based on your grade.',
      selectionMode: 'single',

      groups: [
        {
          id: 'science-junior',
          label: 'Junior Division — Grade 7, 8 & 9',
          grades: ['7', '8', '9'],
          topics: [
            { id: 'bio-jr',  label: 'Biology & Life Sciences', description: 'Plants, animals, ecology, human body' },
            { id: 'chem-jr', label: 'Chemistry',               description: 'Experiments, reactions, materials' },
            { id: 'phy-jr',  label: 'Physics & Energy',        description: 'Motion, electricity, magnetism' },
            { id: 'env-jr',  label: 'Environmental Science',   description: 'Pollution, conservation, climate' },
            { id: 'math-jr', label: 'Maths & Computing',       description: 'Algorithms, geometry, puzzles' },
          ],
        },
        {
          id: 'science-senior',
          label: 'Senior Division — Grade 10, 11 & 12',
          grades: ['10', '11', '12'],
          topics: [
            { id: 'bio-sr',  label: 'Biotechnology & Medicine',  description: 'Genetics, microbiology, health innovations' },
            { id: 'chem-sr', label: 'Chemistry & Materials',     description: 'Polymers, nanomaterials, green chemistry' },
            { id: 'phy-sr',  label: 'Physics & Engineering',     description: 'Mechanics, optics, electronics' },
            { id: 'cs-sr',   label: 'Computer Science & AI',     description: 'ML, robotics, software projects' },
            { id: 'env-sr',  label: 'Earth & Environmental Sci', description: 'Climate change, renewable energy, water' },
          ],
        },
        {
          id: 'science-open',
          label: 'Open Category',
          grades: '*',
          topics: [
            { id: 'inter',    label: 'Interdisciplinary Project',  description: 'Projects spanning multiple science fields' },
            { id: 'social-s', label: 'Social Science & Innovation', description: 'Psychology, economics, public policy' },
          ],
        },
      ],
    },
  },

  {
    id: 'quiz-championship',
    title: 'Inter-School Knowledge Quiz Championship',
    description: 'The ultimate quiz competition to boost knowledge, teamwork, and curiosity.',
    image:
      'https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'September 2025',
    duration: '1 day',
    participants: '1,000+',
    location: 'Morbi Auditorium',
    fee: 100,
    category: 'competitions',
    status: 'coming-soon',
    features: [
      'Multi-round quiz (written, audio, visual)',
      'Team-based participation',
      'Win trophies and cash prizes!',
    ],
    eligibility: ['Students of grades 6-12', 'Team of 4 members'],
    maxTeamSize: 3,
    pinned: false,
    link: 'quizform',
    sections: ['personalInfo', 'teamInfo', 'academicInfo', 'guardianInfo', 'documents'],
    fieldOverrides: {},
  },

  {
    id: 'drawing-competition',
    title: 'District Art & Drawing Championship',
    description: 'A creative platform for young artists to express their imagination through art.',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'July 10, 2025',
    duration: '1 day',
    participants: '1,200+',
    location: 'Morbi District Hall',
    fee: 0,
    category: 'competitions',
    status: 'closed',
    features: ['Theme-based competition', 'Expert jury evaluation', 'Trophies and certificates'],
    eligibility: ['Students aged 10-18 years', 'School and college participants'],
    pinned: false,
    link: 'drawingform',
    sections: ['personalInfo', 'academicInfo', 'guardianInfo', 'additionalInfo'],
    fieldOverrides: { personalInfo: { hide: ['aadhar'] } },
  },
];