const DEFAULT_PORT = 5000;

function getRequiredEnvVar(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getEnv() {
  return {
    port: Number(process.env.PORT || DEFAULT_PORT),
    authServiceUrl: getRequiredEnvVar("AUTH_SERVICE_URL"),
    taskServiceUrl: getRequiredEnvVar("TASK_SERVICE_URL"),
    notificationServiceUrl: getRequiredEnvVar("NOTIFICATION_SERVICE_URL"),
    reportServiceUrl: getRequiredEnvVar("REPORT_SERVICE_URL")
  };
}

module.exports = {
  getEnv
};
