const { MockGovernmentProvider, DEMO_GOVERNMENT_DATABASE } = require('./MockGovernmentProvider');
const StatusProcessor = require('./StatusProcessor');

/**
 * Factory that returns the active government/PFMS provider instance.
 * When a real authorized API is enabled via environment variable (e.g. GOVERNMENT_API_PROVIDER=LIVE),
 * it returns the authorized provider adapter. Defaults to MockGovernmentProvider for SIH/Demonstration.
 */
const getGovernmentProvider = () => {
  const providerType = process.env.GOVERNMENT_API_PROVIDER || 'MOCK';
  
  if (providerType === 'LIVE') {
    // Future Authorized Government API Adapter
    // return new AuthorizedGovernmentProvider();
  }
  
  return new MockGovernmentProvider();
};

const defaultProvider = getGovernmentProvider();

module.exports = {
  getGovernmentProvider,
  defaultProvider,
  MockGovernmentProvider,
  StatusProcessor,
  DEMO_GOVERNMENT_DATABASE
};
