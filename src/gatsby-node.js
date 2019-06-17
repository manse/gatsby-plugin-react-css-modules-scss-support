const production = process.env.NODE_ENV === `production`;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaultLocalIdentName = production
  ? '_[hash:base64:8]'
  : '[path][name]---[local]---[hash:base64:5]';

exports.onCreateBabelConfig = ({ actions }, pluginOptions) => {
  if (pluginOptions.plugins) {
    delete pluginOptions.plugins;
  }
  actions.setBabelPlugin({
    name: `babel-plugin-react-css-modules`,
    options: {
      webpackHotModuleReloading: !production,
      generateScopedName: pluginOptions.localIdentName || defaultLocalIdentName,
      filetypes: {
        '.scss': {
          syntax: 'postcss-scss'
        }
      },
      ...pluginOptions.cssModules
    }
  });
};

exports.onCreateWebpackConfig = ({ actions, stage }, pluginOptions) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.scss$/,
          use:
            !production || stage === 'build-javascript'
              ? [
                  production ? MiniCssExtractPlugin.loader : 'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      importLoaders: 1,
                      sourceMap: !production,
                      minimize: production,
                      localIdentName:
                        pluginOptions.localIdentName || defaultLocalIdentName
                    }
                  },
                  {
                    loader: 'sass-loader',
                    options: pluginOptions.sassLoader || {}
                  }
                ]
              : ['ignore-loader']
        }
      ]
    }
  });
};
