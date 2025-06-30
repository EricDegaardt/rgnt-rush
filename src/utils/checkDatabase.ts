import { supabase } from '@/lib/supabase';

export async function checkDatabaseSchema() {
  console.log('🔍 Checking Supabase Database Schema...\n');

  try {
    // Test connection
    console.log('✅ Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('scoreboard')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError);
      return;
    }
    
    console.log('✅ Connection successful!\n');

    // Get scoreboard data structure
    console.log('📊 Scoreboard Table Structure:');
    const { data: scoreboardData, error: scoreboardError } = await supabase
      .from('scoreboard')
      .select('*')
      .limit(5);

    if (scoreboardError) {
      console.error('❌ Error fetching scoreboard:', scoreboardError);
    } else {
      console.log('Columns: id, username, distance, selected_bike, email');
      console.log('Sample data:', scoreboardData);
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('scoreboard')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting count:', countError);
    } else {
      console.log(`\n📈 Total records in scoreboard: ${count}`);
    }

    // Get top scores
    console.log('\n🏆 Top 5 Scores:');
    const { data: topScores, error: topScoresError } = await supabase
      .from('scoreboard')
      .select('username, distance, selected_bike')
      .order('distance', { ascending: false })
      .limit(5);

    if (topScoresError) {
      console.error('❌ Error fetching top scores:', topScoresError);
    } else {
      topScores?.forEach((score, index) => {
        console.log(`${index + 1}. ${score.username} - ${score.distance}m (${score.selected_bike})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check if this file is executed directly
if (typeof window !== 'undefined') {
  // In browser environment, you can call this function
  (window as any).checkDatabaseSchema = checkDatabaseSchema;
}