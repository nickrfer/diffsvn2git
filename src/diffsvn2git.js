import dateFormat from 'dateformat';
import Client from './fixed-svn';
import DiffParser from './parser/diffparser';

export default class DiffSvn2Git {
  constructor(options) {
    this.client = new Client(options);
    this.diffParser = new DiffParser(this.client);
  }

  listRevisionsByDate(dateStr) {
    const date = new Date(new Date(dateStr).getTime() + 86400000);
    const followingDay = new Date(date.getTime() + 86400000);

    return this.getLogByDate(date, followingDay);
  }

  getLogByDate(date, followingDay) {
    return new Promise((resolve) => {
      console.log('calling getLog');
      this.client.getLog([`-r{${dateFormat(date, 'yyyy-mm-dd')}}:{${dateFormat(followingDay, 'yyyy-mm-dd')}}`], (err, data) => {
        if (data) {
          resolve(data);
        } else {
          console.error(`Error while calling svn log: ${err}`);
          resolve(err);
        }
      });
    });
  }

  parse(rev = null) {
    return this.diffParser.parse(rev);
  }

}
