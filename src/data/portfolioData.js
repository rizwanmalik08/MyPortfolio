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
  { id: "all", label: "All Websites" },
  { id: "ecommerce", label: "E-Commerce & Storefronts" },
  { id: "agency", label: "Agency & Corporate Portals" }
];

export const projects = [
  {
    id: "soda-3d-experience",
    clientName: "Soda — 3D Product Experience",
    company: "Futuristic Zero-Sugar Beverage Brand",
    role: "Creative Developer & Three.js / GSAP Specialist",
    category: "ecommerce",
    type: "website",
    badge: "SD",
    review: "An extraordinary 3D product showcase inspired by high-end beverage advertising, featuring realistic 720° can rotations, interactive fruit physics, GSAP timeline choreography, and an Express.js backend.",
    link: "http://localhost:5002/",
    image: "/projects/soda-showcase.png",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "Three.js", "GSAP", "Node.js", "Express.js"],
    description: "Immersive 3D product website and interactive advertising showcase featuring Three.js WebGL rendering, realistic metallic PBR materials, cursor-driven camera physics, continuous floating animation, and a dramatic 720-degree GSAP flavor switcher that transitions can textures, fruit meshes (cherries to blueberries), and atmospheric themes between Diet Classic and Zero Lime. Complete with a zero-trust Express.js cart calculation engine, SQLite database persistence, customer review portal, and live admin telemetry dashboard.",
    deliverables: [
      "Interactive Three.js 3D Soda Can (Metallic PBR, Realistic Studio Lighting & Reflections)",
      "Dynamic 720° GSAP Flavor Switch Animation with Mid-Spin Texture & Fruit Swaps",
      "Floating 3D Cherries, Blueberries, and Leaves with Interactive Cursor Repulsion Physics",
      "Effervescent Rising Bubble Background System & Smooth Atmospheric Gradient Transitions",
      "Zero-Trust Express.js REST API with Server-Side Pricing, Inventory & Coupon Calculations",
      "Executive Administration Command Center with Live Telemetry KPIs & Order Management"
    ],
    metrics: ["720° Interactive 3D Spin", "100% Procedural & PBR", "Zero-Trust Server Cart"]
  },
  {
    id: "nova-store-3d",
    clientName: "Kanso Collective",
    company: "Luxury 3D E-Commerce Platform",
    role: "Full-Stack & 3D WebGL Architect",
    category: "ecommerce",
    type: "website",
    badge: "KC",
    review: "An extraordinary 3D shopping showcase with real-time Three.js model customization, tamper-proof Express API pricing, and complete executive administration.",
    link: "http://localhost:5001/",
    image: "/projects/nova-store-showcase.svg",
    featured: true,
    tags: ["JavaScript", "CSS", "Three.js", "Express.js", "Node.js", "SQLite"],
    description: "Full-stack luxury e-commerce demonstration built with interactive Three.js 3D model customizers, real-time GLB orbit controls and PBR material swatches, secure Node.js/Express REST API, zero-trust server-side cart & coupon calculations, and SQLite persistence across 11 relational tables including order fulfillment, inventory management, customer accounts, and an executive administration dashboard.",
    deliverables: [
      "Interactive Three.js 3D WebGL Viewer (Orbit, Zoom, Lighting, Material Swatches)",
      "13 Seeded Luxury Products Across 6 Real Categories",
      "Tamper-Proof Server-Side Cart & Dynamic Coupon Validation",
      "Secure User Auth (JWT, Bcrypt) & Customer Portal with Order History",
      "Executive Admin Dashboard with Live Revenue KPI Telemetry & Order Status Management",
      "Zero-Dependency SQLite Native Relational Database"
    ],
    metrics: ["Real-Time 3D WebGL", "100% Server Validated", "Zero Mock Data (Live DB)"]
  },
  {
    id: "new-jersey-pk",
    clientName: "New Jersey Clothing",
    company: "New Jersey PK",
    role: "Frontend Development & UI/UX",
    category: "ecommerce",
    type: "website",
    badge: "NJ",
    review: "DigiServiceZone delivered beyond our expectations. Fast, modern, responsive e-commerce experience.",
    link: "https://newjersey.pk/",
    image: "/new_jersey.png",
    featured: true,
    tags: ["React", "Tailwind CSS", "Clothing Store", "Responsive UI"],
    description: "Production e-commerce storefront for New Jersey apparel. Engineered responsive component architecture, optimized asset pipelines, intuitive clothing collection browsing, and seamless checkout flows across all devices.",
    metrics: ["100% Mobile Responsive", "< 1.2s Load Speed", "Live Production Store"]
  },
  {
    id: "digiservicezone-platform",
    clientName: "DigiServiceZone Agency",
    company: "DigiServiceZone",
    role: "Founder & Full-Stack Architect",
    category: "agency",
    type: "website",
    badge: "DZ",
    review: "Our flagship agency web platform engineered for high conversion, interactive showcases, and client onboarding.",
    link: "https://digiservicezone.com/",
    image: "/real-websites/digiservicezone-preview.png",
    featured: true,
    tags: ["React", "Next.js", "Tailwind CSS", "Corporate Agency"],
    description: "Official web platform for DigiServiceZone digital agency. Features dark cyber aesthetic, dynamic client case studies, service inquiry systems, and optimized SEO structure that drives commercial client acquisition.",
    metrics: ["Modern Web Architecture", "High-Converting UI", "Live Agency Platform"]
  },
  {
    id: "noor-chemicals-web",
    clientName: "Noor Chemical Services",
    company: "Noor Chemicals Corp",
    role: "Digital Marketing & Web Strategy",
    category: "agency",
    type: "website",
    badge: "NC",
    review: "Excellent communication, modern design, and exceptional ongoing digital marketing support throughout.",
    link: "https://www.facebook.com/profile.php?id=100090117847386",
    image: "/noor_chemicals.png",
    featured: false,
    tags: ["Industrial B2B", "Web Strategy", "Meta Ads", "SEO"],
    description: "Corporate digital presence and marketing funnel for Noor Chemicals. Established professional branding, product line catalogs, and lead generation channels that expanded market visibility in industrial chemicals.",
    metrics: ["300%+ Reach Growth", "Verified Industrial Brand", "Active Lead Pipeline"]
  },
  {
    id: "shaban-chemicals-web",
    clientName: "Shaban Chemical Industries",
    company: "Shaban Chemicals",
    role: "B2B Web Presence & Marketing",
    category: "agency",
    type: "website",
    badge: "SC",
    review: "A great team to work with. They understood our industrial requirements perfectly.",
    link: "https://www.facebook.com/shabanchemical/",
    image: "/shaban_chemical.png",
    featured: false,
    tags: ["B2B Portal", "Industrial SEO", "Brand Content", "Social Growth"],
    description: "B2B digital marketing and industrial product portfolio for Shaban Chemicals. Created unified corporate visuals, product catalog presentations, and client communication touchpoints.",
    metrics: ["Consistent Brand Voice", "Enhanced Engagement", "Verified Industrial Presence"]
  }
];

// ==========================================
// --- GRAPHIC DESIGN WORKS ---
// ==========================================
export const graphicDesignCategories = [
  { id: "all", label: "All Works" },
  { id: "branding", label: "Brand Identity" },
  { id: "posters", label: "Marketing Posters" },
  { id: "corporate", label: "Corporate Collateral" }
];

export const graphicDesignProjects = [
  {
    id: "gd-brand-identity",
    clientName: "Brand Identity & Visual System",
    company: "Botanical Labs & DigiServiceZone",
    role: "Brand Identity & Art Direction",
    category: "branding",
    type: "graphic-design",
    featured: true,
    image: "/real-graphics/brand-identity-post.png",
    review: "Sophisticated minimalism with organic tones. The visual identity elevated our packaging and digital brand presence.",
    tags: ["Photoshop", "Illustrator", "Brand System", "Typography"],
    description: "Complete visual identity design system. Crafted core logo marks, typographic hierarchy, primary and secondary color palettes, packaging mockups, and comprehensive brand guidelines for commercial deployment.",
    metrics: ["Full Vector Guidelines", "4K Brand Assets", "Print & Digital Deliverables"],
    deliverables: ["Primary & Secondary Logos", "Brand Style Guide Book", "Packaging Mockups", "Social Media Asset Kit"]
  },
  {
    id: "gd-creative-agency-poster",
    clientName: "Creative Design Agency Series",
    company: "DigiServiceZone Creative",
    role: "Visual Direction & Poster Design",
    category: "posters",
    type: "graphic-design",
    featured: true,
    image: "/real-graphics/graphic-design-post.png",
    review: "Dark mode aesthetic with warm golden typography that positions our design agency as premium and modern.",
    tags: ["Illustrator", "Poster Art", "Dark Mode UI", "Composition"],
    description: "Striking agency marketing poster combining dark futuristic backdrop, elegant gold calligraphy accents, structured capabilities list, and clean circular framing for high-end client acquisition.",
    metrics: ["High-DPI Print Ready", "Editorial Typography", "Multi-Ratio Exports"],
    deliverables: ["A2/A3 Print Posters", "Vector Graphics", "Social Formats (1:1 & 9:16)", "Editable PSD/AI"]
  },
  {
    id: "gd-digital-marketing-creative",
    clientName: "Digital Marketing Visual Suite",
    company: "DigiServiceZone Client",
    role: "Creative Direction & Composition",
    category: "branding",
    type: "graphic-design",
    featured: false,
    image: "/real-graphics/social-media-post-3.png",
    review: "High-energy brand creative that drove qualified commercial inquiries across Meta and WhatsApp channels.",
    tags: ["Photoshop", "Brand Collateral", "Vector Shapes", "Photo Composition"],
    description: "Commercial marketing collateral blending layered geometric color blocking with candid human photography and crisp vector contact badges. Designed for commercial advertising and brand recall.",
    metrics: ["High-Contrast Visuals", "Brand Unified Palette", "Custom Vector Badges"],
    deliverables: ["Commercial Graphics", "Print Collateral", "Web Ad Banners", "Vector Icons"]
  },
  {
    id: "gd-digital-expertise-matrix",
    clientName: "Digital Expertise & Solutions Deck",
    company: "Enterprise Cloud Suite",
    role: "Infographic & Deck Architecture",
    category: "corporate",
    type: "graphic-design",
    featured: true,
    image: "/real-graphics/digital-expertise.webp",
    review: "Transformed complex multi-tier services into an intuitive, visually stunning capability matrix.",
    tags: ["Figma", "Infographic Design", "Iconography", "Corporate Deck"],
    description: "Executive presentation and infographic asset mapping enterprise capabilities, cloud integrations, and digital growth services into a clean, modern visual architecture.",
    metrics: ["Enterprise Deck Slides", "Custom Iconography Set", "Vector Scalability"],
    deliverables: ["Capability Matrix", "Vector Icon Library", "Pitch Deck Slides", "Interactive PDF"]
  },
  {
    id: "gd-tech-agency-promo",
    clientName: "Web & Mobile Engineering Poster",
    company: "Full-Stack Development Studio",
    role: "Graphic & UI Art Direction",
    category: "posters",
    type: "graphic-design",
    featured: false,
    image: "/real-graphics/web-dev-post.png",
    review: "Bold visual hierarchy and cyberpunk color grading that captured immense developer and client attention.",
    tags: ["Photoshop", "Cyberpunk", "Ad Creative", "Visual Hierarchy"],
    description: "Futuristic visual promotional poster designed for full-stack engineering and software solutions. Utilizes neon cyan, violet, and deep slate gradients with stylized code telemetry overlays.",
    metrics: ["Neon Color Grading", "Multi-Layered FX", "Commercial Art Direction"],
    deliverables: ["Digital Web Banners", "Large Format Posters", "Vector Elements", "Motion Mockups"]
  },
  {
    id: "gd-corporate-stationery",
    clientName: "Corporate Identity & Executive Suite",
    company: "Global Business Partners",
    role: "Stationery & Print Design",
    category: "corporate",
    type: "graphic-design",
    featured: false,
    image: "/real-graphics/brand-identity-post.png",
    review: "Flawless stationery design with meticulous typography and print-finishing specifications.",
    tags: ["InDesign", "Illustrator", "Print Production", "Luxury Collateral"],
    description: "Comprehensive corporate stationery suite including luxury business cards with spot UV/gold foil specifications, presentation folders, corporate envelopes, and executive letterheads.",
    metrics: ["CMYK Print Ready", "Custom Die-Cut Specs", "Luxury Finishes"],
    deliverables: ["Business Card Suite", "Letterheads & Envelopes", "Presentation Folder", "Brand Print Manual"]
  }
];

// ==========================================
// --- SOCIAL MEDIA MARKETING CLIENTS & CAMPAIGNS ---
// ==========================================
export const socialMediaCategories = [
  { id: "all", label: "Client Accounts" }
];

export const socialMediaProjects = [
  {
    id: "smm-new-jersey",
    clientName: "New Jersey Clothing",
    company: "New Jersey",
    role: "Social Media Marketing & Brand Growth",
    category: "clients",
    type: "social-media",
    platform: "Meta & Instagram",
    featured: true,
    image: "/new_jersey.png",
    review: "DigiServiceZone delivered beyond our expectations. Fast, modern, responsive client campaign execution.",
    link: "https://newjersey.pk/",
    tags: ["Social Marketing", "Meta Ads", "Fashion Apparel", "Instagram Growth"],
    description: "Comprehensive social media marketing and brand growth campaigns for New Jersey apparel. Executed targeted Meta ad campaigns, curated Instagram product lookbooks, and drove qualified commercial customer acquisition for the clothing brand.",
    deliverables: ["Meta Ad Campaigns", "Instagram Feed & Story Posts", "Audience Retargeting", "Ad Creative Formats"]
  },
  {
    id: "smm-noor-chemicals",
    clientName: "Noor Chemical Services",
    company: "Noor Chemicals",
    role: "Social Media Marketing & B2B Campaigns",
    category: "clients",
    type: "social-media",
    platform: "Facebook Campaigns",
    featured: true,
    image: "/noor_chemicals.png",
    review: "Excellent communication, modern design, and exceptional ongoing digital marketing support throughout.",
    link: "https://www.facebook.com/profile.php?id=100090117847386",
    tags: ["Meta Ads", "Industrial B2B", "Social Strategy", "Lead Pipeline"],
    description: "Holistic social media strategy, high-converting ad visuals, and targeted campaign management for Noor Chemicals that significantly increased industrial brand reach, page engagement, and qualified commercial inquiries.",
    deliverables: ["B2B Social Campaigns", "Branded Industrial Graphics", "Lead Generation Ads", "Audience Engagement"]
  },
  {
    id: "smm-shaban-chemicals",
    clientName: "Shaban Chemical Industries",
    company: "Shaban Chemicals",
    role: "Social Media Strategy & Content Marketing",
    category: "clients",
    type: "social-media",
    platform: "Facebook Marketing",
    featured: true,
    image: "/shaban_chemical.png",
    review: "A great team to work with. They understood our industrial requirements perfectly.",
    link: "https://www.facebook.com/shabanchemical/",
    tags: ["Social Strategy", "Industrial Marketing", "Brand Content", "Campaign Posts"],
    description: "Strategic digital marketing campaigns, branded industrial graphics, product showcase posts, and community engagement initiatives tailored for the chemical manufacturing sector.",
    deliverables: ["Strategic Content Calendar", "Product Showcase Posts", "Corporate Social Graphics", "Customer Inquiry Routing"]
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
  { label: "Websites", href: "#websites" },
  { label: "Social Media", href: "#social-media" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
