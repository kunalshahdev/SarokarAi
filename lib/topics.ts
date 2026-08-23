export interface TopicStep {
  title: string;
  description: string;
}

export interface TopicData {
  id: string;
  title: string;
  aliases: string[];
  steps: TopicStep[];
  documents: string[];
  office: {
    name: string;
    address?: string;
    hours?: string;
    website?: string;
  };
  source: {
    name: string;
    url?: string;
  };
  locationNote?: string;
}

export const topics: TopicData[] = [
  {
    id: "pan",
    title: "PAN (Permanent Account Number)",
    aliases: [
      "pan",
      "प्यान",
      "pan banaunu",
      "pan nikalnu",
      "pan card",
      "pan apply",
      "ird pan",
      "pan number",
    ],
    steps: [
      {
        title: "Gather your documents",
        description:
          "You need citizenship or passport + a passport-size photo.",
      },
      {
        title: "Go to IRD or online",
        description:
          "Apply online at ird.gov.np or visit your nearest IRD office.",
      },
      {
        title: "Fill the form",
        description:
          "Enter your personal details. It's a simple form.",
      },
      {
        title: "Submit and wait",
        description:
          "If online, you'll get a reference number. If at office, they process it on the spot usually.",
      },
    ],
    documents: [
      "Citizenship certificate or passport",
      "Passport-size photo",
      "Fee: Rs. 200 (normal), Rs. 1,000 (instant)",
    ],
    office: {
      name: "Inland Revenue Department (IRD)",
      address: "Tripureshwor, Kathmandu (main office)",
      hours: "Sun-Thu, 10am-5pm",
      website: "https://www.ird.gov.np",
    },
    source: {
      name: "Inland Revenue Department",
      url: "https://www.ird.gov.np",
    },
    locationNote:
      "You can apply from any IRD office in your district. In Kathmandu, the main office is at Tripureshwor.",
  },
  {
    id: "passport",
    title: "Passport",
    aliases: [
      "passport",
      "पासपोर्ट",
      "passport renew",
      "passport banaunu",
      "passport nikalnu",
      "passport apply",
      "e-passport",
      "machine readable passport",
    ],
    steps: [
      {
        title: "Check eligibility",
        description:
          "First time or renewal? This changes what you need.",
      },
      {
        title: "Gather documents",
        description:
          "Citizenship, old passport (if renewal), photos, and fee receipt.",
      },
      {
        title: "Apply online",
        description:
          "Go to nepalpassport.gov.np and fill the application form.",
      },
      {
        title: "Book appointment",
        description:
          "Choose a date and time slot for your visit to the passport office.",
      },
      {
        title: "Visit the office",
        description:
          "Bring all documents. They'll take your biometric (photo + fingerprint).",
      },
      {
        title: "Collect passport",
        description:
          "After processing (usually 5-10 working days), collect from the office or get it delivered.",
      },
    ],
    documents: [
      "Citizenship certificate",
      "Current passport (if renewing)",
      "Passport-size photos (as per specification)",
      "Fee receipt",
      "Proof of address (if different from citizenship)",
    ],
    office: {
      name: "Department of Passport",
      address: "Tripureshwor, Kathmandu",
      hours: "Sun-Thu, 10am-4pm (appointment-based)",
      website: "https://nepalpassport.gov.np",
    },
    source: {
      name: "Department of Passport",
      url: "https://nepalpassport.gov.np",
    },
    locationNote:
      "Passport offices are available in all district administration offices. In Kathmandu, the main office is at Tripureshwor.",
  },
  {
    id: "driving-licence",
    title: "Driving Licence",
    aliases: [
      "driving licence",
      "driving license",
      "सवारी चालक अनुमतिपत्र",
      "licence",
      "license",
      "driving trial",
      "learner licence",
      "yatayat",
      "यातायात",
    ],
    steps: [
      {
        title: "Get learner licence first",
        description:
          "You need a learner licence before you can apply for a permanent one.",
      },
      {
        title: "Study for the written test",
        description:
          "Traffic rules and regulations. Study the official handbook.",
      },
      {
        title: "Take the written exam",
        description:
          "Online exam at the transport office. Pass to proceed.",
      },
      {
        title: "Practical training",
        description:
          "After passing written, you'll do practical training.",
      },
      {
        title: "Driving trial",
        description:
          "Take the driving trial at the designated area.",
      },
      {
        title: "Get your licence",
        description:
          "Pass both tests and your licence will be issued.",
      },
    ],
    documents: [
      "Citizenship certificate",
      "Passport-size photos",
      "Medical certificate",
      "Fee receipt",
      "Learner licence (for permanent licence)",
    ],
    office: {
      name: "Department of Transport Management",
      address: "Various transport offices across districts",
      hours: "Sun-Thu, 10am-4pm",
      website: "https://www.dotm.gov.np",
    },
    source: {
      name: "Department of Transport Management",
      url: "https://www.dotm.gov.np",
    },
    locationNote:
      "Visit your district's transport office. In Kathmandu, there are multiple offices including Teku and Lagankhel.",
  },
  {
    id: "national-id",
    title: "National ID Card",
    aliases: [
      "national id",
      "nid",
      "राष्ट्रिय परिचयपत्र",
      "national identity card",
      "id card",
      "nepal id",
    ],
    steps: [
      {
        title: "Check if you're eligible",
        description:
          "NID is being rolled out in phases. Check if your area is covered.",
      },
      {
        title: "Gather documents",
        description:
          "Citizenship certificate and other required documents.",
      },
      {
        title: "Visit the designated office",
        description:
          "Go to the ward office or designated center for biometric enrollment.",
      },
      {
        title: "Biometric enrollment",
        description:
          "They'll take your photo, fingerprints, and iris scan.",
      },
      {
        title: "Wait for processing",
        description:
          "Processing takes a few weeks. You'll be notified when it's ready.",
      },
    ],
    documents: [
      "Citizenship certificate",
      "Birth certificate (if available)",
    ],
    office: {
      name: "Department of National ID and Civil Registration",
      address: "Various district offices",
      hours: "Sun-Thu, 10am-4pm",
      website: "https://www.dnic.gov.np",
    },
    source: {
      name: "Department of National ID and Civil Registration",
      url: "https://www.dnic.gov.np",
    },
  },
  {
    id: "police-clearance",
    title: "Police Clearance Certificate",
    aliases: [
      "police clearance",
      "पुलिस खुला चरित्र",
      "police report",
      "character certificate",
      "clearance certificate",
      "pcr",
    ],
    steps: [
      {
        title: "Gather documents",
        description:
          "Citizenship, passport-size photos, and fee receipt.",
      },
      {
        title: "Apply at the police office",
        description:
          "Visit your district police office or the central office in Kathmandu.",
      },
      {
        title: "Fingerprinting",
        description:
          "They'll take your fingerprints as part of the verification.",
      },
      {
        title: "Background check",
        description:
          "Police will verify your background. Usually takes 3-7 working days.",
      },
      {
        title: "Collect certificate",
        description:
          "Pick up your police clearance certificate from the office.",
      },
    ],
    documents: [
      "Citizenship certificate",
      "Passport-size photos (2 copies)",
      "Fee receipt (Rs. 100)",
      "Letter from employer/institution (if applicable)",
    ],
    office: {
      name: "Nepal Police Criminal Investigation Department",
      address: "Naxal, Kathmandu",
      hours: "Sun-Thu, 10am-5pm",
    },
    source: {
      name: "Nepal Police",
    },
    locationNote:
      "You can apply at your district police office. For international use, you may need additional processing.",
  },
  {
    id: "bluebook",
    title: "Bluebook (Vehicle Registration)",
    aliases: [
      "bluebook",
      "ब्लुबुक",
      "vehicle registration",
      "गाडीको ब्लुबुक",
      "bluebook renew",
      "vehicle bluebook",
    ],
    steps: [
      {
        title: "Check bluebook expiry",
        description:
          "Your bluebook needs to be renewed periodically. Check the expiry date.",
      },
      {
        title: "Gather documents",
        description:
          "Vehicle documents, citizenship, insurance, and tax clearance.",
      },
      {
        title: "Visit the transport office",
        description:
          "Go to the transport office in your district.",
      },
      {
        title: "Vehicle inspection",
        description:
          "Your vehicle may need to be inspected.",
      },
      {
        title: "Pay fees and collect",
        description:
          "Pay the renewal fee and collect your updated bluebook.",
      },
    ],
    documents: [
      "Current bluebook",
      "Citizenship certificate",
      "Vehicle insurance",
      "Tax clearance receipt",
      "Fee receipt",
    ],
    office: {
      name: "Department of Transport Management",
      address: "District transport offices",
      hours: "Sun-Thu, 10am-4pm",
      website: "https://www.dotm.gov.np",
    },
    source: {
      name: "Department of Transport Management",
      url: "https://www.dotm.gov.np",
    },
  },
  {
    id: "citizenship",
    title: "Citizenship Certificate",
    aliases: [
      "citizenship",
      "नागरिकता",
      "nagarkta",
      "citizenship certificate",
      "citizenship nikalnu",
      "citizenship apply",
    ],
    steps: [
      {
        title: "Determine your eligibility",
        description:
          "Citizenship by birth, descent, or naturalization — the process differs.",
      },
      {
        title: "Gather documents",
        description:
          "Parents' citizenship, birth certificate, and other supporting documents.",
      },
      {
        title: "Apply at the district office",
        description:
          "Visit your District Administration Office (DAO) or ward office.",
      },
      {
        title: "Verification process",
        description:
          "Local officials will verify your identity and residency.",
      },
      {
        title: "Collect certificate",
        description:
          "After approval, collect your citizenship certificate.",
      },
    ],
    documents: [
      "Parents' citizenship certificates",
      "Birth certificate",
      "Passport-size photos",
      "Recommendation from ward office",
    ],
    office: {
      name: "District Administration Office (DAO)",
      address: "Your district's DAO",
      hours: "Sun-Thu, 10am-5pm",
    },
    source: {
      name: "Ministry of Home Affairs",
    },
    locationNote:
      "You need to apply at the DAO of your permanent address.",
  },
  {
    id: "company-registration",
    title: "Company Registration",
    aliases: [
      "company register",
      "company kholna",
      "business register",
      "roc",
      "बेमा",
      "company registration",
      "pvt ltd",
      "sole proprietorship",
    ],
    steps: [
      {
        title: "Choose business structure",
        description:
          "Sole proprietorship, partnership, or private limited — each has different requirements.",
      },
      {
        title: "Register at OCR",
        description:
          "Apply at the Office of the Company Registrar (OCR) for company registration.",
      },
      {
        title: "Get PAN and VAT",
        description:
          "Register at IRD for PAN and VAT if applicable.",
      },
      {
        title: "Open bank account",
        description:
          "Open a company bank account with your registration documents.",
      },
      {
        title: "Other registrations",
        description:
          "Social security fund, local government registration, etc.",
      },
    ],
    documents: [
      "Citizenship of directors",
      "Company name approval letter",
      "Memorandum and Articles of Association",
      "Office address proof",
      "Fee receipt",
    ],
    office: {
      name: "Office of the Company Registrar (OCR)",
      address: "Kathmandu (head office), and regional offices",
      hours: "Sun-Thu, 10am-5pm",
      website: "https://www.ocr.gov.np",
    },
    source: {
      name: "Office of the Company Registrar",
      url: "https://www.ocr.gov.np",
    },
  },
  {
    id: "loksewa",
    title: "Lok Sewa (Public Service Commission)",
    aliases: [
      "loksewa",
      "लोक सेवा",
      "lok sewa",
      "loksewa aayog",
      "psc nepal",
      "loksewa form",
      "loksewa exam",
      "loksewa tayari",
    ],
    steps: [
      {
        title: "Create online profile",
        description:
          "Register an account on the master portal (pps.psc.gov.np) with your personal & educational details.",
      },
      {
        title: "Upload certificates",
        description:
          "Scan and upload citizenship, photo, signature, SLC/SEE, +2, and Bachelor degree transcripts.",
      },
      {
        title: "Apply for advertised post",
        description:
          "Select the job vacancy (Kharidar, Nayab Subba, Officer) during open application windows.",
      },
      {
        title: "Pay examination fee",
        description:
          "Pay via ConnectIPS, eSewa, Khalti, or bank voucher before the deadline.",
      },
      {
        title: "Download admit card & sit exam",
        description:
          "Print your admit card 1 week prior to exam date and attend the written test at assigned center.",
      },
    ],
    documents: [
      "Citizenship certificate (front & back)",
      "Educational marksheets, transcripts & character certificates",
      "Passport-size photo & signature (digital copy)",
      "Equivalency certificate (if studied abroad/foreign university)",
      "Inclusive category proof (Adivasi/Janjati, Madhesi, Dalit, etc.)",
    ],
    office: {
      name: "Public Service Commission (Lok Sewa Aayog)",
      address: "Anamnagar, Kathmandu (Central Office)",
      hours: "Sun-Thu, 10am-5pm",
      website: "https://psc.gov.np",
    },
    source: {
      name: "Public Service Commission Nepal",
      url: "https://psc.gov.np",
    },
    locationNote:
      "Applications are 100% online through pps.psc.gov.np. Regional offices in Pokhara, Biratnagar, Surkhet, etc. handle exam centers.",
  },
  {
    id: "shram-swikriti",
    title: "Labor Permit (Shram Swikriti)",
    aliases: [
      "shram",
      "श्रम",
      "shram swikriti",
      "labor permit",
      "labour permit",
      "dofe",
      "foreign employment permit",
      "reentry shram",
    ],
    steps: [
      {
        title: "Create FEIMS account",
        description:
          "Register on the Department of Foreign Employment portal (feims.dofe.gov.np).",
      },
      {
        title: "Medical & orientation check",
        description:
          "Complete mandatory medical examination and pre-departure orientation (for new applicants).",
      },
      {
        title: "Upload visa & agreement",
        description:
          "Upload passport, work visa, employment contract, and My-Miya insurance clearance.",
      },
      {
        title: "Deposit Welfare Fund & Insurance",
        description:
          "Pay Foreign Employment Welfare Fund (Rs. 1,500) and insurance premium online via eSewa/Khalti.",
      },
      {
        title: "Get online E-Sticker",
        description:
          "Once approved, download and print your digital Labor Permit E-Sticker.",
      },
    ],
    documents: [
      "Valid passport (minimum 6 months validity)",
      "Work Visa / Entry Permit",
      "Employment agreement / contract letter",
      "Orientation training certificate",
      "Medical fitness certificate",
    ],
    office: {
      name: "Department of Foreign Employment (DoFE)",
      address: "Tahachal, Kathmandu",
      hours: "Sun-Thu, 10am-5pm",
      website: "https://dofe.gov.np",
    },
    source: {
      name: "Department of Foreign Employment",
      url: "https://dofe.gov.np",
    },
    locationNote:
      "Re-entry labor permits can be obtained 100% online without physically visiting Tahachal office.",
  },
  {
    id: "tu-transcript",
    title: "TU Transcript & Certificates",
    aliases: [
      "tu transcript",
      "tu certificate",
      "tribhuvan university transcript",
      "balkhu exam office",
      "tu pariksha niyantran",
      "tu marksheet",
    ],
    steps: [
      {
        title: "Collect marksheets",
        description:
          "Ensure you have original marksheets for all years/semesters from your campus.",
      },
      {
        title: "Fill application form online/offline",
        description:
          "Fill the transcript request form available online or at the Examination Control Office.",
      },
      {
        title: "Pay fee at Global IME Bank",
        description:
          "Pay the required fee at Global IME Bank counter inside Balkhu premises or designated online bank pay.",
      },
      {
        title: "Submit voucher & documents",
        description:
          "Submit the bank voucher, registration card photocopy, and marksheets at Balkhu counter.",
      },
      {
        title: "Collect transcript",
        description:
          "Collect your transcript within 7-15 working days from Balkhu office.",
      },
    ],
    documents: [
      "Photocopies of marksheets (all years/semesters)",
      "TU Registration Card copy",
      "Passport-size photos",
      "Bank deposit voucher (Rs. 500-1500 per document)",
    ],
    office: {
      name: "Office of the Controller of Examinations (TU)",
      address: "Balkhu, Kathmandu",
      hours: "Sun-Thu, 10am-4pm",
      website: "https://tuexam.edu.np",
    },
    source: {
      name: "Tribhuvan University Examination Control Office",
      url: "https://tuexam.edu.np",
    },
  },
  {
    id: "birth-marriage-cert",
    title: "Birth & Marriage Registration",
    aliases: [
      "birth certificate",
      "marriage certificate",
      "janma darta",
      "vivaha darta",
      "जन्म दर्ता",
      "विवाह दर्ता",
      "ward office registration",
      "vital registration nepal",
    ],
    steps: [
      {
        title: "Apply within 35 days",
        description:
          "Registering within 35 days of birth or marriage avoids late fees.",
      },
      {
        title: "Visit local Ward Office",
        description:
          "Go to the Ward Office of your permanent address or current municipality.",
      },
      {
        title: "Fill vital registration form",
        description:
          "Fill the official vital registration form (or pre-enroll online at public.donidcr.gov.np).",
      },
      {
        title: "Verification by Ward Secretary",
        description:
          "Ward Secretary verifies citizenship and hospital birth proof/marriage photos.",
      },
      {
        title: "Receive official certificate",
        description:
          "Official certificate with QR code is issued on the same day.",
      },
    ],
    documents: [
      "Hospital birth report / discharge slip (for Birth Cert)",
      "Parents' citizenship certificates",
      "Couple's citizenship certificates & joint photo (for Marriage Cert)",
      "Landlord/Neighbor recommendation if temporary resident",
    ],
    office: {
      name: "Local Ward Office (Nagarpalika / Gaunpalika)",
      address: "Your local Ward Office",
      hours: "Sun-Thu, 10am-5pm",
      website: "https://donidcr.gov.np",
    },
    source: {
      name: "Department of National ID and Civil Registration",
      url: "https://donidcr.gov.np",
    },
  },
];

export function findTopic(query: string): TopicData | undefined {
  const q = query.toLowerCase();
  return topics.find((topic) =>
    topic.aliases.some((alias) => {
      const a = alias.toLowerCase();
      // For short aliases (<=3 chars like "pan", "nid"), use word boundary matching
      // to avoid false positives (e.g. "panic" matching "pan")
      if (a.length <= 3) {
        const regex = new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        return regex.test(q);
      }
      return q.includes(a);
    })
  );
}
