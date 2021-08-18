import fs from 'fs'
import { argError } from './error.js'
const readFile = (path ) =>  fs.readFileSync(path).toString().split('\n').filter((str) => str !== '')

const validatePath = (path) => {
   const exists = fs.existsSync(path)
   
   if(!exists) argError('File path provided was invalid. Please enter a valid error')
}
const removeOneLine = (path ) => {
  const withoutFirstLine = fs.readFileSync(path).toString().split('\n').slice(1).join('\n')
}

const getFileName = (path) => {
  const pathArray = path.split('/')
  const last = pathArray[pathArray.length  - 1]
  const [withoutExtension] = last.split('.')
  return withoutExtension
}

export {readFile, validatePath, getFileName , removeOneLine}
