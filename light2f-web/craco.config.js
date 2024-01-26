const CracoLessPlugin = require('craco-less');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(css|js)/i,
        threshold: 1024,
        minRatio: 0.6
      })
    ]
  },
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
        modifyLessRule: function () {
          return {
            test: /\.module\.less|.less|.css$/,
            use: ['style-loader', 'css-loader', 'less-loader']
          }
        }
      }
    }
  ]
};
