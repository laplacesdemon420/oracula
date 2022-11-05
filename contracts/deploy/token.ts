import { ethers } from 'ethers';
import OPTI from '../out/Token.sol/OPTI.json';
import 'dotenv/config';

const address = '0xdcb9048D6bb9C31e60af7595ef597ADC642B9cB6';

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

  await opti.mint(address, ethers.utils.parseEther('10000'));
  console.log('minted 100 OPTI tokens');
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
