#!/usr/bin/env node
import crypto from 'crypto';

console.log('\n🔐 Generating Random Secrets for Deployment\n');
console.log('Copy these values to your Render/Vercel environment variables:\n');
console.log('─'.repeat(70));

console.log('\n📝 JWT_ACCESS_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\n📝 JWT_REFRESH_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\n📝 SESSION_SECRET:');
console.log(crypto.randomBytes(32).toString('hex'));

console.log('\n' + '─'.repeat(70));
console.log('\n⚠️  IMPORTANT: Keep these secrets safe and never commit them to git!\n');
console.log('💡 Add these to:\n');
console.log('   • Render: Dashboard → Your Service → Environment\n');
console.log('   • Vercel: Dashboard → Your Project → Settings → Environment Variables\n');
