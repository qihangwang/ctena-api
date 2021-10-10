const axios = require('axios');

const getHolders = async () => {
  let holderCount = 0;

  try {
    let response = await axios.get(
      'https://beefy-vote-api.herokuapp.com/api/0x8f4fc37bff97e6e7fd4355a5df76a486ac1e2e1c/snapshot/holders'
    );

    const ipfsHash = response.data['holders'];
    response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);

    let holders = response.data;
    holders = Object.keys(holders).filter(key => parseFloat(holders[key]) > 0);
    holderCount = holders.length;
  } catch (err) {
    console.error('Holders error:', err);
  }
  return { holderCount: holderCount };
};

module.exports = { getHolders };
