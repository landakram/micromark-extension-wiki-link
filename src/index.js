import { html } from './html'

function wikiLink (opts = {}) {
  const aliasDivider = opts.aliasDivider || ':'

  const aliasMarker = aliasDivider
  const startMarker = '[['
  const endMarker = ']]'

  function tokenize (effects, ok, nok) {
    var data
    var alias

    var aliasCursor = 0
    var startMarkerCursor = 0
    var endMarkerCursor = 0

    return start

    function start (code) {
      if (code !== startMarker.charCodeAt(startMarkerCursor)) return nok(code)

      effects.enter('wikiLink')
      effects.enter('wikiLinkMarker')

      return consumeStart
    }

    function consumeStart (code) {
      if (startMarkerCursor === startMarker.length) {
        effects.exit('wikiLinkMarker')
        return consumeData
      }

      if (code !== startMarker.charCodeAt(startMarkerCursor)) {
        return nok(code)
      }

      effects.consume(code)
      startMarkerCursor++

      return consumeStart
    }

    function consumeData (code) {
      effects.enter('wikiLinkData')
      effects.enter('wikiLinkTarget')
      return consumeTarget
    }

    function consumeTarget (code) {
      if (code === aliasMarker.charCodeAt(aliasCursor)) {
        if (!data) return nok(code)
        effects.exit('wikiLinkTarget')
        effects.enter('wikiLinkAliasMarker')
        return consumeAliasMarker
      }

      if (code === endMarker.charCodeAt(endMarkerCursor)) {
        if (!data) return nok(code)
        effects.exit('wikiLinkTarget')
        effects.exit('wikiLinkData')
        effects.enter('wikiLinkMarker')
        return consumeEnd
      }

      if (!(code < 0 || code === 32)) {
        data = true
      }

      effects.consume()

      return consumeTarget
    }

    function consumeAliasMarker (code) {
      if (aliasCursor === aliasMarker.length) {
        effects.exit('wikiLinkAliasMarker')
        effects.enter('wikiLinkAlias')
        return consumeAlias
      }

      if (code !== aliasMarker.charCodeAt(aliasCursor)) {
        return nok(code)
      }

      effects.consume(code)
      aliasCursor++

      return consumeAliasMarker
    }

    function consumeAlias (code) {
      if (code === endMarker.charCodeAt(endMarkerCursor)) {
        if (!alias) return nok(code)
        effects.exit('wikiLinkAlias')
        effects.exit('wikiLinkData')
        effects.enter('wikiLinkMarker')
        return consumeEnd
      }

      if (!(code < 0 || code === 32)) {
        alias = true
      }

      effects.consume()

      return consumeAlias
    }

    function consumeEnd (code) {
      if (endMarkerCursor === endMarker.length) {
        effects.exit('wikiLinkMarker')
        effects.exit('wikiLink')
        return ok
      }

      if (code !== endMarker.charCodeAt(endMarkerCursor)) {
        return nok(code)
      }

      effects.consume(code)
      endMarkerCursor++

      return consumeEnd
    }
  }

  var call = { tokenize: tokenize }

  return {
    text: { 91: call }
  }
}

export {
  wikiLink as syntax,
  html
}
