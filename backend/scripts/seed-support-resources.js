import 'dotenv/config';
import mongoose from 'mongoose';
import SupportResource from '../src/models/supportResource.model.js';

const supportResources = [
  // Books
  {
    type: 'book',
    title: "Quiet: The Power of Introverts in a World That Can't Stop Talking",
    author: "Susan Cain",
    category: "Understanding Introversion",
    description: "A groundbreaking exploration of introversion and its strengths in an extroverted world.",
    link: "https://www.goodreads.com/book/show/8520610-quiet",
    order: 1
  },
  {
    type: 'book',
    title: "The Highly Sensitive Person",
    author: "Elaine N. Aron",
    category: "Self-Understanding",
    description: "Understanding and thriving as a highly sensitive person.",
    link: "https://www.goodreads.com/book/show/337467.The_Highly_Sensitive_Person",
    order: 2
  },
  {
    type: 'book',
    title: "The Introvert Advantage",
    author: "Marti Olsen Laney",
    category: "Personal Growth",
    description: "How to thrive in an extrovert world while staying true to yourself.",
    link: "https://www.goodreads.com/book/show/49309.The_Introvert_Advantage",
    order: 3
  },
  {
    type: 'book',
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    category: "Philosophy & Meaning",
    description: "Finding purpose and meaning even in the darkest circumstances.",
    link: "https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning",
    order: 4
  },
  {
    type: 'book',
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction for Deep Thinkers",
    description: "A novel about infinite possibilities and finding meaning in life.",
    link: "https://www.goodreads.com/book/show/52578297-the-midnight-library",
    order: 5
  },
  {
    type: 'book',
    title: "Solitude: A Return to the Self",
    author: "Anthony Storr",
    category: "Philosophy of Solitude",
    description: "An exploration of the importance and creativity found in solitude.",
    link: "https://www.goodreads.com/book/show/251780.Solitude",
    order: 6
  },

  // Videos
  {
    type: 'video',
    title: "The Power of Introverts",
    creator: "Susan Cain | TED",
    category: "Understanding Introversion",
    description: "In a world that celebrates extroverts, Susan Cain makes a case for the quiet and contemplative.",
    link: "https://www.youtube.com/watch?v=c0KYU2j0TM4",
    duration: "19 min",
    order: 1
  },
  {
    type: 'video',
    title: "Self-Love is the Best Love",
    creator: "Jay Shetty",
    category: "Self-Love",
    description: "How to truly love yourself and build unshakeable self-worth from within.",
    link: "https://www.youtube.com/watch?v=LgC1x4hsPbk",
    duration: "8 min",
    order: 2
  },
  {
    type: 'video',
    title: "How to Love Yourself",
    creator: "Teal Swan",
    category: "Self-Love",
    description: "A deep dive into what self-love actually means and how to practice it.",
    link: "https://www.youtube.com/watch?v=UnkelZhYpQ0",
    duration: "30 min",
    order: 3
  },
  {
    type: 'video',
    title: "Are We Living in a Simulation?",
    creator: "Kurzgesagt",
    category: "Reality & Philosophy",
    description: "Exploring the simulation hypothesis and what it means for our existence.",
    link: "https://www.youtube.com/watch?v=tlTKTTt47WE",
    duration: "8 min",
    order: 4
  },
  {
    type: 'video',
    title: "Life as a Game: Alan Watts",
    creator: "After Skool",
    category: "Reality & Philosophy",
    description: "Alan Watts explains how viewing life as a game can transform your experience.",
    link: "https://www.youtube.com/watch?v=3VuSSJXbKXc",
    duration: "10 min",
    order: 5
  },
  {
    type: 'video',
    title: "The Introvert's Guide to Success",
    creator: "Matthew Hussey",
    category: "Introvert Life",
    description: "How introverts can thrive in an extroverted world without changing who they are.",
    link: "https://www.youtube.com/watch?v=cEo5RdXpJB8",
    duration: "15 min",
    order: 6
  },

  // Articles
  {
    type: 'article',
    title: "Self-Love: What It Is and What It Isn't",
    source: "Psychology Today",
    category: "Self-Love",
    description: "A comprehensive guide to understanding true self-love beyond Instagram mantras.",
    link: "https://www.psychologytoday.com/us/blog/the-moment-youth/201808/what-self-love-is-and-what-it-isnt",
    order: 1
  },
  {
    type: 'article',
    title: "The Introvert's Guide to Networking",
    source: "Harvard Business Review",
    category: "Introvert Life",
    description: "How introverts can build meaningful connections on their own terms.",
    link: "https://hbr.org/2016/09/the-introverts-guide-to-networking",
    order: 2
  },
  {
    type: 'article',
    title: "Living in a Simulation",
    source: "Scientific American",
    category: "Reality & Philosophy",
    description: "Scientists weigh in on whether we could be living in a computer simulation.",
    link: "https://www.scientificamerican.com/article/do-we-live-in-a-simulation-chances-are-about-50-50/",
    order: 3
  },
  {
    type: 'article',
    title: "The Philosophy of Solitude",
    source: "Aeon",
    category: "Introvert Life",
    description: "Why being alone is not the same as being lonely, and why solitude matters.",
    link: "https://aeon.co/essays/what-we-can-learn-from-the-philosophy-of-solitude",
    order: 4
  },
  {
    type: 'article',
    title: "Reality as a Game",
    source: "Medium",
    category: "Reality & Philosophy",
    description: "Exploring the metaphor of life as a game and how it changes your perspective.",
    link: "https://medium.com/the-mission/life-is-a-game-this-is-your-strategy-guide-b5a0d5c0c04b",
    order: 5
  },
  {
    type: 'article',
    title: "The Art of Self-Compassion",
    source: "Greater Good Magazine",
    category: "Self-Love",
    description: "Research-backed strategies for treating yourself with kindness.",
    link: "https://greatergood.berkeley.edu/article/item/the_five_myths_of_self_compassion",
    order: 6
  },

  // Professional Therapist
  {
    type: 'therapist',
    name: "Elijah",
    title: "Licensed Professional Therapist",
    category: "Mental Health Professional",
    description: "Specializing in introversion, social anxiety, existential concerns, and identity exploration. Provides a safe, non-judgmental space for deep thinkers and quiet souls.",
    link: "mailto:elijah@anotherme.app",
    specialties: ["Social Anxiety", "Depression", "Identity Issues", "Existential Concerns", "Introversion"],
    availability: "Monday-Friday, 9AM-6PM",
    professionalType: "Licensed Therapist (LMFT)",
    bio: "With over 10 years of experience, Elijah understands the unique challenges faced by introverts and deep thinkers in an extroverted world.",
    verified: true,
    order: 1
  },

  // Peer Support
  {
    type: 'peer-support',
    name: "Ruhama",
    title: "Ruhama - Verified Peer Support",
    role: "Verified Peer Support",
    category: "Community Support",
    description: "A fellow introvert who has walked through darkness and found her way to self-acceptance. Available for peer support conversations about loneliness, self-love, and finding your place.",
    link: "mailto:ruhama@anotherme.app",
    specialties: ["Loneliness", "Self-Love Journey", "Introvert Struggles", "Finding Community"],
    availability: "Flexible, volunteer basis",
    bio: "Ruhama is a verified community member who volunteers her time to support others on their journey. She's not a therapist, but a compassionate listener who understands.",
    verified: true,
    order: 1
  }
];

async function seedSupportResources() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing support resources
    await SupportResource.deleteMany({});
    console.log('Cleared existing support resources');

    // Insert new support resources
    const created = await SupportResource.insertMany(supportResources);
    console.log(`✅ Created ${created.length} support resources`);

    console.log('\nSupport resources by type:');
    const books = created.filter(r => r.type === 'book').length;
    const videos = created.filter(r => r.type === 'video').length;
    const articles = created.filter(r => r.type === 'article').length;
    const therapists = created.filter(r => r.type === 'therapist').length;
    const peerSupport = created.filter(r => r.type === 'peer-support').length;
    
    console.log(`- Books: ${books}`);
    console.log(`- Videos: ${videos}`);
    console.log(`- Articles: ${articles}`);
    console.log(`- Therapists: ${therapists}`);
    console.log(`- Peer Support: ${peerSupport}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding support resources:', error);
    process.exit(1);
  }
}

seedSupportResources();
