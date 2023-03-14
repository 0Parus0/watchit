#!/usr/bin/env node
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal');
const fs = require('fs');
// const chalk = require('chalk');
const { spawn } = require('child_process');

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';
        try {
            await fs.promises.access(name);
        } catch (error) {
            throw new Error(`Could not find the file ${name}`);
        }
        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            console.log('>>> Starting process...');
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 300);
        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);
