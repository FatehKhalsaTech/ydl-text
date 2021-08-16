import fs from 'fs'
const readFile = (path ) =>  fs.readFileSync(path).toString().split('\n').filter((str) => str !== '')

const removeOneLine = (path ) => {
  const withoutFirstLine = fs.readFileSync(path).toString().split('\n').slice(1).join('\n')



}

export {readFile, removeOneLine}