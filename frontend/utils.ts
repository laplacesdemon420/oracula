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
