import { getInvalidErrorMessages } from './validate';

describe('Util - validate - getInvalidErrorMessages()', () => {
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
