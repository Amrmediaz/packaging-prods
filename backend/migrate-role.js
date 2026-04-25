import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../backend/models/User.js'; // ✅ adjust path if needed
import Role from '../backend/models/Role.js'; // ✅ adjust path if needed



// dotenv.config({ path: '/Users/macbook/Downloads/pacin/packin/.env.development' });
dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ Use raw collections — bypass Mongoose model casting
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    const rolesCollection = db.collection('roles');

    // 1. Load all roles
    const roles = await rolesCollection.find({}).toArray();
    console.log(`📦 Found ${roles.length} roles:`, roles.map(r => r.name));

    // 2. Build name → ObjectId map
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role._id;
    });
    console.log('🗺️  Role map:', roleMap);

    // 3. Load all users raw
    const users = await usersCollection.find({}).toArray();
    console.log(`👥 Found ${users.length} users to migrate`);

    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      const currentRole = user.role; // raw string from DB e.g. "Super Admin"
      console.log(`👤 ${user.email} — current role: "${currentRole}"`);

      // Skip if already an ObjectId
      if (currentRole instanceof mongoose.Types.ObjectId) {
        console.log(`⏭️  Skipping ${user.email} — already migrated`);
        continue;
      }

      const roleId = roleMap[currentRole];
      if (!roleId) {
        console.log(`❌ No role found for "${currentRole}" — user: ${user.email}`);
        failCount++;
        continue;
      }

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { role: roleId } }
      );

      console.log(`✅ ${user.email}: "${currentRole}" → ${roleId}`);
      successCount++;
    }

    console.log('\n📊 Migration complete!');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed:  ${failCount}`);

  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

migrate();