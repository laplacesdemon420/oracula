import { ethers } from 'ethers';
import OPTI from '../out/Token.sol/OPTI.json';
import 'dotenv/config';

const address = '0xB340EAdC6baA1fb1dD84FA7BaC924Fc2F843058b';
const chain = 'bittorrent';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env[chain]);
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
