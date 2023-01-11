function loadFile(path) {
  let filePath = java.nio.file.Path.of(path)
  let bytes = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath))
  return new java.lang.String(bytes)
}

function sample(requirement, code) {
  return { requirement: requirement, code: code }
}

let dataString = loadFile('src/main/resources/train/dal.js') + loadFile('src/main/resources/train/dal.js')
let dataArray = dataString.split('/*')
let trainData = []
for (let i = 1; i < dataArray.length; i++) {
  let data = dataArray[i].split('*/')
  let requirement = '/*' + data[0] + '*/'
  let code = data[1]
  trainData.push(sample(requirement, code))
}
bp.log.info('loaded ' + trainData.length + ' samples')



let testData=[
  '/* Each product has: id, type, color, and size */',
  '/* A user can place products in the cart */',
  '/* once the cart has items, the user can checkout */',
  '/*  */',
  '/*  */',
  '/*  */',
  '/*  */',
]