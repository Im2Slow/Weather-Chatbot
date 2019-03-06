const patternDict = [{
  pattern: '\\b(?<greetings>Hi|Hello|Hey)\\b',
  intent: 'Hello'
},{
  pattern:'\\b(?<goodbyes>bye|exit|goodbye|cya)\\b',
  intent: 'Exit'
},{
  pattern:'\\b(?<help>help|man)\\b',
  intent: 'help'
},{
pattern:'\\bweather(?:\\s+\\w+)?\\sin\\s(?<city>.*)\\b',
  intent: 'Current Weather'
},{
  pattern:'\\b(?<weather>rainy|sunny|foggy|cloudy|warm)\\sin\\s(?<city>.*)\\s(?<time>today|tomorrow)\\b',
  intent: 'Forecast Weather'
}];
module.exports = patternDict;
