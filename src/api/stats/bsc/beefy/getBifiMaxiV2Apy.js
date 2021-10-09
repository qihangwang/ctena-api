const BigNumber = require('bignumber.js');
const { bscWeb3: web3 } = require('../../../../utils/web3');

const IRewardPool = require('../../../../abis/IRewardPool.json');
const fetchPrice = require('../../../../utils/fetchPrice');
const { getTotalStakedInUsd } = require('../../../../utils/getTotalStakedInUsd');
const { compound } = require('../../../../utils/compound');
const { DAILY_HPY } = require('../../../../constants');

const BIFI = '0x8f4fc37bff97e6e7fd4355a5df76a486ac1e2e1c';
const REWARDS = '0x57689D22256CE11862F302d0FFc4C8688F5C4CE9';
const ORACLE = 'tokens';
const ORACLE_ID = 'CTENA';
const DECIMALS = '1e9';
const BLOCKS_PER_DAY = 28800;

const getBifiMaxiV2Apy = async () => {
  const [yearlyRewardsInUsd, totalStakedInUsd] = await Promise.all([
    getYearlyRewardsInUsd(),
    getTotalStakedInUsd(REWARDS, BIFI, ORACLE, ORACLE_ID, DECIMALS),
  ]);

  const simpleApy = yearlyRewardsInUsd.dividedBy(totalStakedInUsd);
  const apy = compound(simpleApy, DAILY_HPY, 1, 1);

  return { 'bifi-maxi-v2': apy };
};

const getYearlyRewardsInUsd = async () => {
  const bnbPrice = await fetchPrice({ oracle: 'tokens', id: 'WBNB' });

  const rewardPool = new web3.eth.Contract(IRewardPool, REWARDS);
  const rewardRate = new BigNumber(await rewardPool.methods.rewardRate().call());
  const yearlyRewards = rewardRate.times(3).times(BLOCKS_PER_DAY).times(365);
  const yearlyRewardsInUsd = yearlyRewards.times(bnbPrice).dividedBy(DECIMALS);

  return yearlyRewardsInUsd;
};

module.exports = getBifiMaxiV2Apy;
