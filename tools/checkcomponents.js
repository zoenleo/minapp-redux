const path = require('path')

const _ = require('./utils')
const config = require('./config')

const srcPath = config.srcPath

/**
 * get json path's info
 */
function getJsonPathInfo(jsonPath) {
    const dirPath = path.dirname(jsonPath)
    const fileName = path.basename(jsonPath, '.json')
    const relative = path.relative(srcPath, dirPath)
    const fileBase = path.join(relative, fileName)

    return {
        dirPath,
        fileName,
        relative,
        fileBase
    }
}

/**
 * check included components
 */
const checkProps = ['usingComponents', 'componentGenerics']
async function checkIncludedComponents(jsonPath, componentListMap) {
    const json = _.readJson(jsonPath)
    if (!json) throw new Error(`json is not valid: "${jsonPath}"`)

    const { dirPath, fileName, fileBase } = getJsonPathInfo(jsonPath)

    for (let i = 0, len = checkProps.length; i < len; i++) {
        const checkProp = checkProps[i]
        const checkPropValue = json[checkProp] || {}
        const keys = Object.keys(checkPropValue)

        for (let j = 0, jlen = keys.length; j < jlen; j++) {
            const key = keys[j]
            let value =
                typeof checkPropValue[key] === 'object'
                    ? checkPropValue[key].default
                    : checkPropValue[key]
            if (!value) continue

            value = _.transformPath(value, path.sep)

            // check relative path
            const componentPath = `${path.join(dirPath, value)}.json`
            // eslint-disable-next-line no-await-in-loop
            const isExists = await _.checkFileExists(componentPath)
            if (isExists) {
                // eslint-disable-next-line no-await-in-loop
                await checkIncludedComponents(componentPath, componentListMap)
            }
        }
    }

    // checked
    componentListMap.wxmlFileList.push(`${fileBase}.wxml`)
    componentListMap.wxssFileList.push(`${fileBase}.wxss`)
    componentListMap.jsonFileList.push(`${fileBase}.json`)
    componentListMap.tsFileList.push(`${fileBase}.ts`)

    componentListMap.tsFileMap[fileBase] = `${path.join(dirPath, fileName)}.ts`
}

module.exports = async function(entry) {
    const componentListMap = {
        wxmlFileList: [],
        wxssFileList: [],
        jsonFileList: [],
        tsFileList: [],

        tsFileMap: {} // for webpack entry
    }

    const isExists = await _.checkFileExists(entry)
    if (!isExists) {
        const { dirPath, fileName, fileBase } = getJsonPathInfo(entry)

        componentListMap.tsFileList.push(`${fileBase}.ts`)
        componentListMap.tsFileMap[fileBase] = `${path.join(
            dirPath,
            fileName
        )}.ts`

        return componentListMap
    }

    await checkIncludedComponents(entry, componentListMap)

    return componentListMap
}
