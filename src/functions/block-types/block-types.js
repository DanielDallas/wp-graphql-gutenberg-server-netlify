const { blockTypes } = require("wp-graphql-gutenberg-server-core");
const { wrapHandler, createBrowser } = require("../../functions");

const browserJob = createBrowser();

exports.handler = wrapHandler(async (event) =>
  blockTypes({ browser: await browserJob, ...event.body })
);
