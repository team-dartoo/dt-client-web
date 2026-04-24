const normalizeBaseUrl = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\/+$/, "");
};

export const getServiceBaseUrl = (envName, fallback = "") => {
  const configuredValue = normalizeBaseUrl(import.meta.env[envName]);

  if (configuredValue) {
    return configuredValue;
  }

  return normalizeBaseUrl(fallback);
};

export const requireServiceBaseUrl = (envName, serviceName) => {
  const baseUrl = getServiceBaseUrl(envName);

  if (baseUrl) {
    return baseUrl;
  }

  throw new Error(
    `${serviceName} base URL is not configured. Set ${envName} in your frontend environment.`,
  );
};
