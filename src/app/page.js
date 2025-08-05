'use client'
import React, { useState, useEffect } from 'react'

// --- Helper Functions ---
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০'
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(
    /[0-9]/g,
    (digit) => bengaliDigits[parseInt(digit)]
  )
}

// --- Data for Tabs ---
const weeklyData = {
  6: {
    baby: 'একটি মটরশুঁটির আকারের। হৃৎপিণ্ড স্পন্দিত হতে শুরু করেছে।',
    mother: 'বমি বমি ভাব এবং ক্লান্তি বোধ হতে পারে।',
  },
  7: {
    baby: 'একটি ব্লুবেরির আকারের। হাত ও পায়ের কুঁড়ি তৈরি হচ্ছে।',
    mother: 'ঘন ঘন প্রস্রাবের চাপ আসতে পারে।',
  },
  10: {
    baby: 'একটি ছোট জলপাইয়ের আকারের। অঙ্গ-প্রত্যঙ্গ তৈরি হয়ে গেছে।',
    mother: 'পেট সামান্য স্ফীত হতে পারে।',
  },
  14: {
    baby: 'একটি লেবুর আকারের। শিশু এখন ভ্রূকুটি করতে বা হাসতে পারে।',
    mother: 'প্রথম ট্রাইমেস্টারের অস্বস্তিগুলো কমতে শুরু করবে।',
  },
  20: {
    baby: 'একটি কলার আকারের। আপনি এখন শিশুর নড়াচড়া অনুভব করতে পারেন।',
    mother: 'পেটের আকার দৃশ্যমান হবে এবং ক্ষুধা বাড়বে।',
  },
  28: {
    baby: 'একটি বেগুনের আকারের। শিশু চোখ খুলতে ও বন্ধ করতে পারে।',
    mother: 'পিঠে ব্যথা বা পায়ে পানি আসার মতো সমস্যা দেখা দিতে পারে।',
  },
  35: {
    baby: 'একটি আনারসের আকারের। ফুসফুস প্রায় সম্পূর্ণ তৈরি।',
    mother: 'ঘন ঘন Braxton Hicks contractions (প্রস্তুতিমূলক সংকোচন) হতে পারে।',
  },
  40: {
    baby: 'একটি ছোট কুমড়োর আকারের। শিশু এখন জন্মের জন্য প্রস্তুত।',
    mother: 'যে কোনো মুহূর্তে প্রসব বেদনা শুরু হতে পারে।',
  },
}

const tipsData = {
  foodsToEat: [
    {
      name: 'ফলিক অ্যাসিড সমৃদ্ধ খাবার',
      examples: 'ডাল, সবুজ শাক (পালং), লেবু জাতীয় ফল',
      benefit:
        'শিশুর মস্তিষ্ক ও মেরুদণ্ডের সঠিক বিকাশে সাহায্য করে এবং জন্মগত ত্রুটি (নিউরাল টিউব ডিফেক্ট) রোধ করে।',
    },
    {
      name: 'আয়রন ও প্রোটিন',
      examples: 'লাল মাংস, মুরগি, মাছ, ডিম, শিম, বাদাম',
      benefit:
        'রক্তস্বল্পতা দূর করে, শিশুর বৃদ্ধি ও কোষ গঠনে অপরিহার্য। প্রোটিন শিশুর শারীরিক ভিত্তি তৈরি করে।',
    },
    {
      name: 'ক্যালসিয়াম',
      examples: 'দুধ, দই, পনির, ছোট মাছ',
      benefit:
        'মা ও শিশুর হাড় এবং দাঁত মজবুত করে। মায়ের অস্টিওপোরোসিসের ঝুঁকি কমায়।',
    },
    {
      name: 'পর্যাপ্ত পানি',
      examples: 'প্রতিদিন ৮-১০ গ্লাস বিশুদ্ধ পানি',
      benefit:
        'শরীরকে সতেজ রাখে, কোষ্ঠকাঠিন্য দূর করে এবং অ্যামনিওটিক ফ্লুইডের ভারসাম্য বজায় রাখে।',
    },
    {
      name: 'ফাইবারযুক্ত খাবার',
      examples: 'লাল আটার রুটি, ওটস, ফল ও সবজি',
      benefit:
        'হজমে সহায়তা করে এবং গর্ভাবস্থায় সাধারণ সমস্যা কোষ্ঠকাঠিন্য প্রতিরোধ করে।',
    },
  ],
  foodsToAvoid: [
    {
      name: 'অসিদ্ধ বা কাঁচা খাবার',
      examples: 'কাঁচা ডিম (যেমন মেয়োনিজ), আধা-সিদ্ধ মাংস/মাছ (যেমন সুশি)',
      risk: 'সালমোনেলা বা লিস্টেরিয়ার মতো ক্ষতিকর ব্যাকটেরিয়া সংক্রমণের ঝুঁকি বাড়ায়, যা গর্ভপাত বা শিশুর মারাত্মক ক্ষতি করতে পারে।',
    },
    {
      name: 'অতিরিক্ত ক্যাফেইন',
      examples: 'চা, কফি, কোমল পানীয়, এনার্জি ড্রিংকস',
      risk: 'অতিরিক্ত গ্রহণে (দৈনিক ২০০ মি.গ্রা. এর বেশি) গর্ভপাত বা কম ওজনের শিশু জন্মের ঝুঁকি থাকে।',
    },
    {
      name: 'অপাস্তুরিত দুধ ও পনির',
      examples: 'সরাসরি খামার থেকে আনা কাঁচা দুধ বা নরম পনির',
      risk: 'লিস্টেরিয়া নামক ব্যাকটেরিয়া থাকতে পারে, যা গর্ভের শিশুর জন্য অত্যন্ত বিপজ্জনক।',
    },
    {
      name: 'কিছু সামুদ্রিক মাছ',
      examples: 'টুনা, হাঙ্গর, সোর্ডফিশ (যাদের দেহে পারদের মাত্রা বেশি)',
      risk: 'অতিরিক্ত পারদ শিশুর স্নায়ুতন্ত্রের বিকাশে বাধা দিতে পারে।',
    },
    {
      name: 'আনারস ও পেঁপে',
      examples: 'কাঁচা বা আধা-পাকা আনারস ও পেঁপে',
      risk: 'এগুলোতে থাকা ব্রোমেলিন ও প্যাপেইন জরায়ুর সংকোচন ঘটাতে পারে, যা গর্ভপাতের ঝুঁকি তৈরি করতে পারে (বিশেষ করে প্রথম দিকে)।',
    },
  ],
}

const islamicData = {
  duas: [
    {
      arabic:
        'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
      pronunciation:
        "রব্বি হাবলি মিল্লাদুনকা যুররিয়্যাতান ত্বাইয়্যিবাতান, ইন্নাকা সামিউ'দ দু'আ।",
      translation:
        'হে আমার রব, আমাকে আপনার পক্ষ থেকে উত্তম সন্তান দান করুন। নিশ্চয়ই আপনি দোয়া শ্রবণকারী।',
      context:
        'এটি যাকারিয়া (আঃ) এর দোয়া। নেক ও صالح সন্তান লাভের জন্য এই দোয়া পাঠ করা অত্যন্ত ফলপ্রসূ।',
      reference: 'সূরা আলে-ইমরান: ৩৮',
    },
    {
      arabic:
        'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
      pronunciation:
        "রব্বানা হাবলানা মিন আযওয়াজিনা ওয়া যুররিয়্যাতিনা কুররাতা আ'ইউনিও ওয়া জা'আলনা লিল মুত্তাক্বীনা ইমামা।",
      translation:
        'হে আমাদের রব, আপনি আমাদেরকে এমন স্ত্রী ও সন্তান দান করুন যারা আমাদের চোখের শীতলতা হবে। আর আমাদেরকে মুত্তাকিদের জন্য আদর্শ বানান।',
      context:
        'এটি আল্লাহর নেক বান্দাদের একটি جامع دعا, যা পরিবার ও ভবিষ্যৎ প্রজন্মের কল্যাণের জন্য পাঠ করা হয়।',
      reference: 'সূরা ফুরকান: ৭৪',
    },
    {
      arabic:
        'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
      pronunciation:
        "রব্বিজ 'আলনি মুক্বিমাস সালাতি ওয়া মিন যুররিয়্যাতি, রব্বানা ওয়া তাক্বাব্বাল দু'আ।",
      translation:
        'হে আমার রব, আমাকে সালাত কায়েমকারী বানান এবং আমার বংশধরদের মধ্য থেকেও। হে আমাদের রব, আর আমার দোয়া কবুল করুন।',
      context:
        'এটি ইবরাহীম (আঃ) এর দোয়া। নিজে এবং সন্তানরা যেন দ্বীনের উপর, বিশেষ করে সালাতের উপর অটল থাকে, সেই জন্য এই দোয়া পাঠ করা হয়।',
      reference: 'সূরা ইবরাহীম: ৪০',
    },
  ],
  eveningDuas: [
    {
      title: 'সাইয়্যিদুল ইস্তিগফার (ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া)',
      arabic:
        'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      pronunciation:
        "আল্লাহুম্মা আনতা রব্বি লা ইলাহা ইল্লা আনতা, খালাক্বতানি ওয়া আনা 'আবদুকা, ওয়া আনা 'আলা 'আহদিকা ওয়া ওয়া'দিকা মাসতাত্বা'তু। আ'উযু বিকা মিন শাররি মা সনা'তু, আবুউ লাকা বিনি'মাতিকা 'আলাইয়্যা, ওয়া আবুউ বিকা বিযাম্বি, ফাগফিরলি ফা ইন্নাহু লা ইয়াগফিরুয যুনুবা ইল্লা আনতা।",
      translation:
        'হে আল্লাহ! তুমি আমার প্রতিপালক, তুমি ছাড়া কোনো উপাস্য নেই। তুমি আমাকে সৃষ্টি করেছ এবং আমি তোমার বান্দা। আমি আমার সাধ্যমত তোমার সঙ্গে কৃত অঙ্গীকার ও প্রতিশ্রুতির উপর প্রতিষ্ঠিত আছি। আমি যা করেছি, তার মন্দ থেকে তোমার আশ্রয় চাই। আমার উপর তোমার যে নিয়ামত রয়েছে, তা আমি স্বীকার করছি এবং আমার অপরাধও স্বীকার করছি। সুতরাং তুমি আমাকে ক্ষমা করে দাও। কেননা, তুমি ছাড়া আর কেউ গুনাহ ক্ষমা করতে পারে না।',
      benefit:
        'নবী (সাঃ) বলেছেন, যে ব্যক্তি দৃঢ় বিশ্বাসের সাথে সকালে ও সন্ধ্যায় এই দোয়া পাঠ করবে এবং সেই দিন বা রাতে মারা যাবে, সে জান্নাতি হবে।',
      reference: 'সহীহ আল-বুখারী: ৬৩০৬',
    },
    {
      title: 'সকল প্রকার ক্ষতি থেকে সুরক্ষা',
      arabic:
        'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      pronunciation:
        "বিসমিল্লাহিল্লাযি লা ইয়াদ্বুররু মা'আসমিহি শাইউন ফিল আরদ্বি ওয়ালা ফিস সামা-ই, ওয়া হুয়াস সামিউ'ল 'আলিম।",
      benefit:
        'নবী (সাঃ) বলেছেন, যে ব্যক্তি সকালে ও সন্ধ্যায় এই দোয়াটি ৩ বার পাঠ করবে, কোনো কিছুই তার ক্ষতি করতে পারবে না।',
      translation:
        'আল্লাহর নামে (আমি এই দিন বা সন্ধ্যা শুরু করছি), যার নামের বরকতে আসমান ও জমিনের কোনো কিছুই কোনো ক্ষতি করতে পারে না। তিনি সর্বশ্রোতা, সর্বজ্ঞ।',
      reference: 'আবু দাউদ, তিরমিজি',
    },
  ],
  amols: [
    "সন্তানের উত্তম চরিত্র ও সুরতের জন্য 'সূরা ইউসুফ' পাঠ করা যেতে পারে।",
    "সহজ প্রসবের জন্য 'সূরা মারইয়াম' পাঠ করা খুবই উপকারী।",
    "মা ও শিশুর সার্বিক সুরক্ষার জন্য প্রতিদিন 'আয়াতুল কুরসি' পাঠ করুন।",
    'গর্ভাবস্থায় বেশি বেশি ইস্তেগফার ও দরুদ পাঠ করুন।',
  ],
  hadith: {
    text: "রাসূলুল্লাহ (সাঃ) বলেছেন, 'জান্নাত মায়ের পায়ের নিচে।'",
    reference: 'সুনানে নাসায়ী',
  },
}

// --- SVG Icons ---
const BabyIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-pink-500'
  >
    <path d='M9 12h.01' />
    <path d='M15 12h.01' />
    <path d='M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5' />
    <path d='M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.8.6 5.3 1.7' />
  </svg>
)
const CalendarIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-blue-500'
  >
    <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
    <line x1='16' x2='16' y1='2' y2='6' />
    <line x1='8' x2='8' y1='2' y2='6' />
    <line x1='3' x2='21' y1='10' y2='10' />
  </svg>
)
const HeartIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='currentColor'
    className='text-red-500'
  >
    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
  </svg>
)
const CheckIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-green-500'
  >
    <polyline points='20 6 9 17 4 12'></polyline>
  </svg>
)
const XIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-red-500'
  >
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
)

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [pregnancyDetails, setPregnancyDetails] = useState({
    weeks: 0,
    days: 0,
    displayMonths: 0,
    displayRemainingDays: 0,
    totalDays: 0,
    trimester: 1,
    countdown: 0,
    countdownMonths: 0,
    countdownRemainingDays: 0,
    progress: 0,
  })

  // --- Calculation Logic ---
  useEffect(() => {
    const calculateDetails = () => {
      const ultrasoundDate = new Date('2025-07-21T00:00:00')
      const gestationAtUltrasoundInDays = 6 * 7 + 4
      const estimatedDueDate = new Date('2026-03-12T00:00:00')
      const conceptionDate = new Date(ultrasoundDate)
      conceptionDate.setDate(
        ultrasoundDate.getDate() - gestationAtUltrasoundInDays
      )
      const today = new Date()
      const diffTime = today.getTime() - conceptionDate.getTime()
      const totalDaysElapsed = Math.max(
        0,
        Math.floor(diffTime / (1000 * 60 * 60 * 24))
      )
      const weeks = Math.floor(totalDaysElapsed / 7)
      const days = totalDaysElapsed % 7
      const displayMonths = Math.floor(totalDaysElapsed / 30)
      const displayRemainingDays = totalDaysElapsed % 30
      let trimester = 1
      if (weeks >= 14 && weeks <= 27) trimester = 2
      else if (weeks > 27) trimester = 3
      const countdownDiffTime = estimatedDueDate.getTime() - today.getTime()
      const countdownDays =
        countdownDiffTime > 0
          ? Math.ceil(countdownDiffTime / (1000 * 60 * 60 * 24))
          : 0
      const countdownMonths = Math.floor(countdownDays / 30)
      const countdownRemainingDays = countdownDays % 30
      const progressPercentage = Math.min((totalDaysElapsed / 280) * 100, 100)

      setPregnancyDetails({
        weeks,
        days,
        displayMonths,
        displayRemainingDays,
        totalDays: totalDaysElapsed,
        trimester,
        countdown: countdownDays,
        countdownMonths,
        countdownRemainingDays,
        progress: progressPercentage,
      })
    }

    calculateDetails()
    const interval = setInterval(calculateDetails, 60000)
    return () => clearInterval(interval)
  }, [])

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap focus:outline-none ${
        activeTab === tabName
          ? 'text-pink-600'
          : 'text-gray-500 hover:text-pink-500'
      }`}
    >
      {label}
      {activeTab === tabName && (
        <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-pink-500 rounded-full'></span>
      )}
    </button>
  )

  const renderContent = () => {
    const currentWeekData = weeklyData[pregnancyDetails.weeks] ||
      weeklyData[
        Object.keys(weeklyData).reduce((prev, curr) =>
          Math.abs(curr - pregnancyDetails.weeks) <
          Math.abs(prev - pregnancyDetails.weeks)
            ? curr
            : prev
        )
      ] || {
        baby: 'তথ্য আপডেট করা হচ্ছে...',
        mother: 'তথ্য আপডেট করা হচ্ছে...',
      }

    switch (activeTab) {
      case 'home':
        return (
          <div className='space-y-6 animate-fade-in'>
            {/* Current Gestational Age */}
            <div className='bg-pink-100/50 border border-pink-200 rounded-xl p-4 text-center'>
              <div className='flex justify-center items-center gap-2 mb-2'>
                <BabyIcon />
                <h2 className='text-lg font-semibold text-pink-800'>
                  গর্ভধারণের বর্তমান বয়স
                </h2>
              </div>
              <div className='flex justify-center items-baseline space-x-4'>
                <div>
                  <p className='text-4xl font-bold text-pink-600'>
                    {toBengaliNumber(pregnancyDetails.weeks)}
                  </p>
                  <p className='text-sm text-gray-600'>সপ্তাহ</p>
                </div>
                <div>
                  <p className='text-4xl font-bold text-pink-600'>
                    {toBengaliNumber(pregnancyDetails.days)}
                  </p>
                  <p className='text-sm text-gray-600'>দিন</p>
                </div>
              </div>
              <div className='text-sm text-gray-500 mt-3 space-y-1'>
                <p>
                  ({toBengaliNumber(pregnancyDetails.displayMonths)} মাস ও{' '}
                  {toBengaliNumber(pregnancyDetails.displayRemainingDays)} দিন)
                </p>
                <p>
                  অথবা, মোট {toBengaliNumber(pregnancyDetails.totalDays)} দিন
                </p>
              </div>
            </div>
            {/* Countdown */}
            <div className='bg-blue-100/50 border border-blue-200 rounded-xl p-4 text-center'>
              <div className='flex justify-center items-center gap-2 mb-2'>
                <CalendarIcon />
                <h2 className='text-lg font-semibold text-blue-800'>
                  প্রসবের কাউন্টডাউন
                </h2>
              </div>
              <p className='text-5xl font-bold text-blue-600'>
                {toBengaliNumber(pregnancyDetails.countdown)}
              </p>
              <p className='text-md text-gray-600'>দিন বাকি</p>
              <div className='text-sm text-gray-500 mt-2 space-y-1'>
                <p>
                  (অথবা, {toBengaliNumber(pregnancyDetails.countdownMonths)} মাস
                  ও {toBengaliNumber(pregnancyDetails.countdownRemainingDays)}{' '}
                  দিন)
                </p>
                <p>সম্ভাব্য তারিখ: ১২ মার্চ, ২০২৬</p>
              </div>
            </div>
            {/* Progress Bar and Trimester */}
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-base font-medium text-gray-700'>
                  অগ্রগতি
                </span>
                <span className='text-sm font-medium text-gray-700'>
                  {toBengaliNumber(Math.round(pregnancyDetails.progress))}%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-4'>
                <div
                  className='bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-500'
                  style={{ width: `${pregnancyDetails.progress}%` }}
                ></div>
              </div>
              <p className='text-center text-gray-600 mt-2'>
                আপনার গর্ভাবস্থার সফর এখন{' '}
                <span className='font-bold text-purple-600'>
                  {toBengaliNumber(pregnancyDetails.trimester)}ম
                </span>{' '}
                ধাপে রয়েছে।
              </p>
            </div>
          </div>
        )
      case 'weekly':
        return (
          <div className='space-y-4 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              সপ্তাহ {toBengaliNumber(pregnancyDetails.weeks)}: কী ঘটছে?
            </h3>
            <div className='bg-purple-100/50 border border-purple-200 rounded-xl p-4'>
              <h4 className='font-semibold text-purple-800 mb-2'>
                শিশুর বৃদ্ধি
              </h4>
              <p className='text-gray-700'>{currentWeekData.baby}</p>
            </div>
            <div className='bg-green-100/50 border border-green-200 rounded-xl p-4'>
              <h4 className='font-semibold text-green-800 mb-2'>
                মায়ের জন্য তথ্য
              </h4>
              <p className='text-gray-700'>{currentWeekData.mother}</p>
            </div>
          </div>
        )
      case 'tips':
        return (
          <div className='space-y-6 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              খাদ্যাভ্যাস ও যত্ন
            </h3>
            {/* Foods to Eat */}
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <CheckIcon />
                <h4 className='text-lg font-semibold text-green-700'>
                  কী খাবেন (প্রয়োজনীয় খাবার)
                </h4>
              </div>
              <div className='space-y-3'>
                {tipsData.foodsToEat.map((item, index) => (
                  <div
                    key={index}
                    className='bg-green-100/50 border-l-4 border-green-500 p-3 rounded-r-lg'
                  >
                    <p className='font-semibold text-gray-800'>{item.name}</p>
                    <p className='text-xs text-gray-500 mb-1'>
                      ({item.examples})
                    </p>
                    <p className='text-sm text-gray-700'>{item.benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Foods to Avoid */}
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <XIcon />
                <h4 className='text-lg font-semibold text-red-700'>
                  কী এড়িয়ে চলবেন (ঝুঁকিপূর্ণ খাবার)
                </h4>
              </div>
              <div className='space-y-3'>
                {tipsData.foodsToAvoid.map((item, index) => (
                  <div
                    key={index}
                    className='bg-red-100/50 border-l-4 border-red-500 p-3 rounded-r-lg'
                  >
                    <p className='font-semibold text-gray-800'>{item.name}</p>
                    <p className='text-xs text-gray-500 mb-1'>
                      ({item.examples})
                    </p>
                    <p className='text-sm text-gray-700'>{item.risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'islamic':
        return (
          <div className='space-y-6 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              ইসলামিক করনীয় ও দোয়া
            </h3>
            {/* Duas for Child */}
            <div className='bg-teal-100/50 border border-teal-200 rounded-xl p-4'>
              <h4 className='font-semibold text-teal-800 mb-3 text-lg'>
                সন্তানের জন্য দোয়া
              </h4>
              {islamicData.duas.map((dua, index) => (
                <div
                  key={index}
                  className='mb-4 last:mb-0 pt-4 border-t border-teal-200 first:border-t-0 first:pt-0'
                >
                  <p className='text-lg text-right font-serif text-teal-900'>
                    {dua.arabic}
                  </p>
                  <p className='text-gray-600 mt-2 italic'>
                    {dua.pronunciation}
                  </p>
                  <p className='text-gray-700 mt-1'>{dua.translation}</p>
                  <p className='text-sm text-gray-500 mt-2'>
                    <span className='font-semibold'>প্রেক্ষাপট:</span>{' '}
                    {dua.context}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    ({dua.reference})
                  </p>
                </div>
              ))}
            </div>
            {/* Evening Duas */}
            <div className='bg-indigo-100/50 border border-indigo-200 rounded-xl p-4'>
              <h4 className='font-semibold text-indigo-800 mb-3 text-lg'>
                সকাল-সন্ধ্যার দোয়া
              </h4>
              {islamicData.eveningDuas.map((dua, index) => (
                <div
                  key={index}
                  className='mb-4 last:mb-0 pt-4 border-t border-indigo-200 first:border-t-0 first:pt-0'
                >
                  <h5 className='font-semibold text-indigo-700 mb-2'>
                    {dua.title}
                  </h5>
                  <p className='text-lg text-right font-serif text-indigo-900'>
                    {dua.arabic}
                  </p>
                  <p className='text-gray-600 mt-2 italic'>
                    {dua.pronunciation}
                  </p>
                  <p className='text-gray-700 mt-1'>{dua.translation}</p>
                  <p className='text-sm text-red-600 mt-2'>
                    <span className='font-semibold'>ফজিলত:</span> {dua.benefit}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    ({dua.reference})
                  </p>
                </div>
              ))}
            </div>
            {/* Amols */}
            <div className='bg-sky-100/50 border border-sky-200 rounded-xl p-4'>
              <h4 className='font-semibold text-sky-800 mb-2 text-lg'>
                গর্ভাবস্থায় আমল
              </h4>
              <ul className='list-disc list-inside space-y-2 text-gray-700'>
                {islamicData.amols.map((amol, index) => (
                  <li key={index}>{amol}</li>
                ))}
              </ul>
            </div>
            {/* Hadith */}
            <div className='bg-orange-100/50 border border-orange-200 rounded-xl p-4 text-center'>
              <h4 className='font-semibold text-orange-800 mb-2 text-lg'>
                প্রাসঙ্গিক হাদিস
              </h4>
              <p className='text-gray-700 italic'>
                &quot;{islamicData.hadith.text}&quot;
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                ({islamicData.hadith.reference})
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='bg-pink-50 min-h-screen font-sans'>
      <div className='w-full max-w-md mx-auto bg-white shadow-xl rounded-b-2xl'>
        <div className='p-6 md:p-8 pb-4'>
          <div className='text-center'>
            <div className='flex justify-center items-center gap-2'>
              <HeartIcon />
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
                প্রেগন্যান্সি ট্র্যাকার
              </h1>
            </div>
            <p className='text-gray-500 mt-1'>
              আমাদের ছোট্ট অতিথির জন্য অপেক্ষা
            </p>
          </div>
        </div>

        <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200'>
          <div className='flex justify-center max-w-md mx-auto px-6 space-x-1 sm:space-x-2'>
            <TabButton tabName='home' label='হোম' />
            <TabButton tabName='weekly' label='সাপ্তাহিক তথ্য' />
            <TabButton tabName='tips' label='টিপস ও যত্ন' />
            <TabButton tabName='islamic' label='ইসলামিক করনীয়' />
          </div>
        </div>

        <div className='p-6 md:p-8'>{renderContent()}</div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
