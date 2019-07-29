export const SCHEMA_SPEC = {
    properties: {
        types: {
            type: 'array',
            items: {
                properties: {
                    key: {
                        type: 'string',
                    },
                    name: {
                        type: 'object',
                    },
                    isApp: {
                        type: 'boolean',
                    },
                    isAbstract: {
                        type: 'boolean',
                    },
                    icon: {
                        type: 'string',
                    },
                    dataSpec: {
                        type: 'string',
                    },
                    dataForm: {
                        type: 'string',
                    },
                    functions: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                actionName: {
                                    type: 'object',
                                },
                                allowedStateKeys: {
                                    type: 'array',
                                },
                                withEntityId: {
                                    type: 'boolean',
                                },
                                inputSpec: {
                                    type: 'string',
                                },
                                inputForm: {
                                    type: 'string',
                                },
                                showResponse: {
                                    type: 'boolean',
                                },
                                contextDataSpec: {
                                    type: 'string',
                                },
                                contextDataForm: {
                                    type: 'string',
                                },
                                saveFunctionContext: {
                                    type: 'boolean',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    attachments: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                contentTypes: {
                                    type: 'array',
                                },
                                max: {
                                    type: 'number',
                                },
                                size: {
                                    type: 'number',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    calendars: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                events: {
                                    type: 'array',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    links: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                backName: {
                                    type: 'object',
                                },
                                builderType: {
                                    type: 'string',
                                },
                                typeKey: {
                                    type: 'string',
                                },
                                icon: {
                                    type: 'string',
                                },
                                max: {
                                    type: 'number',
                                },
                            },
                            required: ['key', 'name', 'builderType', 'typeKey'],
                        },
                    },
                    locations: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                max: {
                                    type: 'number',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    ratings: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                style: {
                                    type: 'string',
                                },
                                votes: {
                                    type: 'number',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    states: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                                icon: {
                                    type: 'string',
                                },
                                color: {
                                    type: 'string',
                                },
                                next: {
                                    type: 'array',
                                    items: {
                                        properties: {
                                            stateKey: {
                                                type: 'string',
                                            },
                                            name: {
                                                type: 'object',
                                            },
                                            actionName: {
                                                type: 'object',
                                            },
                                            inputSpec: {
                                                type: 'string',
                                            },
                                            inputForm: {
                                                type: 'string',
                                            },
                                            showResponse: {
                                                type: 'boolean',
                                            },
                                        },
                                    },
                                    required: ['stateKey'],
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    tags: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                    comments: {
                        type: 'array',
                        items: {
                            properties: {
                                key: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'object',
                                },
                            },
                            required: ['key', 'name'],
                        },
                    },
                },
                required: ['key', 'name'],
            },
        },
    },
    required: ['types'],
};
