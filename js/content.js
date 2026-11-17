// Everything the binder says lives in this file. Edit text here; the layout follows.
//
// Page fields:  kicker, title, lead (bold one-line takeaway), logo, slug (link name, e.g. #theater), blocks
// Logos:        babson, wholefoods, ftc, frc, rmhc (files in assets/logos/) — on a page or an entry ({..., logo: 'babson'})
// Block types:  entry {h, meta, body}   text {body}        photo {src, alt, [w, h, rot, tap]} — taped in; visitors can peel it off
//
//               role {h, meta}          list {h, items}    links {h, items: [[label, url]]}
//               hi {h, meta, goto}      jump {}            post {}   pocket {}

export const CONTACT = {
  name: 'Ryan Edward Scott',
  email: '', // e.g. 'ryan@example.com' — shown on the contact card and summary page when filled in
  resume: 'resume.pdf', // put your résumé PDF at the root of the repo with this name
  linkedin: 'http://www.linkedin.com/in/ryscott82',
  instagram: 'http://instagram.com/ryscott82',
  youtube: 'https://www.youtube.com/channel/UCbnWWd29rhdNZx2LW28GVqw',
  remg: 'https://ryanedwardmediagroup.com'
};

const P = (name, alt) => ({ type: 'photo', src: 'assets/photos/' + name + '.jpg', alt, contain: name === 'mela' });
const E = (h, meta, body, logo) => ({ type: 'entry', h, meta: meta || '', body: body || '', logo });
const T = (body) => ({ type: 'text', body });
const R = (h, meta) => ({ type: 'role', h, meta });

export const SECTIONS = [
  { label: 'About', pages: [
    { cover: true, slug: 'about' },
    { kicker: 'Ryan Edward Scott', title: 'At a glance', slug: 'at-a-glance', blocks: [
      { type: 'hi', h: 'First Place CONNECT Award', meta: 'FIRST Tech Challenge World Championship, 2021–2022', goto: 'ftc' },
      { type: 'hi', h: '$7,000 raised, 252 patients treated', meta: 'Haitian Relief traveling medical clinic', goto: 'haitian-relief' },
      { type: 'hi', h: '8-module computer science curriculum', meta: 'U-Prep 4 Life Pathway, Allegheny public housing', goto: 'u-prep-4-life' },
      { type: 'jump' }
    ] }
  ] },
  { label: 'Experience', sub: 'Weissman Foundry, MySTEM Academy, Whole Foods', pages: [
    { kicker: 'Section 02', title: 'Experience', slug: 'experience', blocks: [
      P('exp', 'The Weissman Foundry at Babson College'),
      { type: 'links', h: 'Résumé', items: [['Download my résumé (PDF)', CONTACT.resume]] }
    ] },
    { blocks: [
      E('Weissman Foundry', 'Babson College', 'Teaching students the product development cycle and advanced manufacturing techniques.', 'babson'),
      E('MySTEM Academy', '', 'Leading 3rd–7th graders through the journey of Scratch and Python programming.'),
      E('Whole Foods Market', 'E-Commerce Team Member', '', 'wholefoods')
    ] }
  ] },
  { label: 'Education', sub: 'Babson College, Pine-Richland / Sewickley', pages: [
    { kicker: 'Section 03', title: 'Education', slug: 'education', blocks: [P('edu', 'Babson College campus from above')] },
    { blocks: [
      E('Babson College', 'Bachelor of Science in Business Administration', 'Concentrating in Strategy and Consulting.', 'babson'),
      E('High School', 'Pine-Richland / Sewickley Academy · Class of 2024', '')
    ] }
  ] },
  { label: 'Projects', sub: 'Mela-Know-More, FTC and FRC robotics', pages: [
    { kicker: 'Section 04', title: 'Projects', slug: 'projects', blocks: [
      P('projects', 'Close-up of the team 8393 robot'),
      { type: 'links', h: 'Videos', items: [
        ['IMPACT Award (FRC)', 'https://youtu.be/bxJXCOKCVH0'],
        ['First Place CONTROL Award (FTC)', 'https://youtu.be/ITH3-EKN1Po'],
        ['2019–2020 FTC season', 'https://youtu.be/hlcbGaSOi1o'],
        ['First Place Compass Award (FTC)', 'https://youtu.be/O6-WrQWFEGk']
      ] }
    ] },
    { kicker: 'Projects', title: 'Mela-Know-More', slug: 'mela-know-more',
      lead: 'Melanoma risk analysis software that won the CONNECT Award at the FIRST World Championship.',
      blocks: [P('mela', 'Mela-Know-More project poster: mission, technology and feedback from experts')] },
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
  { label: 'Community', sub: 'U-Prep 4 Life, Haitian Relief, Ronald McDonald House', pages: [
    { kicker: 'Section 05', title: 'Community', slug: 'community', blocks: [
      { type: 'photo', src: 'assets/photos/postcard.jpg', alt: 'Community members gathered outdoors in Haiti', w: 300, h: 196, rot: 2, tap: 'postcard' }
    ] },
    { kicker: 'Community', title: 'U-Prep 4 Life Pathway', slug: 'u-prep-4-life',
      lead: 'A guaranteed high school to STEM career pathway for students in Allegheny public housing.',
      blocks: [
        { type: 'list', h: 'What I did', items: [
          'Created an 8-module supplemental high school computer science curriculum, with slideshows and class activities',
          'Represented my team in meetings with M-Powerhouse, Slippery Rock University, Pittsburgh Technical College and Dark Rhino Security',
          'Worked with M-Powerhouse to write grants for program sustainability',
          'Co-taught several modules; designed posters, an EPK and marketing materials'
        ] }
      ] },
    { kicker: 'Community', title: 'Haitian Relief', slug: 'haitian-relief',
      lead: 'Raised over $7,000 for a traveling clinic that has treated 252 patients in 3 villages.',
      blocks: [
        T('My friends and I wanted to help people in Haiti, living in a gang-run environment. I first wanted to start STEM classes, but experts told us food, water and health were more pressing: there is no running water or electricity, and infrastructure could not be imported.'),
        T('So we held a community bingo night to fund the clinic, and sent 10 local farmers for training on improving harvest yield and quality.')
      ] },
    { kicker: 'Community', title: 'Ronald McDonald House', slug: 'ronald-mcdonald-house', logo: 'rmhc',
      lead: 'Built 20 STEM activity stations for the families of hospitalized children.',
      blocks: [
        T('Extended hospitalization affects entire families, so I led a program with the Ronald McDonald House: electronics learning labs, LEGO, snap circuits and marble races for young family members of every age.'),
        T('The local director told us, “No one ever thinks about the families.”')
      ] }
  ] },
  { label: 'The Arts', sub: 'Theater, training, photography, music', pages: [
    { kicker: 'Section 06', title: 'The Arts', slug: 'arts', blocks: [P('arts', 'Ryan singing on stage'), T('Babson Players · President')] },
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
      E('Debut album coming soon', '', ''),
      E('Babson Music Collective', '2025', 'Vocals and keys for an 8-piece band.'),
      { type: 'pocket' }
    ] }
  ] }
];

// Pop-outs (the program behind the Theater page, the postcard, the back-pocket card)
export const PROGRAM = { photo: 'assets/photos/program.jpg', alt: 'Ryan as Javert in Les Misérables', where: 'Comtra Theater · 2022', show: 'Les Misérables', role: 'Ryan Scott as Javert', credit: 'Directed by Thom McLaughlin' };
export const POSTCARD = { photo: 'assets/photos/postcard.jpg', alt: 'Community members gathered outdoors in Haiti', note: '[A FEW LINES ABOUT THIS PLACE OR MEMORY, AS IF WRITTEN ON THE BACK OF THE POSTCARD]' };
export const POCKET = { note: '[A NOTE FOR PEOPLE WHO READ TO THE LAST PAGE]' };
