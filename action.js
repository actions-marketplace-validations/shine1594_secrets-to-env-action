const DEFAULT_PREFIX_DEV = "__DEV__";
const DEFAULT_PREFIX_PROD = "__PROD__";
const DEFAULT_FILE_NAME_DEV = ".env.dev";
const DEFAULT_FILE_NAME_PROD = ".env";

const parseSecrets = (prefix, secrets) =>
  Object.fromEntries(
    Object.entries(secrets)
      .filter(([key]) => key.startsWith(prefix))
      .map(([k, v]) => [k.replace(prefix, ""), v])
  );

const toEnvString = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");

const makeSuccessMessage = (file_names) =>
  `${file_names.map((n) => `'${n}'`).join(" and ")} file${
    file_names.length > 1 ? "s" : ""
  } created successfully.`;

const main = ({
  secrets,
  env,
  override_prod = false,
  file_name_prod = DEFAULT_FILE_NAME_PROD,
  file_name_dev = DEFAULT_FILE_NAME_DEV,
  prefix_prod = DEFAULT_PREFIX_PROD,
  prefix_dev = DEFAULT_PREFIX_DEV,
}) => {
  const secrets_obj = JSON.parse(secrets);
  const env_prod_obj = parseSecrets(prefix_prod, secrets_obj);
  const files = [];
  if (env === "production" || env === "all") {
    files.push([file_name_prod, toEnvString(env_prod_obj)]);
  }
  if (env === "development" || env === "all") {
    const env_dev_obj = parseSecrets(prefix_dev, secrets_obj);
    files.push([
      file_name_dev,
      toEnvString(
        Object.assign({}, override_prod ? env_prod_obj : {}, env_dev_obj)
      ),
    ]);
  }
  return files;
};

module.exports = {
  DEFAULT_PREFIX_DEV,
  DEFAULT_PREFIX_PROD,
  DEFAULT_FILE_NAME_DEV,
  DEFAULT_FILE_NAME_PROD,
  parseSecrets,
  toEnvString,
  makeSuccessMessage,
  main,
};