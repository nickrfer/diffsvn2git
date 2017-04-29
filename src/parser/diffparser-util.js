export default class DiffParserUtil {

  static svnLogToGitLog(svnlog) {
    const metainfo = svnlog[1].split(' | ');
    const subject = svnlog[2];
    const description = svnlog[3];

    const author = metainfo[1];
    const day = metainfo[2].split('(')[1];
    const time = metainfo[2].split(' ')[1];
    const offset = metainfo[2].split(' ')[2];

    let gitlog = `From: ${author} <${author}> \n`;
    gitlog += `Date: ${day} ${time} ${offset} \n`;
    gitlog += `Subject: [PATCH] ${subject} \n`;
    gitlog += `${description} \n`;
    return gitlog;
  }

  static svnDiffToGitDiff(svndiff) {
    let gitDiff = '';

    svndiff.forEach((line) => {
      if (line.startsWith('--- ')) {
        gitDiff += `--- a/${line.substring(4)} \n`;
      } else if (line.startsWith('+++ ')) {
        gitDiff += `+++ b/${line.substring(4)} \n`;
      } else {
        gitDiff += `${line} \n`;
      }
    });
    return gitDiff;
  }
}
