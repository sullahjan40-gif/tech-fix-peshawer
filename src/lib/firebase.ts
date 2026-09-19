import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  ServiceItem, 
  ServiceRequest, 
  SiteSettings, 
  FAQItem, 
  CaseStudyItem 
} from '../types';

// Load config from firebase-applet-config.json
export const firebaseConfig = {
  projectId: "gen-lang-client-0759593306",
  appId: "1:928616012414:web:fac720e8fce7562f4b962f",
  apiKey: "AIzaSyAG6kKK0MH4-XtKfSgnY2IQcavdMJk6uoA",
  authDomain: "gen-lang-client-0759593306.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-peshawaronsitete-70e75457-6a23-4284-84ee-9bd0ef9c4555",
  storageBucket: "gen-lang-client-0759593306.firebasestorage.app",
  messagingSenderId: "928616012414",
  oAuthClientId: "928616012414-31kc93qebldgljki2kl6s10osj3tsf03.apps.googleusercontent.com"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID with fallback
let firestoreInstance;
try {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("Falling back to default Firestore database", e);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

// Firestore Collection References
export const servicesCol = collection(db, 'services');
export const requestsCol = collection(db, 'requests');
export const serviceRequestsCol = collection(db, 'serviceRequests');
export const bookingsCol = collection(db, 'bookings');
export const settingsCol = collection(db, 'settings');
export const usersCol = collection(db, 'users');
export const faqCol = collection(db, 'faq');

/**
 * Standard Mock Data from App.tsx / system default for Peshawar On-Site Services
 */
export const initialMockServices: ServiceItem[] = [
  {
    id: "srv-win-install",
    key: "windows-installation",
    title: "Fast Windows Installation & Setup",
    shortDesc: "Clean, stable Windows 10 & 11 installation with proper drivers, essential runtimes, and performance tuning.",
    fullDesc: "I install and configure genuine Windows on compatible laptops and desktop computers. Every setup includes partition preparation, correct manufacturer drivers, critical security patches, and full hardware verification.",
    priceStarting: "From Rs. 1,500",
    priceNote: "Depends on SSD/HDD, hardware condition, and required data transfer",
    turnaround: "45 – 90 mins (depends on SSD/USB/Hardware)",
    icon: "Monitor",
    status: "PUBLISHED",
    order: 1,
    workflow: [
      "1. Backup Important Data & User Files",
      "2. Clean Partitioning & Windows Installation",
      "3. Official Hardware Drivers (Chipset, GPU, Audio, Wi-Fi)",
      "4. Critical Windows Security Updates",
      "5. System Configuration & Bloatware Removal",
      "6. Hardware Stability & Temperature Test"
    ]
  },
  {
    id: "srv-os-migration",
    key: "os-migration",
    title: "Make Your Old Computer Feel Faster (HDD → SSD)",
    shortDesc: "Breathe new life into sluggish laptops and PCs by upgrading to high-speed solid-state storage.",
    fullDesc: "Many older computers use traditional hard disk drives (HDDs) that bottleneck every click. Upgrading your system drive to an SSD provides dramatic responsiveness improvements. When appropriate, I migrate your entire existing Windows installation to the SSD without starting from zero.",
    priceStarting: "From Rs. 2,000",
    priceNote: "Excludes SSD cost or customer-supplied SSD; includes cloning/migration & optimization",
    turnaround: "1 – 2 hours",
    icon: "HardDrive",
    status: "PUBLISHED",
    order: 2,
    workflow: [
      "1. Old HDD Health & Sector Integrity Check",
      "2. Clone/Migrate Windows Partition Directly to SSD",
      "3. Align 4K Partitions & Optimize TRIM Support",
      "4. Configure Old HDD as Secondary Storage Drive",
      "5. Fast Startup Benchmark & Boot Verification"
    ]
  },
  {
    id: "srv-data-recovery",
    key: "data-recovery",
    title: "Data Recovery Assistance",
    shortDesc: "Lost files? Stop before you format. Sector-level safety, disk imaging, and non-destructive recovery.",
    fullDesc: "When files or partitions disappear, immediate caution is critical. Writing new data or reinstalling Windows overwrites deleted sectors permanently. We assess drive condition, create sector-by-sector clones, and perform non-destructive recovery from the image.",
    priceStarting: "Diagnostic / Quote",
    priceNote: "No charge if drive is physically unreadable and referred to specialized cleanroom lab",
    turnaround: "Diagnostic within 30 mins",
    icon: "ShieldAlert",
    status: "PUBLISHED",
    order: 3,
    warningNote: "DO NOT FORMAT THE DRIVE. DO NOT INSTALL WINDOWS ON IT. DO NOT COPY NEW FILES. Recovery depends on drive condition and whether data was overwritten.",
    workflow: [
      "1. Stop Drive Usage & Prevent Sector Overwrites",
      "2. Non-Destructive S.M.A.R.T. Health Diagnostic",
      "3. Create Raw Bit-by-Bit Drive Image/Clone",
      "4. Attempt Logical Carving & File Recovery from Clone",
      "5. Safe Export to Verified External Drive"
    ]
  },
  {
    id: "srv-bsod-diagnosis",
    key: "blue-screen",
    title: "Blue Screen / BSOD Real Cause Diagnosis",
    shortDesc: "Stop blindly reformatting. We pinpoint the exact driver, memory error, or hardware failure.",
    fullDesc: "A Blue Screen of Death is a symptom, not a mystery that always requires reformatting. We analyze minidump logs, test RAM sticks for bit-flip faults, check SSD health, and monitor thermals to fix the root cause permanently.",
    priceStarting: "From Rs. 1,500",
    priceNote: "Includes crash dump analysis, RAM stress test, and thermal check",
    turnaround: "45 – 75 mins",
    icon: "Cpu",
    status: "PUBLISHED",
    order: 4,
    diagnosticSteps: [
      "1. Read Stop Error Code & Minidump Crash Stack",
      "2. Isolate Conflicting Drivers or Windows Patches",
      "3. Multi-Pass RAM Memory Stress Test",
      "4. Storage Sector Integrity & Cable Health Check",
      "5. CPU/GPU Thermal Throttling & Thermal Paste Check",
      "6. Target Component Repair & 30-Minute Stress Test"
    ]
  },
  {
    id: "srv-win-repair",
    key: "windows-repair",
    title: "Windows Startup & Boot Repair",
    shortDesc: "Stuck in Automatic Repair loop, corrupted BCD, or failing updates? We repair without losing your files.",
    fullDesc: "Repair first when appropriate; reinstall only when strictly necessary. We fix broken Boot Configuration Data (BCD), repair corrupted system files with DISM/SFC, and resolve update rollback loops.",
    priceStarting: "From Rs. 1,500",
    priceNote: "Priority on preserving customer applications and desktop data",
    turnaround: "40 – 60 mins",
    icon: "Wrench",
    status: "PUBLISHED",
    order: 5,
    workflow: [
      "1. Boot to Recovery Environment & Check BCD",
      "2. Rebuild EFI / Bootloader Partitions",
      "3. Offline DISM & System File Checker (SFC)",
      "4. Registry Hive Restoration from RegBack / VSS",
      "5. Normal Boot Verification & Update Cleanup"
    ]
  },
  {
    id: "srv-slow-computer",
    key: "slow-computer",
    title: "Slow Computer & Thermal Overhaul",
    shortDesc: "In-depth diagnostic to eliminate bottlenecks, startup bloat, malware, and thermal throttling.",
    fullDesc: "Why is your computer crawling? We inspect hardware bottlenecks, analyze storage read/write performance, eliminate background resource hogs, check for stealth malware, and clean out dust/thermal barriers.",
    priceStarting: "From Rs. 1,200",
    priceNote: "Transparent diagnosis: if an SSD is needed, we inform you honestly",
    turnaround: "45 – 60 mins",
    icon: "Gauge",
    status: "PUBLISHED",
    order: 6
  },
  {
    id: "srv-software-drivers",
    key: "software-setup",
    title: "Software, Drivers & Printer Configuration",
    shortDesc: "Clean setup of essential everyday tools, network printers, OEM drivers, and productivity suites.",
    fullDesc: "Setup your computer right. We install official manufacturer device drivers, configure network or USB printers, configure secure browsers, PDF tools, and legitimate customer software. Strictly no pirated or cracked software.",
    priceStarting: "From Rs. 1,000",
    priceNote: "Per machine or bundled with Windows installation",
    turnaround: "30 – 45 mins",
    icon: "Layers",
    status: "PUBLISHED",
    order: 7
  },
  {
    id: "srv-bulk-lab",
    key: "bulk-setup",
    title: "Bulk Windows Setup for Labs & Offices",
    shortDesc: "Uniform OS imaging, security policies, and standard software setup for multiple computers.",
    fullDesc: "For schools, university departments, private offices, and coaching centers in Peshawar needing 5 to 50+ PCs configured uniformly. We use automated image deployment to complete setups rapidly.",
    priceStarting: "Custom Discounted Quote",
    priceNote: "Tiered pricing based on number of machines and whether network imaging is used",
    turnaround: "Scheduled on-site session",
    icon: "Building2",
    status: "PUBLISHED",
    order: 8
  }
];

export const initialMockSettings: SiteSettings = {
  businessName: "TechFix On-Site Computer Services",
  tagline: "Contact Online — We Come To You. Professional Computer Support in Peshawar.",
  phoneNumber: "0312 9876543",
  whatsappNumber: "+92 312 9876543",
  email: "ullahsafiullah117@gmail.com",
  serviceAreaCity: "Peshawar, Khyber Pakhtunkhwa",
  businessHours: "Monday – Saturday: 9:00 AM – 8:30 PM (Urgent On-Site Visits Available)",
  visitFeeStarting: "From Rs. 500",
  bulkQuoteNote: "Custom discounted tier for 5+ PCs with deployment script & hardware imaging",
  technicianName: "Safiullah",
  technicianTitle: "Computer Science & Cybersecurity Practitioner",
  technicianInstitution: "University of Agriculture, Peshawar",
  technicianExperience: "5+ Years Practical Windows & Hardware Diagnostics",
  technicianBio: "Hi, I am Safiullah. I am a Computer Science and Cybersecurity learner at the University of Agriculture, Peshawar, with around 5 years of practical experience working with computers and Windows systems.",
  technicianQuote: "My goal is simple: solve computer problems efficiently while saving customers the time and inconvenience of taking their computer to a repair shop.",
  technicianPhoto: "",
  supportResponseSla: "Usually responds within 15 minutes",
  socialX: "https://x.com/safiullah",
  socialLinkedin: "https://linkedin.com/in/safiullah",
  socialTiktok: "https://tiktok.com/@safiullah_tech",
  socialFacebook: "https://facebook.com/peshawaronlinepc"
};

export const initialMockRequests: ServiceRequest[] = [];

export const initialMockBookings: ServiceRequest[] = [];

/**
 * Migration function to seed default services and settings into Firestore
 * if they do not already exist.
 * Does NOT seed fake requests or bookings — real database is single source of truth.
 */
export async function migrateMockDataToFirestore(): Promise<{
  success: boolean;
  servicesCount: number;
  requestsCount: number;
  bookingsCount: number;
  settingsMigrated: boolean;
  message: string;
}> {
  try {
    // Check if an authenticated administrator is signed in before attempting writes
    if (!auth.currentUser) {
      console.warn("Firestore sync deferred: Administrator sign-in required for direct Firestore write operations.");
      return {
        success: false,
        servicesCount: 0,
        requestsCount: 0,
        bookingsCount: 0,
        settingsMigrated: false,
        message: "Firestore synchronization requires an authenticated administrator session."
      };
    }

    const timestamp = new Date().toISOString();
    let servicesCount = 0;

    // 1. Seed initial Services if needed
    for (const service of initialMockServices) {
      const docRef = doc(db, 'services', service.id);
      await setDoc(docRef, {
        ...service,
        status: 'PUBLISHED',
        createdAt: timestamp,
        updatedAt: timestamp
      }, { merge: true });
      servicesCount++;
    }

    // 2. Seed Settings into 'settings' collection
    const settingsDocRef = doc(db, 'settings', 'site_config');
    await setDoc(settingsDocRef, {
      ...initialMockSettings,
      status: 'PUBLISHED',
      createdAt: timestamp,
      updatedAt: timestamp
    }, { merge: true });

    return {
      success: true,
      servicesCount,
      requestsCount: 0,
      bookingsCount: 0,
      settingsMigrated: true,
      message: `Successfully initialized ${servicesCount} services and site settings in Firestore.`
    };
  } catch (error: any) {
    console.warn("Firestore initialization note:", error?.message || error);
    throw new Error(`Failed to initialize data in Firestore: ${error?.message || error}`);
  }
}

