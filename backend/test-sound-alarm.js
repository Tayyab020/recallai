// Quick test to verify system sound functionality
const { exec } = require('child_process');

console.log('🧪 Testing Windows System Sound Alarms');
console.log('=====================================');

function testSystemSound(priority, delay = 0) {
    setTimeout(() => {
        console.log(`\n🔊 Testing ${priority} priority sound...`);

        let soundCommand;

        switch (priority) {
            case 'high':
                soundCommand = 'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Critical Stop.wav\\").PlaySync();"';
                break;
            case 'medium':
                soundCommand = 'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Notify System Generic.wav\\").PlaySync();"';
                break;
            case 'low':
                soundCommand = 'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Notify Messaging.wav\\").PlaySync();"';
                break;
            default:
                soundCommand = 'powershell -c "[console]::beep(800,1000)"';
        }

        exec(soundCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(`⚠️ Could not play ${priority} sound: ${error.message}`);
                console.log('🔄 Trying fallback beep...');
                exec('powershell -c "[console]::beep(800,1000)"', (beepError) => {
                    if (beepError) {
                        console.log(`❌ Fallback beep also failed: ${beepError.message}`);
                    } else {
                        console.log(`✅ Fallback beep played for ${priority} priority`);
                    }
                });
            } else {
                console.log(`✅ ${priority} priority sound played successfully`);
            }
        });
    }, delay);
}

// Test all sound types
console.log('🎵 Testing all alarm sound types...');
console.log('You should hear 3 different Windows sounds:');

testSystemSound('low', 0);
testSystemSound('medium', 2000);
testSystemSound('high', 4000);

setTimeout(() => {
    console.log('\n🏁 Sound test completed!');
    console.log('If you heard sounds, the alarm system will work.');
    console.log('If no sounds played, check Windows sound settings.');
    process.exit(0);
}, 7000);