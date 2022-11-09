import { ethers } from 'ethers';
import 'dotenv/config';
import OptimisticOracle from '../out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../addresses';

const chain = 'bittorrentTestnet';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env[chain]);
  const wallet = new ethers.Wallet(process.env.pk as string, provider);

  const ooFactory = new ethers.ContractFactory(
    OptimisticOracle.abi,
    OptimisticOracle.bytecode,
    wallet
  );

  const oo = ooFactory.attach(addresses[chain].oo);

  let tx = await oo.askQuestion(
    'was $eth over 1000 on 2023-01-01?',
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
