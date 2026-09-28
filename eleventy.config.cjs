module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/*.{txt,xml}");

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
  };
};
