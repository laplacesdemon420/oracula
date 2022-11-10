import { ethers } from 'ethers';
import 'dotenv/config';
import OptimisticOracle from '../out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../addresses';
import { questions } from '../questions';

const chain = 'bittorrent';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env[chain]);
  const wallet = new ethers.Wallet(process.env.pk as string, provider);

  const ooFactory = new ethers.ContractFactory(
    OptimisticOracle.abi,
    OptimisticOracle.bytecode,
    wallet
  );

  const oo = ooFactory.attach(addresses[chain].oo);

  for (const question of questions) {
    let tx = await oo.askQuestion(...question);
    await tx.wait();
    console.log('question asked: ', tx.hash);
  }
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
