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
    id: "new-jersey-pk",
    clientName: "New Jersey Clothing",
    company: "New Jersey PK",
    role: "Frontend Development & UI/UX",
    category: "ecommerce",
    type: "website",
    review: "DigiServiceZone delivered beyond our expectations. Fast, modern, responsive e-commerce experience.",
    link: "https://newjersey.pk/",
    image: "/new_jersey.png",
    badge: "NJ",
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
    review: "Our flagship agency web platform engineered for high conversion, interactive showcases, and client onboarding.",
    link: "https://digiservicezone.com/",
    image: "/real-websites/digiservicezone-preview.png",
    badge: "DSZ",
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
    review: "Excellent communication, modern design, and exceptional ongoing digital marketing support throughout.",
    link: "https://www.facebook.com/profile.php?id=100090117847386",
    image: "/noor_chemicals.png",
    badge: "NC",
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
    review: "A great team to work with. They understood our industrial requirements perfectly.",
    link: "https://www.facebook.com/shabanchemical/",
    image: "/shaban_chemical.png",
    badge: "SC",
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
    badge: "BI",
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
    badge: "GD",
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
    badge: "DM",
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
    badge: "DE",
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
    badge: "WD",
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
    badge: "CP",
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
// --- SOCIAL MEDIA MARKETING CAMPAIGNS ---
// ==========================================
export const socialMediaCategories = [
  { id: "all", label: "All Campaigns" },
  { id: "growth", label: "Lead Gen & Growth" },
  { id: "ads", label: "Paid Ad Creatives" },
  { id: "content", label: "Brand & Viral Social" }
];

export const socialMediaProjects = [
  {
    id: "smm-agency-growth-post",
    clientName: "Social Media Growth & Marketing Post",
    company: "DigiServiceZone Marketing",
    role: "3D Visuals & Social Campaign",
    category: "growth",
    type: "social-media",
    platform: "Instagram & Meta Ads",
    badge: "3D",
    featured: true,
    image: "/real-graphics/social-media-post-2.png",
    review: "Playful isometric 3D arrows and vibrant pastel purple styling that immediately caught attention on social feeds.",
    tags: ["Social Marketing", "3D Isometric", "Growth Campaign", "Meta Ads"],
    metrics: ["+310% Share Velocity", "4.8x Higher CTR", "18% Organic Save Rate"],
    description: "Engineered for high feed stop-rate and algorithmic engagement. Features custom pastel purple 3D isometric arrows, gold coins, floating typography, and a prominent high-contrast CTA.",
    deliverables: ["Square 1:1 Feed Post", "Story / Reel 9:16 Format", "Carousel Cover Art", "Ad Copy Variations"]
  },
  {
    id: "smm-b2b-lead-generation",
    clientName: "Agency Lead Generation Ad",
    company: "DigiServiceZone Client Creative",
    role: "Paid Social Media Creative",
    category: "ads",
    type: "social-media",
    platform: "Meta, LinkedIn & WhatsApp",
    badge: "GD",
    featured: true,
    image: "/real-graphics/social-media-post-1.png",
    review: "Engaging circular photo framing and modern color blocking that effectively communicates our creative capabilities.",
    tags: ["Social Creative", "Photo Composition", "Lead Generation", "Direct Response"],
    metrics: ["+240% Reach Lift", "3.6x ROAS", "680+ Qualified Inquiries"],
    description: "Direct-response advertising creative designed for high-converting social campaigns. Combines trust-building collaborative photography, concise service bullet points, and direct phone/WhatsApp contact credentials.",
    deliverables: ["Meta Feed & Story Ads", "LinkedIn Sponsored Post", "A/B Testing Variants", "WhatsApp Click-to-Chat Linkage"]
  },
  {
    id: "smm-digital-marketing-ad",
    clientName: "Digital Marketing Campaign Creative",
    company: "DigiServiceZone Creative",
    role: "Marketing Visual & Ad Design",
    category: "ads",
    type: "social-media",
    platform: "Facebook & Instagram Ads",
    badge: "MKT",
    featured: true,
    image: "/real-graphics/social-media-post-3.png",
    review: "High-energy brand creative that drove qualified commercial inquiries across Meta and WhatsApp channels.",
    tags: ["Marketing Ad", "Lead Generation", "Vector Shapes", "Paid Ads"],
    metrics: ["3.9x Campaign ROAS", "42% Lower CPL", "120K+ Ad Impressions"],
    description: "Paid social advertising visual engineered to optimize cost per lead (CPL). Utilizes energetic expressive imagery, bold royal blue wave elements, and clear value proposition typography.",
    deliverables: ["Paid Ad Creatives", "Carousel Card Slides", "Story Placement Assets", "Optimized Thumbnail Sets"]
  },
  {
    id: "smm-air-proto-cyberflow",
    clientName: "Air Proto // CyberFlow Campaign",
    company: "Concept Social Campaign",
    role: "Visual & Motion Design",
    category: "content",
    type: "social-media",
    platform: "Instagram, X & Threads",
    badge: "AD",
    featured: false,
    image: "/real-graphics/brand-identity-post.png",
    review: "Bold visual hierarchy, striking neon color grading, and commercial-grade social media art direction.",
    tags: ["Social Media Post", "Photoshop", "Ad Creative", "Neon Grading"],
    metrics: ["140K+ Organic Reach", "+85% Profile Visits", "Top Engagement Post"],
    description: "Futuristic concept footwear and product reveal social sequence with glowing cyan/magenta rim lighting, floating telemetry statistics, and high-energy square framing for social discovery feeds.",
    deliverables: ["Concept Feed Post", "Countdown Story Stickers", "Motion Teaser Loop", "Twitter Header & Banner"]
  },
  {
    id: "smm-web3-ai-summit",
    clientName: "Global AI & Web3 Summit",
    company: "Keynote Conference Series",
    role: "Branding & Social Visuals",
    category: "content",
    type: "social-media",
    platform: "LinkedIn & Twitter/X",
    badge: "GS",
    featured: false,
    image: "/real-graphics/web-dev-post.png",
    review: "The visual kit and speaker announcement posts elevated our conference identity across LinkedIn and Twitter.",
    tags: ["Event Poster", "Social Kit", "Figma", "Speaker Cards"],
    metrics: ["8,500+ Registrations", "1.4M Total Impressions", "Viral Speaker Reshares"],
    description: "Complete social media promotional kit for an international technology conference. Included speaker reveal cards, daily agenda carousels, sponsor spotlight graphics, and live event countdown assets.",
    deliverables: ["Speaker Reveal Graphics", "Agenda Carousel Slides", "VIP Ticket Ad Creatives", "Live Event Templates"]
  },
  {
    id: "smm-educational-carousel",
    clientName: "Digital Expertise Multi-Slide Carousel",
    company: "B2B Educational Social Series",
    role: "Content Strategy & Visual Kit",
    category: "growth",
    type: "social-media",
    platform: "LinkedIn & Instagram Carousels",
    badge: "ES",
    featured: false,
    image: "/real-graphics/digital-expertise.webp",
    review: "The carousel slides generated our highest engagement month and brought in inbound consultation leads.",
    tags: ["Instagram Carousel", "LinkedIn Document", "Content Marketing", "B2B Social"],
    metrics: ["5.2x Organic Saves", "+4,100 New Followers", "16.4% Engagement Rate"],
    description: "Educational multi-slide carousel format designed to maximize saves and reposts. Breaks down actionable digital strategy, SEO fundamentals, and web development frameworks into digestible visual steps.",
    deliverables: ["5-Slide Seamless Carousel", "PDF Slide Deck", "Infographic Summary", "Caption & Hashtag Strategy"]
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
