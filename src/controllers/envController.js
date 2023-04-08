if (!process.env.SECRET) throw new Error('JWT Secret not found in environmnet variables.');
if (!process.env.COOKIE_KEY) throw new Error('COOKIE_KEY not found in environmnet variables.');
if (!process.env.NODE_ENV) throw new Error('NODE_ENV not found in environmnet variables.');
if (!process.env.SERVER_URL) throw new Error('SERVER_URL not found in environmnet variables.');
if (!process.env.DEFAULT_ROLE) throw new Error('DEFAULT_ROLE not found in environmnet variables.');

// Should be the last statement
console.log('=> Environment variables Loaded!');
