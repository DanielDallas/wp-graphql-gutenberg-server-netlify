const { batch } = require("wp-graphql-gutenberg-server-core");
const { wrapHandler, createBrowser } = require("../../functions");

const browserJob = createBrowser();

exports.handler = wrapHandler(async (event) =>
  batch({ browser: await browserJob, ...event.body })
);
