import { setDefaults, clearDefaults, getDefaults } from './public'

const styleStack: (() => any) | any = []

export const grammar = {
  global: '-g',
  width: 'w' //style 中的 width
};

export function getDefaultStyles() {
  return getDefaults(styleStack)
}

export function setDefaultStyles(styles: any | (() => any)) {
  setDefaults(styleStack, styles)
}

export function clearDefaultStyles(styles: any | (() => any)) {
  clearDefaults(styleStack, styles)
}