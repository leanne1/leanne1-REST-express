import { verifyConfig } from './index';

describe('config - verifyConfig()', () => {
  it('throws if config is falsey', () => {
    const config = [{ config: null, name: 'Missing' }];
    try {
      verifyConfig(config)
    } catch (err) {
      expect(err.message).to.equal('Missing config is not defined');
    }
  });
});
