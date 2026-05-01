const path = require("path");

function getPostId(data) {
  return path.basename(data.page.inputPath, path.extname(data.page.inputPath));
}

module.exports = {
  tags: ["posts"],
  layout: "post.njk",
  permalink: (data) => `/works/${data.work}/posts/${getPostId(data)}/`
};
