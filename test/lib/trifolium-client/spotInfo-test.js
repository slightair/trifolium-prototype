var SpotInfo, clientLibPath, should;

should = require('should');

clientLibPath = '../../../lib/trifolium-client';

SpotInfo = require("" + clientLibPath + "/spotInfo").SpotInfo;

describe('SpotInfo', function() {
  var spotInfo;
  spotInfo = new SpotInfo({
    id: 'a5ca237533a06b6dd7d55daa84cd539bb11dcd5d',
    name: 'なめこの洞窟',
    posX: 120,
    posY: -80
  });
  it('should have id', function() {
    should.exist(spotInfo.id);
    return spotInfo.id.should.equal('a5ca237533a06b6dd7d55daa84cd539bb11dcd5d');
  });
  it('should have name', function() {
    should.exist(spotInfo.name);
    return spotInfo.name.should.equal('なめこの洞窟');
  });
  it('should have posX', function() {
    should.exist(spotInfo.posX);
    return spotInfo.posX.should.equal(120);
  });
  return it('should have posY', function() {
    should.exist(spotInfo.posY);
    return spotInfo.posY.should.equal(-80);
  });
});
