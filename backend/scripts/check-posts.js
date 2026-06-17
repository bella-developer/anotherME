import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Post from '../src/models/Post.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

async function checkPosts() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const darkPosts = await Post.find({ room: 'dark' }).sort({ createdAt: -1 });
  console.log('\nDark Room Posts:');
  darkPosts.forEach(p => {
    const title = p.content.split('\n')[0];
    console.log(`  - "${title}"`);
  });

  const philoPosts = await Post.find({ room: 'philo' }).sort({ createdAt: -1 });
  console.log('\nPhilo Room Posts:');
  philoPosts.forEach(p => {
    console.log(`  - "${p.title || p.content.split('\n')[0]}"`);
  });

  const climbPosts = await Post.find({ room: 'climb' }).sort({ createdAt: -1 });
  console.log('\nClimb Room Posts:');
  climbPosts.forEach(p => {
    console.log(`  - "${p.title || p.content.split('\n')[0]}"`);
  });

  await mongoose.connection.close();
}

checkPosts();
