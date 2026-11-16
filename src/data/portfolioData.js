/**
 * Portfolio Data Configuration
 * Central source of truth for all personal content, projects, skills, services, and links.
 * Easily customize text, links, or media here.
 */

export const personalInfo = {
  name: "Rizwan",
  fullName: "Rizwan Malik",
  role: "Visual Designer & Full-Stack Developer",
  subRole: "Digital Marketer & Creative Technologist",
  kicker: "Visual Designer with Programming & Marketing Skills",
  bio: "I am Rizwan, a versatile digital professional with 4+ years of experience across visual design, digital marketing, and modern full-stack development. I combine visual storytelling with technical execution to build high-converting brands, scalable applications, and impactful digital experiences.",
  shortBio: "Visual designer and digital marketer with 4+ years of experience in branding, SEO, modern web development, and client solutions.",
  aboutParagraphs: [
    "I am Rizwan, a versatile digital professional with 4 years of experience across design, marketing, and development. I combine visual storytelling with technical execution to create brands, campaigns, and products that perform.",
    "My toolkit spans graphic and UX/UI design, SEO, social media marketing, and modern web and app technologies like React, React Native, Node.js, Flutter, and C++. I focus on clean visuals, measurable growth, and reliable builds."
  ],
  location: "Lahore, Pakistan",
  email: "rizwan@digiservicezone.com",
  phone: "+92 3214587905",
  whatsapp: "+92 3260388261",
  whatsappLink: "https://wa.me/923260388261?text=Hi%20Rizwan%2C%20I%20would%20like%20to%20discuss%20a%20project.",
  cvUrl: "/cv.pdf",
  formspreeEndpoint: "https://formspree.io/f/maewpjpp",
  socialLinks: {
    github: "https://github.com/rizwanmalik08",
    linkedin: "https://www.linkedin.com/in/rizwan-malik-5919692b7/",
    x: "https://x.com/Rizwanmalik_0",
  },
  highlights: [
    "Brand identity, graphic design, and UX/UI",
    "Digital marketing, SEO, and social campaigns",
    "Front-end and mobile app development",
    "Video editing and content optimization",
    "C++ software and desktop logic automation"
  ]
};

export const stats = [
  { value: 50, suffix: "+", label: "Happy Clients", icon: "Users" },
  { value: 100, suffix: "+", label: "Projects Completed", icon: "FolderCheck" },
  { value: 98, suffix: "%", label: "Client Satisfaction", icon: "Award" },
  { value: 4, suffix: "+", label: "Years Experience", icon: "Clock" },
];

export const services = [
  {
    id: "uiux-design",
    title: "UI/UX & Brand Identity",
    description: "Designing memorable visual identities, intuitive wireframes, responsive mobile/web design systems, and user-centered interactive prototypes.",
    icon: "Palette",
    deliverables: ["Brand Style Guides", "Figma Design Systems", "High-fidelity Prototypes", "Visual Assets"],
    accent: "from-violet-500/20 to-purple-500/5",
    border: "group-hover:border-violet-500/50"
  },
  {
    id: "web-dev",
    title: "Modern Web Development",
    description: "Building blazing-fast, responsive web applications using React, Next.js, Vite, Tailwind CSS, and clean modular JavaScript.",
    icon: "Code2",
    deliverables: ["Single Page Applications", "Responsive Web Design", "Performance Optimization", "API Integration"],
    accent: "from-cyan-500/20 to-sky-500/5",
    border: "group-hover:border-cyan-500/50"
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Crafting cross-platform mobile experiences for iOS and Android with React Native and Flutter, ensuring smooth native feel.",
    icon: "Smartphone",
    deliverables: ["iOS & Android Apps", "Cross-Platform Codebase", "Mobile UI Components", "State Management"],
    accent: "from-pink-500/20 to-rose-500/5",
    border: "group-hover:border-pink-500/50"
  },
  {
    id: "seo-marketing",
    title: "Digital Marketing & SEO",
    description: "Data-driven marketing strategies, On-Page SEO, Google Analytics setup, and targeted social media campaigns that scale visibility.",
    icon: "TrendingUp",
    deliverables: ["SEO Audits & Keyword Strategy", "Social Media Campaigns", "Traffic Growth", "Analytics & Conversion Tracking"],
    accent: "from-amber-500/20 to-orange-500/5",
    border: "group-hover:border-amber-500/50"
  },
  {
    id: "cpp-solutions",
    title: "C++ Logic & Desktop Tools",
    description: "Engineering robust desktop utilities, algorithm implementations, logic-driven systems, and automation scripts with C++ and Python.",
    icon: "Cpu",
    deliverables: ["Custom Desktop Software", "Data Processing Tools", "Automated Workflows", "Performance-critical Logic"],
    accent: "from-blue-500/20 to-indigo-500/5",
    border: "group-hover:border-blue-500/50"
  },
  {
    id: "video-media",
    title: "Video Editing & Content Media",
    description: "High-impact video editing, post-production motion effects, social ad reels, and engaging multimedia content for brands.",
    icon: "Film",
    deliverables: ["Promotional Video Ads", "Social Media Reels & Shorts", "Motion Graphics", "Content Color Grading"],
    accent: "from-emerald-500/20 to-teal-500/5",
    border: "group-hover:border-emerald-500/50"
  }
];

export const skills = [
  // Web & Frontend
  { name: "React.js", detail: "Component-driven UI & hooks", level: 90, category: "frontend", icon: "Atom" },
  { name: "Tailwind CSS", detail: "Utility-first rapid styling", level: 95, category: "frontend", icon: "Wind" },
  { name: "JavaScript", detail: "ES6+, Async, DOM & tooling", level: 90, category: "frontend", icon: "Code" },
  { name: "HTML/CSS", detail: "Semantic, accessible layouts", level: 95, category: "frontend", icon: "FileCode" },
  
  // Mobile & Backend
  { name: "React Native", detail: "Cross-platform mobile apps", level: 85, category: "mobile", icon: "Smartphone" },
  { name: "Flutter", detail: "Modern mobile UI builds", level: 85, category: "mobile", icon: "Layers" },
  { name: "Node.js", detail: "Server-side RESTful APIs", level: 85, category: "backend", icon: "Server" },
  { name: "MongoDB", detail: "NoSQL document databases", level: 85, category: "backend", icon: "Database" },
  { name: "MySQL", detail: "Relational database schema", level: 90, category: "backend", icon: "HardDrive" },
  
  // Systems & Scripting
  { name: "C/C++", detail: "Algorithms & desktop tools", level: 75, category: "systems", icon: "Terminal" },
  { name: "Python", detail: "Automation, scripts & data", level: 90, category: "systems", icon: "Binary" },
  
  // Design & Marketing
  { name: "UX/UI Designing", detail: "Wireframing & user journeys", level: 95, category: "creative", icon: "Layout" },
  { name: "Graphic Designing", detail: "Brand visuals & collateral", level: 85, category: "creative", icon: "PenTool" },
  { name: "SEO", detail: "Search ranking & on-page", level: 80, category: "marketing", icon: "Search" },
  { name: "Social Media Marketing", detail: "Paid & organic campaigns", level: 95, category: "marketing", icon: "Share2" },
  { name: "Video Editing", detail: "Post-production & reels", level: 90, category: "creative", icon: "Video" },
];

export const skillCategories = [
  { id: "all", label: "All Skills" },
  { id: "frontend", label: "Frontend" },
  { id: "mobile", label: "Mobile" },
  { id: "backend", label: "Backend & Data" },
  { id: "systems", label: "Systems & Python" },
  { id: "creative", label: "Design & Media" },
  { id: "marketing", label: "Marketing & SEO" }
];

export const projects = [
  {
    id: "new-jersey",
    clientName: "New Jersey",
    company: "New Jersey",
    role: "Frontend Development",
    review: "DigiServiceZone delivered beyond our expectations. Highly professional and reliable.",
    link: "https://newjersey.pk/",
    image: "/new_jersey.png",
    badge: "N",
    featured: false,
    tags: ["React", "Tailwind CSS", "Responsive UI", "E-commerce"],
    description: "Complete modern front-end web development with responsive architecture, smooth product catalog layouts, optimized assets, and seamless user experience for the New Jersey clothing brand.",
    metrics: ["100% Mobile Responsive", "Ultra-fast load time", "Clean Component Architecture"]
  },
  {
    id: "noor-chemicals",
    clientName: "Noor Chemicals",
    company: "Noor Chemicals",
    role: "Social Media Marketing",
    review: "Excellent communication, modern design and exceptional support throughout.",
    link: "https://www.facebook.com/profile.php?id=100090117847386",
    image: "/noor_chemicals.png",
    badge: "N",
    featured: true,
    tags: ["Meta Ads", "Branding", "Creative Design", "SEO"],
    description: "Holistic social media strategy, high-converting ad visuals, and targeted campaign management that significantly increased client brand reach, page engagement, and qualified commercial inquiries.",
    metrics: ["300%+ Reach Growth", "Professional Brand Assets", "Active Lead Pipeline"]
  },
  {
    id: "shaban-chemicals",
    clientName: "Shaban Chemicals",
    company: "Shaban Chemicals",
    role: "Social Media Marketing",
    review: "A great team to work with. They understood our requirements perfectly.",
    link: "https://www.facebook.com/shabanchemical/",
    image: "/shaban_chemical.png",
    badge: "S",
    featured: false,
    tags: ["Social Strategy", "Brand Content", "Copywriting", "Graphics"],
    description: "Strategic digital marketing campaigns, branded industrial graphics, product showcase posts, and community engagement initiatives tailored for the chemical manufacturing sector.",
    metrics: ["Consistent Brand Voice", "Enhanced Engagement", "Verified Industrial Presence"]
  }
];

export const certificates = [
  {
    id: "cert-1",
    title: "Tube Ads & Video Campaigns",
    issuer: "Google / YouTube Advertising",
    image: "/certificates/certificate1.jpg",
  },
  {
    id: "cert-2",
    title: "Digital Marketing Professional",
    issuer: "Digital Marketing Institute",
    image: "/certificates/certificate2.jpg",
  },
  {
    id: "cert-3",
    title: "Google Analytics Certification",
    issuer: "Google Analytics Academy",
    image: "/certificates/certificate3.jpg",
  },
  {
    id: "cert-4",
    title: "On-Page & Technical SEO",
    issuer: "SEO Specialist Certification",
    image: "/certificates/certificate4.jpg",
  },
  {
    id: "cert-5",
    title: "Advanced Marketing Strategy",
    issuer: "Professional Growth Academy",
    image: "/certificates/certificate5.jpg",
  },
  {
    id: "cert-6",
    title: "Social Growth & Community",
    issuer: "Social Media Strategies",
    image: "/certificates/certificate6.jpg",
  },
  {
    id: "cert-7",
    title: "Brand Visuals & Creative Design",
    issuer: "Creative Visual Arts",
    image: "/certificates/certificate7.jpg",
  },
];

export const experiences = [
  {
    period: "2023 - Present",
    title: "Founder & Lead Strategist",
    company: "DigiServiceZone",
    roleType: "Agency / Leadership",
    bullets: [
      "Founded and scaled DigiServiceZone, developing end-to-end digital branding and high-converting marketing strategies for diverse businesses.",
      "Managed and executed technical SEO campaigns that improved organic search rankings, domain authority, and client visibility.",
      "Delivered bespoke modern web applications and responsive client platforms using React and modern frontend stacks."
    ]
  },
  {
    period: "2022 - Present",
    title: "Founder & Software Developer",
    company: "ARService",
    roleType: "Technical Solutions",
    bullets: [
      "Engineered C++ and Python software solutions tailored for client-specific business automation and logic needs.",
      "Constructed custom desktop utilities, data processors, and high-performance algorithms.",
      "Provided strategic technical consulting, performance audits, and troubleshooting for small enterprise clients."
    ]
  },
  {
    period: "2021 - Present",
    title: "Freelance Creative & Developer",
    company: "Independent Practice",
    roleType: "Design & Development",
    bullets: [
      "Delivered 100+ freelance projects encompassing graphic design, brand identity systems, video editing, and modern web development.",
      "Partnered with brands globally to formulate high-impact social media content and advertising campaigns.",
      "Authored custom UI/UX design systems in Figma and implemented them into pixel-perfect responsive code."
    ]
  }
];

export const testimonials = [
  {
    quote: "Alex is an amazing developer. He delivered the project on time with great quality.",
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    rating: 5,
  },
  {
    quote: "Great communication and high-quality work. I highly recommend him!",
    name: "Michael Brown",
    role: "Founder, DevStudio",
    rating: 5,
  },
  {
    quote: "Professional, creative and dedicated. Will work with him again!",
    name: "Emily Davis",
    role: "Product Manager",
    rating: 5,
  }
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
