const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = path.resolve(__dirname, "..");
const worksPath = path.join(root, "src", "_data", "works.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  const slug = await ask("Work slug (example: livealive): ");
  const name = await ask("Work name: ");

  if (!slug || !name) {
    throw new Error("Work slug and work name are required.");
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Work slug must use lowercase letters, numbers, and hyphens only.");
  }

  const works = JSON.parse(fs.readFileSync(worksPath, "utf8"));

  if (works.some((work) => work.slug === slug)) {
    throw new Error(`Work slug already exists: ${slug}`);
  }

  works.unshift({
    name,
    slug,
  });

  fs.writeFileSync(worksPath, `${JSON.stringify(works, null, 2)}\n`, "utf8");

  console.log("");
  console.log("Added work:");
  console.log(`  name: ${name}`);
  console.log(`  slug: ${slug}`);
  console.log("");
  console.log("Next:");
  console.log("  If you will add posts for this work, update WORK_SLUG in the post-add batch file.");
}

main()
  .catch((error) => {
    console.error("");
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
