import crypto from 'crypto';

console.log('🔐 Generating Secure Secrets');
console.log('━'.repeat(60));

const jwtSecret = crypto.randomBytes(64).toString('hex');
const cookiePassword = crypto.randomBytes(32).toString('hex');

console.log('\n📋 Copy these to your .env file:\n');

console.log('# JWT Secret (64 bytes / 128 characters)');
console.log(`JWT_SECRET=${jwtSecret}`);

console.log('\n# AdminJS Cookie Password (32 bytes / 64 characters)');
console.log(`ADMIN_JS_COOKIE_PASSWORD=${cookiePassword}`);

console.log('\n━'.repeat(60));
console.log('✅ Secrets generated successfully!');
console.log('⚠️  Keep these secret and never commit to Git!');
console.log('━'.repeat(60));
console.log('');