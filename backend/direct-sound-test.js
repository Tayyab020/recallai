// Direct sound test - bypasses cron and plays sounds immediately
const { exec } = require('child_process');

console.log('🔊 DIRECT SOUND TEST - MAXIMUM VOLUME');
console.log('====================================');
console.log('This will play sounds immediately without cron scheduling.');
console.log('');

// Check system volume first
console.log('1️⃣ Checking system volume...');
exec('powershell -c "Get-AudioDevice -PlaybackVolume"', (error, stdout, stderr) => {
    if (error) {
        console.log('⚠️ Could not check volume, proceeding with sound test...');
    } else {
        console.log('📊 System audio info:', stdout.trim());
    }
});

setTimeout(() => {
    console.log('\n2️⃣ Playing LOUD console beeps...');
    exec('powershell -c "for($i=0; $i -lt 5; $i++) { [console]::beep(1000 + ($i * 200), 800); Start-Sleep -Milliseconds 300 }"', (error) => {
        if (error) {
            console.log('❌ Console beeps failed:', error.message);
        } else {
            console.log('✅ Console beeps completed');
        }
    });
}, 2000);

setTimeout(() => {
    console.log('\n3️⃣ Playing Windows system sounds...');
    exec('powershell -c "(New-Object Media.SoundPlayer \\"C:\\\\Windows\\\\Media\\\\Windows Notify System Generic.wav\\").PlaySync();"', (error) => {
        if (error) {
            console.log('❌ Windows sound failed:', error.message);
        } else {
            console.log('✅ Windows notification sound played');
        }
    });
}, 5000);

setTimeout(() => {
    console.log('\n4️⃣ Showing message box with sound...');
    exec('powershell -c "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show(\\"🔔 REMINDER ALARM TEST!\\\\n\\\\nThis is a test of the alarm system.\\\\n\\\\nDid you hear the sounds?\\\\n\\\\nClick OK to continue.\\", \\"Alarm Test\\", \\"OK\\", \\"Exclamation\\")"', (error) => {
        if (error) {
            console.log('❌ Message box failed:', error.message);
        } else {
            console.log('✅ Message box displayed with sound');
        }
    });
}, 8000);

setTimeout(() => {
    console.log('\n5️⃣ Playing final loud alarm sequence...');
    exec('powershell -c "for($i=0; $i -lt 8; $i++) { [console]::beep(800 + ($i * 150), 400); Start-Sleep -Milliseconds 200 }"', (error) => {
        if (error) {
            console.log('❌ Final alarm sequence failed');
        } else {
            console.log('✅ Final alarm sequence completed');
        }
    });
}, 11000);

setTimeout(() => {
    console.log('\n🏁 DIRECT SOUND TEST COMPLETED!');
    console.log('');
    console.log('Results summary:');
    console.log('- If you heard beeping sounds: ✅ Console beeps work');
    console.log('- If you heard Windows notification: ✅ System sounds work');
    console.log('- If you saw a message box: ✅ Visual alarms work');
    console.log('');
    console.log('If you heard NO sounds at all:');
    console.log('1. Check your system volume (speakers/headphones)');
    console.log('2. Check Windows sound settings');
    console.log('3. Try running: powershell -c "[console]::beep(800,1000)"');
    console.log('');
    console.log('Your reminder alarms use the same sound methods tested here.');
    process.exit(0);
}, 15000);