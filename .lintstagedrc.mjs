module.exports = {
  '*.{js,jsx,ts,tsx}': ['yarn eslint --fix', 'yarn prettier --write'],
  '*.{json,css,md,mdx}': ['yarn prettier --write'],
};
