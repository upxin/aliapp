import { resolve } from 'path';

const config = {
  projectName: 'newriozn-app',
  date: '2022-3-23',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: process.env.TARO_ENV === 'h5' ? 'build' : process.env.TARO_ENV,
  plugins: [
    '@tarojs/plugin-html',
    [
      'taro-plugin-tailwind',
      {
        scan: {
          dirs: ['./src'], // 只扫描 src 目录下的文件
          // tailwind一定要屏蔽echarts扫描 因为会有冲突
          exclude: ['./src/fleetModul/comp/ec-canvas', './src/common/*.ts'],
        },
        preflight: false,
        // 具体参数见：https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts#L10
      },
    ],
    [
      '@tarojs/plugin-framework-vue3',
      {
        mini: {
          compilerOptions: {
            isCustomElement: (tag) =>
              /^(native-)/.test(tag) || tag.startsWith('ec-'),
            whitespace: 'preserve',
          },
        },
      },
    ],
  ],
  compiler: 'webpack5',
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  alias: {
    '@': resolve(process.cwd(), 'src'),
    '@/utils': resolve(__dirname, '..', 'src/utils'),
  },
  sass: {
    resource: [
      resolve(__dirname, '..', 'src/assets/styles/custom_theme.scss'), // 修改主题变量
    ],
    data: '@import "@nutui/nutui-taro/dist/styles/variables.scss";', // 京东主题
  },
  mini: {
    miniCssExtractPluginOption: {
      //忽略css文件引入顺序
      ignoreOrder: true,
    },
    optimizeMainPackage: {
      enable: true,
    },
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve('babel-loader'),
                },
              },
            },
          },
        },
      });
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [], // 'nut-', 'van-', /van-/
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
    },
    compile: {
      exclude: [],
    },
  },
};

export default function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
}
