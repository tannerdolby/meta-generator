const getTag = require('get-tag');
const { PRE_TAGGED, SUPPORTED_ARGS } = require('./constants');

function twitterHandle(handle) {
  if (!handle || typeof handle !== 'string') {
    return '';
  }
  return `@${handle}`;
}

function HTMLComment(comment, fallback) {
  if (
    !comment && !fallback ||
    !isString(comment) && !isString(fallback)
  ) {
    return '';
  }
  return `<!-- ${comment || fallback} -->`;
}

function isObject(obj) {
  if (!obj || obj === undefined) return false;
  return typeof obj === 'object' && obj.constructor === Object;
}

function isString(str) {
  return typeof str === 'string'
}

function getDnsTags(data, rel) {
  if (!data || data === undefined) return '';

  if (typeof data === 'string') {
    return getTag('link', null, {
      rel: rel,
      href: data
    });
  } else if (Array.isArray(data)) {
    return data
      .map((link) => {
        if (typeof link === 'string') {
          return getTag('link', null, {
            rel: rel,
            href: link
          });
        } else if (isObject(link)) {
          const crossOrigin = link.crossorigin && 'crossorigin';
          return `<link rel="${rel}" href="${link.url}" ${crossOrigin}>`;
        }
      });
  }
}

function handleDnsResolution(preconnect, dnsPrefetch) {
  if (!preconnect && !dnsPrefetch) return '';
  return [
    getDnsTags(preconnect, 'preconnect'),
    getDnsTags(dnsPrefetch, 'dns-prefetch'),
  ].filter(Boolean);
}

function handleCustomCrawlers(data) {
  if (
    !data ||
    !Object.hasOwn(data, 'crawlers') ||
    !isObject(data.crawlers)
  ) {
    return '';
  }
  const tags = [];
  for (const key in data.crawlers) {
    tags.push(getTag('meta', null, {
      name: key,
      content: data.crawlers[key]
    }));
  }
  return tags;
}

function handleAlternateLocales(locales) {
  if (!locales || !Array.isArray(locales) || !locales.length) {
    return '';
  }
  return locales
    .map((locale) =>
      getTag('meta', null, {
        property: 'og:locale:alternate',
        content: locale,
      }),
    )
}

function getAttributes(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const attributes = str.split(':');

  if (!attributes.length) return '';

  return {
    content: attributes[0],
    attributes: attributes.slice(1).join(' ')
  };
}

function getStaticAssets(tagsObj) {
  if (!isObject(tagsObj)) return [];
  return Object.entries(tagsObj)
    .filter((tagInfo) => tagInfo[1])
    .map(([tag, val]) => {
      switch (tag) {
        case 'inline_css':
          if (typeof val === 'string') {
            return getTag('style', val);
          } else if (Array.isArray(val)) {
            const styles = val
              .map((v) => {
                if (typeof v === 'string') {
                  return getTag('style', v);
                } else if (isObject(v)) {
                  const { css } = v;
                  delete v.css;
                  return getTag('style', css, v);
                }
              })
            return styles;
          }
        case 'inline_js':
          if (typeof val === 'string') {
            return getTag('script', val);
          } else if (Array.isArray(val)) {
            const scripts = val
              .map((v) => {
                if (typeof v === 'string') {
                  return getTag('script', v);
                } else if (isObject(v)) {
                  const { js } = v;
                  delete v.js;
                  return getTag('script', js, v);
                }
              })
            return scripts;
          }
        case 'css':
          if (typeof val === "string") {
            const { content, attributes } = getAttributes(val);
            if (!attributes) {
              return getTag('link', '', { rel: 'stylesheet', href: content });
            } else {
              return `<link rel="stylesheet" href="${content}" ${attributes}>`;
            }
          } else if (Array.isArray(val)) {
            return val
              .map((v) => {
                const { content, attributes } = getAttributes(v);
                if (!attributes) {
                  return getTag('link', null, {
                    rel: 'stylesheet',
                    href: content,
                  });
                } else {
                  return `<link ${attributes} href="${content}">`;
                }
              })
          }
          break;
        case 'js':
          if (typeof val === 'string') {
            const { content, attributes } = getAttributes(val);
            if (!attributes) {
              return getTag('script', '', { src: content });
            } else {
              return `<script src="${content}" ${attributes.trim()}></script>`;
            }
          } else if (Array.isArray(val)) {
            return val
              .map((v) => {
                const { content, attributes } = getAttributes(v);
                if (!attributes) {
                  return `<script src="${content}"></script>`;
                } else {
                  return `<script src="${content}" ${attributes}></script>`;
                }
              })
          }
      }
    });
}

function formatObjects(data, ...objects) {
  const arr = Object.entries(Object.assign({}, ...objects));
  return arr
    .filter((tagData) => tagData[1])
    .map(([tag, value]) => {
      if (PRE_TAGGED.includes(tag)) {
        return value;
      }
      if (tag.includes('twitter')) {
        return getTag('meta', null, {
          [data.twitter_attr_name || 'name']: tag,
          content: value,
        });
      } else if (tag.includes('og')) {
        return getTag('meta', null, { property: tag, content: value });
      } else {
        return getTag('meta', null, {
          name: tag,
          content: value,
        });
      }
    })
    .flat(2)
}

function isValidInput(data) {
  if (data !== undefined && data && isObject(data) && Object.keys(data).length) {
    return true;
  }
  return false;
}

function getInvalidArgs(args) {
  const invalid = [];
  for (const arg of args) {
    if (!SUPPORTED_ARGS.includes(arg)) {
      invalid.push(arg);
    }
  }
  return invalid;
}

module.exports = {
  twitterHandle,
  isObject,
  HTMLComment,
  handleCustomCrawlers,
  handleDnsResolution,
  handleAlternateLocales,
  getDnsTags,
  getAttributes,
  getStaticAssets,
  formatObjects,
  isValidInput,
  getInvalidArgs,
};
