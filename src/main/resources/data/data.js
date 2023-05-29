/**
 * Writes the given data to the given file
 * @param {string}projectName the name of the project including ascii letters and numbers only
 * @param {string}data the data to write
 */
function exportData(projectName, data) {
  let filePath = java.nio.file.Paths('exports', projectName + '.js')
  java.nio.file.Files.write(filePath, data.getBytes())
}


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

/**
 * Create a new snippet object
 * @param {string}[requirement='']
 * @param {string}[code='']
 * @param {boolean}[train=false]
 * @returns {{code: string, requirement: string, train: boolean}}
 */
function snippet(requirement, code, train) {
  if(!requirement) requirement = ''
  if(!code) code = ''
  if(!train) train = false
  return { requirement: requirement, code: code, train: train }
}

function addSnippetIfNonEmpty(snippets, snippet, verbose) {
  snippet.requirement = snippet.requirement.trim()
  snippet.code = snippet.code.trim()
  if (snippet.requirement !== '' || snippet.code !== '') {
    snippets.push(snippet)
    if (verbose)
      bp.log.info('Added snippet: ' + JSON.stringify(snippet))
    return true
  }
  return false
}

/**
 * Returns true iff the given line starts with one of the given prefixes
 * @param {string}line
 * @param {string|string[]}prefixes
 * @returns {boolean}
 */
function lineStartsWith(line, prefixes) {
  if(!Array.isArray(prefixes)){
    prefixes = [prefixes]
  }
  for (let i = 0; i < prefixes.length; i++) {
    if (line.startsWith(prefixes[i])) {
      return true
    }
  }
  return false
}

/**
 * Parses a snippets file and returns an array of snippets objects
 * @param path
 * @param {boolean}[verbose=false] prints debug logs
 * @returns {snippet[]}
 */
function parseSnippetsFile(path, verbose) {
  let files = listFiles(path, 'js')
  bp.log.info('files: ' + files.map(f => f.toString()))
  let data = files.map(f => loadFile(f)).join('\n').replace(/\r/g, '')
  let lines = data.split('\n')
  let snippets = []
  let currentSnippet = snippet()

  for (let i = 0; i < lines.length; i++) {
    if (verbose) bp.log.info('line: ' + lines[i])
    if (lineStartsWith(lines[i], '//region')) {
      addSnippetIfNonEmpty(snippets, currentSnippet)
      currentSnippet = snippet('','', true)
    } else if (lineStartsWith(lines[i], '//endregion')) {
      addSnippetIfNonEmpty(snippets, currentSnippet)
      currentSnippet = snippet()
    } else if (lineStartsWith(lines[i], '//Requirement:')) {
      if(!currentSnippet.train) {
        addSnippetIfNonEmpty(snippets, currentSnippet)
        currentSnippet = snippet()
      }
      currentSnippet.requirement = lines[i].slice('//Requirement:'.length).trim()
      i++
      while (i < lines.length &&
             !lineStartsWith(lines[i], ['//Output:', '//region', '//endregion', '//Requirement:'])) {
        if (verbose) bp.log.info('line: ' + lines[i])
        currentSnippet.requirement += lines[i] + '\n'
        i++
      }
      i--
    } else if (lineStartsWith(lines[i],'//Output:')) {
      i++
      while (i < lines.length &&
             !lineStartsWith(lines[i], ['//region', '//endregion', '//Requirement:'])) {
        if (verbose) bp.log.info('line: ' + lines[i])
        currentSnippet.code += lines[i] + '\n'
        i++
      }
      i--
    }
  }
  if(addSnippetIfNonEmpty(snippets, currentSnippet) && verbose) {
    bp.log.info('Added snippet: ' + JSON.stringify(currentSnippet))
  }
  bp.log.info('loaded ' + snippets.length + ' snippets from ' + path)
  // bp.log.info(snippets)

  return snippets
}

function getTrainSnippets(snippets) {
  return snippets.filter(s => s.train)
}

function getTestSnippets(snippets) {
  return snippets.filter(s => !s.train)
}

/**
 * @param {snippet} snippet
 * @returns //Requirement: + the requirement
 */
function getRequirementWithFormat(snippet) {
  //if requirement starts with /*, add it in a separate line
  if (snippet.requirement.startsWith('/*')) {
    return '//Requirement:\n' + snippet.requirement + '\n'
  } else if (snippet.requirement !== ('')) {
    return '//Requirement: ' + snippet.requirement + '\n'
  } else {
    return ''
  }
}

function getOutputWithFormat(snippet) {
  if(snippet.requirement !== ('')) {
    return '//Output:\n' + snippet.code
  } else {
    return snippet.code
  }
}

function formatSnippetWithoutRegions(snippetExample) {
  return snippet(getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample))
}

function formatSnippetWithRegions(snippetExample) {
  if (snippetExample.train)
    return snippet('//region\n' + getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample) + '\n//endregion', true)
  else
    return snippet(getRequirementWithFormat(snippetExample), getOutputWithFormat(snippetExample))
}
