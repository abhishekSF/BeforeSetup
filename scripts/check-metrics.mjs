#!/usr/bin/env node
/**
 * Enforces BeforeSetup numeric quality gates on src/:
 *   - cyclomatic complexity < 22 per function
 *   - Halstead difficulty < 80 per function
 *   - CRAP score < 25 per function (coverage 100% ⇒ CRAP = complexity)
 *   - < 500 lines per file
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
const MAX_COMPLEXITY = 21;
const MAX_HALSTEAD = 79;
const MAX_CRAP = 24;
const MAX_LINES = 499;

const OPERATOR_KINDS = new Set([
  ts.SyntaxKind.PlusToken,
  ts.SyntaxKind.MinusToken,
  ts.SyntaxKind.AsteriskToken,
  ts.SyntaxKind.SlashToken,
  ts.SyntaxKind.PercentToken,
  ts.SyntaxKind.PlusPlusToken,
  ts.SyntaxKind.MinusMinusToken,
  ts.SyntaxKind.EqualsToken,
  ts.SyntaxKind.PlusEqualsToken,
  ts.SyntaxKind.MinusEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsToken,
  ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.GreaterThanToken,
  ts.SyntaxKind.GreaterThanEqualsToken,
  ts.SyntaxKind.LessThanToken,
  ts.SyntaxKind.LessThanEqualsToken,
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.ExclamationToken,
  ts.SyntaxKind.AmpersandToken,
  ts.SyntaxKind.BarToken,
  ts.SyntaxKind.CaretToken,
  ts.SyntaxKind.TildeToken,
  ts.SyntaxKind.QuestionToken,
  ts.SyntaxKind.ColonToken,
  ts.SyntaxKind.DotToken,
  ts.SyntaxKind.QuestionDotToken,
  ts.SyntaxKind.IfKeyword,
  ts.SyntaxKind.ElseKeyword,
  ts.SyntaxKind.ForKeyword,
  ts.SyntaxKind.WhileKeyword,
  ts.SyntaxKind.DoKeyword,
  ts.SyntaxKind.SwitchKeyword,
  ts.SyntaxKind.CaseKeyword,
  ts.SyntaxKind.ReturnKeyword,
  ts.SyntaxKind.ThrowKeyword,
  ts.SyntaxKind.TryKeyword,
  ts.SyntaxKind.CatchKeyword,
  ts.SyntaxKind.NewKeyword,
  ts.SyntaxKind.AwaitKeyword,
  ts.SyntaxKind.TypeOfKeyword,
  ts.SyntaxKind.InstanceOfKeyword,
  ts.SyntaxKind.InKeyword,
  ts.SyntaxKind.DeleteKeyword,
  ts.SyntaxKind.VoidKeyword,
  ts.SyntaxKind.YieldKeyword,
]);

function walkFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "test") continue;
      walkFiles(full, acc);
      continue;
    }
    if (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
      continue;
    }
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      acc.push(full);
    }
  }
  return acc;
}

function isFunctionLike(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node)
  );
}

function functionName(node, source) {
  if (node.name && ts.isIdentifier(node.name)) {
    return node.name.text;
  }
  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }
  if (parent && ts.isPropertyAssignment(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }
  const pos = source.getLineAndCharacterOfPosition(node.getStart());
  return `<anonymous>:${pos.line + 1}`;
}

function isLogical(node) {
  return (
    ts.isBinaryExpression(node) &&
    (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
      node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
  );
}

function metricsForFunction(fn, source) {
  let complexity = 1;
  const operators = [];
  const operands = [];

  const visit = (node) => {
    if (ts.isTypeNode(node) || ts.isTypeReferenceNode(node)) {
      return;
    }
    if (node !== fn && isFunctionLike(node)) {
      return;
    }

    if (
      ts.isIfStatement(node) ||
      ts.isForStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node) ||
      ts.isCaseClause(node) ||
      ts.isCatchClause(node) ||
      ts.isConditionalExpression(node)
    ) {
      complexity += 1;
    }
    if (isLogical(node)) {
      complexity += 1;
    }

    if (OPERATOR_KINDS.has(node.kind)) {
      operators.push(ts.SyntaxKind[node.kind]);
    }

    if (ts.isIdentifier(node)) {
      operands.push(`id:${node.text}`);
    } else if (ts.isNumericLiteral(node) || ts.isStringLiteral(node)) {
      operands.push(`lit:${node.text}`);
    } else if (
      node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword ||
      node.kind === ts.SyntaxKind.NullKeyword ||
      node.kind === ts.SyntaxKind.UndefinedKeyword
    ) {
      operands.push(`kw:${ts.SyntaxKind[node.kind]}`);
    }

    ts.forEachChild(node, visit);
  };

  visit(fn);

  const n1 = new Set(operators).size;
  const n2 = new Set(operands).size;
  const N2 = operands.length;
  const difficulty = n2 === 0 ? 0 : (n1 / 2) * (N2 / n2);
  const pos = source.getLineAndCharacterOfPosition(fn.getStart());

  return {
    name: functionName(fn, source),
    line: pos.line + 1,
    complexity,
    difficulty,
    n1,
    n2,
    N2,
  };
}

function analyzeFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split("\n").length;
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, kind);
  const functions = [];

  const visit = (node) => {
    if (isFunctionLike(node)) {
      functions.push(metricsForFunction(node, source));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  return { filePath, lines, functions };
}

function coveragePct() {
  const summaryPath = path.join(ROOT, "coverage", "coverage-summary.json");
  if (!fs.existsSync(summaryPath)) {
    return null;
  }
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const total = summary.total;
  if (!total) return null;
  return Math.min(
    total.lines.pct,
    total.statements.pct,
    total.functions.pct,
    total.branches.pct
  );
}

const files = walkFiles(SRC);
const failures = [];
const report = [];

for (const filePath of files) {
  const rel = path.relative(ROOT, filePath);
  const { lines, functions } = analyzeFile(filePath);
  if (lines > MAX_LINES) {
    failures.push(`${rel}: ${lines} lines (max ${MAX_LINES})`);
  }
  for (const fn of functions) {
    const cov = coveragePct();
    const uncovered = cov === null ? 0 : 1 - cov / 100;
    const crap = fn.complexity * fn.complexity * uncovered ** 3 + fn.complexity;
    report.push({ rel, ...fn, crap });
    if (fn.complexity > MAX_COMPLEXITY) {
      failures.push(
        `${rel}:${fn.line} ${fn.name} cyclomatic ${fn.complexity} (max ${MAX_COMPLEXITY})`
      );
    }
    if (fn.difficulty > MAX_HALSTEAD) {
      failures.push(
        `${rel}:${fn.line} ${fn.name} Halstead difficulty ${fn.difficulty.toFixed(1)} (max ${MAX_HALSTEAD})`
      );
    }
    if (crap > MAX_CRAP) {
      failures.push(
        `${rel}:${fn.line} ${fn.name} CRAP ${crap.toFixed(1)} (max ${MAX_CRAP})`
      );
    }
  }
}

report.sort((a, b) => b.difficulty - a.difficulty);
const top = report.slice(0, 8);
console.log("Top Halstead difficulty:");
for (const row of top) {
  console.log(
    `  ${row.rel}:${row.line} ${row.name}  D=${row.difficulty.toFixed(1)}  cc=${row.complexity}  crap=${row.crap.toFixed(1)}`
  );
}

const cov = coveragePct();
if (cov !== null) {
  console.log(`Coverage (min of four totals): ${cov}%`);
  if (cov < 100) {
    failures.push(`Coverage ${cov}% (required 100%)`);
  }
} else {
  console.log("No coverage-summary.json yet — CRAP computed as complexity (assume uncovered=0).");
}

if (failures.length > 0) {
  console.error("\nMetric failures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("\nAll metric gates passed.");
