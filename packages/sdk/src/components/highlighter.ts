/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHighlighter } from "shiki";

const malloyTMGrammar = {
   scopeName: "source.malloy",
   patterns: [{ include: "#malloy-language" }],
   repository: {
      "malloy-language": {
         patterns: [
            { include: "#sql-string" },
            { include: "#comments" },
            { include: "#tags" },
            { include: "#strings" },
            { include: "#numbers" },
            { include: "#keywords" },
            { include: "#properties" },
            { include: "#functions" },
            { include: "#datetimes" },
            { include: "#identifiers-quoted" },
            { include: "#types" },
            { include: "#constants" },
            { include: "#timeframes" },
            { include: "#identifiers-unquoted" },
         ],
      },
      "malloy-matched": {
         begin: "{",
         end: "}",
         patterns: [
            { include: "#malloy-matched" },
            { include: "#malloy-language" },
         ],
      },
      "malloy-in-sql": {
         begin: "%{",
         name: "source.malloy-in-sql",
         end: "}%?",
         patterns: [
            { include: "#malloy-matched" },
            { include: "#malloy-language" },
         ],
      },
      "sql-string": {
         patterns: [
            {
               begin: '(\\b[A-Za-z_][A-Za-z_0-9]*)(\\s*\\.\\s*)(sql)(\\s*\\(\\s*)(""")',
               end: '"""',
               beginCaptures: {
                  "1": { name: "variable.other" },
                  "3": { name: "keyword.control.sql" },
                  "5": { name: "punctuation.sql-block.open" },
               },
               endCaptures: {
                  "0": { name: "punctuation.sql-block.close" },
               },
               name: "source.sql",
               patterns: [
                  { include: "#malloy-in-sql" },
                  { include: "source.sql" },
               ],
            },
         ],
      },
      functions: {
         patterns: [
            {
               match: "(?i)\\b(count)(\\s*\\()(distinct)",
               captures: {
                  "1": { name: "entity.name.function" },
                  "3": { name: "entity.name.function.modifier" },
               },
            },
            {
               match: "(?i)\\b(AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE|UNGROUPED)(\\s*\\()",
               captures: {
                  "1": { name: "entity.name.function" },
               },
            },
            {
               match: "(?i)\\b([a-zA-Z_][a-zA-Z_0-9]*)(\\s*\\()",
               captures: {
                  "1": { name: "entity.name.function" },
               },
            },
            {
               match: "(?i)\\b([a-zA-Z_][a-zA-Z_0-9]*)(!)(timestamp|number|string|boolean|date)?(\\s*\\()",
               captures: {
                  "1": { name: "entity.name.function" },
                  "3": { name: "entity.name.type" },
               },
            },
         ],
      },
      datetimes: {
         patterns: [
            {
               match: "(?i)@[0-9]{4}-[0-9]{2}-[0-9]{2}[ T][0-9]{2}:[0-9]{2}((:[0-9]{2})(([\\.,][0-9]+)(\\[[A-Za-z_/]+\\])?)?)?",
               name: "constant.numeric.timestamp",
            },
            {
               match: "(?i)@[0-9]{4}(-Q[1-4]|-[0-9]{2}(-[0-9]{2}(-WK)?)?)?",
               name: "constant.numeric.date",
            },
         ],
      },
      "identifiers-quoted": {
         patterns: [
            {
               match: "`[^`]*`",
               name: "variable.other.quoted",
            },
         ],
      },
      "identifiers-unquoted": {
         patterns: [
            {
               match: "(?i)\\b[A-Za-z_][A-Za-z_0-9]*\\b",
               name: "variable.other",
            },
         ],
      },
      timeframes: {
         patterns: [
            {
               match: "(?i)\\b((year|quarter|month|week|day|hour|minute|second)s?)\\b",
               name: "keyword.other.timeframe",
            },
            {
               match: "(?i)\\b(day_of_year|day_of_month)\\b",
               name: "keyword.other.timeframe",
            },
         ],
      },
      comments: {
         patterns: [
            {
               begin: "/\\*",
               end: "\\*/",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment.begin" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.comment.end" },
               },
               name: "comment.block",
            },
            {
               begin: "//",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment" },
               },
               name: "comment.line.double-slash",
            },
            {
               begin: "--",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment" },
               },
               name: "comment.line.double-hyphen",
            },
         ],
      },
      tags: {
         patterns: [
            {
               match: "##\\n",
               name: "string.quoted",
               captures: {
                  "0": { name: "string.quoted" },
               },
            },
            {
               begin: '#"',
               end: "\\n",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment" },
               },
               name: "comment.line.double-slash",
            },
            {
               match: "#\\n",
               name: "string.quoted",
               captures: {
                  "0": { name: "string.quoted" },
               },
            },
            {
               begin: "#\\s",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "support.type.property-name.json" },
               },
               name: "comment.line.double-slash",
               patterns: [{ include: "#tag-values" }],
            },
            {
               begin: "##\\s",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "support.type.property-name.json" },
               },
               name: "comment.line.double-slash",
               patterns: [{ include: "#tag-values" }],
            },
            {
               begin: "#",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "string.quoted" },
               },
               name: "string.quoted",
            },
         ],
         repository: {
            "tag-values": {
               name: "support.type.property-name.json",
               match: '(-)?((?:[^\\s=#]+)|(?:"[^#]+"))(?:\\s*(=)\\s*((?:[^\\s=#]+)|(?:"[^#]+")))?',
               captures: {
                  "1": { name: "keyword.control.negate" },
                  "2": { name: "support.type.property-name.json" },
                  "3": { name: "keyword.operator.comparison.ts" },
                  "4": { name: "string.quoted" },
               },
            },
         },
      },
      strings: {
         patterns: [
            {
               begin: "'",
               end: "'",
               beginCaptures: {
                  "0": { name: "punctuation.definition.string.begin" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.string.end" },
               },
               name: "string.quoted.single",
               patterns: [{ include: "#escapes" }],
            },
            {
               begin: '"',
               end: '"',
               beginCaptures: {
                  "0": { name: "punctuation.definition.string.begin" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.string.end" },
               },
               name: "string.quoted.double",
               patterns: [{ include: "#escapes" }],
            },
            {
               begin: '"""',
               end: '"""',
               beginCaptures: {
                  "0": { name: "punctuation.definition.string.begin" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.string.end" },
               },
               name: "string.quoted.triple",
            },
            {
               begin: "(?i)[r|/]'",
               end: "'",
               name: "string.regexp",
               patterns: [{ include: "#regex-escapes" }],
            },
         ],
         repository: {
            escapes: {
               name: "constant.character.escape",
               match: "\\\\(u[A-Fa-f0-9]{4}|.)",
               captures: {
                  "0": { name: "constant.character.escape" },
               },
            },
            "regex-escapes": {
               name: "constant.character.escape",
               match: "\\\\.",
               captures: {
                  "0": { name: "constant.character.escape" },
               },
            },
         },
      },
      numbers: {
         match: "(?i)(\\b((0|[1-9][0-9]*)(E[+-]?[0-9]+|\\.[0-9]*)?)|\\.[0-9]+)",
         name: "constant.numeric",
      },
      constants: {
         patterns: [
            {
               match: "(?i)\\bnull\\b",
               name: "constant.language.null",
            },
            {
               match: "(?i)\\btrue\\b",
               name: "constant.language.true",
            },
            {
               match: "(?i)\\bfalse\\b",
               name: "constant.language.false",
            },
         ],
      },
      types: {
         patterns: [
            {
               match: "(?i)\\bstring\\b",
               name: "entity.name.type.string",
            },
            {
               match: "(?i)\\bnumber\\b",
               name: "entity.name.type.number",
            },
            {
               match: "(?i)\\bdate\\b",
               name: "entity.name.type.date",
            },
            {
               match: "(?i)\\btimestamp\\b",
               name: "entity.name.type.timestamp",
            },
            {
               match: "(?i)\\bboolean\\b",
               name: "entity.name.type.boolean",
            },
         ],
      },
      properties: {
         patterns: [
            {
               match: "(?i)\\baccept\\b",
               name: "keyword.control.accept",
            },
            {
               match: "(?i)\\bselect\\b",
               name: "keyword.control.select",
            },
            {
               match: "(?i)\\bconnection\\b",
               name: "keyword.control.connection",
            },
            {
               match: "(?i)\\brun\\b",
               name: "keyword.control.run",
            },
            {
               match: "(?i)\\bextend\\b",
               name: "keyword.control.extend",
            },
            {
               match: "(?i)\\brefine\\b",
               name: "keyword.control.refine",
            },
            {
               match: "(?i)\\baggregate\\b",
               name: "keyword.control.aggregate",
            },
            {
               match: "(?i)\\bsample\\b",
               name: "keyword.control.sample",
            },
            {
               match: "(?i)\\bcalculate\\b",
               name: "keyword.control.calculate",
            },
            {
               match: "(?i)\\btimezone\\b",
               name: "keyword.control.timezone",
            },
            {
               match: "(?i)\\bdimension\\b",
               name: "keyword.control.dimension",
            },
            {
               match: "(?i)\\bexcept\\b",
               name: "keyword.control.except",
            },
            {
               match: "(?i)\\bsource\\b",
               name: "keyword.control.source",
            },
            {
               match: "(?i)\\bgroup_by\\b",
               name: "keyword.control.group_by",
            },
            {
               match: "(?i)\\bhaving\\b",
               name: "keyword.control.having",
            },
            {
               match: "(?i)\\bindex\\b",
               name: "keyword.control.index",
            },
            {
               match: "(?i)\\bjoin_one\\b",
               name: "keyword.control.join_one",
            },
            {
               match: "(?i)\\bwith\\b",
               name: "keyword.control.with",
            },
            {
               match: "(?i)\\bjoin_many\\b",
               name: "keyword.control.join_many",
            },
            {
               match: "(?i)\\bjoin_cross\\b",
               name: "keyword.control.join_cross",
            },
            {
               match: "(?i)\\blimit\\b",
               name: "keyword.control.limit",
            },
            {
               match: "(?i)\\bmeasure\\b",
               name: "keyword.control.measure",
            },
            {
               match: "(?i)\\bnest\\b",
               name: "keyword.control.nest",
            },
            {
               match: "(?i)\\border_by\\b",
               name: "keyword.control.order_by",
            },
            {
               match: "(?i)\\bpartition_by\\b",
               name: "keyword.control.partition_by",
            },
            {
               match: "(?i)\\bprimary_key\\b",
               name: "keyword.control.primary_key",
            },
            {
               match: "(?i)\\bproject\\b",
               name: "keyword.control.project",
            },
            {
               match: "(?i)\\bquery\\b",
               name: "keyword.control.query",
            },
            {
               match: "(?i)\\brename\\b",
               name: "keyword.control.rename",
            },
            {
               match: "(?i)\\btop\\b",
               name: "keyword.control.top",
            },
            {
               match: "(?i)\\bview\\b",
               name: "keyword.control.view",
            },
            {
               match: "(?i)\\bwhere\\b",
               name: "keyword.control.where",
            },
            {
               match: "(?i)\\bdeclare\\b",
               name: "keyword.control.declare",
            },
         ],
      },
      keywords: {
         patterns: [
            {
               match: "(?i)\\bis\\b",
               name: "keyword.control.is",
            },
            {
               match: "(?i)\\bon\\b",
               name: "keyword.control.on",
            },
            {
               match: "(?i)\\bnot\\b",
               name: "keyword.other.not",
            },
            {
               match: "(?i)\\bor\\b",
               name: "keyword.other.or",
            },
            {
               match: "(?i)\\bdesc\\b",
               name: "keyword.control.desc",
            },
            {
               match: "(?i)\\bby\\b",
               name: "keyword.control.by",
            },
            {
               match: "(?i)\\band\\b",
               name: "keyword.other.and",
            },
            {
               match: "(?i)\\basc\\b",
               name: "keyword.control.asc",
            },
            {
               match: "(?i)\\bfor\\b",
               name: "keyword.other.for",
            },
            {
               match: "(?i)\\belse\\b",
               name: "keyword.other.else",
            },
            {
               match: "(?i)\\bto\\b",
               name: "keyword.other.to",
            },
            {
               match: "(?i)\\bwhen\\b",
               name: "keyword.other.when",
            },
            {
               match: "(?i)\\bpick\\b",
               name: "keyword.other.pick",
            },
            {
               match: "(?i)\\bimport\\b",
               name: "keyword.control.import",
            },
         ],
      },
   },
};

const malloyDocsTMGrammar = {
   ...malloyTMGrammar,
   patterns: [...malloyTMGrammar.patterns, { include: "#docvar" }],
   repository: {
      ...malloyTMGrammar.repository,
      docvar: {
         patterns: [
            {
               match: "\\<\\<[^(\\>\\>)]*\\>\\>",
               beginCaptures: {
                  0: { name: "punctuation.definition.comment.begin" },
               },
               endCaptures: {
                  0: { name: "punctuation.definition.comment.end" },
               },
               name: "markup.italic.markdown",
            },
         ],
      },
   },
};

const malloySQLTMGrammar = {
   name: "Malloy SQL",
   scopeName: "source.malloy-sql",
   patterns: [{ include: "#malloysql-sql" }],
   repository: {
      "malloysql-sql": {
         beginCaptures: {
            "0": { name: "entity.other.attribute.malloy-sql" },
            "1": { name: "entity.other.attribute.malloy-sql" },
            "3": { name: "comment.line.double-slash" },
         },
         name: "meta.embedded.block.malloysql.sql",
         patterns: [
            { include: "#comments" },
            {
               begin: "%{",
               end: "}%",
               beginCaptures: {
                  "0": { name: "punctuation.definition.malloy-sql" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.malloy-sql" },
               },
               name: "meta.embedded.block.malloy",
               patterns: [{ include: "source.malloy" }],
            },
            {
               include: "source.sql",
            },
         ],
      },
      comments: {
         patterns: [
            {
               begin: "/\\*",
               end: "\\*/",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment.begin" },
               },
               endCaptures: {
                  "0": { name: "punctuation.definition.comment.end" },
               },
               name: "comment.block",
            },
            {
               begin: "//",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment" },
               },
               name: "comment.line.double-slash",
            },
            {
               begin: "--",
               end: "\\n",
               beginCaptures: {
                  "0": { name: "punctuation.definition.comment" },
               },
               name: "comment.line.double-hyphen",
            },
         ],
      },
   },
};

const THEME = "catppuccin-latte";
const HIGHLIGHTER = createHighlighter({
   themes: [THEME],
   langs: [
      "sql",
      "json",
      "typescript",
      {
         name: "malloy",
         scopeName: "source.malloy",
         embeddedLangs: ["sql"],
         ...(malloyDocsTMGrammar as any),
      },
      {
         name: "malloysql",
         scopeName: "source.malloy-sql",
         embeddedLangs: ["sql"],
         ...(malloySQLTMGrammar as any),
      },
   ],
});

export async function highlight(code: string, lang: string): Promise<string> {
   const highlighter = await HIGHLIGHTER;
   const highlightedRaw = highlighter.codeToHtml(code, {
      lang: lang,
      theme: THEME,
   });
   return highlightedRaw;
}
