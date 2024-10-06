// migrations/2_deploy_my_token.js

const PupaToken = artifacts.require('PupaToken');

module.exports = function (deployer) {
  const name = 'PupaToken';
  const symbol = 'PUPA';
  deployer.deploy(PupaToken, name, symbol);
};
