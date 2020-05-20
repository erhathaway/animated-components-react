/**
 * General types
 */
type Levels = 'warn' | 'info' | 'error' | 'debug';
type Console = {
    // eslint-disable-next-line
    [level in Levels]: (...params: any[]) => void;
};

/**
 * Argument types
 */
interface ILoggerOptions {
    level?: Levels;
    collapse?: boolean;
    groupByMessage?: boolean;
}

interface ILoggerConfig {
    transports?: Transport[];
    scopes?: Scope[];
}

// eslint-disable-next-line
type MergingObject = {[key: string]: any} & ILoggerOptions & ILoggerConfig;
type Message = string | undefined;

/**
 * Event interface
 */
interface LogEvent {
    (mergingObject?: MergingObject | Message, message?: Message): void;
    (message?: Message): void;
}

/**
 * Child interface
 */
interface ChildScope {
    (mergingObject?: MergingObject | Message, message?: Message): ILogger;
    (message?: Message): ILogger;
}

interface ParentScope {
    (): ILogger;
}

/**
 * Logger interface
 */
interface ILogger {
    child: ChildScope;
    // parent: ParentScope;
    info: LogEvent;
    warn: LogEvent;
    debug: LogEvent;
    error: LogEvent;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * Scope passed along to child loggers
 */
interface Scope {
    message?: string;
    mergingObject?: MergingObject;
}

type TransportScopeControlFn = () => void;

/**
 * Transport interface
 */
type Transport = (level: Levels, mergingObject: MergingObject, message?: Message) => void;

/**
 * Browser transport types
 */
type ScopeReducerAcc = {
    begin: TransportScopeControlFn[];
    end: TransportScopeControlFn[];
    mergingObject: MergingObject;
};

const extractOptionsFromMergingObject = (
    mergingObject: MergingObject
): Omit<MergingObject, keyof ILoggerConfig & keyof ILoggerOptions> | undefined => {
    const newMergeObject = {...mergingObject};
    delete newMergeObject.scopes;
    delete newMergeObject.transports;
    delete newMergeObject.level;
    delete newMergeObject.collapse;
    delete newMergeObject.groupByMessage;

    return Object.keys(newMergeObject).length > 0 ? newMergeObject : undefined;
};

const calculateScopes = (oldScopes: Scope[], newScopes: Scope[] = []): Scope[] => {
    let diffScopes: Scope[] = [];
    if (oldScopes.length >= newScopes.length) {
        for (const [index, oldScope] of oldScopes.entries()) {
            const remainingScopes = oldScopes.length - index;

            // If old scopes have groups that the new scopes don't have, we need to end these groups
            if (newScopes[index] === undefined || oldScope.message !== newScopes[index].message) {
                Array.from(Array(remainingScopes)).forEach(() => {
                    console.groupEnd();
                });
                // Add the remaining scopes so that groups can be made for these
                diffScopes = newScopes.slice(index, newScopes.length);
                break;
            }
        }
    } else {
        for (const [index, newScope] of newScopes.entries()) {
            const remainingScopes = oldScopes.length - index;

            // If old scopes have groups that the new scopes don't have, we need to end these groups
            if (oldScopes[index] === undefined || newScope.message !== oldScopes[index].message) {
                Array.from(Array(remainingScopes)).forEach(() => {
                    console.groupEnd();
                });
                // Add the remaining scopes so that groups can be made for these
                diffScopes = newScopes.slice(index, newScopes.length);
                break;
            }
        }
    }
    return diffScopes;
};
export const browserTransport = (): Transport => {
    let previousScopes: Scope[] = [];
    return (level, mergingObject, message) => {
        const log: Console = console;
        if (mergingObject.scopes === undefined) {
            throw new Error('Missing scopes');
        }
        const calculateScopesToGroupOn =
            mergingObject && mergingObject.groupByMessage === true
                ? calculateScopes(previousScopes, mergingObject.scopes)
                : mergingObject.scopes;
        const scopeControl = calculateScopesToGroupOn.reduce(
            (acc, s) => {
                acc.begin.push(() => {
                    s.mergingObject && s.mergingObject.collapse
                        ? console.groupCollapsed(s.message)
                        : console.group(s.message);
                });
                acc.end.push(() => {
                    console.groupEnd();
                });
                return {...acc, mergingObject: {...acc.mergingObject, ...s.mergingObject}};
            },
            {begin: [], end: [], mergingObject: {}} as ScopeReducerAcc
        );

        scopeControl.begin.forEach(f => f());
        const newMergingObject = extractOptionsFromMergingObject({
            ...scopeControl.mergingObject,
            ...mergingObject
        });

        newMergingObject
            ? message
                ? log[level](message, newMergingObject)
                : log[level](newMergingObject)
            : message
            ? log[level](message)
            : noop;

        if (mergingObject && mergingObject.groupByMessage === false) {
            scopeControl.end.forEach(f => f());
        }
        previousScopes = [...mergingObject.scopes];
    };
};
const transportCaller = (logLevel: Levels, mergeObject: MergingObject): LogEvent => (
    paramOne?: object | string,
    paramTwo?: string
): void => {
    const newMergeObject =
        typeof paramOne === 'object' ? {...mergeObject, ...paramOne} : mergeObject;

    if (newMergeObject.transports === undefined) {
        throw new Error('Missing transports');
    }
    newMergeObject.transports.forEach(t => {
        if (typeof paramOne === 'string') {
            t(logLevel, newMergeObject, paramOne);
        } else {
            t(logLevel, newMergeObject, paramTwo);
        }
    });
};

export const createLogger = (
    paramOne?: MergingObject | Message,
    paramTwo?: Message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ILogger => {
    // extract existing scopes
    const oldScopes: Scope[] =
        paramOne && typeof paramOne !== 'string' && paramOne.scopes ? paramOne.scopes : [];

    // extract new mergeObject
    const newMergeObject: MergingObject = paramOne && typeof paramOne === 'object' ? paramOne : {};

    // extract new mergeObject
    const groupByMessage: ILoggerOptions['groupByMessage'] =
        paramOne && typeof paramOne === 'object' && paramOne.groupByMessage !== undefined
            ? paramOne.groupByMessage
            : false;

    // extract message
    const message: Message =
        paramOne && typeof paramOne === 'object' && paramTwo && typeof paramTwo === 'string'
            ? paramTwo
            : undefined;

    const newScope: Scope = {message, mergingObject: newMergeObject};
    const newScopes: Scope[] = [...oldScopes, newScope];

    // extract existing log level
    const level: Levels =
        paramOne && typeof paramOne !== 'string' && paramOne.level ? paramOne.level : 'info';

    // extract existing transports
    const transports: Transport[] | undefined =
        paramOne && typeof paramOne !== 'string' && paramOne.transports
            ? paramOne.transports
            : undefined;
    if (transports === undefined) {
        throw new Error(
            'You must define an initial logger transport. For instance `logger({transports: browserTransport})`'
        );
    }

    // extract collapse
    const collapse: ILoggerOptions['collapse'] =
        paramOne && typeof paramOne !== 'string' && paramOne.collapse ? paramOne.collapse : false;

    const existingMergeObj: MergingObject = {
        level,
        transports,
        scopes: newScopes,
        collapse,
        groupByMessage
    };

    return {
        child: (childParamOne?: MergingObject | Message, childParamTwo?: Message) => {
            if (typeof childParamOne === 'string') {
                return {
                    ...createLogger(existingMergeObj, childParamOne)
                };
            } else if (typeof childParamOne === 'object') {
                const childMergeObj = {
                    ...existingMergeObj,
                    ...childParamOne
                };
                return {
                    ...createLogger(childMergeObj, childParamTwo)
                };
            } else {
                // TODO add better error handling around possible abuse
                throw new Error('Invalid call');
            }
        },
        // parent: () => {
        //     const parentScopes = newScopes.length > 1 ? newScopes.slice(0, -1) : newScopes;
        //     const parentMergeObj = {
        //         ...existingMergeObj,
        //         scopes: parentScopes
        //     };
        //     const parentScope = parentScopes[parentScopes.length - 1];
        //     const parentMessage = parentScope.message;
        //     return {
        //         ...createLogger(parentMergeObj, parentMessage)
        //     };
        // },
        info: ['info', 'warn', 'debug', 'error'].includes(level)
            ? transportCaller('info', existingMergeObj)
            : noop,
        warn: ['warn', 'debug', 'error'].includes(level)
            ? transportCaller('warn', existingMergeObj)
            : noop,
        debug: ['debug', 'error'].includes(level)
            ? transportCaller('debug', existingMergeObj)
            : noop,
        error: ['error'].includes(level) ? transportCaller('error', existingMergeObj) : noop
    };
};
