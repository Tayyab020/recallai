// Play a loud, long alarm tune
const { exec } = require('child_process');

console.log('🚨 PLAYING LOUD ALARM TUNE 🚨');
console.log('=============================');

function playLoudAlarmSequence() {
    console.log('🔊 Starting loud alarm sequence...');

    // Play multiple loud sounds in sequence
    const alarmSequence = [
        // Critical stop sound (very loud)
        'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Critical Stop.wav\\").PlaySync();"',
        // Exclamation sound
        'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Exclamation.wav\\").PlaySync();"',
        // Critical stop again
        'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Critical Stop.wav\\").PlaySync();"',
        // Error sound
        'powershell -c "(New-Object Media.SoundPlayer \\"C:\\Windows\\Media\\Windows Error.wav\\").PlaySync();"',
        // Multiple beeps
        'powershell -c "for($i=0; $i -lt 5; $i++) { [console]::beep(1000,500); Start-Sleep -Milliseconds 200 }"'
    ];

    let currentSound = 0;

    function playNextSound() {
        if (currentSound < alarmSequence.length) {
            console.log(`🔊 Playing alarm sound ${currentSound + 1}/${alarmSequence.length}...`);

            exec(alarmSequence[currentSound], (error, stdout, stderr) => {
                if (error) {
                    console.log(`⚠️ Sound ${currentSound + 1} failed, trying fallback beep...`);
                    exec('powershell -c "[console]::beep(1200,1000)"', () => { });
                } else {
                    console.log(`✅ Sound ${currentSound + 1} completed`);
                }

                currentSound++;
                // Play next sound after a short delay
                setTimeout(playNextSound, 500);
            });
        } else {
            console.log('🎵 Alarm sequence completed!');

            // Play final long beep sequence
            console.log('🔊 Playing final long beep sequence...');
            exec('powershell -c "for($i=0; $i -lt 10; $i++) { [console]::beep(800 + ($i * 100), 300); Start-Sleep -Milliseconds 100 }"', (error) => {
                if (error) {
                    console.log('⚠️ Final beep sequence failed');
                } else {
                    console.log('✅ Final beep sequence completed');
                }
                console.log('🏁 LOUD ALARM TUNE FINISHED!');
            });
        }
    }

    playNextSound();
}

// Start the loud alarm
playLoudAlarmSequence();