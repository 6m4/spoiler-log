const works = require("./src/_data/works.json");
const pathPrefix = "/spoiler-log/";
const postsPerWorkPage = 20;

function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }

      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/embed/")[1];
      }

      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1];
      }
    }
  } catch (e) {
    return null;
  }

  return null;
}

function getPostId(post) {
  const inputPath = post?.inputPath || post?.page?.inputPath || post?.data?.page?.inputPath;

  if (inputPath) {
    return inputPath
      .split(/[\\/]/)
      .pop()
      .replace(/\.[^.]+$/, "");
  }

  return post?.fileSlug || post?.page?.fileSlug || post?.data?.page?.fileSlug || "";
}

function getWorkPageUrl(workSlug, pageNumber) {
  return pageNumber === 1
    ? `/works/${workSlug}/`
    : `/works/${workSlug}/page/${pageNumber}/`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  eleventyConfig.amendLibrary("md", (mdLib) => {
    const defaultImageRenderer =
      mdLib.renderer.rules.image ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    mdLib.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const srcIndex = token.attrIndex("src");

      if (srcIndex >= 0) {
        const src = token.attrs[srcIndex][1];

        if (src.startsWith("/images/")) {
          token.attrs[srcIndex][1] = `${pathPrefix.replace(/\/$/, "")}${src}`;
        }
      }

      return defaultImageRenderer(tokens, idx, options, env, self);
    };
  });

  eleventyConfig.addShortcode("youtube", function (url) {
    const id = getYouTubeId(url);

    if (!id) {
      return `<p>YouTube URL error: ${url}</p>`;
    }

    return `
      <div class="video-wrap">
        <iframe
          src="https://www.youtube.com/embed/${id}"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
    `;
  });

  eleventyConfig.addFilter("postAnchor", function (post) {
    return `post-${getPostId(post)}`;
  });

  eleventyConfig.addFilter("postUrl", function (post) {
    return `/works/${post.data.work}/posts/${getPostId(post)}/`;
  });

  eleventyConfig.addFilter("workName", function (workSlug) {
    const work = works.find((item) => item.slug === workSlug);
    return work ? work.name : workSlug;
  });

  eleventyConfig.addFilter("workCardImage", function (workSlug) {
    const work = works.find((item) => item.slug === workSlug);
    return work?.cardImage || "";
  });

  eleventyConfig.addFilter("absoluteUrl", function (url, site) {
    const normalizedUrl = url || "/";
    const prefixedUrl = normalizedUrl.startsWith(pathPrefix)
      ? normalizedUrl
      : `${pathPrefix.replace(/\/$/, "")}${normalizedUrl.startsWith("/") ? "" : "/"}${normalizedUrl}`;

    if (!site?.url) {
      return prefixedUrl;
    }

    return `${site.url.replace(/\/$/, "")}${prefixedUrl}`;
  });

  eleventyConfig.addFilter("encodeURIComponent", function (value) {
    return encodeURIComponent(value || "");
  });

  eleventyConfig.addFilter("postBackUrl", function (post, workSlug, collections) {
    const posts = collections[`work_${workSlug}`] || [];
    const index = posts.findIndex((item) => getPostId(item) === getPostId(post));
    const pageNumber = index >= 0 ? Math.floor(index / postsPerWorkPage) + 1 : 1;

    return getWorkPageUrl(workSlug, pageNumber);
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  for (const work of works) {
    eleventyConfig.addCollection(`work_${work.slug}`, function (collectionApi) {
      return collectionApi
        .getFilteredByTag("posts")
        .filter((item) => item.data.work === work.slug)
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  }

  eleventyConfig.addCollection("workPageDefs", function (collectionApi) {
    const defs = [];

    for (const work of works) {
      const items = collectionApi
        .getFilteredByTag("posts")
        .filter((item) => item.data.work === work.slug)
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const totalPages = Math.max(1, Math.ceil(items.length / postsPerWorkPage));

      for (let page = 1; page <= totalPages; page++) {
        defs.push({
          slug: work.slug,
          name: work.name,
          pageNumber: page,
          totalPages,
          start: (page - 1) * postsPerWorkPage,
          end: page * postsPerWorkPage,
          permalink:
            page === 1
              ? `/works/${work.slug}/`
              : `/works/${work.slug}/page/${page}/`,
        });
      }
    }

    return defs;
  });

  eleventyConfig.addCollection("workSummaries", function (collectionApi) {
    return works
      .map((work) => {
        const posts = collectionApi
          .getFilteredByTag("posts")
          .filter((item) => item.data.work === work.slug)
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
          ...work,
          count: posts.length,
          latestPost: posts[0] || null,
        };
      })
      .sort((a, b) => {
        const aTime = a.latestPost ? new Date(a.latestPost.date).getTime() : 0;
        const bTime = b.latestPost ? new Date(b.latestPost.date).getTime() : 0;
        return bTime - aTime;
      });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    pathPrefix: pathPrefix
  };
};
