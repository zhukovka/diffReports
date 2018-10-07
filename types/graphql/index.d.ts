declare module 'graphql' {

    export type ObjMap<T> = { [key: string]: T, __proto__: null };
    export type MaybePromise<T> = Promise<T> | T;
    /**
     * Used while defining GraphQL types to allow for circular references in
     * otherwise immutable type definitions.
     */
    export type Thunk<T> = (() => T) | T;
    type TypeMap = ObjMap<GraphQLNamedType>;
    export type ResponsePath = {
        prev: ResponsePath | void,
        key: string | number,
    };
    // Values

    export type ValueNode =
        | VariableNode
        | IntValueNode
        | FloatValueNode
        | StringValueNode
        | BooleanValueNode
        | NullValueNode
        | EnumValueNode
        | ListValueNode
        | ObjectValueNode;

    export type VariableNode = {
        kind: 'Variable',
        loc?: Location,
        name: NameNode,
    };

    export type IntValueNode = {
        kind: 'IntValue',
        loc?: Location,
        value: string,
    };

    export type FloatValueNode = {
        kind: 'FloatValue',
        loc?: Location,
        value: string,
    };

    export type StringValueNode = {
        kind: 'StringValue',
        loc?: Location,
        value: string,
        block?: boolean,
    };

    export type BooleanValueNode = {
        kind: 'BooleanValue',
        loc?: Location,
        value: boolean,
    };

    export type NullValueNode = {
        kind: 'NullValue',
        loc?: Location,
    };

    export type EnumValueNode = {
        kind: 'EnumValue',
        loc?: Location,
        value: string,
    };

    export type ListValueNode = {
        kind: 'ListValue',
        loc?: Location,
        values: Array<ValueNode>,
    };

    export type ObjectValueNode = {
        kind: 'ObjectValue',
        loc?: Location,
        fields: Array<ObjectFieldNode>,
    };

    export type ObjectFieldNode = {
        kind: 'ObjectField',
        loc?: Location,
        name: NameNode,
        value: ValueNode,
    };

    export type OperationTypeDefinitionNode = {
        kind: 'OperationTypeDefinition',
        loc?: Location,
        operation: OperationTypeNode,
        type: NamedTypeNode,
    };
    // Type Reference

    export type TypeNode = NamedTypeNode | ListTypeNode | NonNullTypeNode;

    export type NamedTypeNode = {
        kind: 'NamedType',
        loc?: Location,
        name: NameNode,
    };

    export type ListTypeNode = {
        kind: 'ListType',
        loc?: Location,
        type: TypeNode,
    };

    export type NonNullTypeNode = {
        kind: 'NonNullType',
        loc?: Location,
        type: NamedTypeNode | ListTypeNode,
    };
    // Type Definition

    export type TypeDefinitionNode =
        | ScalarTypeDefinitionNode
        | ObjectTypeDefinitionNode
        | InterfaceTypeDefinitionNode
        | UnionTypeDefinitionNode
        | EnumTypeDefinitionNode
        | InputObjectTypeDefinitionNode;

    export type ScalarTypeDefinitionNode = {
        kind: 'ScalarTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
    };

    export type ObjectTypeDefinitionNode = {
        kind: 'ObjectTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        interfaces?: Array<NamedTypeNode>,
        directives?: Array<DirectiveNode>,
        fields?: Array<FieldDefinitionNode>,
    };

    export type FieldDefinitionNode = {
        kind: 'FieldDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        arguments?: Array<InputValueDefinitionNode>,
        type: TypeNode,
        directives?: Array<DirectiveNode>,
    };

    export type InputValueDefinitionNode = {
        kind: 'InputValueDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        type: TypeNode,
        defaultValue?: ValueNode,
        directives?: Array<DirectiveNode>,
    };

    export type InterfaceTypeDefinitionNode = {
        kind: 'InterfaceTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        fields?: Array<FieldDefinitionNode>,
    };

    export type UnionTypeDefinitionNode = {
        kind: 'UnionTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        types?: Array<NamedTypeNode>,
    };

    export type EnumTypeDefinitionNode = {
        kind: 'EnumTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        values?: Array<EnumValueDefinitionNode>,
    };

    export type EnumValueDefinitionNode = {
        kind: 'EnumValueDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
    };

    export type InputObjectTypeDefinitionNode = {
        kind: 'InputObjectTypeDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        fields?: Array<InputValueDefinitionNode>,
    };
    // Type System Definition

    export type TypeSystemDefinitionNode =
        | SchemaDefinitionNode
        | TypeDefinitionNode
        | DirectiveDefinitionNode;

    // Directive Definitions

    export type DirectiveDefinitionNode = {
        kind: 'DirectiveDefinition',
        loc?: Location,
        description?: StringValueNode,
        name: NameNode,
        arguments?: Array<InputValueDefinitionNode>,
        locations: Array<NameNode>,
    };

// Type System Extensions

    export type TypeSystemExtensionNode = SchemaExtensionNode | TypeExtensionNode;

    export type SchemaExtensionNode = {
        kind: 'SchemaExtension',
        loc?: Location,
        directives?: Array<DirectiveNode>,
        operationTypes?: Array<OperationTypeDefinitionNode>,
    };

// Type Extensions

    export type TypeExtensionNode =
        | ScalarTypeExtensionNode
        | ObjectTypeExtensionNode
        | InterfaceTypeExtensionNode
        | UnionTypeExtensionNode
        | EnumTypeExtensionNode
        | InputObjectTypeExtensionNode;

    export type ScalarTypeExtensionNode = {
        kind: 'ScalarTypeExtension',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
    };

    export type ObjectTypeExtensionNode = {
        kind: 'ObjectTypeExtension',
        loc?: Location,
        name: NameNode,
        interfaces?: Array<NamedTypeNode>,
        directives?: Array<DirectiveNode>,
        fields?: Array<FieldDefinitionNode>,
    };

    export type InterfaceTypeExtensionNode = {
        kind: 'InterfaceTypeExtension',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        fields?: Array<FieldDefinitionNode>,
    };

    export type UnionTypeExtensionNode = {
        kind: 'UnionTypeExtension',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        types?: Array<NamedTypeNode>,
    };

    export type EnumTypeExtensionNode = {
        kind: 'EnumTypeExtension',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        values?: Array<EnumValueDefinitionNode>,
    };

    export type InputObjectTypeExtensionNode = {
        kind: 'InputObjectTypeExtension',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
        fields?: Array<InputValueDefinitionNode>,
    };

    export type SelectionSetNode = {
        kind: 'SelectionSet',
        loc?: Location,
        selections: Array<SelectionNode>,
    };

    export type FieldNode = {
        kind: 'Field',
        loc?: Location,
        alias?: NameNode,
        name: NameNode,
        arguments?: Array<ArgumentNode>,
        directives?: Array<DirectiveNode>,
        selectionSet?: SelectionSetNode,
    };

    export type SelectionNode = FieldNode | FragmentSpreadNode | InlineFragmentNode;
    // Fragments

    export type FragmentSpreadNode = {
        kind: 'FragmentSpread',
        loc?: Location,
        name: NameNode,
        directives?: Array<DirectiveNode>,
    };

    export type InlineFragmentNode = {
        kind: 'InlineFragment',
        loc?: Location,
        typeCondition?: NamedTypeNode,
        directives?: Array<DirectiveNode>,
        selectionSet: SelectionSetNode,
    };

    export type FragmentDefinitionNode = {
        kind: 'FragmentDefinition',
        loc?: Location,
        name: NameNode,
        // Note: fragment variable definitions are experimental and may be changed
        // or removed in the future.
        variableDefinitions?: Array<VariableDefinitionNode>,
        typeCondition: NamedTypeNode,
        directives?: Array<DirectiveNode>,
        selectionSet: SelectionSetNode,
    };
    // Document

    export type DocumentNode = {
        kind: 'Document',
        loc?: Location,
        definitions: Array<DefinitionNode>,
    };

    export type DefinitionNode =
        | ExecutableDefinitionNode
        | TypeSystemDefinitionNode
        | TypeSystemExtensionNode;

    export type ExecutableDefinitionNode =
        | OperationDefinitionNode
        | FragmentDefinitionNode;

    export type OperationDefinitionNode = {
        kind: 'OperationDefinition',
        loc?: Location,
        operation: OperationTypeNode,
        name?: NameNode,
        variableDefinitions?: Array<VariableDefinitionNode>,
        directives?: Array<DirectiveNode>,
        selectionSet: SelectionSetNode,
    };

    export type OperationTypeNode = 'query' | 'mutation' | 'subscription';

    export type VariableDefinitionNode = {
        kind: 'VariableDefinition',
        loc?: Location,
        variable: VariableNode,
        type: TypeNode,
        defaultValue?: ValueNode,
        directives?: Array<DirectiveNode>,
    };
    // Name

    export type NameNode = {
        kind: 'Name',
        loc?: Location,
        value: string,
    };

    export type ArgumentNode = {
        kind: 'Argument',
        loc?: Location,
        name: NameNode,
        value: ValueNode,
    };
    // Directives

    export type DirectiveNode = {
        kind: 'Directive',
        loc?: Location,
        name: NameNode,
        arguments?: Array<ArgumentNode>,
    };
    export type SchemaDefinitionNode = {
        kind: 'SchemaDefinition',
        loc?: Location,
        directives?: Array<DirectiveNode>,
        operationTypes: Array<OperationTypeDefinitionNode>,
    };
    export type GraphQLScalarSerializer<TExternal> = (value: any) => TExternal;
    export type GraphQLScalarValueParser<TInternal> = (value: any) => TInternal;
    export type GraphQLScalarLiteralParser<TInternal> = (
        valueNode: ValueNode,
        variables?: any,
    ) => TInternal;
    export type GraphQLTypeResolver<TSource, TContext> = (
        value: TSource,
        context: TContext,
        info: GraphQLResolveInfo,
    ) => MaybePromise<GraphQLObjectType | string>;

    export type GraphQLFieldResolver<TSource,
        TContext,
        TArgs = { [argument: string]: any },
        > = (
        source: TSource,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo,
    ) => any;

    export class GraphQLScalarType {
        name: string;
        description?: string;
        serialize: GraphQLScalarSerializer<any>;
        parseValue: GraphQLScalarValueParser<any>;
        parseLiteral: GraphQLScalarLiteralParser<any>;
        astNode?: ScalarTypeDefinitionNode;
        extensionASTNodes?: Array<ScalarTypeExtensionNode>;
    }

    /**
     * Interface Type Definition
     *
     * When a field can return one of a heterogeneous set of types, a Interface type
     * is used to describe what types are possible, what fields are in common across
     * all types, as well as a function to determine which type is actually used
     * when the field is resolved.
     *
     * Example:
     *
     *     const EntityType = new GraphQLInterfaceType({
     *       name: 'Entity',
     *       fields: {
     *         name: { type: GraphQLString }
     *       }
     *     });
     *
     */
    export class GraphQLInterfaceType {
        name: string;
        description?: string;
        astNode?: InterfaceTypeDefinitionNode;
        extensionASTNodes?: Array<InterfaceTypeExtensionNode>;
        resolveType?: GraphQLTypeResolver<any, any>;

        _fields: Thunk<GraphQLFieldMap<any, any>>;
    }

    export type GraphQLResolveInfo = {
        fieldName: string,
        fieldNodes: Array<FieldNode>,
        returnType: GraphQLOutputType,
        parentType: GraphQLObjectType,
        path: ResponsePath,
        schema: GraphQLSchema,
        fragments: ObjMap<FragmentDefinitionNode>,
        rootValue: any,
        operation: OperationDefinitionNode,
        variableValues: { [variable: string]: any },
    };

    export type GraphQLIsTypeOfFn<TSource, TContext> = (
        source: TSource,
        context: TContext,
        info: GraphQLResolveInfo,
    ) => MaybePromise<boolean>;

    export type GraphQLArgument = {
        name: string,
        type: GraphQLInputType,
        defaultValue?: any,
        description?: string,
        astNode?: InputValueDefinitionNode,
    };

    export type GraphQLField<TSource,
        TContext,
        TArgs = { [argument: string]: any },
        > = {
        name: string,
        description?: string,
        type: GraphQLOutputType,
        args: Array<GraphQLArgument>,
        resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>,
        subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>,
        isDeprecated?: boolean,
        deprecationReason?: string,
        astNode?: FieldDefinitionNode,
    };

    export type GraphQLFieldMap<TSource, TContext> = ObjMap<GraphQLField<TSource, TContext>>;

    export type GraphQLEnumValue /* <T> */ = {
        name: string,
        description: string,
        isDeprecated?: boolean,
        deprecationReason: string,
        astNode?: EnumValueDefinitionNode,
        value: any /* T */,
    };

    export class GraphQLObjectType {
        name: string;
        description?: string;
        astNode?: ObjectTypeDefinitionNode;
        extensionASTNodes?: Array<ObjectTypeExtensionNode>;
        isTypeOf?: GraphQLIsTypeOfFn<any, any>;

        _fields: Thunk<GraphQLFieldMap<any, any>>;
        _interfaces: Thunk<Array<GraphQLInterfaceType>>;
    }

    /**
     * Union Type Definition
     *
     * When a field can return one of a heterogeneous set of types, a Union type
     * is used to describe what types are possible as well as providing a function
     * to determine which type is actually used when the field is resolved.
     *
     * Example:
     *
     *     const PetType = new GraphQLUnionType({
     *       name: 'Pet',
     *       types: [ DogType, CatType ],
     *       resolveType(value) {
     *         if (value instanceof Dog) {
     *           return DogType;
     *         }
     *         if (value instanceof Cat) {
     *           return CatType;
     *         }
     *       }
     *     });
     *
     */
    export class GraphQLUnionType {
        name: string;
        description?: string;
        astNode?: UnionTypeDefinitionNode;
        extensionASTNodes?: Array<UnionTypeExtensionNode>;
        resolveType?: GraphQLTypeResolver<any, any>;

        _types: Thunk<Array<GraphQLObjectType>>;
    }

    /**
     * Enum Type Definition
     *
     * Some leaf values of requests and input values are Enums. GraphQL serializes
     * Enum values as strings, however internally Enums can be represented by any
     * kind of type, often integers.
     *
     * Example:
     *
     *     const RGBType = new GraphQLEnumType({
     *       name: 'RGB',
     *       values: {
     *         RED: { value: 0 },
     *         GREEN: { value: 1 },
     *         BLUE: { value: 2 }
     *       }
     *     });
     *
     * Note: If a value is not provided in a definition, the name of the enum value
     * will be used as its internal value.
     */
    export class GraphQLEnumType /* <T> */ {
        name: string;
        description?: string;
        astNode?: EnumTypeDefinitionNode;
        extensionASTNodes?: Array<EnumTypeExtensionNode>;

        _values: Array<GraphQLEnumValue /* <T> */>;
        _valueLookup: Map<any /* T */, GraphQLEnumValue>;
        _nameLookup: ObjMap<GraphQLEnumValue>;
    }

    /**
     * List Type Wrapper
     *
     * A list is a wrapping type which points to another type.
     * Lists are often created within the context of defining the fields of
     * an object type.
     *
     * Example:
     *
     *     const PersonType = new GraphQLObjectType({
     *       name: 'Person',
     *       fields: () => ({
     *         parents: { type: GraphQLList(PersonType) },
     *         children: { type: GraphQLList(PersonType) },
     *       })
     *     })
     *
     */
    export class GraphQLList<T extends GraphQLType> {
        ofType: T;

        static<T extends GraphQLType> (ofType: T): GraphQLList<T>;

        // Note: constructors cannot be used for covariant types. Drop the "new".
        constructor (ofType: GraphQLType);
    }

    /**
     * Non-Null Type Wrapper
     *
     * A non-null is a wrapping type which points to another type.
     * Non-null types enforce that their values are never null and can ensure
     * an error is raised if this ever occurs during a request. It is useful for
     * fields which you can make a strong guarantee on non-nullability, for example
     * usually the id field of a database row will never be null.
     *
     * Example:
     *
     *     const RowType = new GraphQLObjectType({
     *       name: 'Row',
     *       fields: () => ({
     *         id: { type: GraphQLNonNull(GraphQLString) },
     *       })
     *     })
     *
     * Note: the enforcement of non-nullability occurs within the executor.
     */
    export class GraphQLNonNull<T extends GraphQLNullableType> {
        ofType: T;

        static<T extends GraphQLNullableType> (ofType: T): GraphQLNonNull<T>;

        // Note: constructors cannot be used for covariant types. Drop the "new".
        constructor (ofType: GraphQLType);
    }

    /**
     * Input Object Type Definition
     *
     * An input object defines a structured collection of fields which may be
     * supplied to a field argument.
     *
     * Using `NonNull` will ensure that a value must be provided by the query
     *
     * Example:
     *
     *     const GeoPoint = new GraphQLInputObjectType({
     *       name: 'GeoPoint',
     *       fields: {
     *         lat: { type: GraphQLNonNull(GraphQLFloat) },
     *         lon: { type: GraphQLNonNull(GraphQLFloat) },
     *         alt: { type: GraphQLFloat, defaultValue: 0 },
     *       }
     *     });
     *
     */
    export class GraphQLInputObjectType {
        name: string;
        description?: string;
        astNode?: InputObjectTypeDefinitionNode;
        extensionASTNodes?: Array<InputObjectTypeExtensionNode>;

        _fields: Thunk<GraphQLInputFieldMap>;

        constructor (config: GraphQLInputObjectTypeConfig);
    }

    type DirectiveLocationEnum = 'QUERY' |
        'MUTATION' |
        'SUBSCRIPTION' |
        'FIELD' |
        'FRAGMENT_DEFINITION' |
        'FRAGMENT_SPREAD' |
        'INLINE_FRAGMENT' |
        'VARIABLE_DEFINITION' |
        // Type System Definitions
        'SCHEMA' |
        'SCALAR' |
        'OBJECT' |
        'FIELD_DEFINITION' |
        'ARGUMENT_DEFINITION' |
        'INTERFACE' |
        'UNION' |
        'ENUM' |
        'ENUM_VALUE' |
        'INPUT_OBJECT' |
        'INPUT_FIELD_DEFINITION';

    /**
     * Directives are used by the GraphQL runtime as a way of modifying execution
     * behavior. Type system creators will usually not create these directly.
     */
    export class GraphQLDirective {
        name: string;
        description: string;
        locations: Array<DirectiveLocationEnum>;
        args: Array<GraphQLArgument>;
        astNode: DirectiveDefinitionNode;

        constructor (config: GraphQLDirectiveConfig)
    }

    export type GraphQLArgumentConfig = {
        type: GraphQLInputType,
        defaultValue?: any,
        description?: string,
        astNode?: InputValueDefinitionNode,
    };
    export type GraphQLDirectiveConfig = {
        name: string,
        description?: string,
        locations: Array<DirectiveLocationEnum>,
        args?: GraphQLFieldConfigArgumentMap,
        astNode?: DirectiveDefinitionNode,
    };
    export type GraphQLInputObjectTypeConfig = {
        name: string,
        fields: Thunk<GraphQLInputFieldConfigMap>,
        description?: string,
        astNode?: InputObjectTypeDefinitionNode,
        extensionASTNodes?: Array<InputObjectTypeExtensionNode>,
    };
    export type GraphQLInputFieldConfig = {
        type: GraphQLInputType,
        defaultValue?: any,
        description?: string,
        astNode?: InputValueDefinitionNode,
    };
    export type GraphQLInputField = {
        name: string,
        type: GraphQLInputType,
        defaultValue?: any,
        description?: string,
        astNode?: InputValueDefinitionNode,
    };
    export type GraphQLInputFieldConfigMap = ObjMap<GraphQLInputFieldConfig>;
    export type GraphQLInputFieldMap = ObjMap<GraphQLInputField>;
    /**
     * These types can all accept null as a value.
     */
    export type GraphQLNullableType =
        | GraphQLScalarType
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLUnionType
        | GraphQLEnumType
        | GraphQLInputObjectType
        | GraphQLList<any>;
    /**
     * These types may be used as output types as the result of fields.
     */
    export type GraphQLOutputType = GraphQLScalarType
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLUnionType
        | GraphQLEnumType
        | GraphQLList<any>
        | GraphQLNonNull<GraphQLScalarType | GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType | GraphQLEnumType | GraphQLList<any>>;

    /**
     * These types may describe the parent context of a selection set.
     */
    export type GraphQLCompositeType =
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLUnionType;

    /**
     * These types may describe the parent context of a selection set.
     */
    export type GraphQLAbstractType = GraphQLInterfaceType | GraphQLUnionType;

    /**
     * These are all of the possible kinds of types.
     */
    export type GraphQLType =
        | GraphQLScalarType
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLUnionType
        | GraphQLEnumType
        | GraphQLInputObjectType
        | GraphQLList<any>
        | GraphQLNonNull<any>;
    /**
     * These types may be used as input types for arguments and directives.
     */
    export type GraphQLInputType =
        | GraphQLScalarType
        | GraphQLEnumType
        | GraphQLInputObjectType
        | GraphQLList<any>
        | GraphQLNonNull<GraphQLScalarType | GraphQLEnumType | GraphQLInputObjectType | GraphQLList<any>>;
    /**
     * These named types do not include modifiers like List or NonNull.
     */
    export type GraphQLNamedType =
        | GraphQLScalarType
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLUnionType
        | GraphQLEnumType
        | GraphQLInputObjectType;

    /**
     * The list of all possible AST node types.
     */
    export type ASTNode =
        | NameNode
        | DocumentNode
        | OperationDefinitionNode
        | VariableDefinitionNode
        | VariableNode
        | SelectionSetNode
        | FieldNode
        | ArgumentNode
        | FragmentSpreadNode
        | InlineFragmentNode
        | FragmentDefinitionNode
        | IntValueNode
        | FloatValueNode
        | StringValueNode
        | BooleanValueNode
        | NullValueNode
        | EnumValueNode
        | ListValueNode
        | ObjectValueNode
        | ObjectFieldNode
        | DirectiveNode
        | NamedTypeNode
        | ListTypeNode
        | NonNullTypeNode
        | SchemaDefinitionNode
        | OperationTypeDefinitionNode
        | ScalarTypeDefinitionNode
        | ObjectTypeDefinitionNode
        | FieldDefinitionNode
        | InputValueDefinitionNode
        | InterfaceTypeDefinitionNode
        | UnionTypeDefinitionNode
        | EnumTypeDefinitionNode
        | EnumValueDefinitionNode
        | InputObjectTypeDefinitionNode
        | DirectiveDefinitionNode
        | SchemaExtensionNode
        | ScalarTypeExtensionNode
        | ObjectTypeExtensionNode
        | InterfaceTypeExtensionNode
        | UnionTypeExtensionNode
        | EnumTypeExtensionNode
        | InputObjectTypeExtensionNode;

    export class GraphQLSchema {
        astNode?: SchemaDefinitionNode;
        extensionASTNodes?: Array<SchemaExtensionNode>;
        _queryType?: GraphQLObjectType;
        _mutationType?: GraphQLObjectType;
        _subscriptionType?: GraphQLObjectType;
        _directives: Array<GraphQLDirective>;
        _typeMap: TypeMap;
        _implementations: ObjMap<Array<GraphQLObjectType>>;
        _possibleTypeMap?: ObjMap<ObjMap<boolean>>;
        // Used as a cache for validateSchema().
        __validationErrors?: Array<GraphQLError>;
        // Referenced by validateSchema().
        __allowedLegacyNames: Array<string>;
    }

    export type GraphQLArgs = {
        schema: GraphQLSchema,
        source: string | Source,
        rootValue?: any,
        contextValue?: any,
        variableValues?: ObjMap<any>,
        operationName?: string,
        fieldResolver?: GraphQLFieldResolver<any, any>,
    };
    export type GraphQLFieldConfigArgumentMap = ObjMap<GraphQLArgumentConfig>;

    /**
     * A representation of source input to GraphQL.
     * `name` and `locationOffset` are optional. They are useful for clients who
     * store GraphQL documents in source files; for example, if the GraphQL input
     * starts at line 40 in a file named Foo.graphql, it might be useful for name to
     * be "Foo.graphql" and location to be `{ line: 40, column: 0 }`.
     * line and column in locationOffset are 1-indexed
     */
    export class Source {
        body: string;
        name: string;
        locationOffset: Location;

        constructor (body: string, name?: string, locationOffset?: Location)
    }

    /**
     * A GraphQLError describes an Error found during the parse, validate, or
     * execute phases of performing a GraphQL operation. In addition to a message
     * and stack trace, it also includes information about the locations in a
     * GraphQL document and/or execution result that correspond to the Error.
     */
    export class GraphQLError extends Error {
        constructor (
            message: string,
            nodes?: Array<ASTNode> | ASTNode | void,
            source?: Source,
            positions?: Array<number>,
            path?: Array<string | number>,
            originalError?: Error,
            extensions?: { [key: string]: any },
        )
    }

    /**
     * The result of GraphQL execution.
     *
     *   - `errors` is included when any errors occurred as a non-empty array.
     *   - `data` is the result of a successful execution of the query.
     */
    export type ExecutionResult = {
        errors?: Array<GraphQLError>,
        data?: ObjMap<any>,
    };

    export function graphql (schema: GraphQLSchema,
                             source: string | Source,
                             rootValue?: any,
                             contextValue?: any,
                             variableValues?: ObjMap<any>,
                             operationName?: string,
                             fieldResolver?: GraphQLFieldResolver<any, any>, ..._: []): Promise<ExecutionResult>;

    export type GraphQLSchemaValidationOptions = {
        /**
         * When building a schema from a GraphQL service's introspection result, it
         * might be safe to assume the schema is valid. Set to true to assume the
         * produced schema is valid.
         *
         * Default: false
         */
        assumeValid?: boolean,

        /**
         * If provided, the schema will consider fields or types with names included
         * in this list valid, even if they do not adhere to the specification's
         * schema validation rules.
         *
         * This option is provided to ease adoption and will be removed in v15.
         */
        allowedLegacyNames?: Array<string>,
    };
    export type BuildSchemaOptions = GraphQLSchemaValidationOptions & {
        /**
         * Descriptions are defined as preceding string literals, however an older
         * experimental version of the SDL supported preceding comments as
         * descriptions. Set to true to enable this deprecated behavior.
         * This option is provided to ease adoption and will be removed in v16.
         *
         * Default: false
         */
        commentDescriptions?: boolean,

        /**
         * Set to true to assume the SDL is valid.
         *
         * Default: false
         */
        assumeValidSDL?: boolean,
    };

    /**
     * Configuration options to control parser behavior
     */
    export type ParseOptions = {
        /**
         * By default, the parser creates AST nodes that know the location
         * in the source that they correspond to. This configuration flag
         * disables that behavior for performance or testing.
         */
        noLocation?: boolean,

        /**
         * If enabled, the parser will parse empty fields sets in the Schema
         * Definition Language. Otherwise, the parser will follow the current
         * specification.
         *
         * This option is provided to ease adoption of the final SDL specification
         * and will be removed in v16.
         */
        allowLegacySDLEmptyFields?: boolean,

        /**
         * If enabled, the parser will parse implemented interfaces with no `&`
         * character between each interface. Otherwise, the parser will follow the
         * current specification.
         *
         * This option is provided to ease adoption of the final SDL specification
         * and will be removed in v16.
         */
        allowLegacySDLImplementsInterfaces?: boolean,

        /**
         * EXPERIMENTAL:
         *
         * If enabled, the parser will understand and parse variable definitions
         * contained in a fragment definition. They'll be represented in the
         * `variableDefinitions` field of the FragmentDefinitionNode.
         *
         * The syntax is identical to normal, query-defined variables. For example:
         *
         *   fragment A($var: Boolean = false) on T  {
         *     ...
         *   }
         *
         * Note: this feature is experimental and may change or be removed in the
         * future.
         */
        experimentalFragmentVariables?: boolean,
    };

    /**
     * A helper function to build a GraphQLSchema directly from a source
     * document.
     */
    export function buildSchema (
        source: string | Source,
        options?: BuildSchemaOptions & ParseOptions,
    ): GraphQLSchema
}