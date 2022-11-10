import { ethers } from 'ethers';
import 'dotenv/config';
import OptimisticOracle from '../out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../addresses';

const chain = 'bittorrent';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env[chain]);
  const wallet = new ethers.Wallet(process.env.pk as string, provider);

  const ooFactory = new ethers.ContractFactory(
    OptimisticOracle.abi,
    OptimisticOracle.bytecode,
    wallet
  );

  let oo = await ooFactory.deploy(addresses[chain].token);
  await oo.deployed();
  console.log('Optimistic Oracle deployed at:', oo.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
