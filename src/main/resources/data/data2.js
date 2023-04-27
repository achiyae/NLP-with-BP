// function loadFile(path) {
//   let filePath = java.nio.file.Path.of(path)
//   let bytes = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath))
//   return new java.lang.String(bytes)
// }
//
// function listFiles(path, type) {
//   let files = java.nio.file.Files.find(java.nio.file.Paths.get(path),
//     java.lang.Integer.MAX_VALUE,
//     (filePath, fileAttr) => fileAttr.isRegularFile() && filePath.getFileName().toString().endsWith(type))
//   return files.map(p => p.toString()).toArray()
// }
//
function snippet(requirement, code) {
  return { requirement: requirement, code: code, isGiven: false }
}
//for backward compatibility
function prepareData(path, type=null) {
    return parseSnippetsFile(path);

}
const fs = require('fs');

/**
 * Parses a snippets file and returns an array of snippets objects
 * @param filename
 * @returns {snippet[]}
 */
function parseSnippetsFile(filename) {
  const data = fs.readFileSync(filename, 'utf-8');
  const lines = data.split('\n');
  const snippets = [];
  let currentSnippet = snippet('', '');
  let isRegion = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]//.trim();
    if(line.startsWith('//region')) {
      isRegion = true;
      continue;
    }
    if(line.startsWith('//endregion')) {
        isRegion = false;
        continue;
    }
    let lineStartsWithRequirement = ""
    if(line.startsWith('//Requirement: ')) {
        lineStartsWithRequirement = '//Requirement: ';
    }
    if(line.startsWith('//Requirement:')) {
        lineStartsWithRequirement = '//Requirement:';
    }
    if (lineStartsWithRequirement != "") {
      currentSnippet.requirement = line.slice(lineStartsWithRequirement.length).trim();
      //if requirement is empty, it actually starts in the next line with /* and ends in some line that ends with */
        if (currentSnippet.requirement.trim() == "") {
            let j = i + 1;
            while (lines[j].trim().endsWith('*/') == false) {
                currentSnippet.requirement += lines[j] + '\n';
                j++;
            }
            currentSnippet.requirement += lines[j];
            i = j;
        }
    } else if (line.trim().startsWith('//Output:')) {
      //The code starts in the next line and ends in a line that starts with //endregion or //region or //Requirement(not including) or end of file
        let j = i + 1;
      currentSnippet.code = '';
        while ( j < lines.length && lines[j].trim().startsWith('//') == false) {
            currentSnippet.code += lines[j] + '\n';
            j++;
        }
        //remove the last \n
        currentSnippet.code = currentSnippet.code.slice(0, -1);
        i = j - 1;


    }
    // else if (line.startsWith('//')) {
    //   // Ignore other comments
    // }
    // else {
    //   currentSnippet.code += line + '\n';
    // }

    if (currentSnippet.requirement && currentSnippet.code) {
      currentSnippet.isGiven = isRegion;
      snippets.push(currentSnippet);
      currentSnippet = snippet('', '');
    }
  }

  return snippets;
}
function getGivenSnippets(snippets) {
  return snippets.filter(s => s.isGiven);
}
function getUnGivenSnippets(snippets) {
  return snippets.filter(s => !s.isGiven);
}
function getRequirements(snippets) {
  return snippets.map(s => s.requirement);
}
/**
 * @param {snippet} snippet
 * @returns //Requirement: + the requirement
 */
function getRequirementWithFormat(snippet) {
    return '//Requirement: ' + snippet.requirement;
}


const snippets = parseSnippetsFile('store_entities_behaviors_updated.js');
console.log(snippets);
//print only the given snippets, in the format of the original file
for (let i = 0; i < snippets.length; i++) {
    const snippet = snippets[i];
    if (snippet.isGiven) {
      console.log('//region');
    }
      //if requirement starts with /*, print it in a separate line
      if (snippet.requirement.trim().startsWith('/*')) {
          console.log('//Requirement:');

          console.log(snippet.requirement);
      }
      else {
        console.log('//Requirement: ' + snippet.requirement);
      }
      console.log('//Output:');
      console.log(snippet.code);
    if (snippet.isGiven)
      console.log('//endregion');
    if (i < snippets.length - 1)
      console.log();

}
