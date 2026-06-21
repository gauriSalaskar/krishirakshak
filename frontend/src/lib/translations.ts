/**
 * Lightweight translation system for the Kisan Yojana Hub page.
 * Not a full i18n library — just enough to genuinely translate
 * the static UI strings into Hindi and Marathi as promised in the spec.
 * Scheme data itself (from MongoDB) stays in English since translating
 * 15 real government scheme descriptions accurately needs a proper
 * translation service, not a hardcoded dictionary.
 */

export type Lang = 'en' | 'hi' | 'mr'

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    pageTitle: 'Kisan Yojana Hub',
    pageSubtitle: 'All government schemes and policies for Indian farmers in one place',
    searchPlaceholder: 'Search schemes by name or keyword...',
    allStates: 'All States',
    eligibilityCTA: 'Not sure which scheme fits you?',
    eligibilityDesc: 'Answer 4 quick questions and get matched instantly',
    checkEligibility: 'Check Eligibility',
    applyNow: 'Apply Now',
    more: 'More',
    less: 'Less',
    allBenefits: 'All Benefits',
    requiredDocs: 'Required Documents',
    howToApply: 'How to Apply',
    helpline: 'Helpline',
    eligibility: 'Eligibility',
    shareWhatsapp: 'Share on WhatsApp',
    printSummary: 'Print Summary',
    noSchemesFound: 'No schemes found',
    tryDifferentSearch: 'Try a different search or filter',
    askAboutSchemes: 'Ask about schemes',
    schemeAssistant: 'Scheme AI Assistant',
    chatPlaceholder: 'Ask about schemes...',
    chatWelcome: 'Namaste! 🌱 I am your Kisan Yojana AI assistant. Tell me about your farm (land size, state, crop type) and I will suggest the best government schemes for you!',
  },
  hi: {
    pageTitle: 'किसान योजना हब',
    pageSubtitle: 'भारतीय किसानों के लिए सभी सरकारी योजनाएं और नीतियां एक जगह पर',
    searchPlaceholder: 'योजना का नाम या कीवर्ड खोजें...',
    allStates: 'सभी राज्य',
    eligibilityCTA: 'कौन सी योजना आपके लिए सही है?',
    eligibilityDesc: '4 सरल सवालों के जवाब दें और तुरंत मिलान पाएं',
    checkEligibility: 'पात्रता जांचें',
    applyNow: 'अभी आवेदन करें',
    more: 'अधिक',
    less: 'कम',
    allBenefits: 'सभी लाभ',
    requiredDocs: 'आवश्यक दस्तावेज़',
    howToApply: 'आवेदन कैसे करें',
    helpline: 'हेल्पलाइन',
    eligibility: 'पात्रता',
    shareWhatsapp: 'व्हाट्सएप पर शेयर करें',
    printSummary: 'सारांश प्रिंट करें',
    noSchemesFound: 'कोई योजना नहीं मिली',
    tryDifferentSearch: 'अलग खोज या फ़िल्टर आज़माएं',
    askAboutSchemes: 'योजनाओं के बारे में पूछें',
    schemeAssistant: 'योजना AI सहायक',
    chatPlaceholder: 'योजनाओं के बारे में पूछें...',
    chatWelcome: 'नमस्ते! 🌱 मैं आपका किसान योजना AI सहायक हूं। अपने खेत के बारे में बताएं (भूमि का आकार, राज्य, फसल का प्रकार) और मैं आपके लिए सबसे अच्छी सरकारी योजनाएं सुझाऊंगा!',
  },
  mr: {
    pageTitle: 'किसान योजना हब',
    pageSubtitle: 'भारतीय शेतकऱ्यांसाठी सर्व सरकारी योजना आणि धोरणे एकाच ठिकाणी',
    searchPlaceholder: 'योजनेचे नाव किंवा कीवर्ड शोधा...',
    allStates: 'सर्व राज्ये',
    eligibilityCTA: 'कोणती योजना तुमच्यासाठी योग्य आहे?',
    eligibilityDesc: '4 सोप्या प्रश्नांची उत्तरे द्या आणि लगेच जुळणी मिळवा',
    checkEligibility: 'पात्रता तपासा',
    applyNow: 'आता अर्ज करा',
    more: 'अधिक',
    less: 'कमी',
    allBenefits: 'सर्व फायदे',
    requiredDocs: 'आवश्यक कागदपत्रे',
    howToApply: 'अर्ज कसा करावा',
    helpline: 'हेल्पलाइन',
    eligibility: 'पात्रता',
    shareWhatsapp: 'व्हॉट्सअॅपवर शेअर करा',
    printSummary: 'सारांश प्रिंट करा',
    noSchemesFound: 'कोणतीही योजना सापडली नाही',
    tryDifferentSearch: 'वेगळा शोध किंवा फिल्टर वापरून पहा',
    askAboutSchemes: 'योजनांबद्दल विचारा',
    schemeAssistant: 'योजना AI सहाय्यक',
    chatPlaceholder: 'योजनांबद्दल विचारा...',
    chatWelcome: 'नमस्कार! 🌱 मी तुमचा किसान योजना AI सहाय्यक आहे. तुमच्या शेताबद्दल सांगा (जमिनीचा आकार, राज्य, पिकाचा प्रकार) आणि मी तुमच्यासाठी सर्वोत्तम सरकारी योजना सुचवेन!',
  },
}

export function t(lang: Lang, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key
}
