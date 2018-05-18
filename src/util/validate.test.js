import { getInvalidErrorMessages } from './validate';

describe(colors.yellow.bold('@Util - validate'), () => {
  describe('getInvalidErrorMessages()', () => {
    it('gets all invalid error messages', () => {
      const error = {
        details: [
          { message: 'Three' },
          { message: 'error' },
          { message: 'messages' },
        ]
      };
      expect(getInvalidErrorMessages(error)).to.equal('Three, error, messages');
    });
  });
});
