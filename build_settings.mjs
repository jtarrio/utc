var buildCommands = [
  { compile: "webapp/utc/**" },
  { copy: "webapp/utc/.htaccess", base: "webapp/utc", to: "dist/utc" }
];

export default buildCommands;
