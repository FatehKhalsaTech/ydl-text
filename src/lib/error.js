import { InvalidOptionArgumentError, CommanderError  } from "commander";

export const argError = (text) => {
  throw new InvalidOptionArgumentError(text)
}

export const endWithError = (text) => {
  throw new CommanderError(text)
}