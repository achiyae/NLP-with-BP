function seleniumEvent(name, xpath, data) {
  return bp.Event('Selenium', { type: name, xpath: xpath, data: data })
}

function startSession(url) {
  bp.sync({ request: seleniumEvent('startSession', url) })
}

function sleep(millis) {
  java.lang.Thread.sleep(millis)
}

function writeText(xpath, text) {
  bp.sync({ request: seleniumEvent('writeText', xpath, text) })
}

function click(xpath) {
  bp.sync({ request: seleniumEvent('click', xpath) })
}

function defineEvent(name, func) {
  this[name] = function (data) {
    bp.sync({ request: bp.Event(name, data) })
    func(data)
    bp.sync({ request: bp.Event('EndOf(' + name + ')', data) })
  }
}

function provideInstructions(instructions) {
  writeText('//textarea[@id="pg-code-editor-textarea"]', instructions)
}

function submit() {
  click('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
  sleep(10000)
}

function changeLanguage(lang) {
  writeText('//input[@id="react-select-6-input"]', lang)
}

function changeMaxTokens(tokens) {
  writeText('//input[@class="text-input text-input-sm css-17eqq1p"]', tokens)
}

function changeTemprature(temp) {
  writeText('//dev/input[@class="text-input text-input-sm css-17eqq1p"]', temp)
}

function provideTest(data) {
  writeText('//textarea[@id="pg-code-editor-textarea"]', data)
  submit()
}

function changeModel(model) {
  writeText('//input[@id="react-select-3-input"]', model, true)
}

function changeStopSequence(seq) {
  writeText('//input[@id="react-select-4-input"]', seq)
}

/*
defineEvent('ProvideInstructions', function (data) {
  writeText('//textarea[@class="query-box"]', data.instructions.replace(/\r\n/g,""))
  click('//div[@class="submit-button"]')
})
*/
