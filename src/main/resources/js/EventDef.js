function seleniumEvent(name, xpath, data) {
  return bp.Event('Selenium', { type: name, xpath: xpath, data: data })
}

function startSession(url) {
  bp.sync({ request: seleniumEvent('startSession', url) })
}

function sleep(millis) {
  java.lang.Thread.sleep(millis)
}

function writeText(xpath, text, charByChar, clear) {
  if (charByChar == null) charByChar = false
  if (clear == null) clear = true
  bp.sync({ request: seleniumEvent('writeText', xpath, { text: text, charByChar: charByChar, clear: clear }) })
}

function click(xpath) {
  bp.sync({ request: seleniumEvent('click', xpath) })
}

function provideInstructions(instructions) {
  writeText('//textarea[@id="pg-code-editor-textarea"]', instructions, true, false)
  // sleep(20 * instructions.length)
}

function submit() {
  click('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
  sleep(10000)
}

function changeLanguage(lang) {
  writeText('//input[@id="react-select-6-input"]', lang)
}

function changeTemperature(temp) {
  writeText('//div[span[text()="Temperature"]]/input[@class="text-input text-input-sm css-17eqq1p"]', temp)
}

function changeMaxTokens(tokens) {
  writeText('//div[span[text()="Maximum length"]]/input[@class="text-input text-input-sm css-17eqq1p"]', tokens)
}

function topP(p) {
  writeText('//div[span[text()="Top P"]]/input[@class="text-input text-input-sm css-17eqq1p"]', p)
}

function frequencyPenalty(fp) {
  writeText('//div[span[text()="Frequency penalty"]]/input[@class="text-input text-input-sm css-17eqq1p"]', fp)
}

function presencePenalty(pp) {
  writeText('//div[span[text()="Presence penalty"]]/input[@class="text-input text-input-sm css-17eqq1p"]', pp)
}

function provideTest(data) {
  writeText('//textarea[@id="pg-code-editor-textarea"]', data, true, false)
  submit()
}

function changeModel(model) {
  writeText('//input[@id="react-select-3-input"]', model, false)
}

function changeStopSequence(seq) {
  writeText('//input[@id="react-select-4-input"]', seq)
}
