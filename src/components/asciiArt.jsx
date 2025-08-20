const asciiArt = `
%c                    _
                  _(_)_                          wWWWw   _
      @@@@       (_)@(_)   vVVVv     _     @@@@  (___) _(_)_
     @@()@@ wWWWw  (_)\\    (___)   _(_)_  @@()@@   Y  (_)@(_)
      @@@@  (___)     \`|/    Y    (_)@(_)  @@@@   \\|/   (_)\\
       /      |       \\|    \\|/    /(_)    \\|      |/      |
    \\ |     \\ |/       | / \\ | /  \\|/       |/    \\|      \\|/
    \\\\|//   \\\\|///  \\\\\\|//\\\\\\|/// \\|///  \\\\\\|//  \\\\|//  \\\\\\|// 
%c^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
%cPoking around the console? Huh! Like what you see?
%cBuilt with ❤️ by Rahul Deka || 🌐 rahul-deka.is-a.dev`;

const styles = [
    'color: #dc3545; font-family: monospace; font-size: 12px;',
    'color: #28a745; font-family: monospace; font-size: 12px;',
    'color: #6c757d; font-family: monospace; font-size: 14px; font-weight: bold;',
    'color: white; font-family: Fira Code, Source Code Pro, Monaco, Menlo, Consolas, Courier New, monospace; font-size: 14px; font-weight: bold;'
];

export const displayAsciiArt = () => {
    console.log(asciiArt, ...styles);
};

export default asciiArt;