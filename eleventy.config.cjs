module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/*.{txt,xml}");

  // Every page reports the date of its last commit (CI checks out the full history).
  eleventyConfig.addGlobalData("date", "git Last Modified");
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
  };
};
