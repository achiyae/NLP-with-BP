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

defineEvent('ProvideInstructions', function (data) {
  writeText('//textarea[@class="query-box"]', data.instructions)
  click('//div[@class="submit-button"]')
})
