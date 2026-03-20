const axios = require("axios");
const { getEnv } = require("../config/env");

const HOP_BY_HOP_RESPONSE_HEADERS = new Set(["connection", "content-length", "transfer-encoding"]);

function resolveTarget(path) {
  const {
    authServiceUrl,
    taskServiceUrl,
    notificationServiceUrl,
    reportServiceUrl
  } = getEnv();

  if (path === "/auth" || path.startsWith("/auth/")) {
    return {
      baseUrl: authServiceUrl,
      path: path.replace(/^\/auth/, "") || "/"
    };
  }

  if (path === "/tasks" || path.startsWith("/tasks/")) {
    return {
      baseUrl: taskServiceUrl,
      path
    };
  }

  if (path === "/notifications" || path.startsWith("/notifications/")) {
    const rewrittenPath = path.replace(/^\/notifications\/notify$/, "/notify");
    return {
      baseUrl: notificationServiceUrl,
      path: rewrittenPath
    };
  }

  if (path === "/reports" || path.startsWith("/reports/")) {
    return {
      baseUrl: reportServiceUrl,
      path: path.replace(/^\/reports/, "") || "/"
    };
  }

  return null;
}

async function proxyRequest(req, res, next) {
  const target = resolveTarget(req.path);

  if (!target) {
    return res.status(404).json({
      message: "No downstream service mapping found for this route."
    });
  }

  try {
    const response = await axios({
      method: req.method,
      url: `${target.baseUrl}${target.path}`,
      params: req.query,
      data: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
      headers: {
        authorization: req.headers.authorization,
        "content-type": req.headers["content-type"]
      },
      validateStatus: () => true
    });

    Object.entries(response.headers).forEach(([header, value]) => {
      if (!HOP_BY_HOP_RESPONSE_HEADERS.has(header.toLowerCase())) {
        res.setHeader(header, value);
      }
    });

    return res.status(response.status).send(response.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Downstream service is unavailable."
      });
    }

    return next(error);
  }
}

module.exports = {
  proxyRequest
};
