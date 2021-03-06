import { verifyConfig } from './index';

describe(colors.yellow.bold('@Config'), () => {
  describe('verifyConfig', () => {
    it('throws if config is falsey', () => {
      const config = [{ config: null, name: 'Missing' }];
      try {
        verifyConfig(config)
      } catch (err) {
        expect(err.message).to.equal('Missing config is not defined');
      }
    });
  });
});
