import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import nock from 'nock';
import colors from 'colors';

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
global.colors = colors;

// dirty-chai must be the last plugin added
chai.use(dirtyChai);

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1'); // Allow localhost connections so we can test local routes and mock servers.
