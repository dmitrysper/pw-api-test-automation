const report = require('multiple-cucumber-html-reporter');

report.generate({
    jsonDir: './reports/',
    reportPath: './reports/',
    hideMetadata: false,
    disableLog: true,
    useCDN: false,
    reportName: 'Cucumber-Playwright API tests',
    metadata:{
        device: 'desktop',
        platform: {
            name: 'macOS',
            version: "14.4"
        }
    }
});
