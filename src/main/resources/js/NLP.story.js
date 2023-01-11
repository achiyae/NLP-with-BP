const URL = 'https://beta.openai.com/codex-javascript-sandbox'

bthread('train', function () {
  for (let i = 0; i < trainData.length; i++) {
    ProvideInstructions({ instructions: trainData[i].requirement + '\n' + trainData[i].code })
  }
})