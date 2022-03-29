#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer')
const fs = require('fs');
const chalk = require('chalk');//给提示文案着色

// 提示样式s
const success = chalk.blueBright;
const error = chalk.bold.red;

const download = require('download-git-repo');//拉取github项目

// 动画
const ora = require('ora')
const {yellow} = require("chalk");

program
  .version('0.1.0','-v')
  .option('-n, --yourname [yourname]', 'Your name')
  .option('-g, --glad', 'Tell us you are happy')
  .parse(process.argv);

if (program.opts().yourname) {
  console.log(`Hello, ${program.opts().yourname}! ${program.glad ? 'I am very happy to see you!' : ''}`);
}

const promptList = [
  //具体交互内容
  {
    type: 'input',
    message: '请输入项目名称：',
    name: 'name',
    validate(input) {
      if (!input) {
        return '请输入项目名称!';
      }

      if (fs.existsSync(input)) {
        return '项目名已重复!'
      }

      return true;
    }
  }
]

inquirer.prompt(promptList).then(answers => {
  let url = 'zhushaohz/zzvue'
  const spinner = ora('正在下载模版...').start()
  download(url, answers.name, function (err) {
    if (!err) {
      spinner.succeed(success('下载完成'))
      changePackage(answers.name)
      spinner.succeed(success('项目创建成功！'))
      spinner.succeed(success('Done. Now run:\n'))
      spinner.indent = 4
      console.log(chalk.dim(`   cd ${answers.name}`))
      console.log(chalk.dim(`   npm install`))
      console.log(chalk.dim(`   npm run dev`))

    } else {
      console.log(err)
      spinner.fail('下载失败')
    }
  })
})

const changePackage = (name) => {
  console.log(chalk.blue('正在替换package.json中的内容...'))
  fs.readFile(`${name}/package.json`, (err, data) => {
    if (err) throw err;
    let _data = JSON.parse(data.toString());
    _data.name = name;
    _data.version = '0.0.0';
    let str = JSON.stringify(_data, null, 4);
    fs.writeFile(`${name}/package.json`, str, function (err) {
      if (err) throw err;
    })
  })
  console.log(success('替换完成'))
}
