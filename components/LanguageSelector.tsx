'use client'

import { useLanguage } from '../contexts/LanguageContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from 'lucide-react'

export default function LanguageSelector() {
  let languageContext;

  try {
    languageContext = useLanguage();
  } catch (error) {
    console.error('Language context not available:', error);
    return null; // Or return a fallback UI
  }

  const { language, setLanguage, t } = languageContext;

  if (!language || !setLanguage || !t) {
    return null; // Or return a fallback UI
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <Select value={language} onValueChange={(value: 'en' | 'hi' | 'kn') => setLanguage(value)}>
        <SelectTrigger className="w-[100px] bg-transparent border-gray-700 text-white">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
          <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

