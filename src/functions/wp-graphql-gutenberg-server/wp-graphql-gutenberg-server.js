const {
  blockTypes,
  batch,
  formatError,
  ServerError,
} = require("wp-graphql-gutenberg-server-core");
const chromium = require("chrome-aws-lambda");

function response({ body, statusCode }) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  let browser = null;
  try {
    if (event.httpMethod !== "POST") {
      throw new ServerError("Wrong HTTP method", 400);
    }

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const pathname = event.path.split(`wp-graphql-gutenberg-server`).pop();

    let data;

    try {
      data = JSON.parse(event.body);
    } catch (error) {
      throw new ServerError(error.message, 400);
    }

    switch (pathname) {
      case "/batch":
        return response({
          statusCode: 200,
          body: await batch({ browser, ...data }),
        });
      case "/block-types":
        return response({
          statusCode: 200,
          body: await blockTypes({ browser, ...data }),
        });
      default:
        throw new ServerError(`Unknown resource '${pathname}'`);
    }
  } catch (error) {
    return response({
      statusCode: error.status || 500,
      body: formatError({ error }),
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
