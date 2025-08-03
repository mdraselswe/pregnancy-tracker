'use client'
import React, { useState, useEffect } from 'react'

// --- Helper Functions ---

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর করার ফাংশন
const toBengaliNumber = (num) => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(
    /[0-9]/g,
    (digit) => bengaliDigits[parseInt(digit)]
  )
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

// --- Main App Component ---
export default function App() {
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
  const calculateDetails = () => {
    // প্রদত্ত ডেটা অনুযায়ী তারিখ সেট করা
    const ultrasoundDate = new Date('2025-07-21T00:00:00')
    const gestationAtUltrasoundInDays = 6 * 7 + 4 // ৬ সপ্তাহ ৪ দিন = ৪৬ দিন
    const estimatedDueDate = new Date('2026-03-12T00:00:00')

    // গর্ভধারণের শুরুর আনুমানিক তারিখ গণনা
    const conceptionDate = new Date(ultrasoundDate)
    conceptionDate.setDate(
      ultrasoundDate.getDate() - gestationAtUltrasoundInDays
    )

    const today = new Date()

    // আজকের দিন পর্যন্ত মোট দিনের সংখ্যা গণনা
    const diffTime = today.getTime() - conceptionDate.getTime()
    const totalDaysElapsed = Math.max(
      0,
      Math.floor(diffTime / (1000 * 60 * 60 * 24))
    )

    // সপ্তাহ ও দিনে রূপান্তর
    const weeks = Math.floor(totalDaysElapsed / 7)
    const days = totalDaysElapsed % 7

    // মাস ও অবশিষ্ট দিনের গণনা (প্রদর্শনের জন্য)
    const displayMonths = Math.floor(totalDaysElapsed / 30)
    const displayRemainingDays = totalDaysElapsed % 30

    // ট্রাইমিস্টার গণনা
    let trimester = 1
    if (weeks >= 14 && weeks <= 27) {
      trimester = 2
    } else if (weeks > 27) {
      trimester = 3
    }

    // ডেলিভারি পর্যন্ত কাউন্টডাউন
    const countdownDiffTime = estimatedDueDate.getTime() - today.getTime()
    const countdownDays =
      countdownDiffTime > 0
        ? Math.ceil(countdownDiffTime / (1000 * 60 * 60 * 24))
        : 0

    // কাউন্টডাউনকে মাস ও দিনে ভাগ করা
    const countdownMonths = Math.floor(countdownDays / 30)
    const countdownRemainingDays = countdownDays % 30

    // প্রেগন্যান্সির অগ্রগতি (সাধারণত ৪০ সপ্তাহ বা ২৮০ দিন ধরা হয়)
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

  useEffect(() => {
    calculateDetails()
    // প্রতি মিনিটে ডেটা আপডেট করার জন্য একটি ইন্টারভাল সেট করা হলো
    const interval = setInterval(calculateDetails, 60000)

    // কম্পোনেন্ট আনমাউন্ট হলে ইন্টারভাল ক্লিয়ার করা হবে
    return () => clearInterval(interval)
  }, [])

  // --- UI Rendering ---
  return (
    <div className='bg-pink-50 min-h-screen flex items-center justify-center p-4 font-sans'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transform transition-all hover:shadow-2xl'>
        <div className='text-center'>
          <div className='flex justify-center items-center gap-2'>
            <HeartIcon />
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              প্রেগন্যান্সি ট্র্যাকার
            </h1>
          </div>
          <p className='text-gray-500 mt-1'>আমাদের ছোট্ট অতিথির জন্য অপেক্ষা</p>
        </div>

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
            <p>অথবা, মোট {toBengaliNumber(pregnancyDetails.totalDays)} দিন</p>
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
              (অথবা, {toBengaliNumber(pregnancyDetails.countdownMonths)} মাস ও{' '}
              {toBengaliNumber(pregnancyDetails.countdownRemainingDays)} দিন)
            </p>
            <p>সম্ভাব্য তারিখ: ১২ মার্চ, ২০২৬</p>
          </div>
        </div>

        {/* Progress Bar and Trimester */}
        <div>
          <div className='flex justify-between mb-1'>
            <span className='text-base font-medium text-gray-700'>অগ্রগতি</span>
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
            গর্ভাবস্থার সফর এখন{' '}
            <span className='font-bold text-purple-600'>
              {toBengaliNumber(pregnancyDetails.trimester)}ম
            </span>{' '}
            ধাপে রয়েছে।
          </p>
        </div>
      </div>
    </div>
  )
}
