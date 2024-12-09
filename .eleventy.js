const fs = require("fs");
const htmlmin = require("html-minifier-terser");

module.exports = async function (eleventyConfig) {
  console.log('******** BEGIN: .eleventy:5 ********');
  console.dir(eleventyConfig, { depth: null, colors: true });
  console.log('********   END: .eleventy:5 ********');

  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

  let markdownIt = require("markdown-it");
  var markdownItAttrs = require('markdown-it-attrs');
  let options = {
    html: true,
    breaks: false,
    linkify: false
  };
  
  let markdownLib = markdownIt(options).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", markdownLib);
  
  if (process.env.ELEVENTY_PRODUCTION) {
    eleventyConfig.addTransform("htmlmin", htmlminTransform);
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  // Watch targets
  eleventyConfig.addWatchTarget("./src/styles/");

  var pathPrefix = "rotarycolleferro";
  if (process.env.GITHUB_REPOSITORY) {
    pathPrefix = process.env.GITHUB_REPOSITORY.split('/')[1];
  }

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin,
    { 
      baseHref: pathPrefix,
      extensions: "html" 
    }
  );


  return {
    dir: {
      input: "src"
    },
    pathPrefix
  }
};

function htmlminTransform(content, outputPath) {
  if (outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}
