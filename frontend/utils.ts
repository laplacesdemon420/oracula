export const timestampToDate = (
  ts: string,
  format: 'days' | 'seconds'
): string => {
  // var ts = 1565605570;

  // convert unix timestamp to milliseconds
  let ts_ms = parseInt(ts) * 1000;
  let date_ob = new Date(ts_ms);
  let year = date_ob.getFullYear();
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
  let day = ('0' + date_ob.getDate()).slice(-2);
  let hours = ('0' + date_ob.getHours()).slice(-2);
  let minutes = ('0' + date_ob.getMinutes()).slice(-2);
  let seconds = ('0' + date_ob.getSeconds()).slice(-2);

  if (format === 'days') {
    return `${year}-${month}-${day}`;
  }

  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
};

export const addresses: { [key: string]: any } = {
  goerli: {
    token: '0xC9A119E1543Dd6ea5fC7ab48cF3762570caf8AA9',
    oo: '0x34C19059583e26873D4f0Ce7867259818fCf8b75',
  },
  bittorrent: {
    token: '0xC9A119E1543Dd6ea5fC7ab48cF3762570caf8AA9',
    oo: '0x34C19059583e26873D4f0Ce7867259818fCf8b75',
  },
  bittorrentTestnet: {
    token: '0xca3db11bd994233b8946a3e426922ebada8d4b55',
    oo: '0xf519084F81a0c76d6cAf91558191742DbBB64e0A',
  },
};
