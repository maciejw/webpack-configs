module.exports = function minifyLitHtmlTemplate(source) {
  const uglifyTemplateString = string =>
    string
      .replace(/(\r\n|\n|\r)/g, '')
      .replace(/^\s+/g, '')
      .replace(/>\s+/g, '>')
      .replace(/\s+</g, '<')
      .replace(/\s{2,}/g, ' ');

  return source.replace(/(?:(?:=)|(?:=>)|(?:return html))(?:\s*\()?\s*`([\d|\D]*?)`/g, (match, $1) =>
    match.replace($1, uglifyTemplateString($1))
  );
};
