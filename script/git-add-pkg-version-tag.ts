/* eslint no-console: off */
// inspired by https://github.com/okunishinishi/node-taggit

/// <reference types="node" />
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const readFileAsync = promisify(fs.readFile);

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

interface PkgDataInterface {
    version: string;
}

function isPkgData(value: unknown): value is PkgDataInterface {
    if (isObject(value)) {
        return typeof value.version === 'string';
    }
    return false;
}

async function readJSONFile(filepath: string): Promise<unknown | void> {
    const dataText = await readFileAsync(filepath, 'utf8');
    try {
        return JSON.parse(dataText);
    } catch (error) {
        console.error(`JSON parse error: ${filepath}`);
    }
    return undefined;
}

async function getTagVersionName(): Promise<string> {
    const projectPkgPath = path.join(process.cwd(), 'package.json');
    const projectPkgData = await readJSONFile(projectPkgPath);

    if (isPkgData(projectPkgData)) {
        return `v${projectPkgData.version}`;
    }

    throw new Error('Failed to find version tag name.');
}

async function tagExists(tagName: string): Promise<boolean> {
    const { stdout, stderr } = await execFileAsync('git', [
        'tag',
        '-l',
        tagName,
    ]);
    if (stderr) {
        throw new Error(`tagExists() Error: ${stderr}`);
    }
    return Boolean(stdout);
}

async function isHeadTag(tagName: string): Promise<boolean> {
    const { stdout, stderr } = await execFileAsync('git', [
        'tag',
        '-l',
        tagName,
        '--points-at',
        'HEAD',
    ]);
    if (stderr) {
        throw new Error(`isHeadTag() Error: ${stderr}`);
    }
    return Boolean(stdout);
}

async function setTag(tagName: string): Promise<void> {
    const { stderr } = await execFileAsync('git', ['tag', tagName]);
    if (stderr) {
        throw new Error(`setTag() Error: ${stderr}`);
    }
}

(async () => {
    try {
        const versionTagName = await getTagVersionName();
        const exists = await tagExists(versionTagName);

        if (exists) {
            if (!(await isHeadTag(versionTagName))) {
                throw new Error(`Git tag already exists: ${versionTagName}`);
            }
        }

        if (!exists) {
            await setTag(versionTagName);
        }
    } catch (error) {
        process.exitCode = 1;
        console.error(error instanceof Error ? error.message : error);
    }
})();
