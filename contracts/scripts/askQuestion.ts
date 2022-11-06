import { ethers } from 'ethers';
import 'dotenv/config';
import OptimisticOracle from '../out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../addresses';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.goerli);
  const wallet = new ethers.Wallet(process.env.pk as string, provider);

  const ooFactory = new ethers.ContractFactory(
    OptimisticOracle.abi,
    OptimisticOracle.bytecode,
    wallet
  );

  const oo = ooFactory.attach(addresses.goerli.oo);

  let tx = await oo.askQuestion(
    'Will $ETH be over 0100 in 1 minute?',
    'https://coingecko.com',
    1667638013 + 60
  );
  await tx.wait();
  console.log('question asked: ', tx.hash);
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
