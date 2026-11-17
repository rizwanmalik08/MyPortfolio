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

export const projectCategories = [
  { id: "all", label: "All Works" },
  { id: "web", label: "Live Websites" },
  { id: "graphics", label: "Social Media Posts & Graphics" },
  { id: "marketing", label: "Client Campaigns & Marketing" }
];

export const projects = [
  // ==========================================
  // --- REAL LIVE WEBSITES & CLIENT PORTALS ---
  // ==========================================
  {
    id: "new-jersey-pk",
    clientName: "New Jersey Clothing",
    company: "New Jersey PK",
    role: "Frontend Development & UI/UX",
    category: "web",
    type: "website",
    review: "DigiServiceZone delivered beyond our expectations. Fast, modern, responsive e-commerce experience.",
    link: "https://newjersey.pk/",
    image: "/new_jersey.png",
    badge: "NJ",
    featured: true,
    tags: ["React", "Tailwind CSS", "Responsive UI", "E-commerce"],
    description: "Production e-commerce storefront for New Jersey apparel. Engineered responsive component architecture, optimized asset pipelines, intuitive collection browsing, and seamless checkout flows across all devices.",
    metrics: ["100% Mobile Responsive", "< 1.2s Load Speed", "Live Production Store"]
  },
  {
    id: "digiservicezone-platform",
    clientName: "DigiServiceZone Platform",
    company: "DigiServiceZone",
    role: "Full-Stack Web Development & Architecture",
    category: "web",
    type: "website",
    review: "Our agency flagship web platform engineered for high conversion, interactive showcases, and client onboarding.",
    link: "https://digiservicezone.com/",
    image: "/real-websites/digiservicezone-preview.png",
    badge: "DSZ",
    featured: true,
    tags: ["React", "Next.js", "Tailwind CSS", "Full-Stack Web"],
    description: "Official web platform for DigiServiceZone agency. Features dark cyber aesthetic, dynamic client case studies, service inquiry systems, and optimized SEO structure that drives commercial client acquisition.",
    metrics: ["Modern Web Architecture", "High-Converting UI", "Live Agency Platform"]
  },
  {
    id: "noor-chemicals-web",
    clientName: "Noor Chemicals",
    company: "Noor Chemicals Corp",
    role: "Digital Marketing & Web Strategy",
    category: "web",
    type: "website",
    review: "Excellent communication, modern design, and exceptional ongoing digital marketing support throughout.",
    link: "https://www.facebook.com/profile.php?id=100090117847386",
    image: "/noor_chemicals.png",
    badge: "NC",
    featured: false,
    tags: ["Web Strategy", "Meta Ads", "B2B Brand", "SEO"],
    description: "Corporate digital presence and marketing funnel for Noor Chemicals. Established professional branding, product line catalogs, and lead generation channels that expanded market visibility in industrial chemicals.",
    metrics: ["300%+ Reach Growth", "Verified Industrial Brand", "Active Lead Pipeline"]
  },
  {
    id: "shaban-chemicals-web",
    clientName: "Shaban Chemicals",
    company: "Shaban Chemicals",
    role: "B2B Web Presence & Marketing",
    category: "web",
    type: "website",
    review: "A great team to work with. They understood our industrial requirements perfectly.",
    link: "https://www.facebook.com/shabanchemical/",
    image: "/shaban_chemical.png",
    badge: "SC",
    featured: false,
    tags: ["B2B Portal", "Brand Content", "Industrial SEO", "Social Growth"],
    description: "B2B digital marketing and industrial product portfolio for Shaban Chemicals. Created unified corporate visuals, product catalog presentations, and client communication touchpoints.",
    metrics: ["Consistent Brand Voice", "Enhanced Engagement", "Verified Industrial Presence"]
  },

  // ==========================================
  // --- REAL CLIENT GRAPHICS & SOCIAL POSTS ---
  // ==========================================
  {
    id: "dsz-web-dev-post",
    clientName: "Web Development Services Post",
    company: "DigiServiceZone Client Post",
    role: "Graphic Design & Typography",
    category: "graphics",
    type: "graphic-post",
    review: "Professional layout, clear service hierarchy, and bold commercial typography that generated client inquiries.",
    link: "https://digiservicezone.com/",
    image: "/real-graphics/web-dev-post.png",
    badge: "DSZ",
    featured: true,
    tags: ["Social Media Post", "Photoshop", "Ad Graphic", "Custom Layout"],
    description: "Official social media marketing post designed for DigiServiceZone's web development services. Features server infrastructure imagery, service feature checklists, and prominent contact call-to-actions.",
    metrics: ["1080 × 1080px Square", "Commercial Social Post", "High-Converting Layout"]
  },
  {
    id: "modelux-vio-residences",
    clientName: "VIO Residences Dubai Campaign",
    company: "Modelux Developments",
    role: "Real Estate Social Ad Design",
    category: "graphics",
    type: "graphic-post",
    review: "Luxury architectural presentation that perfectly highlighted the rooftop amenities and modern living concept.",
    link: "https://modeluxdevelopments.com/",
    image: "/real-graphics/digital-expertise.webp",
    badge: "MD",
    featured: true,
    tags: ["Real Estate Ad", "Luxury Branding", "Multi-Photo Grid", "Meta Campaign"],
    description: "High-end social media campaign post created for Modelux Developments' VIO Residences in Dubai. Showcases rooftop gardens, outdoor cinema, swimming pool, and luxury residential amenities with elegant editorial framing.",
    metrics: ["High-Res Meta Ad", "Luxury Dubai Client", "Multi-Image Composition"]
  },
  {
    id: "dsz-graphic-agency-post",
    clientName: "Graphic Design Agency Post",
    company: "DigiServiceZone Client Creative",
    role: "Creative Direction & Composition",
    category: "graphics",
    type: "graphic-post",
    review: "Engaging circular photo framing and modern color blocking that effectively communicates our creative capabilities.",
    link: "https://digiservicezone.com/",
    image: "/real-graphics/graphic-design-post.png",
    badge: "GD",
    featured: false,
    tags: ["Social Creative", "Photo Composition", "Brand Collateral", "Illustrator"],
    description: "Marketing post design featuring collaborative team imagery, dynamic halftone dot patterns, clean blue brand accents, and direct contact details for creative design inquiries.",
    metrics: ["Square 1:1 Feed Post", "Halftone Pattern Art", "Client Brand Assets"]
  },
  {
    id: "dsz-brand-identity-post",
    clientName: "Striking Visuals & Branding Post",
    company: "DigiServiceZone Creative Series",
    role: "Brand Identity Design",
    category: "graphics",
    type: "graphic-post",
    review: "Dark mode aesthetic with warm golden typography that positions our design agency as premium and modern.",
    link: "https://digiservicezone.com/",
    image: "/real-graphics/brand-identity-post.png",
    badge: "ID",
    featured: false,
    tags: ["Brand Identity", "Dark Mode UI", "Poster Design", "Social Kit"],
    description: "Editorial style social media post showcasing graphic design, website design, motion graphics, and game asset services. Features sleek dark graphite backdrop and golden script accent typography.",
    metrics: ["Dark Luxury Aesthetic", "Editorial Hierarchy", "Multi-Service Showcase"]
  },
  {
    id: "dsz-digital-marketing-post",
    clientName: "Digital Marketing Agency Post",
    company: "DigiServiceZone Marketing Kit",
    role: "Marketing Visual & Ad Design",
    category: "marketing",
    type: "graphic-post",
    review: "High-energy brand creative that drove qualified commercial inquiries across Meta and WhatsApp channels.",
    link: "https://digiservicezone.com/",
    image: "/real-graphics/social-media-post-1.png",
    badge: "MKT",
    featured: false,
    tags: ["Marketing Ad", "Lead Generation", "Vector Shapes", "Brand Assets"],
    description: "Commercial marketing post designed for business growth and customer acquisition campaigns. Incorporates curved geometric brand motifs, service category icons, and direct phone/web contact badges.",
    metrics: ["Direct Lead Generation", "Custom Vector Curves", "Brand Marketing Kit"]
  },
  {
    id: "dsz-social-growth-post",
    clientName: "Social Media Growth 3D Post",
    company: "DigiServiceZone Marketing",
    role: "3D Visuals & Social Campaign",
    category: "marketing",
    type: "graphic-post",
    review: "Playful isometric 3D arrows and vibrant pastel purple styling that immediately caught attention on social feeds.",
    link: "https://digiservicezone.com/",
    image: "/real-graphics/social-media-post-2.png",
    badge: "3D",
    featured: false,
    tags: ["Social Marketing", "3D Isometric", "Growth Campaign", "Meta Ad"],
    description: "Eye-catching social media promotional post with custom 3D upward growth arrows, gold coin visual, and bold gradient typography focused on social engagement amplification.",
    metrics: ["3D Render Elements", "Vibrant Social Visual", "Engagement Campaign"]
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
