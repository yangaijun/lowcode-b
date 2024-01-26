export declare const grammar: {
    global: string;
};
/**
 * 设置全局class
 * @param classes {input*: 'inputclass', '-g@red': styles.redclass, 'select@w220': 'width220'}
 */
export declare function setDefaultClasses(classes: (() => any) | any): void;
export declare function getDefaultClasses(): any[];
export declare function clearDefaultClasses(classes: (() => any) | any): void;
