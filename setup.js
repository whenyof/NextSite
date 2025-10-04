#!/usr/bin/env node

/**
 * NextSite Setup Script
 * Automatically configures the project for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 NextSite Setup Script');
console.log('========================\n');

// Check if config.js exists
const configPath = path.join(__dirname, 'config.js');
const exampleConfigPath = path.join(__dirname, 'config.example.js');

if (!fs.existsSync(configPath)) {
    if (fs.existsSync(exampleConfigPath)) {
        console.log('📋 Creating config.js from example...');
        fs.copyFileSync(exampleConfigPath, configPath);
        console.log('✅ config.js created successfully!');
    } else {
        console.log('❌ config.example.js not found!');
        process.exit(1);
    }
} else {
    console.log('✅ config.js already exists');
}

// Create .env file for development
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('📋 Creating .env file for development...');
    const envContent = `# NextSite Environment Variables
# Copy this file and add your actual API keys

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_CONFIRMATION_TEMPLATE_ID=your_confirmation_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id

# Company Information
COMPANY_NAME=NextSite
COMPANY_EMAIL=info@nextsite.es
COMPANY_WEBSITE=https://nextsite.es
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
} else {
    console.log('✅ .env file already exists');
}

// Check .gitignore
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('config.js')) {
        console.log('📋 Updating .gitignore...');
        const updatedContent = gitignoreContent + '\n# Configuration files\nconfig.js\nconfig.local.js\n.env\n.env.local\n.env.production\n';
        fs.writeFileSync(gitignorePath, updatedContent);
        console.log('✅ .gitignore updated successfully!');
    } else {
        console.log('✅ .gitignore already configured');
    }
} else {
    console.log('❌ .gitignore not found!');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📝 Next steps:');
console.log('1. Edit config.js and add your actual API keys');
console.log('2. Test the website locally');
console.log('3. Deploy to your server');
console.log('\n⚠️  Remember: Never commit config.js to Git!');
console.log('📚 See README.md for detailed configuration instructions.');
