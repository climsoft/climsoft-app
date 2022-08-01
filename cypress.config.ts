import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'OPENCDMS-APP',
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  screenshotOnRunFailure: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportDir: "cypress/report",
    reportPageTitle: 'admin-report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents: (on, config) => {
      return require('./cypress/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/integration/*.{feature,features}'
  },
});
