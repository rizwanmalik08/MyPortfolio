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
  { id: "clothing", label: "Clothing & Fashion" },
  { id: "ecommerce", label: "E-Commerce & Stores" },
  { id: "business", label: "Business & Corporate" }
];

export const projects = [
  // ==========================================
  // --- CLOTHING & FASHION WEBSITES ---
  // ==========================================
  {
    id: "new-jersey-pk",
    clientName: "New Jersey Clothing",
    company: "New Jersey PK",
    role: "Frontend Development & UI/UX",
    category: "clothing",
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
    id: "urban-store-apparel",
    clientName: "UrbanStore Apparel",
    company: "Streetwear & Modern Fashion",
    role: "Full-Stack E-Commerce & UI/UX",
    category: "clothing",
    type: "website",
    review: "A sleek streetwear fashion store with fluid cart interactions and high-converting product grids.",
    link: "https://urbanstore-fashion.vercel.app/",
    image: "/real-websites/urban-store.jpg",
    badge: "US",
    featured: true,
    tags: ["React", "Tailwind CSS", "Streetwear", "Framer Motion"],
    description: "Modern streetwear and urban apparel e-commerce web platform. Features dynamic product filtering, interactive quick-add cart drawer, lookbook showcases, and conversion-optimized checkout layouts.",
    metrics: ["Interactive Cart & Drawer", "Lookbook Product Grid", "Sub-second Page Transitions"]
  },
  {
    id: "velora-luxury-fashion",
    clientName: "Velora Couture",
    company: "High-Fashion & Luxury Apparel",
    role: "Frontend Architecture & Editorial UI",
    category: "clothing",
    type: "website",
    review: "High-end luxury aesthetic, editorial typography, and buttery-smooth animations that elevate our brand.",
    link: "https://velora-couture.vercel.app/",
    image: "/real-websites/velora.jpg",
    badge: "VL",
    featured: false,
    tags: ["React", "Luxury Fashion", "Editorial UI", "Motion"],
    description: "Premium editorial fashion e-commerce website designed for high-end designer apparel, luxury boutiques, and seasonal collections. Features magazine-style typography, floating minimal navigation, and smooth parallax.",
    metrics: ["Editorial Fashion Layout", "60 FPS Fluid Motion", "Mobile First Design"]
  },
  {
    id: "aurelia-lifestyle-wear",
    clientName: "Aurelia Lifestyle & Wear",
    company: "Aurelia Fashion House",
    role: "UI/UX & Web Development",
    category: "clothing",
    type: "website",
    review: "Minimalist, chic, and incredibly fast. The aesthetic perfectly matches our high-end fashion line.",
    link: "https://aurelia-fashion.vercel.app/",
    image: "/real-websites/aurelia.jpg",
    badge: "AU",
    featured: false,
    tags: ["React", "Boutique Apparel", "Tailwind CSS", "E-Commerce"],
    description: "Luxury fashion and apparel boutique platform. Built with minimal monochrome styling, high-resolution product showcases, size selection guides, and multi-currency support for international fashion clientele.",
    metrics: ["High-Res Image Optimization", "Multi-Currency Ready", "Clean Component Structure"]
  },

  // ==========================================
  // --- E-COMMERCE & ONLINE STORES ---
  // ==========================================
  {
    id: "shopora-store",
    clientName: "Shopora Multi-Store",
    company: "Modern Retail E-Commerce",
    role: "Full-Stack Storefront Development",
    category: "ecommerce",
    type: "website",
    review: "A complete retail shopping platform with instant category search, favorites, and cart management.",
    link: "https://shopora-store.vercel.app/",
    image: "/real-websites/shopora.jpg",
    badge: "SH",
    featured: true,
    tags: ["React", "E-Commerce Store", "Cart Context", "Tailwind"],
    description: "Comprehensive multi-category online retail platform featuring real-time product search, persistent cart state, wishlist functionality, customer reviews, and integrated promo discount engines.",
    metrics: ["Live Cart & Wishlist", "Multi-Category Search", "Conversion-Focused UX"]
  },
  {
    id: "techmart-electronics-store",
    clientName: "TechMart Electronics",
    company: "Consumer Hardware & Gadgets",
    role: "E-Commerce Architecture & UI/UX",
    category: "ecommerce",
    type: "website",
    review: "Lightning-fast catalog navigation, specs comparison matrix, and high customer conversion rate.",
    link: "https://techmart-store.vercel.app/",
    image: "/real-websites/techmart.jpg",
    badge: "TM",
    featured: false,
    tags: ["React", "Electronics Store", "Next.js", "Payment Gateway"],
    description: "Full-featured consumer electronics and digital gadget store. Built with instant product specification filtering, customer review ratings, stock tracking, and secure multi-tier payment gateways.",
    metrics: ["Instant Filter Engine", "Specs Comparison Matrix", "Secure Checkout Gateway"]
  },
  {
    id: "glow-cosmetics-store",
    clientName: "Glow Beauty & Cosmetics",
    company: "Beauty & Personal Care",
    role: "Frontend Design & E-Commerce",
    category: "ecommerce",
    type: "website",
    review: "Vibrant visual identity and effortless shopping flow that doubled our average order value.",
    link: "https://glow-cosmetics.vercel.app/",
    image: "/real-websites/glow-beauty.jpg",
    badge: "GL",
    featured: false,
    tags: ["React", "Cosmetics Store", "Tailwind CSS", "Cart Drawer"],
    description: "Modern beauty and skincare retail store featuring shade finders, curated bundle builders, customer routine recommendations, and high-conversion one-click cart checkout workflows.",
    metrics: ["Shade & Routine Matcher", "Bundle Builder Flow", "Mobile First Checkout"]
  },

  // ==========================================
  // --- BUSINESS & CORPORATE WEBSITES ---
  // ==========================================
  {
    id: "digiservicezone-platform",
    clientName: "DigiServiceZone Agency",
    company: "DigiServiceZone",
    role: "Founder & Full-Stack Architect",
    category: "business",
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
    id: "biznova-corporate",
    clientName: "BizNova Enterprise",
    company: "BizNova Business Consulting",
    role: "Corporate Web Design & Development",
    category: "business",
    type: "website",
    review: "Modern corporate aesthetic, structured service offerings, and professional lead generation that wins enterprise deals.",
    link: "https://biznova-consulting.vercel.app/",
    image: "/real-websites/biznova.jpg",
    badge: "BN",
    featured: true,
    tags: ["React", "Corporate Business", "Consulting", "Tailwind CSS"],
    description: "Corporate business website designed for enterprise consulting firms, professional advisory services, and technology companies. Includes interactive service matrices, case study showcases, and schedule booking.",
    metrics: ["10+ Custom Sections", "Lead Generation Forms", "Optimized B2B Funnel"]
  },
  {
    id: "forge-business-solutions",
    clientName: "Forge Bold Business",
    company: "Forge Enterprise Solutions",
    role: "Frontend Development & Motion UI",
    category: "business",
    type: "website",
    review: "Bold visual hierarchy, asymmetric layouts, and commanding typography that immediately commands authority.",
    link: "https://forge-enterprise.vercel.app/",
    image: "/real-websites/forge-business.jpg",
    badge: "FG",
    featured: false,
    tags: ["React", "Enterprise", "B2B Tech", "Motion Design"],
    description: "High-impact business website for fast-growing companies and venture-backed startups. Features custom cursor interactions, asymmetric geometric layouts, and responsive data analytics sections.",
    metrics: ["Bold Editorial Grid", "Interactive Motion Effects", "Enterprise Ready"]
  },
  {
    id: "nexastudio-creative-agency",
    clientName: "NexaStudio Agency",
    company: "Creative Digital Studio",
    role: "UI/UX Design & Frontend",
    category: "business",
    type: "website",
    review: "Stunning asymmetric grids, animated marquee, and dramatic aesthetic that showcases our creative work brilliantly.",
    link: "https://nexastudio-agency.vercel.app/",
    image: "/real-websites/nexastudio.jpg",
    badge: "NX",
    featured: false,
    tags: ["Creative Studio", "Branding", "Portfolio", "Framer Motion"],
    description: "Editorial-style creative agency landing page featuring interactive service matrices, animated client logo marquees, project case study filters, and high-conversion client consultation triggers.",
    metrics: ["Animated Logo Marquee", "Interactive Services Grid", "Dramatic CTA Section"]
  },
  {
    id: "launchpro-saas-platform",
    clientName: "LaunchPro SaaS",
    company: "LaunchPro Cloud Software",
    role: "SaaS Product Landing Page & UI",
    category: "business",
    type: "website",
    review: "Clear product feature breakdown, interactive pricing toggles, and modern software presentation.",
    link: "https://launchpro-saas.vercel.app/",
    image: "/real-websites/launchpro.jpg",
    badge: "LP",
    featured: false,
    tags: ["SaaS Platform", "Cloud Software", "React", "Tech Startup"],
    description: "High-converting product landing page engineered for SaaS startups, AI products, and digital platforms. Includes interactive feature tabs, ROI calculator, and dynamic pricing plan switches.",
    metrics: ["Interactive Pricing Switch", "SaaS Conversion Funnel", "Zero Layout Shift"]
  },
  {
    id: "noor-chemicals-web",
    clientName: "Noor Chemical Services",
    company: "Noor Chemicals Corp",
    role: "Digital Marketing & Web Strategy",
    category: "business",
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
    category: "business",
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
