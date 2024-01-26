const CracoLessPlugin = require('craco-less');

module.exports = {
  eslint: {
    configure: {
      rules: {
        'jsx-a11y/anchor-is-valid': 'off'
      }
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        },
        modifyLessRule: function() {
          return {
            test: /\.module\.less|.less$/, 
            use: ['style-loader', 'css-loader', 'less-loader'] 
          }
        }
      }
    }
  ]
};
