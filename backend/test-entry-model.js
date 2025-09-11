require('dotenv').config();
const mongoose = require('mongoose');
const Entry = require('./models/Entry');

async function testEntryModel() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create a test entry
        const testEntry = new Entry({
            userId: new mongoose.Types.ObjectId(),
            text: 'This is a test journal entry for debugging',
            tags: ['test', 'debug']
        });

        console.log('Test entry created:', {
            text: testEntry.text,
            encryptedText: testEntry.encryptedText ? 'exists' : 'missing',
            isNew: testEntry.isNew
        });

        // Save the entry
        console.log('Saving entry...');
        await testEntry.save();

        console.log('Entry saved successfully:', {
            id: testEntry._id,
            text: testEntry.text,
            encryptedText: testEntry.encryptedText ? 'exists (' + testEntry.encryptedText.length + ' chars)' : 'missing'
        });

        // Test decryption
        const decryptedText = testEntry.decryptText();
        console.log('Decryption test:', {
            original: testEntry.text,
            decrypted: decryptedText,
            match: testEntry.text === decryptedText
        });

        // Clean up
        await testEntry.deleteOne();
        console.log('Test entry deleted');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

testEntryModel();