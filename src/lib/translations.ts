export type Language = 'en' | 'bn';

export const translations = {
  en: {
    // App
    appName: 'FuelFlow',
    appSubtitle: 'Vehicle & Fuel Tracker',
    developerCredit: 'Developer Nahid Ferdous Emon',
    
    // Navigation
    dashboard: 'Dashboard',
    fuel: 'Fuel',
    maintenance: 'Maintenance',
    calculator: 'Calculator',

    // Menu & Account
    account: 'Account',
    signIn: 'Sign In / Register',
    signOut: 'Sign Out',
    guest: 'Guest Driver',
    installApp: 'Install Chrome App',
    darkMode: 'Dark Theme',
    lightMode: 'Light Theme',
    language: 'Language',
    currentLangName: 'বাংলা (BN)',
    switchLang: 'Switch to Bangla',

    // Dashboard
    liveLogs: 'LIVE LOGS',
    fuelEfficiency: 'Fuel Efficiency',
    totalDistance: 'Total Distance',
    totalSpent: 'Total Cost Spent',
    totalFuel: 'Total Fuel Liters',
    avgPerLiter: 'Avg Price/Liter',
    avgCostPerKm: 'Avg Cost/KM',
    recentFuelLogs: 'Recent Fuel Logs',
    recentMaintenance: 'Recent Service & Maintenance',
    viewAll: 'View All',
    noLogsYet: 'No logs recorded yet.',
    addFirstLog: 'Add your first log to start tracking statistics.',
    addFuelBtn: '+ Add Fuel Fill-Up',
    addMaintBtn: '+ Add Service Log',
    tripCalculatorTitle: 'Trip Cost Calculator',

    // Fuel Logs
    fuelLogsTitle: 'Fuel Fill-Up Records',
    fuelLogsSubtitle: 'Track mileage, per-liter cost, and vehicle fuel efficiency',
    searchFuel: 'Search by date, notes or grade...',
    distance: 'Travel Distance',
    pricePerLiter: 'Price per Liter',
    totalCost: 'Total Cost',
    liters: 'Liters Pumped',
    efficiency: 'Efficiency',
    odometer: 'Odometer Reading',
    fuelGrade: 'Fuel Grade',
    date: 'Date',
    notes: 'Notes / Station',
    actions: 'Actions',
    delete: 'Delete',
    octane95: 'Octane 95',
    octane92: 'Octane 92',
    diesel: 'Diesel',
    cng: 'CNG',

    // Maintenance Logs
    maintenanceTitle: 'Vehicle Maintenance Logs',
    maintenanceSubtitle: 'Track servicing, oil changes, brake pads & master repairs',
    searchMaint: 'Search service title or notes...',
    serviceTitle: 'Service Title',
    category: 'Category',
    allCategories: 'All',

    // Categories
    catMasterService: 'Master Service',
    catEngineOil: 'Engine Oil',
    catBrakeService: 'Brake Service',
    catTires: 'Tires',
    catTransmission: 'Transmission',
    catGeneralService: 'General Service',
    catOther: 'Other',

    // Modals & Forms
    addFuelTitle: 'Add Fuel Fill-Up',
    addFuelDesc: 'Log odometer reading, liters pumped, and cost',
    addMaintTitle: 'Add Service Log',
    addMaintDesc: 'Log vehicle servicing, parts replacement, and repairs',
    tripCalcTitle: 'Trip & Fuel Cost Calculator',
    tripCalcDesc: 'Estimate fuel needed and budget required for your journey',
    tripDistance: 'Trip Distance (KM)',
    estFuelNeeded: 'Estimated Fuel Needed',
    estTripCost: 'Estimated Trip Cost',
    costPerKm: 'Cost per KM',
    calculate: 'Calculate',
    saveLog: 'Save Log',
    saveToFuelLogs: 'Save as Fuel Log',
    cancel: 'Cancel',

    // Auth
    welcomeTitle: 'Welcome to Fuel Flow',
    authDesc: 'Track fuel efficiency, mileage, and maintenance logs synced live on Firebase.',
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    signInBtn: 'Sign In to Account',
    signUpBtn: 'Create Fuel Flow Account',
    guestBtn: 'Proceed as Guest (Online Sync Mode)',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUpNow: 'Sign up now',
    signInNow: 'Sign in',

    // PWA Install
    installTitle: 'Install Fuel Flow',
    installDesc: 'Chrome Progressive Web Application (PWA)',
    installNowBtn: 'Install Now',
    dismiss: 'Dismiss',
    pwaBannerText: 'Add to home screen for fast Chrome access',

    // Units
    km: 'KM',
    kmPerLiter: 'km/L',
    bdtSymbol: '৳',

    // Cloud Sync
    cloudSynced: 'Cloud Synced',
    syncing: 'Syncing Cloud...',
    cloudError: 'Sync Offline',
    forceSync: 'Force Cloud Sync',
    syncSuccess: 'All logs and settings successfully synced online to Firebase Cloud!'
  },

  bn: {
    // App
    appName: 'ফুয়েলফ্লো',
    appSubtitle: 'যানবাহন ও ফুয়েল ট্র্যাকার',
    developerCredit: 'ডেভেলপার নাহিদ ফেরদৌস ইমন',
    
    // Navigation
    dashboard: 'ড্যাশবোর্ড',
    fuel: 'ফুয়েল',
    maintenance: 'মেইনটেন্যান্স',
    calculator: 'ক্যালকুলেটর',

    // Menu & Account
    account: 'অ্যাকাউন্ট',
    signIn: 'সাইন ইন / রেজিস্টার',
    signOut: 'সাইন আউট',
    guest: 'গেস্ট ড্রাইভার',
    installApp: 'ক্রোম অ্যাপ ইনস্টল করুন',
    darkMode: 'ডার্ক থিম',
    lightMode: 'লাইট থিম',
    language: 'ভাষা',
    currentLangName: 'English (EN)',
    switchLang: 'Switch to English',

    // Dashboard
    liveLogs: 'লাইভ লগ',
    fuelEfficiency: 'জ্বালানী দক্ষতা',
    totalDistance: 'মোট অতিক্রান্ত দূরত্ব',
    totalSpent: 'মোট খরচ',
    totalFuel: 'মোট জ্বালানী (লিটার)',
    avgPerLiter: 'গড় দাম/লিটার',
    avgCostPerKm: 'গড় খরচ/কিমি',
    recentFuelLogs: 'সাম্প্রতিক ফুয়েল লগ',
    recentMaintenance: 'সাম্প্রতিক সার্ভিস ও মেইনটেন্যান্স',
    viewAll: 'সব দেখুন',
    noLogsYet: 'এখনো কোন তথ্য যোগ করা হয়নি।',
    addFirstLog: 'পরিসংখ্যান দেখতে আপনার প্রথম লগটি যোগ করুন।',
    addFuelBtn: '+ ফুয়েল লগ যোগ করুন',
    addMaintBtn: '+ সার্ভিস লগ যোগ করুন',
    tripCalculatorTitle: 'ট্রিপ খরচ ক্যালকুলেটর',

    // Fuel Logs
    fuelLogsTitle: 'ফুয়েল নেওয়ার হিসেব',
    fuelLogsSubtitle: 'মাইলেজ, প্রতি লিটার খরচ এবং গাড়ির ফুয়েল মাইলেজ হিসেব রাখুন',
    searchFuel: 'তারিখ, নোট বা গ্রেড দিয়ে খুঁজুন...',
    distance: 'অতিক্রান্ত দূরত্ব',
    pricePerLiter: 'প্রতি লিটার মূল্য',
    totalCost: 'মোট খরচ',
    liters: 'ফুয়েল (লিটার)',
    efficiency: 'মাইলেজ দক্ষতা',
    odometer: 'ওডোমিটার (কিমি)',
    fuelGrade: 'ফুয়েলের ধরন',
    date: 'তারিখ',
    notes: 'নোট / পাম্পের নাম',
    actions: 'অ্যাকশন',
    delete: 'মুছে ফেলুন',
    octane95: 'অকটেন ৯৫',
    octane92: 'অকটেন ৯২',
    diesel: 'ডিজেল',
    cng: 'সিএনজি',

    // Maintenance Logs
    maintenanceTitle: 'গাড়ির সার্ভিস ও মেইনটেন্যান্স লগ',
    maintenanceSubtitle: 'ইঞ্জিন ওয়েল, ব্রেক, টায়ার ও মাস্টার সার্ভিসের রেকর্ড রাখুন',
    searchMaint: 'সার্ভিসের নাম বা নোট দিয়ে খুঁজুন...',
    serviceTitle: 'সার্ভিসের নাম',
    category: 'ক্যাটাগরি',
    allCategories: 'সব ক্যাটাগরি',

    // Categories
    catMasterService: 'মাস্টার সার্ভিস',
    catEngineOil: 'ইঞ্জিন ওয়েল',
    catBrakeService: 'ব্রেক সার্ভিস',
    catTires: 'টায়ার',
    catTransmission: 'ট্রান্সমিশন',
    catGeneralService: 'জেনারেল সার্ভিস',
    catOther: 'অন্যান্য',

    // Modals & Forms
    addFuelTitle: 'ফুয়েল রিফিল লগ যোগ করুন',
    addFuelDesc: 'ওডোমিটার রিডিং, কত লিটার নিলেন এবং মোট খরচ তথ্য দিন',
    addMaintTitle: 'সার্ভিস লগ যোগ করুন',
    addMaintDesc: 'গাড়ির সার্ভিসিং, যন্ত্রাংশ পরিবর্তন ও মেরামতের খরচ লিখে রাখুন',
    tripCalcTitle: 'ট্রিপ ও ফুয়েল খরচ ক্যালকুলেটর',
    tripCalcDesc: 'আপনার ভ্রমণের জন্য প্রয়োজনীয় জ্বালানি ও মোট খরচের হিসেব করুন',
    tripDistance: 'ভ্রমণের দূরত্ব (কিমি)',
    estFuelNeeded: 'আনুমানিক প্রয়োজনীয় জ্বালানি',
    estTripCost: 'আনুমানিক মোট ভ্রমণ খরচ',
    costPerKm: 'প্রতি কিমি খরচ',
    calculate: 'হিসেব করুন',
    saveLog: 'সংরক্ষণ করুন',
    saveToFuelLogs: 'ফুয়েল লগে সেভ করুন',
    cancel: 'বাতিল',

    // Auth
    welcomeTitle: 'ফুয়েল ফ্লো-তে স্বাগতম',
    authDesc: 'জ্বালানী দক্ষতা, মাইলেজ এবং মেইনটেন্যান্সের সঠিক হিসেব রাখুন ফায়ারবেস সিংকের মাধ্যমে।',
    email: 'ইমেইল এড্রেস',
    password: 'পাসওয়ার্ড',
    fullName: 'আপনার নাম',
    signInBtn: 'অ্যাকাউন্টে সাইন ইন করুন',
    signUpBtn: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    guestBtn: 'গেস্ট হিসেবে চালিয়ে যান (অনলাইন সিংক)',
    dontHaveAccount: 'অ্যাকাউন্ট নেই?',
    alreadyHaveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    signUpNow: 'রেজিস্টার করুন',
    signInNow: 'সাইন ইন করুন',

    // PWA Install
    installTitle: 'ফুয়েলফ্লো অ্যাপ ইনস্টল করুন',
    installDesc: 'ক্রোম প্রোগ্রেসিভ ওয়েব অ্যাপ্লিকেশন (PWA)',
    installNowBtn: 'এখনই ইনস্টল করুন',
    dismiss: 'বাতিল',
    pwaBannerText: 'হোম স্ক্রিনে যোগ করুন দ্রুুুত ক্রোম ব্যবহারের জন্য',

    // Units
    km: 'কিমি',
    kmPerLiter: 'কিমি/লিটার',
    bdtSymbol: '৳',

    // Cloud Sync
    cloudSynced: 'ক্লাউডে সিঙ্কড',
    syncing: 'অনলাইনে সিঙ্ক হচ্ছে...',
    cloudError: 'সিঙ্ক অফলাইন',
    forceSync: 'ম্যানুয়াল ক্লাউড সিঙ্ক',
    syncSuccess: 'সমস্ত লগ ও সেটিংস ফায়ারবেস ক্লাউডে অনলাইনে সেভ হয়েছে!'
  }
};
