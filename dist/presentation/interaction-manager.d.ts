import type { ValidatorFn } from '../core/validator/validator.type.js';
export interface AskOptions {
    defaultAnswer?: string | undefined;
    validator?: ValidatorFn | undefined;
}
export interface Choice {
    label: string;
    value: string;
}
export declare const openInteractionManager: () => {
    ask: (question: string, options?: AskOptions) => Promise<string | undefined>;
    choose: (question: string, choices: Choice[], optional?: boolean) => Promise<Choice | undefined>;
    close: () => void;
};
//# sourceMappingURL=interaction-manager.d.ts.map