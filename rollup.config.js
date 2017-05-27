import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const config = {
  entry: 'src/index.js',
  external: [
    'react'
  ],
  globals: {
    'react': 'React'
  },
  format: 'umd',
  moduleName: 'ReactOnboarder',
  plugins: [
    eslint(),
    resolve({
      extensions: [".js", ".jsx"]
    }),
    babel({
      exclude: "**/node_modules/**"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    }),
    commonjs({
      include: "node_modules/**"
    })
  ]
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      }
    })
  );
}

export default config;