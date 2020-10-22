const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  proxy: {
    "/api": {
      "target": "http://192.168.31.227:9909",
      "changeOrigin": true,

      "pathRewrite": { "^/api" : "" }
    }
  },

  ignoreMomentLocale: true,
  disableDynamicImport: true,
  publicPath: '',//'/fs/main/',
  hash: false,
};
