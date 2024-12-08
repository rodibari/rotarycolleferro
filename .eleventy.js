const fs = require("fs");
const htmlmin = require("html-minifier-terser");

module.exports = async function(eleventyConfig) {

  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
		// The base URL: defaults to Path Prefix
		baseHref: "rotarycolleferro",
		// But you could use a full URL here too:
		// baseHref: "http://example.com/"

		// Comma separated list of output file extensions to apply
		// our transform to. Use `false` to opt-out of the transform.
	  extensions: "html,njk",
	});


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


  return {
    dir: {
      input: "src"
    },
    // pathPrefix
  }
};

function htmlminTransform(content, outputPath) {
  if( outputPath.endsWith(".html") ) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
    return minified;
  }
  return content;
}
