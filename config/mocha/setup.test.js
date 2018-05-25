import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import colors from 'colors';

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.colors = colors;

// dirty-chai must be the last plugin added
chai.use(dirtyChai);
