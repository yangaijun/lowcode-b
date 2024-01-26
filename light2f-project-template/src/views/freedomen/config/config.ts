import { setDefaults, clearDefaults, getDefaults } from './public'

const configStack: (() => any) | any = []

export const grammar = {
  global: '-g' //全局config '-g@samll': {size: 'small',...} => 'button@small', 'input@small'... , 都是用此配置
};

export function setDefaultConfigs(configs: any | (() => any)) {
  setDefaults(configStack, configs)
};

export function getDefaultConfigs() {
  return getDefaults(configStack)
}

export function clearDefaultConfigs(configs: any | (() => any)) {
  clearDefaults(configStack, configs)
}