// based on https://github.com/microlinkhq/youtube-dl-exec/
import execa from "execa"
import dargs from "dargs"

const generateArguments = (path, flags) => {
  return [path].concat(dargs(flags, {useEquals: false})).filter(Boolean)
}
export const apRaw = (path, options, execaOptions) => {
  return execa('AtomicParsley', [...generateArguments(path, options), '--overWrite'],  execaOptions)
}
