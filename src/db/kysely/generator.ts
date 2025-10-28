/**
 * Customized generator to generate TypeScript enums for model fields.
 * To support dynamic type references when select fields in Kysely.
 *
 * Referenced & borrowed from: https://github.com/valtyr/prisma-kysely/
 */
import type { DMMF, GeneratorOptions } from '@prisma/generator-helper';
import { generatorHandler } from '@prisma/generator-helper';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

// Helper functions
const isValidTSIdentifier = (ident: string) =>
  !!ident && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(ident);

const formatFile = async (content: string) => {
  try {
    const { default: prettier } = await import('prettier');

    const config = await prettier.resolveConfig(process.cwd());
    if (!config) {
      return content;
    }

    const formatted = prettier.format(content, {
      ...config,
      parser: 'typescript',
    });

    return formatted;
  } catch (e) {
    console.error(e);
  }

  return content;
};

const writeFileSafely = async (writeLocation: string, content: string) => {
  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, await formatFile(content));
};

function getFieldNames(model: DMMF.Model): string[] {
  return model.fields
    .filter((field) => field.kind === 'enum' || field.kind === 'scalar')
    .map((field) => field.name);
}

const generateTypedReferenceNode = (name: string, referToName: string) => {
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    name,
    undefined,
    ts.factory.createTypeReferenceNode(
      `(typeof ${referToName ?? name})[keyof typeof ${referToName ?? name}]`,
      undefined,
    ),
  );
};

const generateEnum = (
  name: string,
  values: DMMF.EnumValue[],
  referredName?: string,
) => {
  if (!name || !values.length) {
    return [];
  }

  const objectDeclaration = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          name,
          undefined,
          undefined,
          ts.factory.createAsExpression(
            ts.factory.createObjectLiteralExpression(
              values.map((v) => {
                const identifier = isValidTSIdentifier(v.dbName ?? v.name)
                  ? ts.factory.createIdentifier(v.dbName ?? v.name)
                  : ts.factory.createStringLiteral(v.dbName ?? v.name);

                return ts.factory.createPropertyAssignment(
                  identifier,
                  // dbName holds the "@map("value")" value from the Prisma schema if it exists, otherwise fallback to the name
                  ts.factory.createStringLiteral(v.name),
                );
              }),
              true,
            ),
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier('const'),
              undefined,
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

  const typeDeclaration = generateTypedReferenceNode(
    referredName ?? name,
    name,
  );
  return [objectDeclaration, typeDeclaration];
};

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

type Options = {
  withEnumImport: false | { importPath: string; names: string[] };
  withLeader: boolean;
};

const generateFile = (
  statements: readonly ts.Statement[],
  { withEnumImport, withLeader }: Options,
) => {
  const file = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );

  const result = printer.printFile(file);

  const leader = `import type { ColumnType${
    result.includes('GeneratedAlways') ? ', GeneratedAlways' : ''
  } } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;`;

  if (withEnumImport) {
    const enumImportStatement = `import type { ${withEnumImport.names.join(
      ', ',
    )} } from "${withEnumImport.importPath}";`;

    return withLeader
      ? `${leader}\n\n${enumImportStatement}\n\n${result}`
      : `${enumImportStatement}\n\n${result}`;
  }

  return withLeader ? `${leader}\n\n${result}` : result;
};

// Main entry
generatorHandler({
  onManifest: () => ({
    defaultOutput: './generator',
    prettyName: 'Model Fields Enum',
  }),
  onGenerate: async (options: GeneratorOptions) => {
    try {
      const models: DMMF.Model[] = [...options.dmmf.datamodel.models].sort(
        (a: DMMF.Model, b: DMMF.Model) => a.name.localeCompare(b.name),
      );

      const fileContent = models.map((model) => {
        const fieldNames = getFieldNames(model);
        const columnEnums = generateEnum(
          `${model.name}_FieldEnum`,
          fieldNames.map((name) => ({ name: name, dbName: name })),
        );
        const columnEnumFiles = generateFile(columnEnums, {
          withEnumImport: false,
          withLeader: false,
        });

        const columnWithTableEnums = generateEnum(
          `${model.name}_FieldWithTableEnum`,
          fieldNames.map((name) => ({
            name: `${model.dbName}.${name}`,
            dbName: name,
          })),
        );
        const columnWithTableEnumFiles = generateFile(columnWithTableEnums, {
          withEnumImport: false,
          withLeader: false,
        });

        return `${columnEnumFiles}\n${columnWithTableEnumFiles}`;
      });

      const modelEnums = generateEnum(
        'DB_TableEnum',
        models.map((model) => ({
          name: model.dbName ?? model.name,
          dbName: model.name,
        })),
        'DB_TableEnum',
      );
      const modelEnumsContent = generateFile(modelEnums, {
        withEnumImport: false,
        withLeader: false,
      });

      await writeFileSafely(
        '../src/db/kysely/model-fields-enums.ts',
        `${fileContent.join('\n')}\n\n${modelEnumsContent}`,
      );
    } catch (error) {
      console.error('Error generating model fields enums: ', error);
    }
  },
});
