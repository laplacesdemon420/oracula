import { ethers } from 'ethers';
import OPTI from '../out/Token.sol/OPTI.json';
import 'dotenv/config';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.goerli);
  const wallet = new ethers.Wallet(process.env.pk as string, provider);

  const tokenFactory = new ethers.ContractFactory(
    OPTI.abi,
    OPTI.bytecode,
    wallet
  );

  let opti = await tokenFactory.deploy();
  await opti.deployed();
  console.log('OPTI token deployed at:', opti.address);
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
