// Everything the binder says lives in this file. Edit text here; the layout follows.
//
// Page fields:  kicker, title, lead (bold one-line takeaway), logo, slug (link name, e.g. #theater), blocks
// Logos:        babson, cmu, vertex, wholefoods, ftc, frc, rmhc, bmc (files in assets/logos/) — on a page or an entry ({..., logo: 'babson'})
// Block types:  entry {h, meta, body}   text {body}        photo {src, alt, [w, h, rot, tap]} — taped in; visitors can peel it off
//
//               role {h, meta}          list {h, items}    links {h, items: [[label, url]]}
//               hi {h, meta, goto}      jump {}            post {}   pocket {}

export const CONTACT = {
  name: 'Ryan Edward Scott',
  email: 'ryscott82@gmail.com',
  phone: '', // left off on purpose: a public site gets scraped. Add it here to show it on the contact card.
  resume: 'resume.pdf', // put your résumé PDF at the root of the repo with this name
  linkedin: 'http://www.linkedin.com/in/ryscott82',
  instagram: 'http://instagram.com/ryscott82',
  youtube: 'https://www.youtube.com/channel/UCbnWWd29rhdNZx2LW28GVqw',
  remg: 'https://ryanedwardmediagroup.com'
};

const P = (name, alt) => ({ type: 'photo', src: 'assets/photos/' + name + '.webp', alt, contain: name === 'mela' });
const E = (h, meta, body, logo) => ({ type: 'entry', h, meta: meta || '', body: body || '', logo });
const T = (body) => ({ type: 'text', body });
const R = (h, meta) => ({ type: 'role', h, meta });
const L = (h, items) => ({ type: 'list', h, items });

export const SECTIONS = [
  { label: 'About', pages: [
    { cover: true, slug: 'about' },
    { kicker: 'Ryan Edward Scott', title: 'At a glance', slug: 'at-a-glance', blocks: [
      { type: 'hi', h: '51 software risks found for Vertex Pharmaceuticals', meta: 'Student consultant, Babson MCFE, 2026', goto: 'vertex' },
      { type: 'hi', h: '$80,000+ budget, 40+ people, 600+ attendees', meta: 'President, Babson Players', goto: 'arts' },
      { type: 'hi', h: 'First Place CONNECT Award', meta: 'FIRST Tech Challenge World Championship, 2021–2022', goto: 'ftc' },
      { type: 'jump' }
    ] }
  ] },
  { label: 'Experience', sub: 'Weissman Foundry, Carnegie Mellon, Vertex, and more', pages: [
    { kicker: 'Section 02', title: 'Experience', slug: 'experience', blocks: [
      P('exp', 'The Weissman Foundry at Babson College'),
      { type: 'links', h: 'Résumé', items: [['Download my résumé (PDF)', CONTACT.resume]] }
    ] },
    { blocks: [
      E('Weissman Foundry', 'Product Development Consultant (Scout) · Jan 2025–present', 'Consult 40+ students in physical and digital product development and advanced manufacturing.', 'babson'),
      E('Carnegie Mellon University', 'Lab Intern · Jun–Sep 2026', 'Researched and planned effective ways to bring AI into primary education.', 'cmu'),
      E('STEM Coding Lab', 'Project Analyst · Jun–Aug 2026', 'Collected and analyzed 8,000+ data points in a custom Google Sheets database. Created 9 lessons teaching elementary students the limits of AI.')
    ] },
    { kicker: 'Experience · Babson College MCFE', title: 'Vertex Pharmaceuticals', slug: 'vertex', logo: 'vertex',
      lead: 'Student consultant: identified 51 risks in new software systems, with recommendations to mitigate each.',
      blocks: [
        L('Jan–May 2026', [
          'Applied insights from 4 interviews with industry professionals and consultants, and 2 key case studies',
          'Presented 15 detailed technical slides and a living risk register that calculates ongoing RPNs'
        ])
      ] },
    { blocks: [
      E('Whole Foods Market', 'E-Commerce Team Member (seasonal) · Nov 2024–Aug 2025', 'Fulfilled online orders at 70+ units per hour with 100% accuracy.', 'wholefoods'),
      E('MySTEM Academy', 'Coding and Robotics Summer Camp Instructor · Jun–Aug 2022', 'Led 3rd–7th graders through Scratch and Python programming.'),
      E('Amazon FBA / Print on Demand', 'Self-employed · Jun 2020–May 2022', '')
    ] }
  ] },
  { label: 'Education', sub: 'Babson College, Pine-Richland / Sewickley', pages: [
    { kicker: 'Section 03', title: 'Education', slug: 'education', blocks: [P('edu', 'Babson College campus from above')] },
    { blocks: [
      E('Babson College', 'B.S. Business Administration, Strategy & Consulting · 2024–2027', '3.4 GPA, Dean’s List. Coursework: Management Consulting Field Experience, Negotiations, FME, Technology Operations Management.', 'babson'),
      E('Pine-Richland & Sewickley Academy', 'High school · Class of 2024', 'Highest Honor Roll; 9 AP and 13 advanced or honors courses.'),
      R('Business software', 'Microsoft Office, Google Workspace, Apple iWork, Minitab'),
      R('AI', 'OpenAI API, Gemini, Claude (Anthropic API), Copilot, Llama, Perplexity'),
      R('Creative & technical', 'Adobe Creative Cloud, Fusion 360, Revit, Final Cut, Logic, Canva'),
      R('Languages', 'Java, Python, R, HTML; basic Swift, SQL, Zsh and Go')
    ] }
  ] },
  { label: 'Projects', sub: 'MindHugz, Mela-Know-More, BrainSTEM robotics', pages: [
    { kicker: 'Section 04', title: 'Projects', slug: 'projects', blocks: [
      P('projects', 'Close-up of the team 8393 robot'),
      { type: 'links', h: 'Videos', items: [
        ['IMPACT Award (FRC)', 'https://youtu.be/bxJXCOKCVH0'],
        ['First Place CONTROL Award (FTC)', 'https://youtu.be/ITH3-EKN1Po'],
        ['2019–2020 FTC season', 'https://youtu.be/hlcbGaSOi1o'],
        ['First Place Compass Award (FTC)', 'https://youtu.be/O6-WrQWFEGk']
      ] }
    ] },
    { kicker: 'Projects · Babson College FME', title: 'MindHugz', slug: 'mindhugz',
      lead: 'Chief Operations Officer: built the supply chain and took the product to market in 4 months.',
      blocks: [
        E('Aug 2024–Apr 2025', '', 'Developed the supply chain pipeline and evaluated 6 suppliers against 7 KPIs.')
      ] },
    { kicker: 'Projects', title: 'Mela-Know-More', slug: 'mela-know-more',
      lead: 'Melanoma risk analysis software that won the CONNECT Award at the FIRST World Championship.',
      blocks: [P('mela', 'Mela-Know-More project poster: mission, technology and feedback from experts')] },
    { kicker: 'Projects · BrainSTEM Learning Inc.', title: 'BrainSTEM Robotics', slug: 'brainstem',
      lead: 'Business and Community Outreach Lead, 2018–2024.',
      blocks: [
        L('', [
          'Led teams of 20+ people in large-scale projects, outreach events and fundraising',
          'Wrote 500+ pages of technical documentation, financials and project summaries',
          'Designed and manufactured hall-of-fame recognized robots'
        ])
      ] },
    { kicker: 'Projects · FTC Teams 8393 and 6931', title: 'FIRST Tech Challenge', slug: 'ftc', logo: 'ftc',
      lead: 'Six seasons of competitive robotics, with a First Place CONNECT Award at Worlds.',
      blocks: [
        R('2023–2024', 'PA State Championship · First Place THINK Award'),
        R('2022–2023', 'World Championship · Top Seeded Finalist Alliance'),
        R('2021–2022', 'World Championship · First Place CONNECT Award'),
        R('2020–2021', 'PA State Championship · First Place INNOVATE and CONTROL'),
        R('2019–2020', 'Virginia State Championship · First Place Compass Award'),
        R('2018–2019', 'PA State Championship · Winning Alliance, then Worlds')
      ] },
    { kicker: 'Projects · FRC Team 8393', title: 'FIRST Robotics Competition', slug: 'frc', logo: 'frc',
      lead: 'A rookie team that competed at the FIRST World Championship in its first year.',
      blocks: [
        E('2023 · Rookie year', 'Rochester and Pittsburgh Regionals', 'Rookie All-Star Award; Captain of the Finalist Alliance; Highest Rookie Seed; Team Sustainability Award. Qualified for and competed at the FIRST World Championship.'),
        E('2024', 'Pittsburgh and Miami Valley Regionals, World Championship', 'Engineering Inspiration Award; IMPACT Award; callback judging for Engineering Inspiration at Worlds (top 4 teams).')
      ] }
  ] },
  { label: 'Community', sub: 'U-Prep 4 Life, Haitian Relief, Belize, Ronald McDonald House', pages: [
    { kicker: 'Section 05', title: 'Community', slug: 'community', blocks: [
      { type: 'photo', src: 'assets/photos/postcard.webp', alt: 'Community members gathered outdoors in Haiti', w: 300, h: 196, rot: 2, tap: 'postcard' }
    ] },
    { kicker: 'Community', title: 'U-Prep 4 Life Pathway', slug: 'u-prep-4-life',
      lead: 'A computer science curriculum for publicly housed students, built with 2 universities as part of a $150,000 grant.',
      blocks: [
        L('What I did', [
          'Created an 8-module supplemental high school computer science curriculum, with slideshows and class activities',
          'Represented my team in meetings with M-Powerhouse, Slippery Rock University, Pittsburgh Technical College and Dark Rhino Security',
          'Worked with M-Powerhouse to write grants for program sustainability',
          'Co-taught several modules; designed posters, an EPK and marketing materials'
        ])
      ] },
    { kicker: 'Community', title: 'Haitian Relief', slug: 'haitian-relief',
      lead: 'Raised over $7,000 for medical clinics and farming classes in Haiti.',
      blocks: [
        T('My friends and I wanted to help people in Haiti, living in a gang-run environment. I first wanted to start STEM classes, but experts told us food, water and health were more pressing: there is no running water or electricity, and infrastructure could not be imported.'),
        T('So we held community events to fund a traveling medical clinic, which has treated 252 patients in 3 villages, and sent 10 local farmers for training on improving harvest yield and quality.')
      ] },
    { kicker: 'Community', title: 'Belize and Ronald McDonald House', slug: 'belize',
      blocks: [
        E('Robotics in Belize City', '', 'Presented to the Bayer Project panel and was awarded $15,000 to start 20 robotics teams in Belize City.'),
        E('Ronald McDonald House', '', 'Led a program of 20 STEM activity stations for the families of hospitalized children: electronics learning labs, LEGO, snap circuits and marble races. The local director told us, “No one ever thinks about the families.”', 'rmhc')
      ] }
  ] },
  { label: 'The Arts', sub: 'Babson Players, theater, training, photography, music', pages: [
    { kicker: 'Section 06', title: 'The Arts', slug: 'arts', blocks: [
      P('arts', 'Ryan singing on stage'),
      E('Babson Players', 'President', 'Manage an $80,000+ annual budget, lead teams of 40+ people and host events with 600+ attendees.')
    ] },
    { kicker: 'The Arts', title: 'Theater', slug: 'theater',
      lead: '13 roles across school, community and regional stages.',
      blocks: [
        R('Richard Stanley', 'The Man Who Came To Dinner · Pine-Richland, 2023'),
        R('Javert', 'Les Misérables · Comtra Theater, 2022'),
        R('Gene Kelly Awards Finale', 'Benedum Center for the Performing Arts, 2022'),
        R('Billy Boy Bill', 'Urinetown · Sewickley Academy, 2022'),
        R('Sergei, Ballerina & Featured Dancer', 'Anastasia YPE pilot · TJ Lubinsky Studio, 2021')
      ] },
    { blocks: [
      R('Simba', 'The Lion King, Jr. · Jeter Backyard Theater, 2021'),
      R('Juror 6', '12 Angry Men · Sewickley Academy, 2021'),
      R('Prince Eric', 'The Little Mermaid · Jeter Backyard Theater, 2021'),
      R('Seth & Snake', 'Children of Eden · The Comtra Theater, 2021'),
      R('Jock', 'High School Musical · Pine-Richland High School, 2021'),
      R('Aladdin', 'Aladdin, Jr. · Jeter Backyard Theater, 2021'),
      R('Chad Charming', 'Descendants pilot · Jeter Backyard Theater, 2020'),
      R('Captain Hook', 'Peter Pan, Jr. · The Kean Theatre, 2019')
    ] },
    { kicker: 'The Arts', title: 'Training', slug: 'training', blocks: [
      R('Voice', 'Beth Leckey (2017–2021), Thespina Christulides (2023), Jacqulynn Ware (2021–current)'),
      R('Dance', 'Elizabeth Karas, Beth Robertshaw, Amber Martin, Eileen Grace, Rocker Verastique, Danny Herman, Judine Sommerville'),
      R('Acting', 'Paul Renyolds, Amy Landis, Joe Jackson, Renee Rabenold'),
      R('Stage combat', 'Samuel Munoz'),
      R('Programs', 'Jeter Backyard Theater (2019–2021) · Wexford Dance Academy (2021–) · CLO Academy Summer Training (2022) · Point Park University Summer Musical Theater Intensive (2023)')
    ] },
    { kicker: 'The Arts', title: 'Photography', slug: 'photography', blocks: [
      P('photography', 'A coastal village in Italy seen from above'),
      T('[A FEW WORDS ABOUT WHAT YOU SHOOT]')
    ] },
    { kicker: 'The Arts', title: 'Music', slug: 'music', blocks: [
      E('Babson Music Collective', 'Student Leader', 'Vocals and keys for an 8-piece band. Debut album coming soon.', 'bmc'),
      E('Babson Sound', 'Vice-President', 'Leading campus musicians through live music events, solving technical and logistical challenges.'),
      { type: 'pocket' }
    ] }
  ] }
];

// Pop-outs (the program behind the Theater page, the postcard, the back-pocket card)
export const PROGRAM = { photo: 'assets/photos/program.webp', alt: 'Ryan as Javert in Les Misérables', where: 'Comtra Theater · 2022', show: 'Les Misérables', role: 'Ryan Scott as Javert', credit: 'Directed by Thom McLaughlin' };
export const POSTCARD = { photo: 'assets/photos/postcard.webp', alt: 'Community members gathered outdoors in Haiti', note: '[A FEW LINES ABOUT THIS PLACE OR MEMORY, AS IF WRITTEN ON THE BACK OF THE POSTCARD]' };
export const POCKET = { note: '[A NOTE FOR PEOPLE WHO READ TO THE LAST PAGE]' };
