import fs from 'fs'
import nodePath from 'path'
import { argError } from './error.js'
const readFile = (path ) =>  fs.readFileSync(path).toString().split('\n').filter((str) => str !== '')

const validatePath = (path) => {
   const exists = fs.existsSync(path)
   
   if(!exists) argError(`File  path  ${path} provided was invalid. Please enter a valid error`)
}
const removeOneLine = (path ) => {
  const withoutFirstLine = fs.readFileSync(path).toString().split('\n').slice(1).join('\n')
  return withoutFirstLine
}

const getFileName = (path) => {
  const {ext} = getFileExtension(path)
  return nodePath.basename(path, ext)
}

const getFileExtension = (path) => {
  const ext = nodePath.extname(path)
  const extWithoutDot = ext.substring(1, ext.length())
  return {ext, extWithoutDot}
}
export {readFile, validatePath, getFileName, getFileExtension , removeOneLine}
