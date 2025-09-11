// Test the new lovely alarm sounds
const { exec } = require('child_process');

console.log('🎵 TESTING LOVELY ALARM SOUNDS 🎵');
console.log('=================================');

function playHighPriorityAlarm() {
    console.log('\n🚨 Testing HIGH PRIORITY alarm (urgent but lovely)...');

    const urgentAlarm = `
        powershell -c "
            # Play Windows Critical Stop first
            (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\Windows Critical Stop.wav').PlaySync();
            Start-Sleep -Milliseconds 200;
            
            # Play urgent beep melody
            [console]::beep(1200,300);
            Start-Sleep -Milliseconds 100;
            [console]::beep(1000,300);
            Start-Sleep -Milliseconds 100;
            [console]::beep(1200,300);
            Start-Sleep -Milliseconds 100;
            [console]::beep(1400,500);
            Start-Sleep -Milliseconds 200;
            
            # Play exclamation sound
            (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\Windows Exclamation.wav').PlaySync();
        "
    `;

    exec(urgentAlarm, (error) => {
        if (error) {
            console.log('⚠️ High priority sound failed, using fallback...');
            exec('powershell -c "for($i=0; $i -lt 5; $i++) { [console]::beep(1000,400); Start-Sleep -Milliseconds 200 }"');
        } else {
            console.log('✅ High priority alarm played successfully');
        }
    });
}

function playMediumPriorityAlarm() {
    console.log('\n🔔 Testing MEDIUM PRIORITY alarm (pleasant doorbell melody)...');

    const pleasantAlarm = `
        powershell -c "
            # Play Windows notification sound first
            (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\Windows Notify System Generic.wav').PlaySync();
            Start-Sleep -Milliseconds 300;
            
            # Play pleasant melody (like a doorbell)
            [console]::beep(800,400);
            Start-Sleep -Milliseconds 100;
            [console]::beep(1000,400);
            Start-Sleep -Milliseconds 100;
            [console]::beep(800,400);
            Start-Sleep -Milliseconds 200;
            [console]::beep(600,600);
            Start-Sleep -Milliseconds 300;
            
            # Play another notification sound
            (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\Windows Notify Messaging.wav').PlaySync();
        "
    `;

    exec(pleasantAlarm, (error) => {
        if (error) {
            console.log('⚠️ Medium priority sound failed, using fallback...');
            exec('powershell -c "[console]::beep(800,800); Start-Sleep -Milliseconds 200; [console]::beep(1000,800);"');
        } else {
            console.log('✅ Medium priority alarm played successfully');
        }
    });
}

function playLowPriorityAlarm() {
    console.log('\n🔕 Testing LOW PRIORITY alarm (gentle and soft)...');

    const gentleAlarm = `
        powershell -c "
            # Play soft messaging sound
            (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\Windows Notify Messaging.wav').PlaySync();
            Start-Sleep -Milliseconds 400;
            
            # Play gentle melody
            [console]::beep(600,300);
            Start-Sleep -Milliseconds 150;
            [console]::beep(700,300);
            Start-Sleep -Milliseconds 150;
            [console]::beep(800,500);
        "
    `;

    exec(gentleAlarm, (error) => {
        if (error) {
            console.log('⚠️ Low priority sound failed, using fallback...');
            exec('powershell -c "[console]::beep(600,600);"');
        } else {
            console.log('✅ Low priority alarm played successfully');
        }
    });
}

// Test all alarm types with delays
console.log('🎼 You will hear 3 different lovely alarm melodies:');
console.log('   1. High Priority: Urgent but musical');
console.log('   2. Medium Priority: Pleasant doorbell melody');
console.log('   3. Low Priority: Gentle and soft');

playLowPriorityAlarm();

setTimeout(() => {
    playMediumPriorityAlarm();
}, 4000);

setTimeout(() => {
    playHighPriorityAlarm();
}, 8000);

setTimeout(() => {
    console.log('\n🎵 All lovely alarm sounds tested!');
    console.log('Your reminders will now play these beautiful melodies! 🎶');
    process.exit(0);
}, 15000);