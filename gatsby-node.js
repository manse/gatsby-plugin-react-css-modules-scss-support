"use strict";

const production = process.env.NODE_ENV === `production`;

exports.onCreateBabelConfig = ({
  actions
}, pluginOptions) => {
  if (pluginOptions.plugins) {
    delete pluginOptions.plugins;
  }

  actions.setBabelPlugin({
    name: `babel-plugin-react-css-modules`,
    options: {
      webpackHotModuleReloading: !production,
      generateScopedName: '_[hash:base64:8]',
      filetypes: {
        '.scss': {
          syntax: 'postcss-scss'
        }
      }
    }
  });
};

exports.onCreateWebpackConfig = ({
  actions,
  stage
}, pluginOptions) => {
  actions.setWebpackConfig({
    module: {
      rules: [{
        test: /\.scss$/,
        use: !production || stage === 'build-javascript' ? [production ? MiniCssExtractPlugin.loader : 'style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            sourceMap: !production,
            minimize: production,
            localIdentName: '_[hash:base64:8]'
          }
        }, {
          loader: 'sass-loader',
          options: {}
        }] : ['ignore-loader']
      }]
    }
  });
};