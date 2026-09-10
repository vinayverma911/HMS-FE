export default function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: ["test/**/*.spec.js"],

    browsers: ["Chrome"],

    singleRun: true,
  });
};