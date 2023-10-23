const metagen = require('../src/index');

describe('metagen unit tests', () => {
  describe('should generate tags', () => {
    it('when only comments field is provided', () => {
      expect(metagen({
        comments: true,
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="en_US">',
        '<!-- Twitter -->',
        '<meta name="twitter:card" content="summary">',
      ]);
    });

    it('when provided title and comments', () => {
      expect(metagen({
        title: 'foo',
        comments: true
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>foo</title>',
        '<meta name="title" content="foo">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="foo">',
        '<!-- Twitter -->',
        '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:title" content="foo">',
      ]);
    });

    it('nunjucks front matter example', () => {
      expect(metagen({
        title: 'Eleventy Plugin Add Meta Tags',
        desc: 'An eleventy shortcode for generating meta tags.',
        url: 'https://tannerdolby.com',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        img_alt: 'Archimedean Spiral',
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        name: 'Tanner Dolby',
        custom: [
          {
            tag: 'meta',
            attrs: {
              name: 'fizz',
              content: 'buzz',
            }
          }
        ],
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Eleventy Plugin Add Meta Tags</title>',
        '<meta name="title" content="Eleventy Plugin Add Meta Tags">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Eleventy Plugin Add Meta Tags">',
        '<meta property="og:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="Archimedean Spiral">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@tannerdolby">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Eleventy Plugin Add Meta Tags">',
        '<meta name="twitter:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="Archimedean Spiral">',
        '<link rel="canonical" href="https://tannerdolby.com">',
        '<meta name="fizz" content="buzz">',
      ]);
    });

    it('baseline functionality example', () => {
      expect(metagen({
        title: 'Eleventy Plugin Meta Generator',
        desc: 'An eleventy shortcode for generating meta tags.',
        url: 'https://tannerdolby.com',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        img_alt: 'Archimedean Spiral',
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        name: 'Tanner Dolby',
        generator: 'eleventy',
        comments: true,
        css: ['style.css', 'design.css'],
        js: ['foo.js', 'bar.js:async'],
        inline_css: 'h1 { color: #f06; }',
        inline_js: 'console.log("hello, world.");'
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Eleventy Plugin Meta Generator</title>',
        '<meta name="title" content="Eleventy Plugin Meta Generator">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="generator" content="eleventy">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Eleventy Plugin Meta Generator">',
        '<meta property="og:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="Archimedean Spiral">',
        '<!-- Twitter -->',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@tannerdolby">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Eleventy Plugin Meta Generator">',
        '<meta name="twitter:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="Archimedean Spiral">',
        '<link rel="canonical" href="https://tannerdolby.com">',
        '<link rel="stylesheet" href="style.css">',
        '<link rel="stylesheet" href="design.css">',
        '<style>h1 { color: #f06; }</style>',
        '<script src="foo.js"></script>',
        '<script src="bar.js" async></script>',
        '<script>console.log("hello, world.");</script>',
      ]);
    });

    it('liquid example', () => {
      expect(metagen({
        title: 'Eleventy Plugin Add Meta Tags',
        desc: 'An eleventy shortcode for generating meta tags.',
        url: 'https://tannerdolby.com',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        img_alt: 'Archimedean Spiral',
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        name: 'Tanner Dolby'
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Eleventy Plugin Add Meta Tags</title>',
        '<meta name="title" content="Eleventy Plugin Add Meta Tags">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Eleventy Plugin Add Meta Tags">',
        '<meta property="og:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="Archimedean Spiral">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@tannerdolby">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Eleventy Plugin Add Meta Tags">',
        '<meta name="twitter:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="Archimedean Spiral">',
        '<link rel="canonical" href="https://tannerdolby.com">',
      ]);
    });

    it('advanced usage example', () => {
      expect(metagen({
        title: 'Eleventy Plugin Meta Generator',
        desc: 'An eleventy shortcode for generating meta tags.',
        url: 'https://tannerdolby.com',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        img_alt: 'Archimedean Spiral',
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        name: 'Tanner Dolby',
        generator: '11ty',
        comments: true,
        site_name: 'Metagen',
        robots: 'noindex',
        crawlers: {
          googlebot: 'noindex',
          'googlebot-news': 'nosnippet',
        },
        preconnect: [{ url: 'https://fonts.googleapis.com/', crossorigin: true }, 'https://google.com'],
        dns_prefetch: ['https://fonts.googleapis.com/', 'https://google.com'],
        og_alternate_locales: ['es', 'zh', 'ja'],
        css: ['style.css', 'foo.css:rel="preload":as="style"'],
        js: ['foo.js', 'bar.js:async:type="module"', 'fizz.js:defer'],
        inline_css: 'h1 {color: #f06}',
        inline_js: [
          'console.log("hello, world")',
          {
            type: 'application/json',
            id: 'some-id',
            js: '{"data": "hello"}'
          }
        ],
        custom: [
          {
            tag: 'meta',
            attrs: {
              name: 'foobar',
              content: "fizz"
            }
          },
          {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: 'print.css',
              media: 'print'
            }
          },
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: 'myFont.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous'
            }
          },
        ]
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Eleventy Plugin Meta Generator</title>',
        '<meta name="title" content="Eleventy Plugin Meta Generator">',
        '<link rel="preconnect" href="https://fonts.googleapis.com/" crossorigin>',
        '<link rel="preconnect" href="https://google.com">',
        '<link rel="dns-prefetch" href="https://fonts.googleapis.com/">',
        '<link rel="dns-prefetch" href="https://google.com">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="robots" content="noindex">',
        '<meta name="googlebot" content="noindex">',
        '<meta name="googlebot-news" content="nosnippet">',
        '<meta name="generator" content="11ty">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:site_name" content="Metagen">',
        '<meta property="og:locale:alternate" content="es">',
        '<meta property="og:locale:alternate" content="zh">',
        '<meta property="og:locale:alternate" content="ja">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Eleventy Plugin Meta Generator">',
        '<meta property="og:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="Archimedean Spiral">',
        '<!-- Twitter -->',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@tannerdolby">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Eleventy Plugin Meta Generator">',
        '<meta name="twitter:description" content="An eleventy shortcode for generating meta tags.">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="Archimedean Spiral">',
        '<link rel="canonical" href="https://tannerdolby.com">',
        '<meta name="foobar" content="fizz">',
        '<link rel="stylesheet" href="print.css" media="print">',
        '<link rel="preload" href="myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">',
        '<link rel="stylesheet" href="style.css">',
        '<link rel="preload" as="style" href="foo.css">',
        '<style>h1 {color: #f06}</style>',
        '<script src="foo.js"></script>',
        '<script src="bar.js" async type="module"></script>',
        '<script src="fizz.js" defer></script>',
        '<script>console.log("hello, world")</script>',
        '<script type="application/json" id="some-id">{"data": "hello"}</script>',
      ]);
    });

    it('template data example', () => {
      expect(metagen({
        title: 'Some Title',
        desc: 'Some desc',
        url: 'https://tannerdolby.com',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        img_alt: 'Archimedean spiral',
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        name: 'Tanner Dolby',
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Some Title</title>',
        '<meta name="title" content="Some Title">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="Some desc">',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Some Title">',
        '<meta property="og:description" content="Some desc">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="Archimedean spiral">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@tannerdolby">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Some Title">',
        '<meta name="twitter:description" content="Some desc">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="Archimedean spiral">',
        '<link rel="canonical" href="https://tannerdolby.com">'
      ]);
    });
  });

  describe('plugin arguments', () => {
    it('general', () => {
      expect(metagen({
        title: 'Some title',
        url: 'https://tannerdolby.com',
        name: 'Tanner Dolby',
        desc: 'My cool site',
        generator: 'eleventy',
        comments: true,
        preconnect: 'https://google.com',
        dns_prefetch: 'https://example.com',
        robots: 'noindex, nofollow',
        crawlers: {
          googlebot: 'noindex',
          'googlebot-news': 'nosnippet'
        },
        css: [
          'modals.css',
          'icons.css:rel="preload":as="style"'
        ],
        inline_css: [".foo {color: blue}", "h1:hover {color: blue}"],
        js: ['foo.js', 'bar.js:async:type="module"', 'fizz.js:defer'],
        inline_js: 'console.log("hello, world");',
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Some title</title>',
        '<meta name="title" content="Some title">',
        '<link rel="preconnect" href="https://google.com">',
        '<link rel="dns-prefetch" href="https://example.com">',
        '<meta name="author" content="Tanner Dolby">',
        '<meta name="description" content="My cool site">',
        '<meta name="robots" content="noindex, nofollow">',
        '<meta name="googlebot" content="noindex">',
        '<meta name="googlebot-news" content="nosnippet">',
        '<meta name="generator" content="eleventy">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="https://tannerdolby.com">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="Some title">',
        '<meta property="og:description" content="My cool site">',
        '<!-- Twitter -->',
        '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:url" content="https://tannerdolby.com">',
        '<meta name="twitter:title" content="Some title">',
        '<meta name="twitter:description" content="My cool site">',
        '<link rel="canonical" href="https://tannerdolby.com">',
        '<link rel="stylesheet" href="modals.css">',
        '<link rel="preload" as="style" href="icons.css">',
        '<style>.foo {color: blue}</style>',
        '<style>h1:hover {color: blue}</style>',
        '<script src="foo.js"></script>',
        '<script src="bar.js" async type="module"></script>',
        '<script src="fizz.js" defer></script>',
        '<script>console.log("hello, world");</script>',
      ]);
    });

    it('open graph', () => {
      expect(metagen({
        locale: 'en_US',
        og_title: 'some cool title',
        og_desc: 'some desc',
        img: 'https://tannerdolby.com/images/arch-spiral-large.jpg',
        type: 'article',
        site_name: 'my cool site',
        img_width: 300,
        img_height: 300,
        img_alt: 'some alt text',
        og_comment: 'Open Graph Tags',
        og_img_type: 'image/jpeg',
        og_secure_img_url: 'some-secure-url',
        og_audio: 'some-audio-file-url',
        og_video: 'some-video-file-url',
        og_determiner: 'auto',
        og_alternate_locales: ['es', 'ko', 'ja']
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta property="og:type" content="article">',
        '<meta property="og:site_name" content="my cool site">',
        '<meta property="og:video" content="some-video-file-url">',
        '<meta property="og:audio" content="some-audio-file-url">',
        '<meta property="og:determiner" content="auto">',
        '<meta property="og:locale:alternate" content="es">',
        '<meta property="og:locale:alternate" content="ko">',
        '<meta property="og:locale:alternate" content="ja">',
        '<meta property="og:locale" content="en_US">',
        '<meta property="og:title" content="some cool title">',
        '<meta property="og:description" content="some desc">',
        '<meta property="og:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta property="og:image:alt" content="some alt text">',
        '<meta property="og:image:width" content="300">',
        '<meta property="og:image:height" content="300">',
        '<meta property="og:image:type" content="image/jpeg">',
        '<meta property="og:image:secure_url" content="some-secure-url">',
        '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:image" content="https://tannerdolby.com/images/arch-spiral-large.jpg">',
        '<meta name="twitter:image:alt" content="some alt text">',
      ]);
    });

    it('twitter', () => {
      expect(metagen({
        twitter_card_type: 'summary_large_image',
        twitter_handle: 'tannerdolby',
        creator_handle: 'dannertolby',
        twitter_title: 'foo',
        twitter_image: 'https://tannerdolby.com/foo.jpg',
        twitter_image_alt: 'foo bar',
        twitter_desc: 'fizz buzz',
        twitter_comment: 'Some Custom Comment',
        comments: true,
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<!-- Open Graph -->',
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="en_US">',
        '<!-- Some Custom Comment -->',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@tannerdolby">',
        '<meta name="twitter:creator" content="@dannertolby">',
        '<meta name="twitter:title" content="foo">',
        '<meta name="twitter:description" content="fizz buzz">',
        '<meta name="twitter:image" content="https://tannerdolby.com/foo.jpg">',
        '<meta name="twitter:image:alt" content="foo bar">',
      ]);
    });

    it('custom', () => {
      expect(metagen({
        custom: [
          { tag: 'meta', attrs: { name: 'foobar', content: 'fizz' } },
          { tag: 'link', attrs: { rel: 'stylesheet', href: 'print.css', media: 'print' } },
          { tag: 'link', attrs: { rel: 'preload', href: 'myFont.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' } },
        ]
      })).toEqual([
        '<meta charset="utf-8">',
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="en_US">',
        '<meta name="twitter:card" content="summary">',
        '<meta name="foobar" content="fizz">',
        '<link rel="stylesheet" href="print.css" media="print">',
        '<link rel="preload" href="myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">',
      ])
    });

    it('minified', () => {
      expect(metagen({
        title: 'foo',
        minified: true
      })).toEqual('<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>foo</title><meta name="title" content="foo"><meta property="og:type" content="website"><meta property="og:locale" content="en_US"><meta property="og:title" content="foo"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="foo">');
    });
  });
});
