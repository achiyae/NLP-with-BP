function Event(name, data) {
  if (data)
    return bp.Event(name, data)
  else
    return bp.Event(name)
}

/**
 * Waits for an event or an event name
 * @param {string|Event}event
 */
function waitFor(event) {
  if (typeof (event) === 'string')
    event = bp.EventSet('', e => e.name == event)
  bp.sync({ waitFor: event })
}

function seleniumEvent(name, xpath, data) {
  return Event('Selenium', { type: name, xpath: xpath, data: data })
}

function startSession(url) {
  bp.sync({ request: seleniumEvent('startSession', url) })
}

function sleep(millis) {
  java.lang.Thread.sleep(millis)
}

function waitForVisibility(xpath) {
  bp.sync({ request: seleniumEvent('waitForVisibility', xpath) })
}

function startRecord(filename) {
  bp.sync({ request: seleniumEvent('startRecord', filename) })
}

function stopRecord() {
  bp.sync({ request: seleniumEvent('stopRecord') })
}

function writeText(xpath, text, charByChar, clear) {
  if (charByChar == null) charByChar = 0
  if (clear == null) clear = true
  bp.sync({ request: seleniumEvent('writeText', xpath, { text: text, charByChar: charByChar, clear: clear }) })
}

function pasteText(xpath, text, clear) {
  if (clear == null) clear = true
  bp.sync({ request: seleniumEvent('pasteText', xpath, { text: text, clear: clear }) })
}

function click(xpath) {
  bp.sync({ request: seleniumEvent('click', xpath) })
}

function writeInstructions(instructions, charByChar) {
  writeText('//div[@class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"][last()]', instructions, charByChar, false)
  // sleep(20 * instructions.length)
}

function pasteInstructions(instructions, charByChar) {
  pasteText('//div[@class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"][last()]', instructions, false)
}


function submit() {
  waitForVisibility('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
  click('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
  waitForVisibility('//button[@class="btn btn-sm btn-filled btn-primary pg-submit-btn"]')
  // sleep(10000)
}

function changeLanguage(lang) {
  writeText('//input[@id="react-select-6-input"]', lang, 1)
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

function changeModel(model) {
  writeText('//input[@id="react-select-4-input"]', model)
}

function changeStopSequence(seq) {
  writeText('//input[@id="react-select-5-input"]', seq)
}