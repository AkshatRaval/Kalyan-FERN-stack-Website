

export const activities = [
  {
    id: 'women-safety-camp',
    title: 'Morbi Women Safety & Self Defence Workshop',
    description: 'A practical training camp to empower girls and women with self-defence skills and safety awareness.',
    image: 'https://img.freepik.com/premium-photo/diverse-female-construction-workers-hard-hats-generative-ai-raw-illustration_167857-39164.jpg?semt=ais_hybrid&w=740&q=80',
    date: 'November 30, 2025',
    duration: '3 hours',
    participants: '300+',
    location: 'Morbi Town Hall',
    fee: 0,
    category: 'workshops',
    status: 'open',
    features: [
      'Practical self defence techniques',
      'Safety awareness & confidence building',
      'Fitness based training session'
    ],
    eligibility: [
      'Open for girls and women',
      'No age limit'
    ],
    isTeamBased: false,
    pinned: true,
    link: 'women-safety-form'
  },
  {
    id: 'gcg-exam',
    title: 'GCG Examination',
    description: 'Our flagship state-level scholarship examination designed to identify, reward, and mentor outstanding students across multiple subjects.',
    image: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'March 15, 2025',
    duration: '3 hours',
    participants: '10,000+ expected',
    location: 'Multiple Centers across Gujarat',
    fee: 0,
    category: 'exams',
    status: 'coming-soon',
    features: [
      'Three-stage structure: Knowledge Test, Project, and Quiz',
      'Merit-based scholarship distribution',
      'Mentorship for top 100 students',
      'Digital certificates for all participants',
      'Career guidance session for toppers'
    ],
    eligibility: [
      'Students in grades 8-12',
      'Age limit: 13-18 years',
      'Valid school enrollment'
    ],
    isTeamBased: false,
    pinned: false,
    link: 'gcgform',
  },

  {
    id: 'writing-competition',
    title: 'Creative Writing Competition',
    description: 'A literary event to encourage students to express their thoughts, ideas, and imagination through writing.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'August 25, 2025',
    duration: '2 hours',
    participants: '800+',
    location: 'Online & Offline Centers',
    fee: 0,
    category: 'competitions',
    status: 'coming-soon',
    features: [
      'Essay, story, and poem categories',
      'Judged by authors and educators',
      'Certificates for all participants',
      'Publication opportunity for best entries'
    ],
    eligibility: [
      'Students aged 12-20 years',
      'Individual participation only'
    ],
    isTeamBased: false,
    pinned: false,
    link: 'writingform'
  },
  {
    id: 'local-shark-program',
    title: 'Local Shark – Student Innovation & Investment Challenge',
    description: 'An entrepreneurship platform where young innovators can pitch ideas and receive funding, mentorship, and real-world exposure.',
    image: 'https://images.unsplash.com/photo-1759171669032-beafad2287ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    date: 'December 2025',
    duration: '3 days',
    participants: '500+ teams',
    location: 'Ahmedabad & Morbi (Hybrid Event)',
    fee: 1000,
    category: 'entrepreneurships',
    status: 'coming-soon',
    features: [
      'Idea pitching to real investors',
      'Startup mentorship sessions',
      'Funding opportunities for top ideas',
      'Networking with business leaders',
      'Certificate and media recognition'
    ],
    eligibility: [
      'College students and young entrepreneurs (18–30 years)',
      'Solo or team participation (max 4 members)',
      'Fees is payable per team'
    ],
    isTeamBased: true,
    maxTeamSize: 4,
    pinned: true,
    link: 'sharktankform'
  },
  {
    id: 'science-fair',
    title: 'State-Level Science & Innovation Fair',
    description: 'An exhibition and competition encouraging students to showcase creative science models and innovative solutions.',
    image: 'https://images.unsplash.com/photo-1581093577421-f561a654a353?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHNjaWVuY2V8ZW58MHx8MHx8fDA%3D',
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
      'STEM awareness workshops'
    ],
    eligibility: [
      'Students of grades 7–12',
      'School nomination required'
    ],
    isTeamBased: false,
    pinned: false,
    link: 'sciencefairform'
  },
  {
    id: 'quiz-championship',
    title: 'Inter-School Knowledge Quiz Championship',
    description: 'A fun and challenging quiz competition designed to boost knowledge, teamwork, and curiosity among students.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'September 2025',
    duration: '1 day',
    participants: '1,000+',
    location: 'Morbi Auditorium',
    fee: 100,
    category: 'competitions',
    status: 'coming-soon',
    features: [
      'Multi-round quiz (written, audio, and visual)',
      'Team-based participation',
      'Trophies and cash prizes',
      'General knowledge & current affairs topics'
    ],
    eligibility: [
      'Students of grades 6-12',
      'Team of 3 members'
    ],
    isTeamBased: false,
    maxTeamSize: 3,
    pinned: false,
    link: 'quizform'
  },
  {
    id: 'drawing-competition',
    title: 'District Art & Drawing Championship',
    description: 'A creative platform for young artists to express their imagination through art and drawing.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    date: 'July 10, 2025',
    duration: '1 day',
    participants: '1,200+',
    location: 'Morbi District Hall',
    fee: 0,
    category: 'competitions',
    status: 'closed',
    features: [
      'Theme-based competition',
      'Expert jury evaluation',
      'Trophies and certificates for winners',
      'Art exhibition of top entries',
      'Encouragement for creativity and cultural awareness'
    ],
    eligibility: [
      'Students aged 10-18 years',
      'Open to school and college participants'
    ],
    isTeamBased: false,
    pinned: false,
    link: 'drawingform'
  },
];
