'use client'
import { useEffect, useState } from 'react'

// --- Helper Functions ---
const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '০'
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(
    /[0-9]/g,
    (digit) => bengaliDigits[parseInt(digit)]
  )
}

// --- Data for Tabs (Remains the same) ---
const weeklyData = {
  1: {
    week: 1,
    baby_size_fruit: 'প্রযোজ্য নয়',
    baby_size_measurement: 'প্রযোজ্য নয়',
    baby_development:
      'আপনার শেষ মাসিকের প্রথম দিন থেকে গর্ভাবস্থার গণনা শুরু হয়। এই সপ্তাহে, আপনার শরীর ডিম্বস্ফোটনের জন্য প্রস্তুতি নিচ্ছে।',
    mother_symptoms: 'মাসিকের স্বাভাবিক লক্ষণসমূহ।',
    tip: 'স্বাস্থ্যকর জীবনযাপন শুরু করুন এবং প্রি-ন্যাটাল ভিটামিন (ফলিক অ্যাসিড) গ্রহণ করার কথা ভাবুন।',
  },
  2: {
    week: 2,
    baby_size_fruit: 'প্রযোজ্য নয়',
    baby_size_measurement: 'প্রযোজ্য নয়',
    baby_development:
      'এই সপ্তাহের শেষে ডিম্বস্ফোটন হতে পারে এবং শুক্রাণুর সাথে ডিম্বাণুর মিলন (নিষেক) ঘটতে পারে।',
    mother_symptoms:
      'ডিম্বস্ফোটনের লক্ষণ, যেমন শরীরের তাপমাত্রা সামান্য বৃদ্ধি পাওয়া।',
    tip: 'এটি গর্ভধারণের জন্য গুরুত্বপূর্ণ সময়।',
  },
  3: {
    week: 3,
    baby_size_fruit: 'একটি পপি বীজের মতো',
    baby_size_measurement: 'অত্যন্ত ক্ষুদ্র',
    baby_development:
      'নিষিক্ত ডিম্বাণুটি (জাইগোট) জরায়ুর দেয়ালে নিজেকে স্থাপন করে (ইমপ্লান্টেশন)। কোষ বিভাজন দ্রুত গতিতে চলতে থাকে।',
    mother_symptoms:
      'হালকা স্পটিং বা ইমপ্লান্টেশন ব্লিডিং হতে পারে, তবে সবাই এটি অনুভব করে না।',
    tip: 'অ্যালকোহল এবং ধূমপান থেকে সম্পূর্ণ বিরত থাকুন।',
  },
  4: {
    week: 4,
    baby_size_fruit: 'একটি পোস্তদানার মতো',
    baby_size_measurement: 'প্রায় ০.০৪ ইঞ্চি',
    baby_development:
      'অ্যামনিওটিক স্যাক এবং প্লাসেন্টা তৈরি হচ্ছে। ভ্রূণটি এখন তিনটি স্তরে বিভক্ত, যা থেকে অঙ্গ-প্রত্যঙ্গ তৈরি হবে।',
    mother_symptoms:
      'পিরিয়ড মিস হতে পারে। হোম প্রেগন্যান্সি টেস্টে পজিটিভ ফলাফল আসার সম্ভাবনা আছে।',
    tip: 'প্রেগন্যান্সি টেস্ট পজিটিভ হলে ডাক্তারের সাথে যোগাযোগ করে প্রথম সাক্ষাতের সময় নির্ধারণ করুন।',
  },
  5: {
    week: 5,
    baby_size_fruit: 'আপেল বীচির মতো',
    baby_size_measurement: 'প্রায় ০.১৩ ইঞ্চি',
    baby_development: 'মস্তিষ্ক, মেরুদণ্ড এবং হৃৎপিণ্ড তৈরি হতে শুরু করেছে।',
    mother_symptoms:
      'পিরিয়ড মিস হওয়া, স্তনে ব্যথা, ক্লান্তি এবং ঘন ঘন প্রস্রাব।',
    tip: 'এখনই প্রি-ন্যাটাল ভিটামিন (বিশেষ করে ফলিক অ্যাসিড) গ্রহণ শুরু করুন।',
  },
  6: {
    week: 6,
    baby_size_fruit: 'মটরশুঁটির আকারের',
    baby_size_measurement: 'প্রায় ০.২৫ ইঞ্চি',
    baby_development:
      'হৃৎপিণ্ড স্পন্দিত হতে শুরু করেছে এবং রক্ত সঞ্চালন করছে। নাক, মুখ এবং কানের গঠন শুরু হয়েছে।',
    mother_symptoms:
      'বমি বমি ভাব (মর্নিং সিকনেস) এবং ক্লান্তি আরও বাড়তে পারে।',
    tip: 'মর্নিং সিকনেস কমাতে আদা চা পান করতে পারেন এবং বারে বারে অল্প পরিমাণে খাবার খান।',
  },
  7: {
    week: 7,
    baby_size_fruit: 'একটি ব্লুবেরির আকারের',
    baby_size_measurement: 'প্রায় ০.৫১ ইঞ্চি',
    baby_development:
      'হাত ও পায়ের কুঁড়ি তৈরি হচ্ছে। মস্তিষ্ক দ্রুত বিকশিত হচ্ছে।',
    mother_symptoms: 'খাবারে অরুচি বা নতুন খাবারের প্রতি আগ্রহ তৈরি হতে পারে।',
    tip: 'আপনার শরীরকে শুনুন। যা খেতে ভালো লাগছে, পরিমিত পরিমাণে তাই খান।',
  },
  8: {
    week: 8,
    baby_size_fruit: 'একটি কিডনি বীনের আকারের',
    baby_size_measurement: 'প্রায় ০.৬৩ ইঞ্চি',
    baby_development:
      'চোখের পাতা, ঠোঁট এবং নাকের ডগা আরও স্পষ্ট হচ্ছে। শিশু এখন অল্প নড়াচড়া করতে পারে।',
    mother_symptoms: 'ব্রা আঁটসাঁট মনে হতে পারে এবং পেটে হালকা ব্যথা হতে পারে।',
    tip: 'আরামদায়ক এবং সহায়ক ব্রা পরিধান করুন।',
  },
  9: {
    week: 9,
    baby_size_fruit: 'একটি চেরির আকারের',
    baby_size_measurement: 'প্রায় ০.৯০ ইঞ্চি',
    baby_development:
      'সকল প্রধান অঙ্গ গঠিত হয়ে গেছে এবং এখন সেগুলো বিকশিত হতে থাকবে।',
    mother_symptoms: 'মেজাজের পরিবর্তন, ক্লান্তি এবং বমি ভাব থাকতে পারে।',
    tip: 'হালকা ব্যায়াম বা মেডিটেশন মেজাজ ভালো রাখতে সাহায্য করতে পারে।',
  },
  10: {
    week: 10,
    baby_size_fruit: 'একটি ছোট জলপাইয়ের আকারের',
    baby_size_measurement: 'প্রায় ১.২১ ইঞ্চি',
    baby_development:
      'হাতের আঙ্গুল এবং পায়ের পাতা আলাদা হতে শুরু করেছে। দাঁতের কুঁড়ি তৈরি হচ্ছে।',
    mother_symptoms: 'রক্ত সঞ্চালন বাড়ার কারণে শিরার রঙ গাঢ় হতে পারে।',
    tip: 'ডাক্তারের সাথে প্রথম আলট্রাসাউন্ডের সময় নিয়ে কথা বলুন।',
  },
  11: {
    week: 11,
    baby_size_fruit: 'একটি ডুমুরের আকারের',
    baby_size_measurement: 'প্রায় ১.৬১ ইঞ্চি',
    baby_development:
      'শিশু এখন হাত মুঠো করতে ও খুলতে পারে। জননাঙ্গ তৈরি হতে শুরু করেছে।',
    mother_symptoms:
      'পেট সামান্য স্ফীত হতে পারে। গ্যাস বা বদহজমের সমস্যা দেখা দিতে পারে।',
    tip: 'ফাইবারযুক্ত খাবার খান এবং পর্যাপ্ত পানি পান করুন।',
  },
  12: {
    week: 12,
    baby_size_fruit: 'একটি লেবুর আকারের',
    baby_size_measurement: 'প্রায় ২.১৩ ইঞ্চি',
    baby_development: 'শিশুর নখ তৈরি হচ্ছে। সে এখন হাই তুলতে পারে।',
    mother_symptoms: 'মাথাব্যথা হতে পারে এবং মাথা ঝিমঝিম করতে পারে।',
    tip: 'পর্যাপ্ত বিশ্রাম নিন এবং হঠাৎ করে অবস্থান পরিবর্তন করা থেকে বিরত থাকুন।',
  },
  13: {
    week: 13,
    baby_size_fruit: 'একটি মটরশুঁটি ছিমের আকারের',
    baby_size_measurement: 'প্রায় ২.৯১ ইঞ্চি',
    baby_development:
      'শিশুর মুখের অনন্য আঙ্গুলের ছাপ (ফিঙ্গারপ্রিন্ট) তৈরি হয়ে গেছে।',
    mother_symptoms:
      'প্রথম ট্রাইমেস্টারের শেষ, ক্লান্তি ও বমি ভাব কমার সম্ভাবনা।',
    tip: 'আপনার গর্ভাবস্থার খবরটি পরিবার ও বন্ধুদের সাথে শেয়ার করার জন্য এটি একটি ভালো সময়।',
  },
  14: {
    week: 14,
    baby_size_fruit: 'একটি পীচ ফলের আকারের',
    baby_size_measurement: 'প্রায় ৩.৪৩ ইঞ্চি',
    baby_development:
      'শিশু এখন ভ্রূকুটি করতে বা হাসতে পারে। তার ঘাড় লম্বা হচ্ছে।',
    mother_symptoms: 'শক্তি ফিরে আসতে শুরু করবে এবং ক্ষুধা বাড়বে।',
    tip: 'এখন হালকা ব্যায়াম শুরু করার জন্য চমৎকার সময়, ডাক্তারের সাথে কথা বলুন।',
  },
  15: {
    week: 15,
    baby_size_fruit: 'একটি আপেলের আকারের',
    baby_size_measurement: 'প্রায় ৪.০১ ইঞ্চি',
    baby_development:
      'চোখ এখন আলোর প্রতি সংবেদনশীল। শিশু অ্যামনিওটিক ফ্লুইড শ্বাস-প্রশ্বাসের মতো গ্রহণ করছে।',
    mother_symptoms: 'নাক বন্ধ হওয়া বা নাক থেকে রক্ত পড়ার মতো সমস্যা হতে পারে।',
    tip: 'ঘরে হিউমিডিফায়ার ব্যবহার করতে পারেন।',
  },
  16: {
    week: 16,
    baby_size_fruit: 'একটি অ্যাভোকাডোর আকারের',
    baby_size_measurement: 'প্রায় ৪.৫৭ ইঞ্চি',
    baby_development:
      'শিশুর কঙ্কালতন্ত্র আরও শক্ত হচ্ছে। সে এখন মাথা সোজা রাখতে পারে।',
    mother_symptoms:
      'আপনি প্রথমবারের মতো শিশুর হালকা নড়াচড়া (fluttering) অনুভব করতে পারেন।',
    tip: 'আরামদায়ক জুতো পরুন, কারণ পায়ের আকার সামান্য বাড়তে পারে।',
  },
  17: {
    week: 17,
    baby_size_fruit: 'একটি শালগমের আকারের',
    baby_size_measurement: 'প্রায় ৫.১২ ইঞ্চি',
    baby_development:
      'শিশুর শরীরে চর্বি জমতে শুরু করেছে, যা তাকে উষ্ণ রাখতে সাহায্য করবে।',
    mother_symptoms: 'পেটের চামড়ায় চুলকানি হতে পারে।',
    tip: 'চুলকানি কমাতে ময়েশ্চারাইজার বা লোশন ব্যবহার করুন।',
  },
  18: {
    week: 18,
    baby_size_fruit: 'একটি মিষ্টি আলুর আকারের',
    baby_size_measurement: 'প্রায় ৫.৫৯ ইঞ্চি',
    baby_development:
      'শিশুর কান এখন সঠিক স্থানে এবং সে বাইরের শব্দ শুনতে শুরু করেছে।',
    mother_symptoms: 'পিঠে ব্যথা হতে পারে এবং ঘুমাতে অসুবিধা হতে পারে।',
    tip: 'শিশুর সাথে কথা বলুন বা তাকে গান শোনান। ঘুমানোর সময় পাশে বালিশ ব্যবহার করুন।',
  },
  19: {
    week: 19,
    baby_size_fruit: 'একটি আমের আকারের',
    baby_size_measurement: 'প্রায় ৬.০১ ইঞ্চি',
    baby_development:
      'শিশুর ত্বকে ভার্নিক্স কেসিওসা নামক একটি সাদা ও পিচ্ছিল স্তর তৈরি হচ্ছে।',
    mother_symptoms: 'পেটের চারপাশে লিগামেন্টে खिंचाव অনুভব করতে পারেন।',
    tip: 'হঠাৎ নড়াচড়া এড়িয়ে চলুন।',
  },
  20: {
    week: 20,
    baby_size_fruit: 'একটি কলার আকারের',
    baby_size_measurement: 'প্রায় ৬.৪৬ ইঞ্চি',
    baby_development:
      'আপনি এখন আলট্রাসাউন্ডে শিশুর লিঙ্গ জানতে পারার সম্ভাবনা আছে।',
    mother_symptoms: 'পেটের আকার দৃশ্যমান হবে এবং নাভি বাইরের দিকে আসতে পারে।',
    tip: 'এটি গর্ভাবস্থার অর্ধেক পথ! নিজের জন্য ছোটখাটো একটি সেলিব্রেশন করতে পারেন।',
  },
  21: {
    week: 21,
    baby_size_fruit: 'একটি গাজরের আকারের',
    baby_size_measurement: 'প্রায় ১০.৫১ ইঞ্চি',
    baby_development:
      'শিশুর স্বাদ কোরক তৈরি হচ্ছে এবং সে এখন বিভিন্ন স্বাদ বুঝতে পারে।',
    mother_symptoms: 'পায়ে পানি আসতে পারে বা পা ফুলতে পারে।',
    tip: 'দীর্ঘক্ষণ দাঁড়িয়ে বা বসে থাকবেন না এবং পা উঁচু করে বিশ্রাম নিন।',
  },
  22: {
    week: 22,
    baby_size_fruit: 'একটি পেঁপের আকারের',
    baby_size_measurement: 'প্রায় ১০.৯৪ ইঞ্চি',
    baby_development: 'শিশুর ঠোঁট, ভ্রূ এবং চোখের পাতা আরও স্পষ্ট হয়েছে।',
    mother_symptoms: 'ত্বকে স্ট্রেচ মার্কস দেখা যেতে পারে।',
    tip: 'স্ট্রেচ মার্কস কমাতে তেল বা বিশেষ ক্রিম ব্যবহার করতে পারেন।',
  },
  23: {
    week: 23,
    baby_size_fruit: 'একটি বড় আকারের বেগুনের মতো',
    baby_size_measurement: 'প্রায় ১১.৩৮ ইঞ্চি',
    baby_development:
      'ফুসফুসের রক্তনালীগুলো বিকশিত হচ্ছে। শিশু এখন হেঁচকি তুলতে পারে।',
    mother_symptoms: 'মাড়িতে রক্তক্ষরণ বা মাড়ি ফুলে যাওয়ার সমস্যা হতে পারে।',
    tip: 'নরম ব্রাশ ব্যবহার করুন এবং দাঁতের যত্ন নিন।',
  },
  24: {
    week: 24,
    baby_size_fruit: 'একটি ভুট্টার মতো',
    baby_size_measurement: 'প্রায় ১১.৮১ ইঞ্চি',
    baby_development:
      'শিশুর ত্বক এখনও পাতলা এবং স্বচ্ছ, যার মধ্য দিয়ে রক্তনালী দেখা যায়।',
    mother_symptoms: 'চোখ শুষ্ক বা সংবেদনশীল মনে হতে পারে।',
    tip: 'ডাক্তারের সাথে কথা বলে নিরাপদ আই ড্রপ ব্যবহার করতে পারেন।',
  },
  25: {
    week: 25,
    baby_size_fruit: 'একটি ফুলকপির আকারের',
    baby_size_measurement: 'প্রায় ১৩.৬ ইঞ্চি',
    baby_development:
      'শিশুর চুলে রঙ আসতে শুরু করেছে। সে এখন আপনার কণ্ঠস্বর চিনতে পারে।',
    mother_symptoms: 'চুল আগের চেয়ে ঘন এবং উজ্জ্বল মনে হতে পারে।',
    tip: 'নিয়মিত শিশুর সাথে কথা বলুন, এটি আপনাদের বন্ধন দৃঢ় করবে।',
  },
  26: {
    week: 26,
    baby_size_fruit: 'একটি লেটুস পাতার মতো',
    baby_size_measurement: 'প্রায় ১৪ ইঞ্চি',
    baby_development: 'শিশু এখন চোখ খুলতে ও বন্ধ করতে পারে।',
    mother_symptoms: 'রক্তচাপ সামান্য বাড়তে পারে।',
    tip: 'নিয়মিত ডাক্তারের কাছে চেকআপ করান এবং রক্তচাপ পর্যবেক্ষণ করুন।',
  },
  27: {
    week: 27,
    baby_size_fruit: 'একটি বাঁধাকপির আকারের',
    baby_size_measurement: 'প্রায় ১৪.৪ ইঞ্চি',
    baby_development:
      'শিশুর মস্তিষ্ক খুব সক্রিয়। তার ঘুমের একটি নির্দিষ্ট চক্র তৈরি হয়েছে।',
    mother_symptoms: 'পায়ে খিল ধরা বা restless leg syndrome হতে পারে।',
    tip: 'ঘুমানোর আগে হালকা স্ট্রেচিং করুন এবং ম্যাগনেসিয়াম সমৃদ্ধ খাবার খান।',
  },
  28: {
    week: 28,
    baby_size_fruit: 'একটি বড় বেগুনের আকারের',
    baby_size_measurement: 'প্রায় ১৪.৮ ইঞ্চি',
    baby_development: 'তৃতীয় ট্রাইমেস্টারের শুরু। শিশু এখন স্বপ্নও দেখতে পারে!',
    mother_symptoms: 'পিঠে ব্যথা, শ্বাসকষ্ট এবং বদহজমের মতো সমস্যা বাড়তে পারে।',
    tip: 'হাসপাতালের ব্যাগ গোছানো শুরু করার কথা ভাবতে পারেন।',
  },
  29: {
    week: 29,
    baby_size_fruit: 'একটি বাটারনাট স্কোয়াশের মতো',
    baby_size_measurement: 'প্রায় ১৫.২ ইঞ্চি',
    baby_development:
      'শিশুর হাড় শক্ত হচ্ছে, তাই আপনার প্রচুর ক্যালসিয়াম প্রয়োজন।',
    mother_symptoms: 'কোষ্ঠকাঠিন্য এবং অর্শের সমস্যা দেখা দিতে পারে।',
    tip: 'প্রচুর পরিমাণে ফাইবারযুক্ত খাবার ও পানি পান করুন।',
  },
  30: {
    week: 30,
    baby_size_fruit: 'একটি বড় বাঁধাকপির আকারের',
    baby_size_measurement: 'প্রায় ১৫.৭ ইঞ্চি',
    baby_development: 'শিশুর চোখে এখন দৃষ্টিশক্তি তৈরি হচ্ছে।',
    mother_symptoms:
      'ক্লান্তি আবার ফিরে আসতে পারে এবং ঘুমাতে অসুবিধা হতে পারে।',
    tip: 'বুকের দুধ খাওয়ানোর পরিকল্পনা থাকলে প্রস্তুতি নেওয়া শুরু করতে পারেন।',
  },
  31: {
    week: 31,
    baby_size_fruit: 'একটি নারকেলের আকারের',
    baby_size_measurement: 'প্রায় ১৬.২ ইঞ্চি',
    baby_development:
      'শিশুর কেন্দ্রীয় স্নায়ুতন্ত্র বিকশিত হচ্ছে এবং সে শরীরের তাপমাত্রা নিয়ন্ত্রণ করতে পারে।',
    mother_symptoms:
      'ঘন ঘন Braxton Hicks contractions (প্রস্তুতিমূলক সংকোচন) হতে পারে।',
    tip: 'প্রসব বেদনা এবং প্রস্তুতিমূলক সংকোচনের মধ্যে পার্থক্য জেনে নিন।',
  },
  32: {
    week: 32,
    baby_size_fruit: 'একটি ছোট চাইনিজ বাঁধাকপির মতো',
    baby_size_measurement: 'প্রায় ১৬.৭ ইঞ্চি',
    baby_development: 'শিশুর নখ এখন পুরোপুরি তৈরি।',
    mother_symptoms: 'পেটের আকার বাড়ার কারণে শ্বাস নিতে কষ্ট হতে পারে।',
    tip: 'সোজা হয়ে বসুন এবং ঘুমানোর সময় মাথা উঁচু রাখতে অতিরিক্ত বালিশ ব্যবহার করুন।',
  },
  33: {
    week: 33,
    baby_size_fruit: 'একটি আনারসের আকারের',
    baby_size_measurement: 'প্রায় ১৭.২ ইঞ্চি',
    baby_development:
      'শিশুর শরীরে রোগ প্রতিরোধ ক্ষমতা তৈরি হচ্ছে, যা সে আপনার কাছ থেকে পাচ্ছে।',
    mother_symptoms:
      'পেটের চামড়া টানটান হওয়ার কারণে নাভির চারপাশে ব্যথা হতে পারে।',
    tip: 'ডাক্তারের সাথে কত ঘন ঘন দেখা করতে হবে তা জেনে নিন।',
  },
  34: {
    week: 34,
    baby_size_fruit: 'একটি ক্যান্টালোপ ফলের আকারের',
    baby_size_measurement: 'প্রায় ১৭.৭ ইঞ্চি',
    baby_development: 'শিশুর ফুসফুস প্রায় সম্পূর্ণ তৈরি।',
    mother_symptoms:
      'দৃষ্টি ঝাপসা হতে পারে, তবে এটি সাধারণত প্রসবের পর ঠিক হয়ে যায়।',
    tip: 'প্রসবের লক্ষণগুলো সম্পর্কে ভালোভাবে জেনে নিন।',
  },
  35: {
    week: 35,
    baby_size_fruit: 'একটি হানিডিউ মেলনের আকারের',
    baby_size_measurement: 'প্রায় ১৮.২ ইঞ্চি',
    baby_development:
      'জায়গা কম হওয়ার কারণে শিশুর নড়াচড়া কমে আসতে পারে, তবে তার শক্তি বাড়বে।',
    mother_symptoms:
      'ঘন ঘন প্রস্রাবের চাপ আসবে কারণ শিশু এখন পেলভিসের গভীরে নেমে আসছে।',
    tip: 'শিশুর নড়াচড়া পর্যবেক্ষণ করুন। অস্বাভাবিক কিছু মনে হলে ডাক্তারকে জানান।',
  },
  36: {
    week: 36,
    baby_size_fruit: 'একটি বড় লেটুস পাতার মতো',
    baby_size_measurement: 'প্রায় ১৮.৭ ইঞ্চি',
    baby_development:
      'শিশু এখন জন্মের জন্য মাথা নিচের দিকে করে নিয়েছে (cephalic presentation)।',
    mother_symptoms: 'পেট নিচের দিকে নেমে যাওয়ায় শ্বাস নেওয়া সহজ হতে পারে।',
    tip: 'আপনার হাসপাতালের ব্যাগ চূড়ান্তভাবে গুছিয়ে নিন এবং প্রয়োজনীয় ফোন নম্বর হাতের কাছে রাখুন।',
  },
  37: {
    week: 37,
    baby_size_fruit: 'একটি সুইস চার্ডের আকারের',
    baby_size_measurement: 'প্রায় ১৯.১ ইঞ্চি',
    baby_development:
      'শিশু এখন পূর্ণ মেয়াদী (full-term)। সে যেকোনো সময় জন্ম নিতে পারে।',
    mother_symptoms: 'যোনিপথে স্রাব বাড়তে পারে।',
    tip: 'বিশ্রাম নিন এবং বড় দিনের জন্য শক্তি সঞ্চয় করুন।',
  },
  38: {
    week: 38,
    baby_size_fruit: 'একটি কুমড়োর ডাঁটার আকারের',
    baby_size_measurement: 'প্রায় ১৯.৬ ইঞ্চি',
    baby_development: 'শিশুর মস্তিষ্কের বিকাশ অব্যাহত রয়েছে।',
    mother_symptoms: 'অস্থিরতা এবং অধৈর্য বোধ হতে পারে।',
    tip: 'হালকা হাঁটাচলা করুন এবং নিজেকে ব্যস্ত রাখুন।',
  },
  39: {
    week: 39,
    baby_size_fruit: 'একটি ছোট তরমুজের আকারের',
    baby_size_measurement: 'প্রায় ২০ ইঞ্চি',
    baby_development:
      'শিশুর শরীরে চর্বির স্তর বাড়ছে, যা তাকে জন্মের পর উষ্ণ থাকতে সাহায্য করবে।',
    mother_symptoms: 'প্রসবের মিথ্যা লক্ষণ (false labor) দেখা দিতে পারে।',
    tip: 'ধৈর্য ধরুন। আপনার শিশু শীঘ্রই আসছে!',
  },
  40: {
    week: 40,
    baby_size_fruit: 'একটি ছোট কুমড়োর আকারের',
    baby_size_measurement: 'প্রায় ২০.২ ইঞ্চি',
    baby_development:
      'আপনার শিশু এখন আপনার সাথে দেখা করার জন্য সম্পূর্ণ প্রস্তুত।',
    mother_symptoms: 'শারীরিক ও মানসিকভাবে আপনি এখন চূড়ান্ত পর্যায়ে।',
    tip: 'শুভকামনা! আপনার জীবনের সেরা মুহূর্তটি এখন খুবই নিকটে।',
  },
}

const detailedTipsData = {
  title: 'খাদ্যাভ্যাস ও যত্ন',
  generalAdvice: [
    'পর্যাপ্ত পরিমাণে পানি পান করুন (দৈনিক ৮-১০ গ্লাস)। এটি শরীরকে সতেজ রাখে এবং কোষ্ঠকাঠিন্য দূর করে।',
    'হালকা ব্যায়াম বা হাঁটাচলা করুন, তবে অবশ্যই ডাক্তারের পরামর্শ নিয়ে।',
    'মানসিক চাপমুক্ত থাকুন, পর্যাপ্ত ঘুমান এবং বিশ্রাম নিন।',
    'ভারী জিনিস তোলা বা পেটে চাপ লাগে এমন কাজ থেকে বিরত থাকুন।',
  ],
  categories: [
    {
      categoryName: 'ফলমূল',
      items: [
        {
          name: 'কলা',
          benefit:
            'পটাশিয়াম ও ভিটামিন বি৬ সমৃদ্ধ, যা মর্নিং সিকনেস কমাতে সাহায্য করে এবং শক্তি যোগায়।',
          timing: 'সারা দিনই খাওয়া যায়, তবে সকালে খেলে বেশি উপকার।',
          status: 'recommended',
        },
        {
          name: 'কমলা ও মালটা',
          benefit:
            'ভিটামিন সি ও ফোলেট এর চমৎকার উৎস। রোগ প্রতিরোধ ক্ষমতা বাড়ায় এবং শিশুর জন্মগত ত্রুটি রোধ করে।',
          timing: 'সকালের নাস্তার পর বা বিকেলে খাওয়া ভালো।',
          status: 'recommended',
        },
        {
          name: 'আপেল',
          benefit:
            'ফাইবার ও অ্যান্টিঅক্সিডেন্টে ভরপুর। হজমে সাহায্য করে এবং রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
          timing: 'সকালের নাস্তায় বা বিকেলে খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'পেয়ারা',
          benefit:
            'ভিটামিন সি-তে ভরপুর, যা কমলালেবুর চেয়েও বেশি। এটি রোগ প্রতিরোধ ক্ষমতা বাড়াতে এবং রক্তচাপ নিয়ন্ত্রণে সাহায্য করে।',
          timing: 'দিনের যেকোনো সময় খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'আমড়া',
          benefit:
            'ভিটামিন সি এবং আয়রনের ভালো উৎস। এটি হজমে সাহায্য করে এবং রুচি বাড়ায়।',
          timing: 'পরিমিত পরিমাণে খাওয়া উচিত।',
          status: 'recommended',
        },
        {
          name: 'বেদানা',
          benefit:
            'আয়রন, ভিটামিন কে এবং ফোলেটের ভালো উৎস। রক্তস্বল্পতা দূর করতে সাহায্য করে।',
          timing: 'সকালের দিকে খাওয়া উত্তম।',
          status: 'recommended',
        },
        {
          name: 'অ্যাভোকাডো',
          benefit:
            'স্বাস্থ্যকর ফ্যাট, ফোলেট ও পটাশিয়ামে ভরপুর। শিশুর মস্তিষ্ক ও টিস্যু গঠনে সাহায্য করে।',
          timing: 'সকালের নাস্তায় বা সালাদে খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'তরমুজ',
          benefit:
            'পানিতে ভরপুর, যা শরীরকে হাইড্রেটেড রাখে। লাইকোপিন সমৃদ্ধ, যা প্রি-এক্লাম্পসিয়ার ঝুঁকি কমায়।',
          timing: 'পরিমিত পরিমাণে খাওয়া উচিত, কারণ এতে চিনির পরিমাণ বেশি।',
          status: 'recommended',
        },
        {
          name: 'আম',
          benefit: 'ভিটামিন এ ও সি এর ভালো উৎস।',
          timing:
            'পাকা আম পরিমিত পরিমাণে খাওয়া যাবে। অতিরিক্ত খেলে রক্তে শর্করার মাত্রা বাড়তে পারে।',
          status: 'recommended',
        },
        {
          name: 'জাম ও বেরি (স্ট্রবেরি, ব্লুবেরি)',
          benefit:
            'অ্যান্টিঅক্সিডেন্ট, ভিটামিন সি ও ফাইবারে ভরপুর। শিশুর কোষকে ক্ষতির হাত থেকে বাঁচায়।',
          timing: 'সকালের নাস্তায় বা স্ন্যাকস হিসেবে চমৎকার।',
          status: 'recommended',
        },
        {
          name: 'খেজুর',
          benefit:
            'প্রাকৃতিক চিনি, ফাইবার, আয়রন ও বিভিন্ন খনিজ পদার্থের দারুণ উৎস। শক্তি যোগায় এবং কোষ্ঠকাঠিন্য দূর করে।',
          timing: 'প্রতিদিন ২-৩টি খাওয়া যেতে পারে।',
          status: 'recommended',
        },
        {
          name: 'কিসমিস',
          benefit: 'আয়রন ও ফাইবারের ভালো উৎস। রক্তস্বল্পতা পূরণে সাহায্য করে।',
          timing:
            'অতিরিক্ত চিনি থাকার কারণে পরিমিত পরিমাণে (এক মুঠোর কম) খাওয়া উচিত।',
          status: 'recommended',
        },
        {
          name: 'আনারস',
          benefit:
            'ভিটামিন সি সমৃদ্ধ হলেও এতে থাকা ব্রোমেলিন জরায়ুর সংকোচন ঘটাতে পারে।',
          timing:
            'প্রথম তিন মাস এড়িয়ে চলা উত্তম। এরপর পরিমিত পরিমাণে খাওয়া যেতে পারে, তবে ডাক্তারের পরামর্শ নিন।',
          status: 'caution',
        },
        {
          name: 'পেঁপে',
          benefit:
            'পাকা পেঁপে ভিটামিনে ভরপুর, তবে কাঁচা বা আধা-পাকা পেঁপেতে থাকা ল্যাটেক্স জরায়ুর সংকোচন ঘটাতে পারে।',
          timing:
            'কাঁচা বা আধা-পাকা পেঁপে সম্পূর্ণ এড়িয়ে চলুন। পাকা পেঁপে খাওয়া নিরাপদ।',
          status: 'caution',
        },
      ],
    },
    {
      categoryName: 'শাক-সবজি',
      items: [
        {
          name: 'পালং শাক ও সবুজ শাক',
          benefit:
            'ফলিক অ্যাসিড, আয়রন ও ক্যালসিয়ামের দারুণ উৎস। রক্তস্বল্পতা দূর করে ও শিশুর বিকাশে সাহায্য করে।',
          timing: 'ভালোভাবে ধুয়ে ও রান্না করে খেতে হবে।',
          status: 'recommended',
        },
        {
          name: 'মিষ্টি আলু',
          benefit:
            'বিটা-ক্যারোটিন (ভিটামিন এ) সমৃদ্ধ, যা শিশুর কোষ ও দৃষ্টিশক্তির বিকাশের জন্য জরুরি।',
          timing: 'সিদ্ধ বা বেক করে খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'ব্রকলি',
          benefit:
            'ভিটামিন সি, কে, ফাইবার ও অ্যান্টিঅক্সিডেন্টে ভরপুর। কোষ্ঠকাঠিন্য দূর করে ও রোগ প্রতিরোধ করে।',
          timing: 'ভালোভাবে রান্না করে খেতে হবে।',
          status: 'recommended',
        },
        {
          name: 'গাজর',
          benefit:
            'বিটা-ক্যারোটিন (ভিটামিন এ) এর চমৎকার উৎস, যা শিশুর চোখ, ত্বক ও হাড়ের বিকাশে জরুরি।',
          timing: 'ভালোভাবে ধুয়ে, রান্না করে বা সালাদে খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'টমেটো',
          benefit:
            'ভিটামিন সি ও লাইকোপিন সমৃদ্ধ। এটি একটি শক্তিশালী অ্যান্টিঅক্সিডেন্ট।',
          timing: 'রান্না করে খেলে এর পুষ্টিগুণ বাড়ে।',
          status: 'recommended',
        },
        {
          name: 'ক্যাপসিকাম (লাল)',
          benefit: 'ভিটামিন সি এবং এ-তে ভরপুর, যা রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
          timing: 'সালাদ বা রান্নায় ব্যবহার করা যায়।',
          status: 'recommended',
        },
        {
          name: 'শসা',
          benefit: 'পানিতে ভরপুর, শরীরকে সতেজ ও হাইড্রেটেড রাখতে সাহায্য করে।',
          timing: 'দিনের যেকোনো সময় খাওয়া যায়।',
          status: 'recommended',
        },
      ],
    },
    {
      categoryName: 'প্রোটিন ও দুগ্ধজাত খাবার',
      items: [
        {
          name: 'দুধ',
          benefit:
            'ক্যালসিয়াম, প্রোটিন এবং ভিটামিন ডি-এর সর্বোত্তম উৎস। মা ও শিশুর হাড় গঠনে অপরিহার্য।',
          timing: 'প্রতিদিন ১-২ গ্লাস পাস্তুরিত দুধ পান করা উচিত।',
          status: 'recommended',
        },
        {
          name: 'ডিম',
          benefit:
            'উচ্চ মানের প্রোটিন, কোলিন ও ভিটামিন ডি এর উৎস। শিশুর মস্তিষ্ক ও সার্বিক বিকাশের জন্য অপরিহার্য।',
          timing: 'অবশ্যই সম্পূর্ণ সিদ্ধ করে খেতে হবে। কাঁচা বা আধা-সিদ্ধ নয়।',
          status: 'recommended',
        },
        {
          name: 'মুরগির মাংস',
          benefit:
            'চর্বিহীন প্রোটিনের দারুণ উৎস, যা শিশুর কোষ ও পেশী গঠনে জরুরি।',
          timing: 'অবশ্যই ভালোভাবে সিদ্ধ করে খেতে হবে।',
          status: 'recommended',
        },
        {
          name: 'ডাল ও শিম',
          benefit: 'উদ্ভিজ্জ প্রোটিন, ফাইবার, আয়রন ও ফোলেটের সেরা উৎস।',
          timing: 'প্রতিদিনের খাদ্যতালিকায় রাখা উচিত।',
          status: 'recommended',
        },
        {
          name: 'দই',
          benefit:
            'প্রোবায়োটিক ও ক্যালসিয়ামের চমৎকার উৎস। হজমে সাহায্য করে এবং হাড় মজবুত করে।',
          timing: 'দিনের যেকোনো সময় খাওয়া যায়।',
          status: 'recommended',
        },
        {
          name: 'ছোট মাছ',
          benefit:
            'ক্যালসিয়াম ও ওমেগা-৩ ফ্যাটি অ্যাসিডের ভালো উৎস, যা শিশুর মস্তিষ্ক বিকাশে সাহায্য করে।',
          timing: 'ভালোভাবে রান্না করে খেতে হবে।',
          status: 'recommended',
        },
        {
          name: 'সামুদ্রিক মাছ (স্যামন, সার্ডিন)',
          benefit:
            'ওমেগা-৩ ফ্যাটি অ্যাসিড (DHA) এর সেরা উৎস, যা শিশুর মস্তিষ্ক ও চোখের বিকাশে অপরিহার্য।',
          timing:
            'সপ্তাহে ২ বার পরিমিত পরিমাণে খাওয়া নিরাপদ। পারদযুক্ত মাছ এড়িয়ে চলতে হবে।',
          status: 'recommended',
        },
        {
          name: 'বাদাম (আমন্ড, আখরোট)',
          benefit: 'স্বাস্থ্যকর ফ্যাট, প্রোটিন, ফাইবার ও ম্যাগনেসিয়াম সমৃদ্ধ।',
          timing: 'প্রতিদিন এক মুঠো পরিমাণে খাওয়া যেতে পারে।',
          status: 'recommended',
        },
        {
          name: 'কাঁচা দুধের পনির',
          benefit:
            'অপাস্তুরিত বা কাঁচা দুধের তৈরি নরম পনিরে লিস্টেরিয়া ব্যাকটেরিয়া থাকতে পারে।',
          timing: 'সম্পূর্ণরূপে এড়িয়ে চলুন। পাস্তুরিত দুধের পনির নিরাপদ।',
          status: 'caution',
        },
      ],
    },
    {
      categoryName: 'শস্য ও কার্বোহাইড্রেট',
      items: [
        {
          name: 'লাল চালের ভাত/আটার রুটি',
          benefit:
            'জটিল কার্বোহাইড্রেট, ফাইবার ও আয়রন সমৃদ্ধ। দীর্ঘ সময় শক্তি যোগায় এবং কোষ্ঠকাঠিন্য দূর করে।',
          timing: 'প্রধান খাবার হিসেবে গ্রহণ করা উচিত।',
          status: 'recommended',
        },
        {
          name: 'ওটস',
          benefit:
            'ফাইবার ও কমপ্লেক্স কার্বোহাইড্রেটে ভরপুর। শক্তি যোগায় এবং রক্তে শর্করার মাত্রা স্থিতিশীল রাখে।',
          timing: 'সকালের নাস্তার জন্য চমৎকার।',
          status: 'recommended',
        },
      ],
    },
    {
      categoryName: 'পানীয় ও অন্যান্য সতর্কতা',
      items: [
        {
          name: 'অতিরিক্ত ক্যাফেইন',
          benefit: 'চা, কফি, কোমল পানীয়, এনার্জি ড্রিংকস।',
          timing:
            'অতিরিক্ত গ্রহণে (দৈনিক ২০০ মি.গ্রা. এর বেশি) গর্ভপাত বা কম ওজনের শিশু জন্মের ঝুঁকি থাকে। ডাক্তারের পরামর্শ অনুযায়ী সীমিত পরিমাণে পান করুন।',
          status: 'caution',
        },
        {
          name: 'অ্যালকোহল',
          benefit:
            'যেকোনো প্রকার অ্যালকোহল শিশুর শারীরিক ও মানসিক বিকাশে মারাত্মক ক্ষতি করতে পারে।',
          timing: 'সম্পূর্ণরূপে বর্জনীয়।',
          status: 'caution',
        },
        {
          name: 'প্রক্রিয়াজাত খাবার',
          benefit:
            'চিপস, ফাস্ট ফুড, প্যাকেটজাত জুস। এগুলোতে অতিরিক্ত লবণ, চিনি ও অস্বাস্থ্যকর ফ্যাট থাকে।',
          timing: 'যতটা সম্ভব এড়িয়ে চলুন।',
          status: 'caution',
        },
        {
          name: 'অসিদ্ধ বা কাঁচা খাবার',
          benefit: 'কাঁচা ডিম, আধা-সিদ্ধ মাংস/মাছ (যেমন সুশি)।',
          timing:
            'সালমোনেলা বা লিস্টেরিয়ার মতো ব্যাকটেরিয়া সংক্রমণের ঝুঁকি বাড়ায়, যা গর্ভপাত বা শিশুর মারাত্মক ক্ষতি করতে পারে।',
          status: 'caution',
        },
      ],
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
        'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّnā وَتَقَبَّلْ دُعَاءِ',
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
        'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّমِيعُ الْعَلِيمُ',
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
const CautionIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-yellow-500'
  >
    <path d='m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'></path>
    <line x1='12' x2='12' y1='9' y2='13'></line>
    <line x1='12' x2='12.01' y1='17' y2='17'></line>
  </svg>
)
const ResetIcon = () => (
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
    className='text-gray-500 hover:text-red-500 transition-colors'
  >
    <polyline points='23 4 23 10 17 10'></polyline>
    <polyline points='1 20 1 14 7 14'></polyline>
    <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'></path>
  </svg>
)

// --- DataInputFormComponent ---
const DataInputForm = ({ onDataSave }) => {
  const [method, setMethod] = useState('lmp') // 'lmp' or 'ultrasound'
  const [lmpDate, setLmpDate] = useState('')
  const [ultrasoundDate, setUltrasoundDate] = useState('')
  const [weeks, setWeeks] = useState('')
  const [days, setDays] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    let pregnancyStartDate
    let estimatedDueDate

    try {
      if (method === 'lmp') {
        if (!lmpDate) {
          setError('অনুগ্রহ করে শেষ মাসিকের প্রথম দিনটি নির্বাচন করুন।')
          return
        }
        const lmp = new Date(lmpDate)
        lmp.setHours(0, 0, 0, 0)
        pregnancyStartDate = new Date(lmp)
        estimatedDueDate = new Date(lmp)
        estimatedDueDate.setDate(lmp.getDate() + 280)
      } else {
        if (!ultrasoundDate || !weeks || !days) {
          setError('অনুগ্রহ করে আলট্রাসাউন্ডের সকল তথ্য পূরণ করুন।')
          return
        }
        const uDate = new Date(ultrasoundDate)
        uDate.setHours(0, 0, 0, 0)
        const gestationInDays = parseInt(weeks) * 7 + parseInt(days)
        pregnancyStartDate = new Date(uDate)
        pregnancyStartDate.setDate(uDate.getDate() - gestationInDays)
        estimatedDueDate = new Date(pregnancyStartDate)
        estimatedDueDate.setDate(pregnancyStartDate.getDate() + 280)
      }

      const userData = {
        pregnancyStartDate: pregnancyStartDate.toISOString(),
        estimatedDueDate: estimatedDueDate.toISOString(),
      }

      localStorage.setItem('pregnancyUserData', JSON.stringify(userData))
      onDataSave(userData)
    } catch (err) {
      setError('তারিখ গণনায় সমস্যা হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।')
    }
  }

  return (
    <div className='bg-pink-50 min-h-screen flex items-center justify-center p-4 font-sans'>
      <div className='w-full max-w-md bg-white md:rounded-2xl md:shadow-xl p-8 space-y-6 animate-fade-in'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800'>স্বাগতম!</h1>
          <p className='text-gray-500 mt-2'>
            আপনার প্রেগন্যান্সি ট্র্যাক করতে, অনুগ্রহ করে নিচের তথ্যগুলো দিন।
          </p>
        </div>

        <div className='flex bg-gray-100 rounded-full p-1'>
          <button
            onClick={() => setMethod('lmp')}
            className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
              method === 'lmp' ? 'bg-pink-500 text-white' : 'text-gray-600'
            }`}
          >
            শেষ মাসিক (LMP)
          </button>
          <button
            onClick={() => setMethod('ultrasound')}
            className={`w-1/2 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
              method === 'ultrasound'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600'
            }`}
          >
            আলট্রাসাউন্ড
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {method === 'lmp' ? (
            <div>
              <label
                htmlFor='lmpDate'
                className='block text-sm font-medium text-gray-700'
              >
                শেষ মাসিকের প্রথম দিন
              </label>
              <input
                type='date'
                id='lmpDate'
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${
                  !lmpDate ? 'text-gray-500' : 'text-gray-900'
                }`}
              />
            </div>
          ) : (
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='ultrasoundDate'
                  className='block text-sm font-medium text-gray-700'
                >
                  আলট্রাসাউন্ডের তারিখ
                </label>
                <input
                  type='date'
                  id='ultrasoundDate'
                  value={ultrasoundDate}
                  onChange={(e) => setUltrasoundDate(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 ${
                    !ultrasoundDate ? 'text-gray-500' : 'text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  রিপোর্ট অনুযায়ী বাচ্চার বয়স
                </label>
                <div className='flex gap-4 mt-1'>
                  <input
                    type='number'
                    placeholder='সপ্তাহ'
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    className='w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 placeholder-gray-600 text-gray-900'
                  />
                  <input
                    type='number'
                    placeholder='দিন'
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className='w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 placeholder-gray-600 text-gray-900'
                  />
                </div>
              </div>
            </div>
          )}
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          <button
            type='submit'
            className='w-full py-3 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-transform transform hover:scale-105 cursor-pointer'
          >
            শুরু করুন
          </button>
        </form>
      </div>
    </div>
  )
}

// --- TrackerComponent ---
const Tracker = ({ userData, onReset }) => {
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

  const [touchStartX, setTouchStartX] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const minSwipeDistance = 50
  const tabs = ['home', 'weekly', 'tips', 'islamic']

  useEffect(() => {
    const calculateDetails = () => {
      const pregnancyStartDate = new Date(userData.pregnancyStartDate)
      const estimatedDueDate = new Date(userData.estimatedDueDate)

      const today = new Date()

      const startOfDay = (date) => {
        const newDate = new Date(date)
        newDate.setHours(0, 0, 0, 0)
        return newDate
      }

      const diffTime =
        startOfDay(today).getTime() - startOfDay(pregnancyStartDate).getTime()
      const totalDaysElapsed = Math.round(diffTime / (1000 * 60 * 60 * 24))

      const weeks = Math.floor(totalDaysElapsed / 7)
      const days = totalDaysElapsed % 7
      const displayMonths = Math.floor(totalDaysElapsed / 30)
      const displayRemainingDays = totalDaysElapsed % 30
      let trimester = 1
      if (weeks >= 14 && weeks <= 27) trimester = 2
      else if (weeks > 27) trimester = 3

      const countdownDiffTime =
        startOfDay(estimatedDueDate).getTime() - startOfDay(today).getTime()
      const countdownDays = Math.max(
        0,
        Math.round(countdownDiffTime / (1000 * 60 * 60 * 24))
      )

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
        estimatedDueDate: estimatedDueDate.toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })
    }

    calculateDetails()
    const interval = setInterval(calculateDetails, 60000)
    return () => clearInterval(interval)
  }, [userData])

  const onTouchStart = (e) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = tabs.indexOf(activeTab)
      let nextIndex
      if (isLeftSwipe) {
        nextIndex = (currentIndex + 1) % tabs.length
      } else {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
      }
      setActiveTab(tabs[nextIndex])
    }
  }

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative px-3 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap focus:outline-none cursor-pointer ${
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
    const currentWeekData =
      weeklyData[pregnancyDetails.weeks] ||
      weeklyData[
        Object.keys(weeklyData).reduce((prev, curr) =>
          Math.abs(curr - pregnancyDetails.weeks) <
          Math.abs(prev - pregnancyDetails.weeks)
            ? curr
            : prev
        )
      ] ||
      weeklyData[40]

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
                <p>সম্ভাব্য তারিখ: {pregnancyDetails.estimatedDueDate}</p>
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
          <div className='space-y-6 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              সপ্তাহ {toBengaliNumber(currentWeekData.week)}: কী ঘটছে?
            </h3>
            <div className='bg-purple-100/50 border border-purple-200 rounded-xl p-4'>
              <h4 className='font-semibold text-purple-800 mb-2'>শিশুর আকার</h4>
              <p className='text-gray-700'>
                আপনার শিশু এখন প্রায় একটি{' '}
                <strong>{currentWeekData.baby_size_fruit}</strong>।
              </p>
              <p className='text-sm text-gray-600 mt-1'>
                ({currentWeekData.baby_size_measurement})
              </p>
            </div>
            <div className='bg-sky-100/50 border border-sky-200 rounded-xl p-4'>
              <h4 className='font-semibold text-sky-800 mb-2'>
                শিশুর বৃদ্ধি ও বিকাশ
              </h4>
              <p className='text-gray-700'>
                {currentWeekData.baby_development}
              </p>
            </div>
            <div className='bg-green-100/50 border border-green-200 rounded-xl p-4'>
              <h4 className='font-semibold text-green-800 mb-2'>
                মায়ের শারীরিক পরিবর্তন
              </h4>
              <p className='text-gray-700'>{currentWeekData.mother_symptoms}</p>
            </div>
            <div className='bg-yellow-100/50 border border-yellow-200 rounded-xl p-4'>
              <h4 className='font-semibold text-yellow-800 mb-2'>
                এই সপ্তাহের টিপস
              </h4>
              <p className='text-gray-700'>{currentWeekData.tip}</p>
            </div>
          </div>
        )
      case 'tips':
        return (
          <div className='space-y-8 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              {detailedTipsData.title}
            </h3>
            <div>
              <h4 className='text-lg font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-pink-200'>
                সাধারণ যত্ন ও পরামর্শ
              </h4>
              <ul className='space-y-2 list-disc list-inside text-gray-700'>
                {detailedTipsData.generalAdvice.map((advice, index) => (
                  <li key={index}>{advice}</li>
                ))}
              </ul>
            </div>
            {detailedTipsData.categories.map((category, catIndex) => (
              <div key={catIndex}>
                <h4 className='text-lg font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-pink-200'>
                  {category.categoryName}
                </h4>
                <div className='space-y-4'>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`p-4 rounded-lg shadow-sm flex gap-4 items-start ${
                        item.status === 'recommended'
                          ? 'bg-green-50/50 border-green-200'
                          : 'bg-yellow-50/50 border-yellow-200'
                      } border`}
                    >
                      <div className='flex-shrink-0 mt-1'>
                        {item.status === 'recommended' ? (
                          <CheckIcon />
                        ) : (
                          <CautionIcon />
                        )}
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {item.name}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          <span className='font-medium text-gray-700'>
                            উপকারিতা/ঝুঁকি:
                          </span>{' '}
                          {item.status === 'recommended'
                            ? item.benefit
                            : item.timing}
                        </p>
                        {item.status === 'recommended' && (
                          <p className='text-sm text-gray-600 mt-1'>
                            <span className='font-medium text-gray-700'>
                              কখন খাবেন:
                            </span>{' '}
                            {item.timing}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case 'islamic':
        return (
          <div className='space-y-6 animate-fade-in'>
            <h3 className='text-xl font-bold text-center text-gray-800'>
              ইসলামিক করনীয় ও দোয়া
            </h3>
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
            <div className='bg-orange-100/50 border border-orange-200 rounded-xl p-4 text-center'>
              <h4 className='font-semibold text-orange-800 mb-2 text-lg'>
                প্রাসঙ্গিক হাদিস
              </h4>
              <p className='text-gray-700 italic'>
                {islamicData.hadith.text}
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
    <div className='bg-pink-50 min-h-screen font-sans md:py-8'>
      <div className='w-full max-w-md mx-auto bg-white md:shadow-xl md:rounded-2xl'>
        <div className='p-6 md:p-8 pb-4 relative'>
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
          <button
            onClick={onReset}
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer'
            title='তথ্য রিসেট করুন'
          >
            <ResetIcon />
          </button>
        </div>

        <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200'>
          <div className='flex justify-center max-w-md mx-auto px-6 space-x-1 sm:space-x-2'>
            <TabButton tabName='home' label='হোম' />
            <TabButton tabName='weekly' label='সাপ্তাহিক তথ্য' />
            <TabButton tabName='tips' label='টিপস ও যত্ন' />
            <TabButton tabName='islamic' label='ইসলামিক করনীয়' />
          </div>
        </div>

        <div
          className='p-6 md:p-8 pb-12'
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// --- Main App Component ---
export default function App() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('pregnancyUserData')
      if (savedData) {
        setUserData(JSON.parse(savedData))
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error)
      localStorage.removeItem('pregnancyUserData')
    }
    setIsLoading(false)
  }, [])

  const handleDataSave = (data) => {
    setUserData(data)
  }

  const handleReset = () => {
    if (
      window.confirm('আপনি কি আপনার সকল তথ্য মুছে ফেলে নতুন করে শুরু করতে চান?')
    ) {
      localStorage.removeItem('pregnancyUserData')
      setUserData(null)
    }
  }

  if (isLoading) {
    return (
      <div className='bg-pink-50 min-h-screen flex items-center justify-center font-sans'>
        <p>লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!userData) {
    return <DataInputForm onDataSave={handleDataSave} />
  }

  return <Tracker userData={userData} onReset={handleReset} />
}
