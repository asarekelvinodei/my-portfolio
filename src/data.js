// EDIT THIS FILE: everything on the site comes from here.
export const me = {
  name: 'Kelvin Odei Asare',
  role: 'Information Systems Graduate & IT Technician',
  intro: 'I administer Windows environments, fix hardware and software faults, and turn data into clear dashboards. Based in Accra, Ghana.',
  status: 'Open to new opportunities',
  email: 'asarekelvinodei@gmail.com',
  cv: '/My_CV.pdf',
  photo: '/photo.jpg', // put your picture at public/photo.jpg
  formId: 'YOUR_FORM_ID', // from formspree.io, see README
  about: 'I am an Information Systems graduate who likes systems that quietly work. At the Lands Commission I kept a Windows domain healthy, tracked faults in a structured log and deployed new desktops. I co-led an evaluation of Ghana.gov’s electronic tax filing system, I turn messy data into dashboards in Excel and Tableau, and I build and maintain websites, including one for a registered NGO.',
  links: [
    { label: 'Tableau Public', href: 'https://public.tableau.com/app/profile/kelvin.asare.odei' },
  ],
}

// Shown as nodes in the hero network. Keep names short; 6 to 9 works best.
export const skills = [
  { name: 'Windows domain', note: 'Joining machines, fixing trust relationship errors, user access support.' },
  { name: 'Troubleshooting', note: 'Structured diagnosis of hardware and software faults to cut downtime.' },
  { name: 'Networking', note: 'Cable termination, network troubleshooting and introductory Wireshark.' },
  { name: 'Linux and macOS', note: 'Ubuntu, macOS, Git and VirtualBox for testing and development.' },
  { name: 'SQL and MySQL', note: 'Database design and queries, with XAMPP and PHP for local work.' },
  { name: 'Data analysis', note: 'Excel and Tableau for cleaning, analysing and visualising data.' },
  { name: 'Web development', note: 'HTML, CSS, JavaScript, React, Vite and Tailwind CSS.' },
  { name: 'IS evaluation', note: 'IT audit and controls, usability evaluation, survey and interview design.' },
]

export const projects = [
  {
    title: 'Nextworld Foundation website',
    text: 'Designed, built and deployed a multi-page site for a registered Ghanaian NGO, including a membership registration form and donation functionality. I still maintain it.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Cloudflare'], href: 'https://nextworld-foundation-site.asarekelvinodei.workers.dev/',
    points: ['Home, about, governance and projects pages built from real stakeholder requirements.', 'Membership registration form and donation functionality.', 'Deployed on Cloudflare and kept online.'],
  },
  {
    title: 'Plotline Homes',
    text: 'Built a modern property platform for showcasing homes, supporting property discovery and presenting a polished real-estate experience.',
    tags: ['Web development', 'Real estate', 'Cloudflare'], href: 'https://plotline-homes.asarekelvinodei.workers.dev/',
    points: ['Modern responsive property showcase.', 'Clear property discovery and presentation.', 'Deployed on Cloudflare Workers.'],
  },
  {
    title: 'Mobile subscriptions vs internet use',
    text: 'Sourced and cleaned telecom data for five African countries from 2000 to 2024, then built an interactive Tableau dashboard comparing mobile subscription growth with internet penetration.',
    tags: ['Excel', 'Tableau', 'Data storytelling'], href: 'https://public.tableau.com/app/profile/kelvin.asare.odei',
    points: ['Cleaned and analysed 24 years of data (2000 to 2024) in Excel.', 'Published an interactive dashboard on Tableau Public.', 'Compared trends across countries and time using data storytelling principles.'],
  },
  {
    title: 'Ghana.gov e-tax filing evaluation',
    text: 'Co-led a mixed-methods study of Ghana’s electronic tax filing system at the Ghana Revenue Authority, using taxpayer questionnaires, official interviews and a usability evaluation. Assessed system quality, satisfaction and adoption barriers with the DeLone & McLean, TAM and E-Government Maturity models.',
    tags: ['Research', 'Usability', 'E-government'],
    readHref: '/document-viewer.html?file=GCTU_eGovernance_Thesis.pdf&title=GCTU%20Thesis&back=%23work',
    downloadHref: '/GCTU_eGovernance_Thesis.pdf',
    points: ['Case study of the Ghana Revenue Authority, Spintex, assessing a live public-sector system.', 'Combined taxpayer questionnaires, interviews with GRA officials and a usability evaluation.', 'Wrote findings and practical recommendations to improve effectiveness and public adoption.'],
  },
]

export const jobs = [
  {
    org: 'Lands Commission Head Office, Accra', role: 'IT Technician (National Service)', period: '2025 to 2026',
    text: 'Administered the Windows domain, supported user access management, kept a structured issue log to spot recurring faults, repaired hardware and software across departments, and configured new desktops before handover.',
  },
  {
    org: 'University of Ghana Medical School, Korle Bu', role: 'IT Attachment', period: '2023',
    text: 'Helped the IT unit resolve staff technical issues, gained hands-on experience with structured cabling and Wireshark, and prepared desktops for deployment.',
  },
]

export const education = [
  { school: 'Ghana Communication Technology University', course: 'BSc Information Systems', detail: 'Second Class Honours (Upper Division), CGPA 3.50.' },
  { school: 'Ofori Panin Senior High School', course: 'WASSCE, Business with Elective ICT', detail: 'Tafo Kukurantumi.' },
]

export const tools = ['Windows', 'Ubuntu', 'macOS', 'SQL', 'MySQL', 'Excel', 'Tableau', 'React', 'Vite', 'Tailwind CSS', 'Git', 'Wireshark', 'VirtualBox', 'PHP']

export const groups = [
  { title: 'IT administration', items: ['Windows domain', 'Trust relationship fixes', 'User access support', 'Desktop deployment', 'Hardware repair', 'Issue tracking'] },
  { title: 'Data and analytics', items: ['Excel', 'SQL', 'Tableau', 'Data cleaning', 'Data visualisation', 'Google Sheets'] },
  { title: 'Web and databases', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Tailwind CSS', 'PHP', 'MySQL'] },
  { title: 'Evaluation and controls', items: ['IT audit and controls', 'DeLone & McLean', 'TAM', 'E-Government Maturity', 'Usability evaluation'] },
]
