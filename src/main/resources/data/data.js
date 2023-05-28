function loadFile(path) {
  let filePath = java.nio.file.Path.of(path)
  let bytes = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath))
  return new java.lang.String(bytes)
}

function listFiles(path, type) {
  let files = java.nio.file.Files.find(java.nio.file.Paths.get(path),
    java.lang.Integer.MAX_VALUE,
    (filePath, fileAttr) => fileAttr.isRegularFile() && filePath.getFileName().toString().endsWith(type))
  return files.map(p => p.toString()).toArray()
}

function snippet(requirement, code) {
  return { requirement: requirement, code: code, isGiven: false }
}

//for backward compatibility
function prepareData(path) {
  return parseSnippetsFile(path)
}

/**
 * Parses a snippets file and returns an array of snippets objects
 * @param filename
 * @returns {snippet[]}
 */
function parseSnippetsFile(path) {
  let files = listFiles(path, 'js')
  bp.log.info('files: ' + files.map(f => f.toString()))
  let data = files.map(f => loadFile(f)).join('')
  const lines = data.split('\n')
  const snippets = []
  let currentSnippet = snippet('', '')
  let isRegion = false

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('//region')) {
      isRegion = true
      continue
    }
    if (lines[i].startsWith('//endregion')) {
      isRegion = false
      continue
    }
    let lineStartsWithRequirement = ''
    if (lines[i].startsWith('//Requirement:')) {
      lineStartsWithRequirement = '//Requirement:'
    }
    if (lineStartsWithRequirement !== '') {
      currentSnippet.requirement = lines[i].slice(lineStartsWithRequirement.length).trim()
      i++
      while (i < lines.length && !lines[i].trim().startsWith('//Output:')) {
        currentSnippet.requirement += lines[i] + '\n'
        i++
      }
    }
    if (lines[i].trim().startsWith('//Output:')) {
      //The code starts in the next line and ends in a line that starts with //endregion or //region or //Requirement(not including) or end of file
      i++
      currentSnippet.code = ''
      while (i < lines.length && !lines[i].trim().startsWith('//region') && !lines[i].trim().startsWith('//endregion') && !lines[i].trim().startsWith('//Requirement:')) {
        currentSnippet.code += lines[i] + '\n'
        i++
      }
      currentSnippet.code = currentSnippet.code.slice(0, -1)
      i--
    }
    // else if (line.startsWith('//')) {
    //   // Ignore other comments
    // }
    // else {
    //   currentSnippet.code += line + '\n';
    // }

    if (currentSnippet.requirement && currentSnippet.code) {
      // bp.log.info(currentSnippet.requirement);
      currentSnippet.isGiven = isRegion
      snippets.push(currentSnippet)
      currentSnippet = snippet('', '')
    }
  }
  bp.log.info('loaded ' + snippets.length + ' snippets from ' + path)
  // bp.log.info(snippets)

  return snippets
}

function getGivenSnippets(snippets) {
  return snippets.filter(s => s.isGiven)
}

function getUnGivenSnippets(snippets) {
  return snippets.filter(s => !s.isGiven)
}

function getRequirements(snippets) {
  return snippets.map(s => s.requirement)
}

/**
 * @param {snippet} snippet
 * @returns //Requirement: + the requirement
 */
function getRequirementWithFormat(snippet) {
  //if requirement starts with /*, add it in a separate line
  if (snippet.requirement.trim().startsWith('/*')) {
    return '//Requirement:\n' + snippet.requirement + '\n'
  }
  return '//Requirement: ' + snippet.requirement + '\n'
}

function getOutputWithFormat(snippet) {
  return '//Output:\n' + snippet.code
}

function formatSnippetWithoutRegions(snippetExample) {
  return snippet(getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample))
}

function formatSnippetWithRegions(snippetExample) {
  if (snippetExample.isGiven)
    return snippet('//region\n' + getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample) + '\n//endregion')
  else
    return formatSnippetWithoutRegions(snippetExample)
}

// function formatSnippet(snippetExample) {
//     return snippet(getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample));
// }

// const snippets = parseSnippetsFile('store_entities_behaviors_updated.js');
// console.log(snippets);
// //print only the given snippets, in the format of the original file
// for (let i = 0; i < snippets.length; i++) {
//     const snippet = snippets[i];
//     if (snippet.isGiven) {
//       console.log('//region');
//     }
//       //if requirement starts with /*, print it in a separate line
//       if (snippet.requirement.trim().startsWith('/*')) {
//           console.log('//Requirement:');
//
//           console.log(snippet.requirement);
//       }
//       else {
//         console.log('//Requirement: ' + snippet.requirement);
//       }
//       console.log('//Output:');
//       console.log(snippet.code);
//     if (snippet.isGiven)
//       console.log('//endregion');
//     if (i < snippets.length - 1)
//       console.log();
//
// }
