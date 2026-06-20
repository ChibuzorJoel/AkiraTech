const Admin = require('../models/Admin.model');

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existing) {
      console.log('⚠️ Admin already exists:', process.env.ADMIN_EMAIL);
      return;
    }

    // 🔍 TEMP DEBUG — remove after confirming
    console.log('🔍 Raw ADMIN_PASSWORD:', JSON.stringify(process.env.ADMIN_PASSWORD));
    console.log('🔍 ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length);

    const admin = await Admin.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'superadmin',
    });

    console.log('✅ Default admin seeded:', admin.email);
  } catch (err) {
    console.error('❌ Admin seed error:', err);
  }
};

module.exports = seedAdmin;