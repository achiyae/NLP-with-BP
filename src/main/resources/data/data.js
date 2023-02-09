function loadFile(path) {
  let filePath = java.nio.file.Path.of(path)
  let bytes = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath))
  return new java.lang.String(bytes)
}

function sample(requirement, code) {
  return { requirement: requirement, code: code }
}

let dataString = TrainFiles.map(f=>loadFile(f)).join('')
let dataArray = dataString.replace(/\r\n/g,"\n").split('/*')
let trainData = []
for (let i = 1; i < dataArray.length; i++) {
  let data = dataArray[i].split('*/')
  // bp.log.info(data)
  let requirement = '/*' + data[0] + '*/'
  let code = data[1]
  trainData.push(sample(requirement, code))
}

// bp.log.info(trainData)
bp.log.info('loaded ' + trainData.length + ' samples')


let testData=[
  // '/!*  *!/',
  /*  '/!*  *!/',
    '/!*  *!/',
    '/!*  *!/',*/
]