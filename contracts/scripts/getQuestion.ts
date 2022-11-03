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

  const id = await oo.getQuestionId(
    'will joe biden be president on 2023-01-01?',
    'https://usa.gov',
    '1672531200'
  );
  console.log(id);
  // console.log(ethers.utils.parseBytes32String(id));

  const questions = await oo.getQuestionById(
    '0x7a3f8bff527e02aa0c592125a5b4ea011865ca8dd6e083941b7b6a2c3f62bc92'
  );
  console.log(questions);
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
