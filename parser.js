// Initialize CodeMirror editor with C mode
const editor = CodeMirror(document.getElementById('editor'), {
  value: `#include <stdio.h>
#include <math.h>
#define PI 3.1416

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int x = 2;
    switch (x) {
        case 1:
            printf("Case 1\\n");
            break;
        case 2:
            printf("Case 2\\n");
            break;
        default:
            printf("Default case\\n");
    }

    int i;
    for (i = 0; i < 3; i++) {
        printf("For loop: %d\\n", i);
    }

    i = 0;
    while (i < 3) {
        printf("While loop: %d\\n", i);
        i++;
    }

    do {
        printf("Do-while loop executed once\\n");
    } while (0);

    char str1[20] = "Hello";
    char str2[20] = "World";
    strcat(str1, " ");
    strcat(str1, str2);
    printf("%s\\n", str1);
    printf("Length = %d\\n", strlen(str1));

    printf("Factorial of 5 = %d\\n", factorial(5));

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

  let cCode = editor.getValue();

  // 1. Remove comments (single-line // and multi-line /* */)
  let jsCode = cCode.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Convert #define to JS const
  jsCode = jsCode.replace(/#define\s+(\w+)\s+([^\n]+)/g, 'const $1 = $2;');

  // 3. Remove #include directives
  jsCode = jsCode.replace(/#include\s+<[^>]+>/g, '');

  // 4. Convert function declarations: remove return type, keep param names
  jsCode = jsCode.replace(/\b(int|float|double|void|char)\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
    (match, retType, funcName, params) => {
      let paramNames = params.split(',')
        .map(p => p.trim().split(' ').pop())
        .filter(p => p.length > 0)
        .join(', ');
      return `function ${funcName}(${paramNames}) {`;
    });

  // 5. Convert variable declarations (int, float, double, char), remove arrays syntax
  jsCode = jsCode.replace(/\b(int|float|double|char)\b\s+([^;]+);/g, (m, t, v) => {
    let vars = v.split(',')
      .map(x => x.replace(/\[\d*\]/g, '').trim())
      .join(', ');
    return 'let ' + vars + ';';
  });

  // 6. Convert char arrays initialized as strings
  jsCode = jsCode.replace(/char\s+(\w+)\s*\[\d*\]\s*=\s*"([^"]*)";/g, 'let $1 = "$2";');

  // 7. Convert array initialization from C { ... } to JS [ ... ]
  jsCode = jsCode.replace(/=\s*\{([^}]+)\}/g, '= [$1]');

  jsCode = jsCode.replace(/printf\s*\(\s*"([^"]*?)"\s*(,\s*([^;]+))?\s*\);/g, (match, fmtStr, _, varsStr) => {
  if (!varsStr) {
    let escapedStr = fmtStr
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')
      .replace(/\\n/g, '\n')  // <-- fix here
      .replace(/"/g, '\\"');
    return `printOutput("${escapedStr}")`;
  }
  let vars = varsStr.split(/\s*,\s*/);
  let fmt = fmtStr.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  let parts = fmt.split(/(%[dfcs]|%lf)/);
  let resultParts = [];
  let varIndex = 0;
  for (let part of parts) {
    if (part.match(/^%[dfcs]$|%lf/)) {
      let v = vars[varIndex++] || '';
      resultParts.push(`\${${v}}`);
    } else {
      // Also replace literal \n with real newline inside parts
      resultParts.push(part.replace(/\\n/g, '\n'));
    }
  }
  let finalStr = resultParts.join('');
  return `printOutput(\`${finalStr}\`)`;
});


  // 9. Convert scanf to prompt with parseInt or parseFloat depending on format
  jsCode = jsCode.replace(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^;]+)\);/g, (match, fmtStr, varsStr) => {
    let formats = fmtStr.trim().split(/\s+/);
    let vars = varsStr.split(/\s*,\s*/).map(v => v.replace(/&/g, '').trim());
    let lines = [];
    for (let i = 0; i < vars.length; i++) {
      let v = vars[i];
      let f = formats[i] || '%d';
      if (f.includes('f') || f.includes('lf')) {
        lines.push(`${v} = parseFloat(prompt("Enter value for ${v}:"));`);
      } else {
        lines.push(`${v} = parseInt(prompt("Enter value for ${v}:"));`);
      }
    }
    return lines.join('\n');
  });

  // 10. Replace 'return 0;' with 'return;'
  jsCode = jsCode.replace(/return\s+0\s*;/g, 'return;');

  // 11. Simulate strcat and strlen
  jsCode = jsCode.replace(/\bstrcat\s*\(\s*(\w+)\s*,\s*("[^"]+"|\w+)\s*\)/g, '$1 = strcat($1, $2)');
  jsCode = jsCode.replace(/\bstrlen\s*\(\s*(\w+)\s*\)/g, 'strlen($1)');

  // 12. Leave if, switch, loops unchanged (they work in JS too)

  // 13. Support functions for output and string ops
  const supportFunctions = `
function printOutput(msg) {
  const out = document.getElementById('output');
  out.textContent += msg + "\\n";
}

function strcat(dest, src) {
  if (src.startsWith('"') && src.endsWith('"')) {
    src = src.slice(1, -1);
  }
  return dest + src;
}

function strlen(str) {
  return str.length;
}
`;

  // 14. Math function aliases
  const mathFunctions = `
const sqrt = Math.sqrt;
const pow = Math.pow;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const log = Math.log;
const abs = Math.abs;
`;

  // Combine everything and run main()
  jsCode = supportFunctions + mathFunctions + '\n' + jsCode + '\nmain();';

  // DEBUG: Uncomment to see generated JS code in browser console
  // console.log("Generated JS code:\n", jsCode);

  try {
    eval(jsCode);
  } catch (e) {
    document.getElementById('output').textContent = 'Error: ' + e.message;
  }
}
