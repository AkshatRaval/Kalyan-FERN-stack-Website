// constants/Apply.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all form activities.
//
// To add a new field:  add one object to fields[]
// To hide a field:     delete it from fields[]
// To make optional:    set required: false
// To add validation:   validate: (v, allValues) => true | 'error message'
// To add a new type:   add a case in FieldWidget.jsx
//
// Field types:
//   text | email | tel | date | number | url
//   textarea | select | radio | checkbox | file
//   topic-picker | members (special composite widgets)
//
// Section keys (just grouping labels — not coupled to backend):
//   personal | team | academic | guardian | documents | topics | extra | consent
// ─────────────────────────────────────────────────────────────────────────────

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad',
];

const GRADES = ['5', '6', '7', '8', '9', '10', '11', '12', 'Graduate', 'Other'];

// ─── Reusable field presets ───────────────────────────────────────────────────
// Import these into any activity's fields[] to avoid repetition.

export const PERSONAL_FIELDS = [
  { id: 'fullName', section: 'personal', type: 'text', label: 'Full Name', required: true },
  { id: 'email', section: 'personal', type: 'email', label: 'Email Address', required: true },
  { id: 'phone', section: 'personal', type: 'tel', label: 'Phone Number', required: true },
  { id: 'dateOfBirth', section: 'personal', type: 'date', label: 'Date of Birth', required: true },
  {
    id: 'gender', section: 'personal', type: 'select', label: 'Gender', required: true,
    options: ['Male', 'Female', 'Other']
  },
  {
    id: 'address', section: 'personal', type: 'textarea', label: 'Address', required: true, colSpan: 2,
    placeholder: 'House/Flat No., Street, Area'
  },
  {
    id: 'city', section: 'personal', type: 'select', label: 'District', required: true,
    options: GUJARAT_DISTRICTS
  },
  {
    id: 'state', section: 'personal', type: 'text', label: 'State', required: false,
    defaultValue: 'Gujarat', readOnly: true
  },
  {
    id: 'pincode', section: 'personal', type: 'text', label: 'Pincode', required: true,
    placeholder: '6-digit pincode',
    validate: (v) => /^\d{6}$/.test(v) || 'Pincode must be 6 digits'
  },
];

export const PERSONAL_WITH_AADHAR = [
  ...PERSONAL_FIELDS,
  {
    id: 'aadhar', section: 'personal', type: 'text', label: 'Aadhar Number', required: true,
    placeholder: '12-digit Aadhar number',
    validate: (v) => /^\d{12}$/.test(v) || 'Aadhar must be exactly 12 digits'
  },
];

export const ACADEMIC_FIELDS = [
  { id: 'currentClass', section: 'academic', type: 'select', label: 'Current Grade / Class', required: true, options: GRADES },
  { id: 'school', section: 'academic', type: 'text', label: 'School / Institution', required: false, placeholder: 'School or college name' },
  { id: 'board', section: 'academic', type: 'text', label: 'Board / University', required: false, placeholder: 'e.g. GSEB, CBSE, GTU' },
  {
    id: 'previousScore', section: 'academic', type: 'number', label: 'Previous Score (%)', required: false,
    placeholder: 'e.g. 85', validate: (v) => (!v || (Number(v) >= 0 && Number(v) <= 100)) || 'Score must be 0-100'
  },
];

export const GUARDIAN_FIELDS = [
  { id: 'guardianName', section: 'guardian', type: 'text', label: 'Guardian Name', required: true },
  { id: 'guardianPhone', section: 'guardian', type: 'tel', label: 'Guardian Phone', required: true },
  { id: 'guardianEmail', section: 'guardian', type: 'email', label: 'Guardian Email', required: false },
  {
    id: 'relationship', section: 'guardian', type: 'select', label: 'Relationship', required: true,
    options: ['Father', 'Mother', 'Guardian', 'Other']
  },
];

export const DOCUMENT_FIELDS = [
  { id: 'photo', section: 'documents', type: 'file', label: 'Recent Photo', required: true, accept: 'image/*' },
  { id: 'idProof', section: 'documents', type: 'file', label: 'ID Proof', required: true, accept: '.pdf,.jpg,.jpeg,.png' },
  { id: 'academicRecords', section: 'documents', type: 'file', label: 'Academic Records', required: false, accept: '.pdf,.jpg,.jpeg,.png' },
];
export const INFLUENCER_FIELDS = [
  {id: 'isInfluencer', section: "extra", type: "text", label: "Are you Content Creator? (If yes type Your @ / If no type 'NO')"}
]
export const ADDITIONAL_FIELDS = [
  { id: 'experience', section: 'extra', type: 'textarea', label: 'Previous Experience', required: false, placeholder: 'Tell us about any relevant experience' },
  { id: 'expectations', section: 'extra', type: 'textarea', label: 'What do you expect?', required: false, placeholder: 'Share your goals and expectations' },
  { id: 'specialNeeds', section: 'extra', type: 'textarea', label: 'Special Needs / Accommodations', required: false, placeholder: 'Any special requirements' },
];

export const TEAM_FIELDS = (maxTeamSize = 4) => [
  { id: 'teamName', section: 'team', type: 'text', label: 'Team Name', required: true, colSpan: 2, placeholder: 'e.g. The Innovators' },
  { id: 'members', section: 'team', type: 'members', label: 'Team Members (excluding leader)', required: false, maxMembers: maxTeamSize - 1 },
];

export const CONSENT_FIELD = {
  id: 'consent', section: 'consent', type: 'checkbox', colSpan: 2,
  label: 'I hereby declare that the information provided is true and correct. I agree to the terms and conditions of Kalyan Trust.',
  required: true,
};

// ─── Activities ───────────────────────────────────────────────────────────────

export const activities = [

  // ── Women Safety Camp ───────────────────────────────────────────────────────
  {
    id: 'women-safety-camp',
    title: 'Morbi Women Safety & Self Defence Workshop',
    description: 'A practical training camp to empower girls and women with vital self-defence skills and safety awareness.',
    image: 'https://img.freepik.com/premium-photo/diverse-female-construction-workers-hard-hats-generative-ai-raw-illustration_167857-39164.jpg',
    date: 'To Be Announced',
    duration: '3 hours',
    participants: '300+',
    location: 'Morbi Town Hall',
    fee: 0,
    category: 'workshops',
    status: 'closed',
    pinned: true,
    link: 'women-safety-form',
    features: ['Practical self-defence techniques', 'Safety awareness & confidence building'],
    eligibility: ['Open for all girls and women', 'No age limit'],

    fields: [
      // No aadhar, no dateOfBirth for this one
      { id: 'fullName', section: 'personal', type: 'text', label: 'Full Name', required: true },
      { id: 'email', section: 'personal', type: 'email', label: 'Email', required: true },
      { id: 'phone', section: 'personal', type: 'tel', label: 'Phone Number', required: true },
      { id: 'gender', section: 'personal', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
      { id: 'address', section: 'personal', type: 'textarea', label: 'Address', required: true, colSpan: 2 },
      { id: 'city', section: 'personal', type: 'select', label: 'District', required: true, options: GUJARAT_DISTRICTS },
      { id: 'state', section: 'personal', type: 'text', label: 'State', required: false, defaultValue: 'Gujarat', readOnly: true },
      { id: 'pincode', section: 'personal', type: 'text', label: 'Pincode', required: true },

      ...ADDITIONAL_FIELDS,
      CONSENT_FIELD,
    ],
  },

  // ── GCG Exam ────────────────────────────────────────────────────────────────
  {
    id: 'gcg-exam',
    title: 'GCG Scholarship Examination',
    description: 'Our flagship state-level scholarship exam to identify, reward, and mentor outstanding students.',
    image: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?w=1080',
    date: 'March 15, 2025',
    duration: '3 hours',
    participants: '10,000+',
    location: 'Multiple Centers across Gujarat',
    fee: 0,
    category: 'exams',
    status: 'coming-soon',
    pinned: false,
    link: 'gcgform',
    features: ['Three-stage: Knowledge Test, Project, and Quiz', 'Merit-based scholarships'],
    eligibility: ['Students in grades 8-12', 'Valid school enrollment'],

    fields: [
      ...PERSONAL_FIELDS,
      ...ACADEMIC_FIELDS,
      ...GUARDIAN_FIELDS,
      ...DOCUMENT_FIELDS,
      ...ADDITIONAL_FIELDS,
      CONSENT_FIELD,
    ],
  },

  // Morbi treasure Hunt
  {
    id: 'city-treasure-hunt-morbi',
    title: 'Mission Morbi: The Midnight ',
    description: 'A fast-paced outdoor treasure hunt where teams solve clues, race across checkpoints, and compete for the final prize.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1080',
    date: 'May 2026',
    duration: '2-3 Hours',
    participants: '25',
    location: 'Selected Area Morbi',
    fee: 200,
    category: 'competitions',
    status: 'open',
    pinned: true,
    link: 'midnightMystry',
    maxTeamSize: 3,
    features: ['Real-world clue-based treasure hunt',
      'Multiple checkpoints across the city',
      'QR code + physical clue system',
      'Live leaderboard tracking',
      'Cash prize + trophy for winners'],
    eligibility: ['Age 18-30 only',
      'Team of 2-4 members',
      'Must carry smartphone with internet',
      'Basic physical mobility required'],

    fields: [
      ...PERSONAL_FIELDS,
      ...INFLUENCER_FIELDS,
      CONSENT_FIELD,
    ],
  },

  // ── Saurashtra Ideathon ─────────────────────────────────────────────────────
  {
    id: 'saurashtra-ideathon-2026',
    title: 'Saurashtra Ideathon 2026',
    description: 'A district-level innovation challenge where students pitch bold ideas to mentors, investors, and industry leaders.',
    image: 'https://images.unsplash.com/photo-1759171669032-beafad2287ee?w=600',
    date: 'February 2026',
    duration: '2 days',
    participants: '500+ teams',
    location: 'Saurashtra Region, Gujarat',
    fee: 100,
    category: 'entrepreneurships',
    status: 'open',
    pinned: true,
    link: 'ideathonform',
    maxTeamSize: 4,
    features: ['Pitch to real investors & mentors', 'Funding opportunities for top ideas'],
    eligibility: ['Grade 9-12, college students, founders (18-30)', 'Solo or team (max 4)'],
    downloadPdf: "/files/SAURASHTRA_IDIATHON_2026.pdf",
    fields: [
      ...PERSONAL_WITH_AADHAR,
      ...TEAM_FIELDS(4),
      ...ACADEMIC_FIELDS,

      // Topic picker — grade-aware
      {
        id: 'topics', section: 'topics', type: 'topic-picker',
        label: 'Innovation Domain', required: true,
        selectionMode: 'single',
        gradeField: 'currentClass',
        groups: [
          {
            id: 'school-junior', label: 'School Track — Grade 9 & 10', grades: ['9', '10'],
            topics: [
              { id: 'plastic-free', label: 'Plastic-Free Initiative', description: 'Promote reduction of plastic use in daily activities like vegetable shopping' },
              { id: 'food-waste', label: 'Food Waste Management', description: 'Redistribute leftover food from events to needy people efficiently' },
              { id: 'cooling-vendors', label: 'Low-Cost Cooling for Vendors', description: 'Electricity-free evaporative cooling for preserving vegetables' },
              { id: 'green-logistics', label: 'Green Logistics', description: 'Fuel-free or mechanical delivery solutions for small goods in cities' },
            ],
          },
          {
            id: 'school-senior', label: 'School Track — Grade 11 & 12', grades: ['11', '12'],
            topics: [
              { id: 'passive-cooling', label: 'Passive Cooling Systems', description: 'Reduce indoor temperature without AC or electricity' },
              { id: 'waste-recycling', label: 'Industrial Waste Recycling', description: 'Affordable purification of toxic industrial wastewater' },
              { id: 'bio-oil', label: 'Natural Oil Alternatives', description: 'Eco-friendly substitutes for machine oils and grease' },
              { id: 'bio-enzyme', label: 'Bio-Enzyme for Agriculture', description: 'Convert crop waste into fertilizer quickly instead of burning' },
            ],
          },
          {
            id: 'college', label: 'College / Graduate Track', grades: ['Graduate'],
            topics: [
              { id: 'plastic-fuel', label: 'Plastic to Fuel', description: 'Convert waste plastic into usable industrial diesel' },
              { id: 'water-purification', label: 'Low-Cost Water Purification', description: 'Affordable desalination and drinking water solutions' },
              { id: 'smart-farming', label: 'Efficient Farming Techniques', description: 'Maximize yield with minimal water usage' },
              { id: 'renewable-energy', label: 'Renewable Energy Solutions', description: 'Innovative and efficient power generation methods' },
              { id: 'ai-farming', label: 'AI-Based Agriculture', description: 'Use AI to detect crop diseases and recommend organic treatments' },
            ],
          },
          {
            id: 'founders', label: 'Open / Founders Track', grades: '*',
            topics: [
              { id: 'open-innovation', label: 'Open Innovation', description: "Any startup or research-based innovative idea" },
            ],
          },
        ],
      },
      ...DOCUMENT_FIELDS,
      CONSENT_FIELD,
    ],
  },


  // ── Science Fair ────────────────────────────────────────────────────────────
  {
    id: 'science-fair',
    title: 'State-Level Science & Innovation Fair',
    description: 'A premier exhibition for students to showcase creative science models and innovative solutions.',
    image: 'https://images.unsplash.com/photo-1581093577421-f561a654a353?w=600',
    date: 'November 2025',
    duration: '2 days',
    participants: '2,000+',
    location: 'Rajkot Science City',
    fee: 200,
    category: 'competitions',
    status: 'coming-soon',
    pinned: false,
    link: 'sciencefairform',
    features: ['Hands-on project display', 'Panel judging by scientists and professors'],
    eligibility: ['Students of grades 7-12', 'School nomination required'],

    fields: [
      ...PERSONAL_WITH_AADHAR,
      ...ACADEMIC_FIELDS,

      {
        id: 'topics', section: 'topics', type: 'topic-picker',
        label: 'Science Category', required: true,
        selectionMode: 'single',
        gradeField: 'currentClass',
        groups: [
          {
            id: 'science-junior', label: 'Junior Division — Grade 7, 8 & 9', grades: ['7', '8', '9'],
            topics: [
              { id: 'bio-jr', label: 'Biology & Life Sciences' },
              { id: 'chem-jr', label: 'Chemistry' },
              { id: 'phy-jr', label: 'Physics & Energy' },
              { id: 'env-jr', label: 'Environmental Science' },
              { id: 'math-jr', label: 'Maths & Computing' },
            ],
          },
          {
            id: 'science-senior', label: 'Senior Division — Grade 10, 11 & 12', grades: ['10', '11', '12'],
            topics: [
              { id: 'bio-sr', label: 'Biotechnology & Medicine' },
              { id: 'chem-sr', label: 'Chemistry & Materials' },
              { id: 'phy-sr', label: 'Physics & Engineering' },
              { id: 'cs-sr', label: 'Computer Science & AI' },
              { id: 'env-sr', label: 'Earth & Environmental Science' },
            ],
          },
          {
            id: 'science-open', label: 'Open Category', grades: '*',
            topics: [
              { id: 'inter', label: 'Interdisciplinary Project' },
              { id: 'social-s', label: 'Social Science & Innovation' },
            ],
          },
        ],
      },

      ...GUARDIAN_FIELDS,
      ...DOCUMENT_FIELDS,
      ...ADDITIONAL_FIELDS,
      CONSENT_FIELD,
    ],
  },

  // ── Quiz Championship ───────────────────────────────────────────────────────
  {
    id: 'quiz-championship',
    title: 'Inter-School Knowledge Quiz Championship',
    description: 'The ultimate quiz competition to boost knowledge, teamwork, and curiosity.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1080',
    date: 'September 2025',
    duration: '1 day',
    participants: '1,000+',
    location: 'Morbi Auditorium',
    fee: 100,
    category: 'competitions',
    status: 'coming-soon',
    pinned: false,
    link: 'quizform',
    maxTeamSize: 3,
    features: ['Multi-round quiz (written, audio, visual)', 'Win trophies and cash prizes!'],
    eligibility: ['Students of grades 6-12', 'Team of 3 members'],

    fields: [
      ...PERSONAL_WITH_AADHAR,
      ...TEAM_FIELDS(3),
      ...ACADEMIC_FIELDS,
      ...GUARDIAN_FIELDS,
      ...DOCUMENT_FIELDS,
      CONSENT_FIELD,
    ],
  },

  // ── Drawing Competition ─────────────────────────────────────────────────────
  {
    id: 'drawing-competition',
    title: 'District Art & Drawing Championship',
    description: 'A creative platform for young artists to express their imagination through art.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1080',
    date: 'July 10, 2025',
    duration: '1 day',
    participants: '1,200+',
    location: 'Morbi District Hall',
    fee: 0,
    category: 'competitions',
    status: 'closed',
    pinned: false,
    link: 'drawingform',
    features: ['Theme-based competition', 'Expert jury evaluation'],
    eligibility: ['Students aged 10-18', 'School and college participants'],

    fields: [
      // No aadhar for free event
      ...PERSONAL_FIELDS,
      ...ACADEMIC_FIELDS,
      ...GUARDIAN_FIELDS,
      ...ADDITIONAL_FIELDS,
      CONSENT_FIELD,
    ],
  },

];