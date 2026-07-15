async function buildTheme() {
  const { config } = await import("@progressiveui/themes-core/config.js");
  config();
}

buildTheme().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
