/**
 * Database Cleanup Script
 * 
 * This script clears all user-generated data from the database
 * while keeping the schema intact.
 * 
 * Usage: npx tsx scripts/clear-database.ts
 */

import db from '../src/lib/db';

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Delete in order to respect foreign key constraints
    
    console.log('Deleting WebSocket messages...');
    await db.websocketMessage.deleteMany({});
    
    console.log('Deleting WebSocket presets...');
    await db.webSocketPreset.deleteMany({});
    
    console.log('Deleting request runs...');
    await db.requestRun.deleteMany({});
    
    console.log('Deleting requests...');
    await db.request.deleteMany({});
    
    console.log('Deleting collections...');
    await db.collection.deleteMany({});
    
    console.log('Deleting environments...');
    await db.environment.deleteMany({});
    
    console.log('Deleting workspace invites...');
    await db.workspaceInvite.deleteMany({});
    
    console.log('Deleting workspace members...');
    await db.workspaceMember.deleteMany({});
    
    console.log('Deleting workspaces...');
    await db.workspace.deleteMany({});
    
    console.log('Deleting sessions...');
    await db.session.deleteMany({});
    
    console.log('Deleting verifications...');
    await db.verification.deleteMany({});
    
    console.log('Deleting accounts...');
    await db.account.deleteMany({});
    
    console.log('Deleting users...');
    await db.user.deleteMany({});
    
    console.log('\n✅ Database cleanup completed successfully!');
    console.log('📊 All user data has been removed.');
    console.log('🔒 Database schema remains intact.');
    
  } catch (error) {
    console.error('\n❌ Error during database cleanup:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Run the cleanup
clearDatabase()
  .then(() => {
    console.log('\n👋 Cleanup script finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
