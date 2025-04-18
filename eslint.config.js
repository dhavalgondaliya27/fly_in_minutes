import { builtinModules } from 'module';
import nodePlugin from 'eslint-plugin-node';

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...builtinModules.reduce((globals, mod) => {
          globals[mod] = 'readonly';
          return globals;
        }, {}),
        process: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    }
  },
  {
    plugins: {
      node: nodePlugin
    }
  }
];
