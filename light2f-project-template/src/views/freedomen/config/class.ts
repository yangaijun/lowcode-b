import { setDefaults, clearDefaults, getDefaults } from './public'

const classStack: (() => any) | any = []

export const grammar = {
  global: '-g' //全局config '-g@red': className: red
};
/**
 * 设置全局class
 * @param classes {input*: 'inputclass', '-g@red': styles.redclass, 'select@w220': 'width220'}
 */
export function setDefaultClasses(classes: (() => any) | any) {
  setDefaults(classStack, classes)
}

export function getDefaultClasses() {
  return getDefaults(classStack)
}

export function clearDefaultClasses(classes: (() => any) | any) {
  clearDefaults(classStack, classes)
}