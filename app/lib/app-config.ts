const rawAppName = "builder-agent-native-starter";
const rawAppTitle = "Builder Agent Native Starter";

const APP_NAME_PLACEHOLDER = "{" + "{APP_NAME}}";
const APP_TITLE_PLACEHOLDER = "{" + "{APP_TITLE}}";

export const APP_NAME =
  rawAppName === APP_NAME_PLACEHOLDER ? "starter" : rawAppName;

export const APP_TITLE =
  rawAppTitle === APP_TITLE_PLACEHOLDER ? "Blank app" : rawAppTitle;
