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

function sample(requirement, code) {
  return { requirement: requirement, code: code }
}

function prepareData(path, type) {
  let files = listFiles(path, type)
  let dataString = files.map(f => loadFile(f)).join('')
  let dataArray = dataString.replace(/\r\n/g, '\n').split('/*')
  let ret = []
  for (let i = 1; i < dataArray.length; i++) {
    let data = dataArray[i].split('*/')
    // bp.log.info(data)
    let requirement = '/*' + data[0] + '*/'
    let code = data[1]
    ret.push(sample(requirement, code))
  }
// bp.log.info(trainData)
  if (type == '.txt')
    bp.log.info('loaded ' + ret.length + ' test samples')
  else
    bp.log.info('loaded ' + ret.length + ' train samples')

  return ret
}