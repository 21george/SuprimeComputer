export type ServiceDetail = {
  slug: string;
  number: string;
  title: string;
  titleLead: string;
  titleAccent: string;
  category: string;
  summary: string;
  visualLabel: string;
  art: "passport" | "phone" | "nin" | "exams" | "training";
  overview: string;
  helps: { title: string; text: string }[];
  prepare: string[];
  steps: { title: string; text: string }[];
  important: string;
  faqs: { question: string; answer: string }[];
  trainingTopics?: { name: string; duration: string; lead: string; description: string; examples: string[] }[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "passport-photos", number: "03", title: "Passport Photographs & Picture Printing",
    titleLead: "Passport photos,", titleAccent: "ready for your next step.",
    category: "PHOTO & PRINT SERVICES", art: "passport", visualLabel: "PHOTO / PRINT",
    summary: "Need passport-style photographs or a printed picture? Visit Supreme Computer for help with the photo and printing process.",
    overview: "Whether your photograph is for an application, school record or personal use, our team can help you discuss the right print format and prepare your picture.",
    helps: [
      { title: "Passport-style photographs", text: "Ask about taking or preparing passport-style pictures for your intended use." },
      { title: "Picture printing", text: "Discuss printing photographs for personal, school and other everyday needs." },
      { title: "Format guidance", text: "Let us know where the photograph will be used so we can discuss the requested size, background or print format." },
    ],
    prepare: [
      "Bring any photo size, background or format instructions supplied by the organisation requesting it.",
      "If you already have a digital picture, ask the team how best to bring or share it.",
      "Contact us to confirm current availability, pricing and collection timing.",
    ],
    steps: [
      { title: "Tell us the purpose", text: "Explain where the photo will be used and share any stated requirements." },
      { title: "Confirm the format", text: "Our team will discuss available photo and printing options with you." },
      { title: "Visit for assistance", text: "Come to the centre for the agreed service and review the finished picture." },
    ],
    important: "Photo requirements differ by institution and application. Please confirm the exact specification with the requesting organisation; acceptance cannot be guaranteed by the print service.",
    faqs: [
      { question: "Can I bring a photo from my phone?", answer: "Contact us before visiting to confirm how to provide a digital picture and whether the format will suit your needs." },
      { question: "Are all passport photo sizes available?", answer: "Sizes and requirements vary. Please share your required dimensions and call to confirm available options." },
    ],
  },
  {
    slug: "print-from-phone", number: "04", title: "Printing From Your Phone",
    titleLead: "Your file. Your phone.", titleAccent: "Printed with care.",
    category: "CONVENIENT DOCUMENT PRINTING", art: "phone", visualLabel: "SEND / PRINT",
    summary: "Have a document on your phone? Supreme Computer can help you arrange printing without needing to bring a laptop.",
    overview: "From documents and application forms to everyday pages, start by telling our team what you need printed. We will confirm how to provide the file and discuss the available print options.",
    helps: [
      { title: "Documents from your device", text: "Ask about printing supported document files that are stored on your phone." },
      { title: "Everyday forms and letters", text: "Discuss printing application materials, typed letters and other personal documents." },
      { title: "Print preferences", text: "Let us know your page count, colour preference and requested paper size so the team can advise." },
    ],
    prepare: [
      "Make sure the file opens correctly on your phone and the content is complete.",
      "Know how many copies you need, and whether you prefer colour or black-and-white.",
      "Call or WhatsApp first to confirm an accepted way to provide the file and the current printing options.",
    ],
    steps: [
      { title: "Describe the print job", text: "Tell us what you want printed and roughly how many pages or copies you need." },
      { title: "Confirm file transfer", text: "Arrange a suitable method of sharing the document with the team." },
      { title: "Review and collect", text: "Confirm the print details, then visit or arrange collection as agreed with the centre." },
    ],
    important: "This website does not accept document uploads. Please agree on a file-sharing method directly with staff, and avoid sending sensitive identification or private account details unless necessary and appropriate.",
    faqs: [
      { question: "Can I upload a document on this website?", answer: "There is no website upload feature. Call or message the centre to agree on how to provide your file." },
      { question: "Can I request colour printing?", answer: "Tell the team your colour and paper requirements so they can confirm available options and pricing." },
    ],
  },
  {
    slug: "nin-assistance", number: "05", title: "NIN Registration Assistance",
    titleLead: "NIN assistance,", titleAccent: "clearly explained.",
    category: "REGISTRATION-RELATED GUIDANCE", art: "nin", visualLabel: "NIN / GUIDANCE",
    summary: "Get practical assistance with NIN registration-related questions and processes, subject to applicable official requirements.",
    overview: "NIN processes can involve specific instructions and authorised channels. Supreme Computer can discuss the assistance currently available and help you understand what to check before proceeding.",
    helps: [
      { title: "General process guidance", text: "Ask about NIN registration-related steps and where official instructions should be followed." },
      { title: "Preparing your visit", text: "Discuss what information or documentation the relevant official process may require." },
      { title: "Document assistance", text: "Ask whether typing, printing or scanning support is available for related paperwork." },
    ],
    prepare: [
      "Check the current requirements published by the appropriate official registration authority.",
      "Bring only the information or documents actually required by the relevant authorised process.",
      "Call ahead to confirm which NIN-related assistance Supreme Computer can currently provide.",
    ],
    steps: [
      { title: "Explain your enquiry", text: "Tell the team which NIN-related process or question you need help with." },
      { title: "Confirm availability", text: "Staff will explain the assistance available and any relevant official requirements." },
      { title: "Follow the authorised process", text: "Proceed through the official channels required for registration or other NIN actions." },
    ],
    important: "Supreme Computer provides assistance only. NIN registration, identity verification and issuance are governed by the relevant Nigerian authorities and their authorised processes. Do not submit your NIN or identity documents through the website contact form.",
    faqs: [
      { question: "Does Supreme Computer issue NIN numbers?", answer: "NIN issuance is an official process. Contact the centre to ask what assistance is available; we do not claim to be the issuing authority." },
      { question: "Should I send my NIN using the contact form?", answer: "No. Use the website form for general questions only, without NIN numbers or sensitive identity documents." },
    ],
  },
  {
    slug: "waec-neco", number: "06", title: "WAEC & NECO Services",
    titleLead: "Exam results,", titleAccent: "less hassle.",
    category: "EXAMINATION SUPPORT", art: "exams", visualLabel: "WAEC / NECO",
    summary: "Ask for assistance checking WAEC and NECO examination results, plus scratch cards when available.",
    overview: "If you need help navigating a result-checking process or want to ask about examination scratch cards, Supreme Computer can confirm its current services and availability.",
    helps: [
      { title: "WAEC result checking", text: "Ask for assistance accessing the appropriate WAEC result-checking service." },
      { title: "NECO result checking", text: "Discuss help with the relevant NECO result-checking process." },
      { title: "Scratch card enquiries", text: "Ask about result-checking cards or tokens where they are available." },
    ],
    prepare: [
      "Know which examination body, year and result-checking service you need.",
      "Confirm the current official result-checking requirements before your visit.",
      "Ask staff about scratch card or token availability and applicable charges.",
    ],
    steps: [
      { title: "Identify the exam", text: "Tell us whether you need WAEC or NECO assistance." },
      { title: "Check what is needed", text: "Confirm availability and the information required by the official result-checking service." },
      { title: "Get support at the centre", text: "Visit for the available help, following the examination body's instructions." },
    ],
    important: "Results are provided by the examination bodies, not Supreme Computer. Scratch cards or tokens may be unavailable, and the centre cannot change examination outcomes. Do not submit candidate credentials or PINs through this website.",
    faqs: [
      { question: "Do you always have WAEC or NECO scratch cards?", answer: "Availability can change. Call the centre first to confirm what is currently available." },
      { question: "Can you change an examination result?", answer: "No. Examination results and any official corrections are controlled by the examination body." },
    ],
  },
  {
    slug: "computer-training", number: "07", title: "Computer Training",
    titleLead: "Build useful skills.", titleAccent: "Gain confidence.",
    category: "PRACTICAL DIGITAL SKILLS", art: "training", visualLabel: "LEARN / PRACTISE",
    summary: "Choose from a 3-month Computer Appreciation course or a 6-month programme covering essential Microsoft Office skills and CorelDRAW.",
    overview: "Our 3-month Computer Appreciation course introduces practical computer skills, Microsoft Word and Microsoft Excel. For more advanced training, the 6-month course covers Microsoft Word, Excel, PowerPoint and CorelDRAW. Contact our centre for enrolment information and class schedules.",
    helps: [
      { title: "3 months — Computer Appreciation", text: "Learn computer fundamentals and build practical skills in Microsoft Word and Microsoft Excel." },
      { title: "6 months — Computer Training", text: "Study Microsoft Word, Microsoft Excel, Microsoft PowerPoint and CorelDRAW." },
      { title: "Practical learning and guidance", text: "Ask about lesson times, course fees and which training option best matches your experience and goals." },
    ],
    trainingTopics: [
      {
        name: "Microsoft Word", duration: "3 & 6 MONTH COURSES",
        lead: "Write and format professional documents.",
        description: "Word is used to type, edit and arrange documents. It helps you create neatly formatted letters, applications, CVs and reports, then save or print them.",
        examples: ["Letters and CVs", "School reports", "Tables and page layouts"],
      },
      {
        name: "Microsoft Excel", duration: "3 & 6 MONTH COURSES",
        lead: "Organise information and work with numbers.",
        description: "Excel is a spreadsheet tool for keeping records and making calculations. You can use rows, columns and formulas to track expenses, prepare budgets, calculate totals and turn figures into simple charts.",
        examples: ["Budgets and expenses", "Attendance and record lists", "Formulas and charts"],
      },
      {
        name: "Microsoft PowerPoint", duration: "6 MONTH COURSE",
        lead: "Turn your ideas into clear presentations.",
        description: "PowerPoint is used to build slides for classwork, meetings and business presentations. Combine text, pictures, diagrams and charts into a story people can follow.",
        examples: ["School presentations", "Business proposals", "Slides and visual storytelling"],
      },
      {
        name: "CorelDRAW", duration: "6 MONTH COURSE",
        lead: "Create designs ready to share or print.",
        description: "CorelDRAW is a graphic design program used for designing flyers, business cards, posters, banners and other layouts with shapes, colours, images and text.",
        examples: ["Flyers and posters", "Business cards", "Banners and layouts"],
      },
    ],
    prepare: [
      "Decide whether the 3-month Computer Appreciation course or the 6-month training programme suits your goals.",
      "Let the team know whether you are a complete beginner or have some experience.",
      "Contact the centre to confirm class availability, schedules, fees and any equipment requirements.",
    ],
    steps: [
      { title: "Choose a course", text: "Ask about the 3-month or 6-month option and tell us about your current computer skills." },
      { title: "Confirm your schedule", text: "Check available class times, enrolment details and fees with our team." },
      { title: "Start learning", text: "Visit the centre at the agreed time and practise the available skills." },
    ],
    important: "The listed courses run for 3 months and 6 months respectively. Contact Supreme Computer directly to confirm class availability, schedules, fees, enrolment requirements and any certificate arrangements.",
    faqs: [
      { question: "What will I learn in the 3-month course?", answer: "The Computer Appreciation course covers computer fundamentals, Microsoft Word and Microsoft Excel." },
      { question: "What will I learn in the 6-month course?", answer: "The 6-month programme covers Microsoft Word, Microsoft Excel, Microsoft PowerPoint and CorelDRAW." },
      { question: "How much does training cost and when are classes?", answer: "Please contact the centre to confirm the current timetable, course availability and fees." },
    ],
  },
];

export const serviceDetailBySlug = Object.fromEntries(serviceDetails.map((service) => [service.slug, service])) as Record<string, ServiceDetail>;
