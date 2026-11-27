import type { WeddingConfig } from "@/types/wedding";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE WIZARDING WALIMA — CENTRAL CONFIGURATION
 *
 *  This is the only file you need to edit to update wedding details.
 *  Every section, the countdown, the map, calendar links and the social
 *  preview read from here.
 *
 *  ✎ = placeholder / still to be confirmed. Leave a value as `null` rather than
 *      guessing — the site shows "to be announced" wording instead.
 *
 *  Naming rule: the groom (Faisal Khan) is always named before the bride.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const wedding: WeddingConfig = {
  couple: {
    groom: {
      firstName: "Faisal",
      fullName: "Faisal Khan",
      family: { relation: "Son of", parents: "Mrs. Fatima Khan & Mr. Mohd Afzal Khan" },
    },
    bride: {
      firstName: "Sadaf",
      fullName: "Sadaf Mirza",
      family: { relation: "Daughter of", parents: "Mrs. Mehrunnisa Mirza & Mr. Zaheer Mirza" },
    },
    monogram: ["F", "S"],
  },

  occasion: "Walima",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  locationLine: "Mumbai",

  event: {
    id: "walima",
    name: "Walima",
    date: "2026-12-20",
    time: "19:00", // 7:00 pm IST — the countdown, Walima card and calendar files use this
    endTime: null, // ✎ optional, e.g. "23:00"
    description: "Following the Sunnah, we invite you to our Walima — a feast of gratitude for our marriage.",
    dressCode: null, // no dress code — the row is hidden. e.g. { label: "Festive", note: "…" } to show one
  },

  venue: {
    name: "The Grand FM Mini Banquet",
    area: "Jogeshwari West",
    addressLines: [
      "1st Floor, E.E Heights",
      "Above Jaffer Bhai Delhi Darbar Restaurant",
      "Jogeshwari West, Mumbai",
    ],
    // Full postal address: used only for the Google Maps and calendar lookups, not shown.
    fullAddress:
      "1st Floor, E.E Heights, Above Jaffer Bhai Delhi Darbar Restaurant, Jogeshwari West, Mumbai, Maharashtra 400102, India",
    coordinates: {
      lat: 19.1374952,
      lng: 72.8458317,
      source:
        "Google Maps place pin for the banquet (place 0x3be7b631b5978847:0x9570c62616af2660). Cross-checked: OpenStreetMap reverse geocode resolves to S.V. Road, Jogeshwari West, and directory listings place E.E Heights / Jaffer Bhai's Delhi Darbar on S.V. Road, Jogeshwari West 400102.",
    },
    googleMapsUrl:
      "https://www.google.com/maps/place/The+Grand+FM+Banquet/@19.1374952,72.8458317,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7b631b5978847:0x9570c62616af2660!8m2!3d19.1374952!4d72.8458317!16s%2Fg%2F11cp7fdv_p",
    landmark: {
      name: "Jogeshwari Railway Station (Western Line)",
      shortName: "Jogeshwari Station",
      coordinates: {
        lat: 19.1361144,
        lng: 72.848936,
        source: "OpenStreetMap / Nominatim: “Jogeshwari (Western Line), Station Road”.",
      },
    },
  },

  contact: {
    label: "For any queries",
    phone: "+91 98674 74339", // also receives the WhatsApp RSVPs
  },

  hashtag: "#SaFal",

  bismillah: {
    arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful",
  },

  verse: {
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    translation:
      "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy.",
    cite: "Surah Ar-Rum · 30:21",
  },

  invitation: {
    received: "You have received a special invitation.",
    unsealLabel: "Unseal your invitation",
    byInvitation: "By Special Invitation",
    invitedTo: "request the pleasure of your company at the Walima of",
    blessing: "Two souls, one magical story, and a lifetime of enchantment.",
    enterLabel: "Enter the magical world",
    envelopeAddressee: "To our dearest guest",
  },

  hero: {
    eyebrow: "The Great Hall welcomes you",
    tagline: "Two hearts. One magical destiny.",
  },

  story: {
    eyebrow: "A tale written in starlight",
    title: "Our Magical Celebration",
    intro: "Turn the pages of our celebrations — from Qubool Hai to forever.",
    chapters: [
      {
        id: "nikah",
        numeral: "I",
        title: "The Nikah",
        period: "19 December 2026",
        body: "Bismillah. In the presence of our families and the people we hold dearest, we will say “Qubool Hai” and begin our life together as husband and wife — a promise made before Allah, written in ink that will never fade.",
        image: { src: "/images/story/nikah.svg", alt: "The Nikahnama — a marriage scroll with a gold quill and wax seal, beneath a crescent moon and star" },
        link: { label: "View the Nikah invitation", href: "https://sadaf-weds-faisal.netlify.app/" },
      },
      {
        id: "reception",
        numeral: "II",
        title: "The Reception",
        period: "19 December 2026",
        body: "As the night of our Nikah unfolds, the celebration continues — an evening of laughter, light and loved ones, ending with the bride’s tender farewell.",
        image: { src: "/images/story/reception.svg", alt: "A gold castle with glowing windows and floating lanterns" },
        link: { label: "View the Reception invitation", href: "https://sadaf-weds-faisal.netlify.app/" },
      },
      {
        id: "walima",
        numeral: "III",
        title: "The Walima",
        period: "20 December 2026 · 7:00 PM",
        body: "The day after our Nikah, following the Sunnah, we gather for our Walima — a feast of gratitude, Alhamdulillah, for the blessing of marriage. We would be honoured to share it with you.",
        image: { src: "/images/story/walima.svg", alt: "A gold domed feast platter, steaming, beneath floating candles" },
        link: { label: "See the Walima details", href: "#walima" },
      },
      {
        id: "forever",
        numeral: "IV",
        title: "Forever, Insha’Allah",
        period: null,
        body: "And here our story truly begins. With Allah’s blessings and your duas, two names written side by side become one tale — a lifetime of tranquillity, affection and mercy, Insha’Allah.",
        image: { src: "/images/story/forever.svg", alt: "Two crossed wands whose sparks meet in a golden heart" },
      },
    ],
  },

  celebration: {
    eyebrow: "The Celebration",
    title: "You are cordially invited",
    timeToBeAnnounced: "Time to be announced",
  },

  express: {
    eyebrow: "The Journey",
    title: "Platform 9¾",
    line: "All aboard for a celebration filled with magic.",
    platform: "9¾",
  },

  countdown: {
    eyebrow: "The Enchanted Clock",
    title: "Until the magic begins",
    complete: "The magic begins.",
    completeMessage: "The day has arrived. Thank you for counting down with us.",
  },

  calendar: {
    eyebrow: "Save the Dates",
    title: "Marked by magic",
    intro: "Two enchanted evenings, written into the stars.",
    marks: [
      { date: "2026-12-19", label: "Nikah & Reception" },
      { date: "2026-12-20", label: "Walima" },
    ],
  },

  map: {
    eyebrow: "The Marauder’s Map",
    title: "Way to the Walima",
    intro: "An enchanted chart to guide you to the celebration. Speak the oath to reveal it.",
    oath: "I solemnly swear that I am up to no good",
    revealLabel: "Reveal the way",
    closeLabel: "Mischief managed",
    mapTitle: "A Chart of Jogeshwari West",
  },

  rsvp: {
    eyebrow: "The Response Letter",
    title: "Reply by owl",
    intro: "Kindly let us know whether you will join us for the Walima.",
    submitLabel: "Send my owl",
    successMessage: "Your response has been received. Thank you for being part of our magical celebration.",
    enabled: true,
    deadline: null, // ✎ optional, e.g. "2026-12-10T23:59" — the form closes after this moment
    maxAttendees: 6, // ✎ guests per reply, including the guest
    dietaryOptions: ["Non-Vegetarian", "Vegetarian"], // the first is selected by default
  },

  closing: {
    message: "Thank you for being part of our magical beginning.",
    duas: "Your presence and your duas are the greatest gifts we could ask for. Please keep us in your prayers as we begin this new chapter, Insha’Allah.",
    signOff: "With love and duas,",
    developedBy: "Sadaf Mirza",
  },

  // https://youtu.be/GSV7fHdwnoU — loops while sound is on.
  music: { youtubeId: "GSV7fHdwnoU" },

  secrets: {
    hiddenMessage: "Of all the magic in this world, finding each other was our favourite.",
    spellHint: "Psst — some say whispering “lumos” lights the way.",
    lumos: {
      eyebrow: "Lumos",
      title: "You found the light",
      message:
        "May the light that brought our two hearts together always find its way to you — and may your home be filled with love, joy and the brightest of days.",
      signature: "— Faisal & Sadaf",
    },
  },

  nav: [
    { id: "story", label: "Our Story" },
    { id: "walima", label: "Walima" },
    { id: "countdown", label: "Countdown" },
    { id: "map", label: "The Map" },
    { id: "rsvp", label: "RSVP" },
  ],

  seo: {
    // Fallback only — Vercel/Netlify detect their own URL; NEXT_PUBLIC_SITE_URL wins for a custom domain.
    siteUrl: "https://faisal-weds-sadaf.vercel.app",
    title: "Faisal Khan & Sadaf Mirza — The Wizarding Walima",
    description:
      "You have received a special invitation: the Walima of Faisal Khan & Sadaf Mirza, 20 December 2026, Mumbai.",
    ogImageAlt: "A parchment invitation sealed with an F & S wax seal — Faisal Khan & Sadaf Mirza, Walima, 20 December 2026",
    allowIndexing: false, // private invitation by default
  },
};
