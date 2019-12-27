import * as AJV from 'ajv';

import { ConfigError } from './config-error.model';
import { SCHEMA } from './schema';
import { SCHEMA_SPEC } from './schema-spec';

declare let YAML: any;

export class ConfigValidatorUtil {

    public static validate(content: string): ConfigError[] {
        const errors = [];
        let spec = null;
        try {
            spec = YAML.parse(content);
        } catch (err) {
            errors.push(new ConfigError(err.message, err.parsedLine, err.snippet));
            return errors;
        }

        errors.push(...ConfigValidatorUtil.validateObjectBySchema(spec, SCHEMA_SPEC));
        errors.push(...ConfigValidatorUtil.validateJsonAttributes(spec));
        errors.push(...ConfigValidatorUtil.validateSpecAttributes(spec));
        errors.push(...ConfigValidatorUtil.validateTypeKeysUniqueness(spec));
        errors.push(...ConfigValidatorUtil.validateNextStates(spec));
        errors.push(...ConfigValidatorUtil.validateLinkReferences(spec));
        return errors;
    }

    public static validateYAML(content: string): ConfigError[] {
        const errors = [];

        try {
            YAML.parse(content);
        } catch (err) {
            errors.push(new ConfigError(err.message, err.parsedLine, err.snippet));
            return errors;
        }
        return errors;
    }

    private static validateObjectBySchema(object: any, schema: any, path?: string): ConfigError[] {
        const errors = [];
        const validate = new AJV({allErrors: true}).compile(schema);
        const valid = validate(object);
        if (!valid) {
            validate.errors.forEach((err) => errors.push({
                message: err.message,
                path: (path ? path : '') + err.dataPath,
            }));
        }
        return errors;
    }

    private static validateJson(content: string, path?: string): ConfigError[] {
        const errors = [];
        try {
            JSON.parse(content);
        } catch (err) {
            errors.push({message: err.message, path});
            return errors;
        }
        return errors;
    }

    // tslint:disable-next-line:cognitive-complexity
    private static findAttributes(object: any, name: string, parent?: string): any[] {
        const result = [];
        for (const property in object) {
            if (object.hasOwnProperty(property)) {
                if (object[property] instanceof Array) {
                    for (const i in object[property]) {
                        if (object[property].hasOwnProperty(i)) {
                            const PARENT = `${parent}.${property}[${i}]`;
                            result.push(...ConfigValidatorUtil.findAttributes(object[property][i], name, PARENT));
                        }
                    }
                } else if (object[property] instanceof Object) {
                    result.push(...ConfigValidatorUtil.findAttributes(object[property], name, `${parent}.${property}`));
                } else {
                    if (property === name) {
                        result.push({
                            path: `${parent}.${name}`,
                            value: object[property],
                        });
                    }
                }
            }
        }
        return result;
    }

    private static validateJsonAttributes(spec: any): ConfigError[] {
        const errors = [];
        const attributes = [];
        for (const aName of ['dataSpec', 'dataForm', 'inputSpec', 'inputForm', 'contextDataSpec', 'contextDataForm']) {
            attributes.push(...ConfigValidatorUtil.findAttributes(spec, aName, ''));
        }
        for (const a of attributes) {
            errors.push(...ConfigValidatorUtil.validateJson(a.value, a.path));
        }
        return errors;
    }

    private static validateSpecAttributes(spec: any): ConfigError[] {
        const errors = [];
        const attributes = [];
        for (const aName of ['dataSpec', 'inputSpec', 'contextDataSpec']) {
            attributes.push(...ConfigValidatorUtil.findAttributes(spec, aName, ''));
        }
        for (const a of attributes) {
            try {
                errors.push(...ConfigValidatorUtil.validateObjectBySchema(JSON.parse(a.value), SCHEMA, a.path));
            } catch (err) {
                console.info(err); // tslint:disable-line
                console.info('valueRaw %o', a); // tslint:disable-line
            }
        }
        return errors;
    }

    private static validateTypeKeysUniqueness(spec: any): ConfigError[] {
        const errors = [];
        const grouped = spec.types.reduce((group, item) => {
            group[item.key] = (group[item.key] || 0) + 1;
            return group;
        }, {});
        for (const key in grouped) {
            if (grouped[key] > 1) {
                errors.push({message: `type key is not unique [${key}]`});
            }
        }
        return errors;
    }

    private static validateNextStates(spec: any): ConfigError[] {
        const errors = [];
        for (const type of spec.types) {
            type.states = type.states ? type.states : [];
            for (const state of type.states) {
                state.next = state.next ? state.next : [];
                for (const next of state.next) {
                    if (!type.states.filter((s) => s.key === next.stateKey).length) {
                        errors.push({message: `state with key [${next.stateKey}] for next reference not present`});
                    }
                }
            }
        }
        return errors;
    }

    private static validateLinkReferences(spec: any): ConfigError[] {
        const errors = [];
        for (const type of spec.types) {
            type.links = type.links ? type.links : [];
            for (const link of type.links) {
                if (!spec.types.filter((t) => t.key === link.typeKey).length) {
                    errors.push({message: `link target error for key [${link.typeKey}] as not present`});
                }
            }
        }
        return errors;
    }
}
