// Test simple sound to make sure we can hear something
const { exec } = require('child_process');

console.log('🔊 Testing simple sound methods...');

// Method 1: Simple console beep
console.log('\n1️⃣ Testing console beep...');
exec('powershell -c "[console]::beep(800,1000)"', (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Console beep failed:', error.message);
    } else {
        console.log('✅ Console beep should have played');
    }
});

// Method 2: Windows notification sound
setTimeout(() => {
    console.log('\n2️⃣ Testing Windows notification sound...');
    exec('powershell -c "(New-Object Media.SoundPlayer \\"C:\\\\Windows\\\\Media\\\\Windows Notify System Generic.wav\\").PlaySync();"', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Windows sound failed:', error.message);
        } else {
            console.log('✅ Windows notification sound should have played');
        }
    });
}, 2000);

// Method 3: Multiple beeps
setTimeout(() => {
    console.log('\n3️⃣ Testing multiple beeps...');
    exec('powershell -c "for($i=0; $i -lt 3; $i++) { [console]::beep(1000,300); Start-Sleep -Milliseconds 200 }"', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Multiple beeps failed:', error.message);
        } else {
            console.log('✅ Multiple beeps should have played');
        }
    });
}, 4000);

// Method 4: System message box with sound
setTimeout(() => {
    console.log('\n4️⃣ Testing system message box with sound...');
    exec('powershell -c "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show(\\"ALARM TEST - Click OK\\", \\"Reminder Alarm\\", \\"OK\\", \\"Exclamation\\")"', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Message box failed:', error.message);
        } else {
            console.log('✅ Message box with sound should have appeared');
        }
    });
}, 6000);

setTimeout(() => {
    console.log('\n🏁 Sound test completed. Did you hear any sounds?');
    console.log('If no sounds played, your system volume might be muted or very low.');
}, 10000);