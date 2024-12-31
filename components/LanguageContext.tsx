'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'hi' | 'kn'

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    home: "Home",
    about: "About",
    emergencyContacts: "Emergency Contacts",
    community: "Community",
    safetyZones: "Safety Zones",
    contact: "Contact",
    report: "Report",
    login: "Login",
    logout: "Logout",
    youAreNotAlone: "You are not alone",
    itIsNotYourFault: "It is NOT your fault",
    ourMission: "Our Mission",
    missionDescription: "To empower women with technology-driven solutions that enhance their safety, provide immediate assistance in times of need, and foster a supportive community. We strive to create a world where every woman can walk freely without fear.",
    safeWalkDescription: "SafeWalk is an innovative platform that combines AI-powered threat detection, community support, and emergency response systems. Our application provides real-time safety monitoring, instant access to emergency services, and a network of support that ensures no woman has to face danger alone.",
    viewAllSafetyZones: "View All Safety Zones",
  },
  hi: {
    home: "होम",
    about: "हमारे बारे में",
    emergencyContacts: "आपातकालीन संपर्क",
    community: "समुदाय",
    safetyZones: "सुरक्षा क्षेत्र",
    contact: "संपर्क करें",
    report: "रिपोर्ट करें",
    login: "लॉग इन करें",
    logout: "लॉग आउट करें",
    youAreNotAlone: "आप अकेले नहीं हैं",
    itIsNotYourFault: "यह आपकी गलती नहीं है",
    ourMission: "हमारा मिशन",
    missionDescription: "महिलाओं को प्रौद्योगिकी-संचालित समाधानों के साथ सशक्त बनाना जो उनकी सुरक्षा को बढ़ाते हैं, आवश्यकता के समय तत्काल सहायता प्रदान करते हैं, और एक सहायक समुदाय का निर्माण करते हैं। हम एक ऐसी दुनिया बनाने का प्रयास करते हैं जहां हर महिला बिना किसी डर के स्वतंत्र रूप से चल सके।",
    safeWalkDescription: "SafeWalk एक अभिनव प्लेटफॉर्म है जो AI-संचालित खतरा पहचान, सामुदायिक समर्थन, और आपातकालीन प्रतिक्रिया प्रणालियों को जोड़ता है। हमारा एप्लिकेशन रीयल-टाइम सुरक्षा निगरानी, आपातकालीन सेवाओं तक तत्काल पहुंच, और समर्थन का एक नेटवर्क प्रदान करता है जो सुनिश्चित करता है कि कोई भी महिला खतरे का सामना अकेले न करे।",
    viewAllSafetyZones: "सभी सुरक्षा क्षेत्र देखें",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    emergencyContacts: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    community: "ಸಮುದಾಯ",
    safetyZones: "ಸುರಕ್ಷತಾ ವಲಯಗಳು",
    contact: "ಸಂಪರ್ಕಿಸಿ",
    report: "ವರದಿ ಮಾಡಿ",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್ ಔಟ್",
    youAreNotAlone: "ನೀವು ಒಂಟಿಯಲ್ಲ",
    itIsNotYourFault: "ಇದು ನಿಮ್ಮ ತಪ್ಪಲ್ಲ",
    ourMission: "ನಮ್ಮ ಧ್ಯೇಯ",
    missionDescription: "ಮಹಿಳೆಯರ ಸುರಕ್ಷತೆಯನ್ನು ಹೆಚ್ಚಿಸುವ, ಅಗತ್ಯದ ಸಮಯದಲ್ಲಿ ತಕ್ಷಣದ ಸಹಾಯ ಒದಗಿಸುವ ಮತ್ತು ಬೆಂಬಲ ಸಮುದಾಯವನ್ನು ಬೆಳೆಸುವ ತಂತ್ರಜ್ಞಾನ-ಆಧಾರಿತ ಪರಿಹಾರಗಳೊಂದಿಗೆ ಮಹಿಳೆಯರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು. ಪ್ರತಿಯೊಬ್ಬ ಮಹಿಳೆಯೂ ಯಾವುದೇ ಭಯವಿಲ್ಲದೆ ಮುಕ್ತವಾಗಿ ನಡೆಯಬಹುದಾದ ಜಗತ್ತನ್ನು ಸೃಷ್ಟಿಸಲು ನಾವು ಶ್ರಮಿಸುತ್ತೇವೆ.",
    safeWalkDescription: "SafeWalk ಎಂಬುದು AI-ಆಧಾರಿತ ಅಪಾಯ ಪತ್ತೆ, ಸಮುದಾಯ ಬೆಂಬಲ ಮತ್ತು ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ವ್ಯವಸ್ಥೆಗಳನ್ನು ಸಂಯೋಜಿಸುವ ನವೀನ ವೇದಿಕೆಯಾಗಿದೆ. ನಮ್ಮ ಅಪ್ಲಿಕೇಶನ್ ರಿಯಲ್-ಟೈಮ್ ಸುರಕ್ಷತಾ ಮೇಲ್ವಿಚಾರಣೆ, ತುರ್ತು ಸೇವೆಗಳಿಗೆ ತಕ್ಷಣದ ಪ್ರವೇಶ ಮತ್ತು ಯಾವುದೇ ಮಹಿಳೆ ಅಪಾಯವನ್ನು ಎದುರಿಸಬೇಕಾಗಿಲ್ಲ ಎಂದು ಖಚಿತಪಡಿಸುವ ಬೆಂಬಲದ ಜಾಲವನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    viewAllSafetyZones: "ಎಲ್ಲಾ ಸುರಕ್ಷತಾ ವಲಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

