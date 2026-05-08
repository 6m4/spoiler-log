const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = path.resolve(__dirname, "..");
const worksPath = path.join(root, "src", "_data", "works.json");
const cardsDir = path.join(root, "src", "images", "cards");

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

  const cardImage = `/images/cards/${slug}.jpg`;

  works.unshift({
    name,
    slug,
    cardImage,
  });

  fs.writeFileSync(worksPath, `${JSON.stringify(works, null, 2)}\n`, "utf8");
  fs.mkdirSync(cardsDir, { recursive: true });

  console.log("");
  console.log("Added work:");
  console.log(`  name: ${name}`);
  console.log(`  slug: ${slug}`);
  console.log(`  card image: ${cardImage}`);
  console.log("");
  console.log("Next:");
  console.log(`  Put the card image here: src\\images\\cards\\${slug}.jpg`);
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
