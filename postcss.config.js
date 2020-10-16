/**
 * PostCss的配置文件
 * postcss是基于node.js运行的一个处理css的工具
 * 所以它的配置文件也是运行在node.js中
 */
module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
