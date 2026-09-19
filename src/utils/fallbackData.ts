import { AppDataResponse, ProblemCategory, PageSectionsData } from '../types';
import { 
  initialMockServices, 
  initialMockSettings 
} from '../lib/firebase';

export const fallbackPageSections: PageSectionsData = {
  pageStatuses: {
    services: 'published',
    'how-it-works': 'published',
    'why-on-site': 'published',
    'who-we-serve': 'published',
    'bulk-windows': 'published',
    technician: 'published',
    faq: 'published',
    contact: 'published'
  },
  services: {
    pageStatus: 'published',
    badge: 'ON-SITE SERVICES & TRANSPARENT PRICING',
    title: 'Professional On-Site Computer Support',
    subtitle: 'Clear, upfront pricing with no hidden charges. Every service includes full on-site diagnosis, live testing, and our standard 14-day warranty.'
  },
  'how-it-works': {
    pageStatus: 'published',
    badge: 'TRANSPARENT ON-SITE PROTOCOL',
    title: 'How Our On-Site Service Works',
    subtitle: 'Simple, honest, and transparent computer assistance delivered right to your home, hostel, or office in Peshawar.',
    steps: [
      {
        id: 'step-1',
        num: 'STEP 01',
        title: 'CONTACT',
        desc: 'Send a quick WhatsApp message or submit our 60-second online service request.',
        status: 'published'
      },
      {
        id: 'step-2',
        num: 'STEP 02',
        title: 'EXPLAIN',
        desc: 'Tell me your computer brand/model (Dell, HP, Lenovo, Custom PC) and what issue you are experiencing.',
        status: 'published'
      },
      {
        id: 'step-3',
        num: 'STEP 03',
        title: 'BOOK',
        desc: 'Choose a suitable appointment time (Morning, Afternoon, Evening) for your home or office.',
        status: 'published'
      },
      {
        id: 'step-4',
        num: 'STEP 04',
        title: 'VISIT & DIAGNOSE',
        desc: 'I come directly to your location in Peshawar with diagnostic gear, inspect the computer, and resolve the problem.',
        status: 'published'
      }
    ],
    toolkit: [
      {
        id: 'tool-1',
        title: 'High-Speed Bootable Diagnostics',
        desc: 'Multiple Sandisk & Samsung 3.2 Gen 2 USB drives preloaded with official Microsoft Windows 10/11 installation images, WinPE recovery suites, and memory test kernels.',
        status: 'published'
      },
      {
        id: 'tool-2',
        title: 'Hardware & Storage Diagnostic Tools',
        desc: 'S.M.A.R.T telemetry analyzers, bad-sector detectors, NVMe-to-USB-C enclosure rigs, and 2.5" SATA docking adapters for safe isolated data testing.',
        status: 'published'
      },
      {
        id: 'tool-3',
        title: 'Precision Screwdrivers & ESD Gear',
        desc: 'iFixit precision bit set, anti-static grounding wristband, non-marring prying spudgers, and premium thermal interface compound (Arctic MX-4).',
        status: 'published'
      },
      {
        id: 'tool-4',
        title: 'Offline Official Driver Cache',
        desc: 'Pre-downloaded official network, chipset, graphics, and audio drivers for Dell, HP, Lenovo, and Asus laptops to ensure instant offline functionality.',
        status: 'published'
      }
    ]
  },
  'why-on-site': {
    pageStatus: 'published',
    badge: 'TRANSPARENCY & PEACE OF MIND',
    title: 'Why Choose On-Site Service Over a Repair Shop?',
    subtitle: 'Taking your computer to a crowded repair shop in Saddar or City Bazaar exposes your private data, consumes hours in traffic, and leaves you without your machine for days. On-site computer repair changes that completely.',
    pillars: [
      {
        id: 'pillar-1',
        title: 'Zero Private Data Snooping',
        desc: 'We never open personal picture galleries, browser history, WhatsApp folders, or financial documents. You sit right beside the computer and observe every diagnostic step.',
        status: 'published'
      },
      {
        id: 'pillar-2',
        title: 'No Risk of Swapped Hardware',
        desc: 'In bazaar shops, unscrupulous helpers occasionally swap original RAM sticks or SSDs with degraded units. With on-site service, your machine never leaves your room or desk.',
        status: 'published'
      },
      {
        id: 'pillar-3',
        title: 'Zero Transit Shock or Hinge Damage',
        desc: 'Carrying desktop towers and fragile laptops through Peshawar traffic, potholes, or rain frequently loosens heat sinks, snaps ribbon cables, or cracks screens. On-site prevents all travel damage.',
        status: 'published'
      },
      {
        id: 'pillar-4',
        title: 'Immediate Real-World Testing',
        desc: 'Test your machine on your exact home or office Wi-Fi, with your specific printer, monitor cables, and sound systems before the technician departs.',
        status: 'published'
      }
    ],
    shopSteps: [
      { id: 'shop-1', step: '01', title: 'PACK COMPUTER', desc: 'Unplug cables, pack heavy tower or delicate laptop into bag', status: 'published' },
      { id: 'shop-2', step: '02', title: 'TRAVEL', desc: 'Drive through Peshawar traffic, Saddar or Board Bazar congestion', status: 'published' },
      { id: 'shop-3', step: '03', title: 'WAIT IN SHOP', desc: 'Stand in line waiting for technician to become free', status: 'published' },
      { id: 'shop-4', step: '04', title: 'EXPLAIN PROBLEM', desc: 'Rush to explain issue to counter clerk, not the technician', status: 'published' },
      { id: 'shop-5', step: '05', title: 'LEAVE COMPUTER', desc: 'Leave your personal computer, sensitive files, and logins behind for days', status: 'published' },
      { id: 'shop-6', step: '06', title: 'RETURN LATER', desc: 'Make a second trip back to pick it up, hoping it was actually fixed', status: 'published' }
    ],
    ourSteps: [
      { id: 'our-1', step: '01', title: 'CONTACT ONLINE', desc: 'Reach out on WhatsApp or fill our simple 60-second form', status: 'published' },
      { id: 'our-2', step: '02', title: 'BOOK A TIME', desc: 'Choose a date and time that fits your exact schedule', status: 'published' },
      { id: 'our-3', step: '03', title: 'WE COME TO YOU', desc: 'Technician arrives at your home, hostel, or office in Peshawar', status: 'published' },
      { id: 'our-4', step: '04', title: 'DIAGNOSE IN FRONT OF YOU', desc: 'Full diagnostic performed right before your eyes with no mystery', status: 'published' },
      { id: 'our-5', step: '05', title: 'SOLVE THE PROBLEM', desc: 'Clean installation, SSD upgrade, or driver repair completed on-site', status: 'published' },
      { id: 'our-6', step: '06', title: 'TEST & VERIFY', desc: 'Verify everything runs smoothly together before you make payment', status: 'published' }
    ]
  },
  'who-we-serve': {
    pageStatus: 'published',
    badge: 'CUSTOMIZED ON-SITE SUPPORT',
    title: 'Who We Serve in Peshawar',
    subtitle: 'Whether you are a university student rushing to meet a project deadline, a family needing a dependable home computer, or an office requiring fast workstation maintenance, our on-site service adapts directly to your requirements.',
    audiences: [
      {
        id: 'aud-students',
        key: 'students',
        title: 'STUDENTS',
        tagline: 'Agriculture University, Peshawar Uni, Medical & Engineering Campuses',
        headline: 'Your laptop is part of your education. Get computer problems handled without wasting your study day.',
        badge: 'STUDENT FRIENDLY',
        status: 'published',
        services: [
          'Clean Windows 10 & 11 setups for semester work',
          'HDD to SSD upgrades for old study laptops',
          'BSOD & overheating diagnostics',
          'Academic software, compilers & development environments',
          'Thesis & lost assignment data recovery assistance',
          'Special student turnaround speed'
        ]
      },
      {
        id: 'aud-home',
        key: 'home-users',
        title: 'HOME USERS',
        tagline: 'Families, Personal Laptops & Home Desktops Across Peshawar',
        headline: 'Computer problems at home? Get practical assistance without carrying your computer around.',
        badge: 'MAXIMUM CONVENIENCE',
        status: 'published',
        services: [
          'Zero travel: no carrying heavy desktop towers in traffic',
          'Full privacy: family photos & accounts stay safe in your home',
          'Home Wi-Fi & wireless printer configuration',
          'Slow PC cleanups & storage expansion',
          'Parental controls & browser safety setups',
          'Transparent in-person diagnosis in your living room'
        ]
      },
      {
        id: 'aud-offices',
        key: 'offices',
        title: 'OFFICES & ACADEMIES',
        tagline: 'Small Businesses, Schools, Academies & Computer Labs',
        headline: "Keep your team's computers working with on-site support and bulk Windows deployment.",
        badge: 'WORKPLACE READY',
        status: 'published',
        services: [
          'Bulk Windows deployment across 5, 10, 20 or 50+ PCs',
          'Standardized workstation software & driver profiles',
          'Network printer sharing & office file sharing',
          'Scheduled weekend maintenance with zero downtime',
          'Computer lab refreshes for schools & colleges',
          'Formal receipts & documented hardware logs'
        ]
      }
    ]
  },
  'bulk-windows': {
    pageStatus: 'published',
    badge: 'INSTITUTIONAL LAB DEPLOYMENT',
    title: 'Bulk Windows Deployment for Institutions & Offices',
    subtitle: 'Standardized operating system deployment, driver automation, and application configuration for 5 to 50+ PCs in Peshawar.',
    pricingTiers: [
      { id: 'tier-1', minPCs: 5, maxPCs: 9, ratePerPc: 700, label: '5 - 9 Computers', desc: 'Small office / clinic batch', status: 'published' },
      { id: 'tier-2', minPCs: 10, maxPCs: 19, ratePerPc: 600, label: '10 - 19 Computers', desc: 'Standard department / academy', status: 'published' },
      { id: 'tier-3', minPCs: 20, maxPCs: 29, ratePerPc: 500, label: '20 - 29 Computers', desc: 'College / School lab wing', status: 'published' },
      { id: 'tier-4', minPCs: 30, maxPCs: 100, ratePerPc: 450, label: '30+ Computers', desc: 'Full campus / enterprise refresh', status: 'published' }
    ],
    labFeatures: [
      {
        id: 'lab-1',
        title: 'Parallel USB 3.2 Deployment',
        desc: 'Deploying multiple computers simultaneously using customized WinPE images cuts total lab downtime by up to 75% compared to single-disc setups.',
        status: 'published'
      },
      {
        id: 'lab-2',
        title: 'Debloated Windows 10 / 11 Enterprise/Pro',
        desc: 'Removal of consumer telemetry, pre-installed promotional games, Cortana bloat, and unwanted background background services for maximum speed on lab hardware.',
        status: 'published'
      },
      {
        id: 'lab-3',
        title: 'Pre-Packaged Academic / Productivity Suites',
        desc: 'Full installation of browsers, PDF readers, media players, WinRAR, and custom programming IDEs (VS Code, Python, C++, Java, Dev-C++) or office software.',
        status: 'published'
      },
      {
        id: 'lab-4',
        title: 'Tamper-Resistant Security Policies',
        desc: 'Configuring local group policies and restricted non-admin student profiles prevents unauthorized system setting changes and persistent malware.',
        status: 'published'
      }
    ]
  },
  technician: {
    pageStatus: 'published',
    badge: 'PRIMARY TECHNICIAN PROFILE',
    title: 'Meet Your Technician: Safiullah',
    subtitle: 'Independent on-site technical assistance by Safiullah — Computer Science & Cybersecurity practitioner in Peshawar.',
    ethicalCodes: [
      {
        id: 'ethic-1',
        title: 'Zero Snooping & Absolute Confidentiality',
        desc: 'Your personal photos, academic projects, browser cookies, and financial documents remain strictly private. I diagnose and service your computer right before your eyes.',
        status: 'published'
      },
      {
        id: 'ethic-2',
        title: 'Technical Honesty: No Fabricated Faults',
        desc: 'If a problem is caused by a loose ribbon cable or outdated driver, I tell you immediately. I never invent nonexistent motherboard or chipset failures to inflate fees.',
        status: 'published'
      },
      {
        id: 'ethic-3',
        title: 'Root-Cause Diagnostics Over Blind Formatting',
        desc: 'Many local technicians blindly format your drive when Windows crashes. I inspect minidump BSOD crash logs, test RAM blocks, and isolate hardware errors to solve the real cause.',
        status: 'published'
      },
      {
        id: 'ethic-4',
        title: 'Clear, Respectful Communication',
        desc: 'Explaining technical concepts in polite, plain Pashto, Urdu, or English so you understand what happened and how to avoid recurring issues.',
        status: 'published'
      }
    ]
  },
  faq: {
    pageStatus: 'published',
    badge: 'FREQUENTLY ASKED QUESTIONS',
    title: 'Frequently Asked Questions',
    subtitle: 'Clear, direct answers about our on-site computer support in Peshawar, pricing, privacy, and procedures.'
  },
  contact: {
    pageStatus: 'published',
    badge: 'DIRECT ON-SITE DISPATCH',
    title: 'Schedule On-Site Support or Consult Directly',
    subtitle: 'Choose the easiest way to reach us. Submit our service booking form or send a WhatsApp message for rapid response in Peshawar.',
    peshawarAreas: [
      { id: 'area-1', name: 'University Town', speed: '20 - 40 Mins', note: 'Fast Dispatch', status: 'published' },
      { id: 'area-2', name: 'Hayatabad (Phases 1 - 7)', speed: '30 - 50 Mins', note: 'Daily Coverage', status: 'published' },
      { id: 'area-3', name: 'Board Bazaar & Tehkal', speed: '20 - 35 Mins', note: 'Fast Dispatch', status: 'published' },
      { id: 'area-4', name: 'UoA / UoP Campus & Hostels', speed: '15 - 30 Mins', note: 'Direct Access', status: 'published' },
      { id: 'area-5', name: 'Saddar & Cantt Areas', speed: '30 - 50 Mins', note: 'Daily Coverage', status: 'published' },
      { id: 'area-6', name: 'Warsak Road & Surrounds', speed: '35 - 55 Mins', note: 'Scheduled Visits', status: 'published' },
      { id: 'area-7', name: 'Ring Road & Gulbahar', speed: '35 - 55 Mins', note: 'Daily Coverage', status: 'published' },
      { id: 'area-8', name: 'Dalazak Road & Kohat Road', speed: '45 - 65 Mins', note: 'Scheduled Visits', status: 'published' }
    ]
  }
};

export const defaultPageSections = fallbackPageSections;

export const fallbackProblemCategories: ProblemCategory[] = [
  {
    id: "pc-1",
    title: "PC Won't Boot / Stuck in Repair Loop",
    symptom: "Automatic Repair loop, blue screen recovery, BCD missing, or black screen after logo.",
    serviceKey: "windows-repair",
    serviceName: "Windows Startup & Boot Repair",
    badgeColor: "rose"
  },
  {
    id: "pc-2",
    title: "Extremely Slow / 100% Disk Usage",
    symptom: "Takes 5+ minutes to start up, programs freeze, high disk latency.",
    serviceKey: "os-migration",
    serviceName: "Make Your Old Computer Feel Faster (HDD → SSD)",
    badgeColor: "amber"
  },
  {
    id: "pc-3",
    title: "Frequent Blue Screen (BSOD) Crashes",
    symptom: "Unexpected restarts with IRQL_NOT_LESS_OR_EQUAL, MEMORY_MANAGEMENT, or DRIVER_IRQL.",
    serviceKey: "blue-screen",
    serviceName: "Blue Screen / BSOD Real Cause Diagnosis",
    badgeColor: "blue"
  },
  {
    id: "pc-4",
    title: "Accidental File Deletion or Formatted Drive",
    symptom: "Files deleted from Recycle Bin, partition disappeared, or drive formatted accidentally.",
    serviceKey: "data-recovery",
    serviceName: "Data Recovery Assistance",
    badgeColor: "red"
  },
  {
    id: "pc-5",
    title: "Need Clean Windows 10/11 Installed",
    symptom: "New laptop without OS, slow cluttered installation, or upgrading to official Windows 11.",
    serviceKey: "windows-installation",
    serviceName: "Fast Windows Installation & Setup",
    badgeColor: "emerald"
  },
  {
    id: "pc-6",
    title: "Overheating & Loud Fan Noise",
    symptom: "Laptop burning hot to touch, fan loud and spinning constantly, shut down under load.",
    serviceKey: "slow-computer",
    serviceName: "Slow Computer & Thermal Overhaul",
    badgeColor: "orange"
  }
];

export const fallbackServiceAreas: string[] = [
  "University Town",
  "Hayatabad (Phases 1 to 7)",
  "Peshawar Cantt & Saddar",
  "Warsak Road & Near Areas",
  "Board Bazar & Jamrud Road",
  "Agriculture University Campus & Hostels",
  "Peshawar University Campus",
  "Ring Road / Charsadda Road",
  "Gulbahar & City Environs",
  "Dalazak Road & Landi Arbab",
  "Kohat Road & Defense Colony",
  "Danishabad & Rahatabad",
  "Tehkal & Pishtakhara"
];

export const fallbackFaqs = [
  {
    id: "faq-1",
    question: "Do you come directly to my home or office in Peshawar?",
    answer: "Yes! That is the core foundation of our service: 'We come to you.' You do not need to unplug cables, pack your desktop or laptop into a bag, or navigate busy traffic to drop your PC at a market shop. We bring our diagnostic tools, installation media, and equipment right to your location."
  },
  {
    id: "faq-2",
    question: "How does the on-site computer service work?",
    answer: "It's simple: 1) Contact us via WhatsApp or submit our quick online booking form. 2) Explain your PC issue. 3) We agree on a convenient day and time. 4) The technician visits your location, tests the machine in front of you, diagnoses the root cause, and resolves it after your direct approval."
  },
  {
    id: "faq-3",
    question: "How long does a Windows installation take?",
    answer: "We focus on fast, thorough installations without cutting corners. On modern computers with an SSD and USB 3.0, clean installation, official drivers, and essential software typically take around 45 to 60 minutes. On older mechanical HDDs, slower processors, or systems requiring large data transfers, it may take 75 to 90 minutes."
  },
  {
    id: "faq-4",
    question: "Can you move my existing Windows and files from an HDD to a new SSD?",
    answer: "Yes, this is one of our most popular services! If your current Windows installation and HDD sectors are healthy, we clone your entire operating system, programs, and desktop directly onto the SSD. Your system boots in seconds with all files intact. If the old drive has severe bad sectors or corruption, we advise on safe data backup followed by a clean setup."
  },
  {
    id: "faq-5",
    question: "Can you recover my deleted or lost files?",
    answer: "Recovery is possible in many cases, provided the sectors where the files were stored have not been overwritten by new data. We utilize non-destructive drive imaging and recovery software. However, we are completely transparent: if a hard drive is physically damaged (clicking noises, dropped, burnt PCB, head failure), it requires a specialized cleanroom laboratory."
  },
  {
    id: "faq-6",
    question: "What should I do immediately if I accidentally deleted important files or formatted a drive?",
    answer: "STOP USING THE COMPUTER IMMEDIATELY. Do not copy new files, do not download software onto that drive, and do not reinstall Windows. Any new data written to the drive can permanently overwrite the deleted sectors. Turn off the computer and contact us right away for an on-site assessment."
  },
  {
    id: "faq-7",
    question: "Can you fix Blue Screen (BSOD) errors without deleting all my files?",
    answer: "Absolutely. Many repair shops take the lazy approach of immediately formatting your PC for a Blue Screen. A Blue Screen is merely a symptom. We analyze the Windows minidump crash log, test RAM modules with memtest, inspect drive S.M.A.R.T. health, and update faulty drivers to resolve the actual cause while preserving your data."
  },
  {
    id: "faq-8",
    question: "Do you install pirated or cracked software?",
    answer: "No. As a Computer Science and Cybersecurity learner, I strictly do not install cracked, keygen, or pirated software. Cracked software frequently bundles trojans, cryptocurrency miners, and backdoor rootkits that compromise your personal data, banking credentials, and system stability."
  }
];

export const fallbackCaseStudies = [
  {
    id: "case-1",
    title: "University Town: Laptop Boot Loop & Corrupted BCD Fixed Without Data Loss",
    customerType: "Home User",
    deviceInfo: "Dell Inspiron 15 (5000 Series)",
    date: "Feb 2026",
    problem: "Laptop rebooting constantly in Automatic Repair loop after a forced Windows update shutdown.",
    diagnosis: "Damaged EFI partition and corrupted Boot Configuration Data. Drive S.M.A.R.T. health tested 100% healthy.",
    solution: "Rebuilt EFI bootloader via command line recovery environment, repaired corrupted system files with offline SFC & DISM.",
    result: "Windows booted normally within 35 minutes with 100% of customer university thesis files and desktop intact."
  },
  {
    id: "case-2",
    title: "Hayatabad Phase 4: Mechanical HDD to NVMe SSD Upgrade & System Migration",
    customerType: "Business / Home Office",
    deviceInfo: "HP Pavilion Desktop Tower",
    date: "Jan 2026",
    problem: "PC taking 4.5 minutes to boot, 100% disk usage freeze during basic document work.",
    diagnosis: "Aging 1TB mechanical hard drive with slow read/write latency bottlenecking system performance.",
    solution: "Installed 500GB high-speed SSD, cloned existing Windows 11 installation and programs directly, aligned partitions, and formatted old HDD as secondary storage.",
    result: "Boot time dropped from 4.5 minutes down to 11 seconds. Customer maintained all existing software licenses and desktop settings."
  }
];

export const fallbackAppData: AppDataResponse = {
  services: initialMockServices,
  settings: initialMockSettings,
  serviceAreas: fallbackServiceAreas,
  faqs: fallbackFaqs,
  caseStudies: fallbackCaseStudies,
  problemCategories: fallbackProblemCategories,
  pageSections: fallbackPageSections
};
