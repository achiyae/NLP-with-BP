// const URL = 'https://beta.openai.com/codex-javascript-sandbox'
const URL = 'https://beta.openai.com/playground'

bthread('train', function () {
  startSession(URL)
  changeStopSequence('Example:\n\\n\\n\\n\\n\n"')
  changeModel('code-davinci-002\n')
  changeLanguage('JavaScript\n')
  changeMaxTokens('1000\n')
  changeTemprature('0\n')
  for (let i = 0; i < trainData.length; i++) {
    provideInstructions('Example: ' + trainData[i].requirement + '\nOutput:\n' + trainData[i].code)
  }
  submit()
  for (let i = 0; i < testData.length; i++) {
    provideTest(testData[i])
  }
})

// temperature=0,
//   max_tokens=1000,
//   top_p=1,
//   frequency_penalty=0.2,
//   presence_penalty=0,