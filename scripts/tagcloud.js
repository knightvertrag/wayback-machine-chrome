var mynewTags = new Array()

function get_tags (url) {
  var hostname = new URL(url).hostname
  var toBeUsedAsURL = hostname.replace(/^www./, '')
  var y = hostname.split('.')
  var not_display4 = y.join(' ')
  var not_display1 = y.join(' ')
  if (url.includes('https')) {
    not_display1 = 'https ' + not_display1
  } else {
    not_display1 = 'http ' + not_display1
  }
  var not_display2 = not_display1 + ' extension'
  var not_display3 = not_display4 + ' extension'
  var dontarray = ['view page', 'open', 'read more', not_display1, not_display2, not_display3, not_display4]
  var new_url = 'https://archive.org/services/context/tagcloud?url=' + toBeUsedAsURL
  $('#loader_tagcloud').show()
  fetch(new_url)
    .then(response => response.json())
    .then(function (data) {
      if (!data.error) {
        for (var i = 0; i < data.length; i++) {
          var b = new Object()
          if (dontarray.indexOf(decodeURIComponent(data[i][0])) <= 0) {
            mynewTags[i] = decodeURIComponent(data[i][0])
            b.text = decodeURIComponent(data[i][0])
            b.weight = (data[i][1])
            mynewTags.push(b)
          }
        }
        if (data.length < 500) {
          var coefOfDistance = 1 / 40
        } else {
          var coefOfDistance = 3 / 4
        }
        var arr = mynewTags.reduce(function (acc, newTag) {
          var minDistance = void 0
          if (acc.length > 0) {
            minDistance = Math.min.apply(Math, _toConsumableArray(acc.map(function (oldTag) {
              return Levenshtein.get(oldTag, newTag)
            })))
          } else {
            minDistance = newTag.length
          }
          if (minDistance > coefOfDistance * newTag.length) {
            acc.push(newTag)
          }
          return acc
        }, []).sort()
        var result = new Array()

        // Filtering out the elements from data which aren't in arr
        data = data.filter(function (el) {
          return arr.indexOf(el[0]) >= 0
        }).sort()

        // Mapping the weights to higher values
        result = data.map(function (el) {
          if (el[1] == 1) { el[1] = el[1] * 10 } else if (el[1] == 2) { el[1] = el[1] * 40 } else if (el[1] == 3) { el[1] = el[1] * 60 } else if (el[1] == 4) { el[1] = el[1] * 90 }
          return { 'text': el[0], 'weight': el[1] }
        })

        for (var i = 0; i < result.length; i++) {
          var span = document.createElement('span')
          span.setAttribute('data-weight', result[i].weight)
          span.appendChild(document.createTextNode(result[i].text))
          document.getElementById('container-wordcloud').appendChild(span)
        }
        $('#loader_tagcloud').hide()
        $('#container-wordcloud').hide()
        $('#container-wordcloud').awesomeCloud({
          'size': {
            'grid': 1,
            'factor': 4
          },
          'color': {
            'background': '#036'
          },
          'options': {
            'color': 'random-light',
            'rotationRatio': 0.5,
            'printMultiplier': 3
          },
          'font': "'Times New Roman', Times, serif",
          'shape': 'square'
        })
      } else {
        $('#loader_tagcloud').hide()
        $('#container-wordcloud').hide()
        $('#message_tagcloud').show().text('Tags Not found, Please try again later')
      }
    })
}

function _toConsumableArray (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    _toConsumableArray: _toConsumableArray
  }
}
