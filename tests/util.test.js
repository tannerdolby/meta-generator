const {
  isObject,
  twitterHandle,
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
} = require('../src/utils/util');

describe('metagen utility functions', () => {
  it('should determine if input is an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ foo: 'bar' })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject()).toBe(false);
  });

  it('should generate twitter handles', () => {
    expect(twitterHandle('tannerdolby')).toBe('@tannerdolby');
    expect(twitterHandle('')).toBe('');
    expect(twitterHandle()).toBe('');
  });

  it('should generate HTML comments', () => {
    expect(HTMLComment({})).toBe('');
    expect(HTMLComment('')).toBe('');
    expect(HTMLComment('foo')).toBe('<!-- foo -->');
    expect(HTMLComment('some comment')).toBe('<!-- some comment -->');
    expect(HTMLComment(null, 'Twitter')).toBe('<!-- Twitter -->');
  });

  it('should generate custom crawler tags', () => {
    const crawlerInfo = {
      crawlers: {
        googlebot: 'noindex',
        'googlebot-news': 'nosnippet'
      }
    };
    const tags = [
      '<meta name="googlebot" content="noindex">',
      '<meta name="googlebot-news" content="nosnippet">'
    ];
    expect(handleCustomCrawlers(crawlerInfo)).toEqual(tags);
  });

  it('should generate DNS tags', () => {
    const urls = ['https://google.com', 'https://example.com'];
    expect(getDnsTags(urls, 'preconnect'))
      .toEqual([
        '<link rel="preconnect" href="https://google.com">',
        '<link rel="preconnect" href="https://example.com">'
      ]);
    expect(getDnsTags(urls, 'dns-prefetch'))
      .toEqual([
        '<link rel="dns-prefetch" href="https://google.com">',
        '<link rel="dns-prefetch" href="https://example.com">'
      ]);
  });

  it('should handle DNS resolution tags', () => {
    const dnsInfo = handleDnsResolution(
      'https://fonts.googleapis.com/',
      'https://google.com'
    );

    const tags = [
      '<link rel="preconnect" href="https://fonts.googleapis.com/">',
      '<link rel="dns-prefetch" href="https://google.com">'
    ];

    expect(dnsInfo).toEqual(tags);
    expect(handleDnsResolution()).toBe('');
    expect(handleDnsResolution('https://fonts.googleapis.com/')).toEqual(['<link rel="preconnect" href="https://fonts.googleapis.com/">']);
    expect(handleDnsResolution(null, 'https://google.com')).toEqual(['<link rel="dns-prefetch" href="https://google.com">']);
    expect(handleDnsResolution(
      'https://fonts.googleapis.com/',
      'https://google.com'
    )).toEqual([
      '<link rel="preconnect" href="https://fonts.googleapis.com/">',
      '<link rel="dns-prefetch" href="https://google.com">',
    ]);
  });

  it('should generate alternate locale tags', () => {
    const tags = [
      '<meta property="og:locale:alternate" content="es">',
      '<meta property="og:locale:alternate" content="zh">',
      '<meta property="og:locale:alternate" content="ja">'
    ];

    expect(handleAlternateLocales()).toBe('');
    expect(handleAlternateLocales([])).toBe('');
    expect(handleAlternateLocales(null)).toBe('');
    expect(handleAlternateLocales(['es', 'zh', 'ja'])).toEqual(tags);
    expect(handleAlternateLocales(['es']))
      .toEqual(['<meta property="og:locale:alternate" content="es">']);
  });

  it('should get element attributes from string', () => {
    const items = [
      'script.js',
      'script.js:async',
      'foo.js:bar',
      'script.js:defer:async',
      'bar.js:async:type="module"',
      'fizz.js:defer:type="module"',
      'icons.css:rel="preload":as="style"'
    ];

    const processed = items.map(item => getAttributes(item));
    expect(processed).toEqual([
      {
        "attributes": "",
        "content": "script.js",
      },
      {
        "attributes": "async",
        "content": "script.js",
      },
      {
        "attributes": "bar",
        "content": "foo.js",
      },
      {
        "attributes": "defer async",
        "content": "script.js",
      },
      {
        "attributes": "async type=\"module\"",
        "content": "bar.js",
      },
      {
        "attributes": "defer type=\"module\"",
        "content": "fizz.js",
      },
      {
        "attributes": "rel=\"preload\" as=\"style\"",
        "content": "icons.css",
      }
    ])
  });

  it('should generate static asset tags for string inputs', () => {
    const basic = getStaticAssets({
      css: 'foo.css',
      'inline_css': 'h3 {color: #f06}',
      js: 'script.js',
      'inline_js': 'console.log("yo")'
    });
    expect(basic).toEqual([
      '<link rel="stylesheet" href="foo.css">',
      '<style>h3 {color: #f06}</style>',
      '<script src="script.js"></script>',
      '<script>console.log("yo")</script>'
    ]);
  });

  it('should generate static asset tags for array inputs', () => {
    const expected = getStaticAssets({
      css: [
        'modals.css',
        'icons.css:rel="preload":as="style"'
      ],
      'inline_css': [
        ".foo {color: 'blue'}",
        "h1:hover {color: blue}"
      ],
      js: [
        'foo.js',
        'bar.js:async:type="module"',
        'fizz.js:defer'
      ],
      'inline_js': [
        'console.log("hello, world");',
        { type: 'application/json', id: 'some-id', js: '{"data": "hello"}' }
      ]
    });

    expect(expected).toEqual([
      [
        '<link rel="stylesheet" href="modals.css">',
        '<link rel="preload" as="style" href="icons.css">'
      ],
      [
        "<style>.foo {color: 'blue'}</style>",
        "<style>h1:hover {color: blue}</style>",
      ],
      [
        '<script src="foo.js"></script>',
        '<script src="bar.js" async type="module"></script>',
        '<script src="fizz.js" defer></script>'
      ],
      [
        '<script>console.log("hello, world");</script>',
        '<script type="application/json" id="some-id">{"data": "hello"}</script>'
      ]
    ]);
  });

  it('should merge objects into a single object', () => {
    expect(formatObjects(
      {},
      { title: 'bar', name: 'foo', 'twitter:title': '@tannerdolby' },
      { fizz: 'buzz' }
    ))
      .toEqual([
        "bar",
        '<meta name="name" content="foo">',
        '<meta name="twitter:title" content="@tannerdolby">',
        '<meta name="fizz" content="buzz">',
      ]);
  });

  it('should determine if data is valid metagen input', () => {
    expect(isValidInput({ title: 'foo', comments: true }));
    expect(isValidInput({})).toBe(false);
    expect(isValidInput([])).toBe(false);
    expect(isValidInput(null)).toBe(false);
    expect(isValidInput()).toBe(false);
  });
});
