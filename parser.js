// Initialize CodeMirror editor with C mode
const editor = CodeMirror(document.getElementById('editor'), {
  value: `#include <stdio.h>

int main() {
    int a = 5;
    int b = 10;
    printf("Sum: %d\\n", a + b);
    return 0;
}
`,
  mode: "text/x-csrc",
  theme: "dracula",
  lineNumbers: true,
  tabSize: 4,
  indentUnit: 4,
});

function runCode() {
  document.getElementById('output').textContent = '';

  // Get code from CodeMirror
  let cCode = editor.getValue();

  // Remove comments (// and /* */)
  let jsCode = cCode.replace(/\/\/.*$/gm, '')
                    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove preprocessor directives (#include, #define)
  jsCode = jsCode.replace(/#include\s+<[^>]+>/g, '')
                 .replace(/#define\s+(\w+)\s+([^\n]+)/g, 'const $1 = $2;');

  // Convert printf to printOutput
  jsCode = jsCode.replace(/printf\s*\(\s*"([^"]*?)"\s*(,\s*([^;]+))?\s*\);/g, (match, str, _, vars) => {
    if (vars) {
      // Replace %d, %f etc with template literals placeholders
      let text = str.replace(/%d|%f|%c|%s|%lf/g, '${' + vars + '}');
      return `printOutput(\`${text}\`)`;
    } else {
      return `printOutput("${str}")`;
    }
  });

  // Convert scanf to prompt input
  jsCode = jsCode.replace(/scanf\s*\(\s*"([^"]+)"\s*,\s*&?(\w+)(\s*,\s*&?(\w+))*\s*\);/g, (match, fmt, v1, _, v2) => {
    let vars = [v1];
    if (v2) vars.push(v2);
    // For simplicity, prompt for each var and parseInt
    return vars.map(v => `${v} = parseInt(prompt("Enter value for ${v}:"));`).join('\n');
  });

  // Convert main function
  jsCode = jsCode.replace(/int\s+main\s*\(\s*\)\s*\{/g, 'function main() {');

  // return 0; → return;
  jsCode = jsCode.replace(/return\s+0\s*;/g, 'return;');

  // Convert variable declarations
  jsCode = jsCode.replace(/\b(int|float|double|char)\s+([a-zA-Z_]\w*)/g, 'let $2');

  // Convert arrays
  jsCode = jsCode.replace(/=\s*\{([^}]+)\}/g, '= [$1]');

  // Convert functions
  jsCode = jsCode.replace(/\b(int|float|double|void)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'function $2($3) {');

  // Convert char arrays to string (simple)
  jsCode = jsCode.replace(/char\s+(\w+)\s*\[\d*\]\s*=\s*"([^"]*)";/g, 'let $1 = "$2";');

  // Add printOutput function and run main()
  jsCode = `
function printOutput(msg) {
  const out = document.getElementById('output');
  out.textContent += msg + "\\n";
}
${jsCode}
main();
`;

  try {
    eval(jsCode);
  } catch (e) {
    document.getElementById('output').textContent = 'Error: ' + e.message;
  }
}
