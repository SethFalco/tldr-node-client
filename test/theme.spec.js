'use strict';

const assert = require('node:assert/strict')
const { describe, it } = require('node:test');
const Theme = require('../lib/theme');
const chalk = require('chalk');

describe('Theme', () => {

  describe('Rendering', () => {

    let theme = new Theme({
      commandName: 'green, bold',
      mainDescription: 'red, underline',
      exampleDescription: 'blue',
      exampleCode: 'bold',
      exampleToken: 'yellow,dim,underline'
    });

    it('should render name with green and bold', () => {
      assert.equal(theme.renderCommandName('text'), chalk.green.bold('text'));
    });

    it('should render description with red and underline', () => {
      assert.equal(theme.renderMainDescription('text'), chalk.red.underline('text'));
    });

    it('should render example description with blue', () => {
      assert.equal(theme.renderExampleDescription('text'), chalk.blue('text'));
    });

    it('should render example code with blue', () => {
      assert.equal(theme.renderExampleCode('text'), chalk.bold('text'));
    });

    it('should render example argument with yellow, dim, underline', () => {
      assert.equal(theme.renderExampleToken('text'), chalk.yellow.dim.underline('text'));
    });
  });

  describe('Rendering with new theme colors', () => {

    let theme = new Theme({
      commandName: 'greenBright, bold',
      mainDescription: 'greenBright, bold',
      exampleDescription: 'greenBright',
      exampleCode: 'redBright',
      exampleToken: 'white'
    });

    it('should render name with greenBright and bold', () => {
      assert.equal(theme.renderCommandName('text'), chalk.greenBright.bold('text'));
    });

    it('should render description with greenBright and bold', () => {
      assert.equal(theme.renderMainDescription('text'), chalk.greenBright.bold('text'));
    });

    it('should render example description with greenBright', () => {
      assert.equal(theme.renderExampleDescription('text'), chalk.greenBright('text'));
    });

    it('should render example code with redBright', () => {
      assert.equal(theme.renderExampleCode('text'), chalk.redBright('text'));
    });

    it('should render example argument with white', () => {
      assert.equal(theme.renderExampleToken('text'), chalk.white('text'));
    });
  });

  describe('Rendering with distinct colors for each token type', () => {

    let theme = new Theme({
      commandName: 'greenBright, bold',
      mainDescription: 'greenBright, bold',
      exampleDescription: 'greenBright',
      exampleCode: 'redBright',
      exampleBool: 'magenta',
      exampleNumber: 'white',
      exampleString: 'blue'
    });

    it('should render name with greenBright and bold', () => {
      assert.equal(theme.renderCommandName('text'), chalk.greenBright.bold('text'));
    });

    it('should render description with greenBright and bold', () => {
      assert.equal(theme.renderMainDescription('text'), chalk.greenBright.bold('text'));
    });

    it('should render example description with greenBright', () => {
      assert.equal(theme.renderExampleDescription('text'), chalk.greenBright('text'));
    });

    it('should render example code with redBright', () => {
      assert.equal(theme.renderExampleCode('text'), chalk.redBright('text'));
    });

    it('should render example arguments with magenta, white, and blue, for boolean, number, and string respectively', () => {
      assert.equal(theme.renderExampleToken('true'), chalk.magenta('true'));
      assert.equal(theme.renderExampleToken('9'), chalk.white('9'));
      assert.equal(theme.renderExampleToken('text'), chalk.blue('text'));
    });
  });
});
