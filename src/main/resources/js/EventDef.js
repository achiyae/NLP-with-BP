function seleniumEvent(name, xpath, data) {
  return bp.Event('Selenium', { type: name, xpath: xpath, data: data })
}

function startSession(url) {
  bp.sync({ request: seleniumEvent('startSession', url) })
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
  writeText('//textarea[@id="pg-code-editor-textarea"]', instructions/*.replace(/\r\n/g,"")*/)
  click('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
}

function changeModel(model) {
  // click('//div[@class=" css-bm1710"]')
  // click('//div[@class="select-dropdown-indicator css-ewq5ei-indicatorContainer"]//div[@text="code-davinci-002"][1]')
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
