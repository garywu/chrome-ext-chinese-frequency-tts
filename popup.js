/**
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org/>
 */

/**
 * popup.js (popup page for browser action)
 *
 * @version 5.1 (pffy.cloud.tortellini)
 * @license http://unlicense.org/ The Unlicense
 * @updated 2015-04-30
 * @author  https://github.com/pffy/ The Pffy Authors
 * @link    https://github.com/pffy/chrome-chinese-frequency-tts
 *
 */


// Helper methods
// --------------

// Builds and displays output.
// Returns true if successful; false, otherwise.
function buildOutput(obj) {

  if(!obj.hasRows) {
    return false;
  }

  var data = obj.data;
  var status = '';

  status = '<div id="title">Chinese Frequency List</div>';
  status += '<div id="subtitle">Click Chinese characters for sound.</div>';

  var summary = '<table id="summary">';

    summary += '<tr><td class="statlabel">Total Characters</td>'
      + '<td class="stat">: ' + obj.total + '</td></tr>';

    summary += '<tr><td class="statlabel">~ Removed</td>'
      + '<td class="stat">: ' + obj.removed + '</td></tr>';

    summary += '<tr><td class="statlabel">Chinese Characters</td>'
      + '<td class="stat">: ' + obj.hanzi + '</td></tr>';

    summary += '<tr><td class="statlabel">~ Unique</td>'
      + '<td class="stat">: ' + obj.uniq + '</td></tr>';

    summary += '<tr><td class="statlabel">~ Processed</td>'
      + '<td class="stat">: ' + obj.rows + '</td></tr>';

    summary += '</table>';

  var html = '<table id="freqlist">';
  for(var i = 0; i < data.length; i++) {
    html += '<tr>';
    html += '<td class="num">' + ( i + 1 ) + '</td>';
    html += '<td class="hz"><a class="hztts" href="javascript:;" '
      +' title="Click character ' + data[i][0] +' to hear sound.">'
      + data[i][0] + '</a></td>';
    html += '<td class="py">' + data[i][1] + '</td>';
    html += '<td class="freq">' + data[i][2] + '</td>';
    html += '</tr><style>a{text-decoration: none;}</style>';
  }

  html += '</table>';

  status += summary + html;
  document.getElementById('status').innerHTML = status;

  return true;
}

// Display a result of nothing
function gotNothing() {

  // Be concise.

  var nothing = [
    'I got nothing.',
    'I got bupkis.',
    'I got nada.',
    'I got zero.',
    'I got jack squat.',
    'I got diddly-poo.',
    'I got squadoosh.',
    'I got zilch.'
  ];

  // random array item solution found here:
  // http://stackoverflow.com/a/4550514
  var msg = nothing[Math.floor(Math.random() * nothing.length)];
  document.body.innerText =  ''  + msg;
}

// Event Handlers
// --------------

// Handles clicks
document.onclick = function(e) {

  // NOTE: you must have declared charset of UTF-8
  // in HTML document for good results; otherwise, gibberish.

  if(e.target.className == 'hztts') {
    chrome.tts.speak('' + e.target.innerHTML, {lang: 'zh-TW'});
  }

  switch(e.target.id) {
    case 'helpitem':
      var w = window.open();
      w.document.write(e.target.id);
      break;
    case 'printitem':
      var randomName = '_meh' + (Math.random() * 100000);
      var strWindowFeatures = 'menubar=no,location=no,resizable=no,'
        +'scrollbars=yes,status=no,width=250,height=500,left=250,top=50';
      var w = window.open(chrome.extension.getURL('blank.html'),
        randomName, strWindowFeatures);
      var t = '<title>Print View (Ctrl/Cmd + P)</title>';
      var s = '<script src="print.js"></script>';
      var m = '<meta http-equiv="Content-Type" content="text/html;'
        + ' charset=utf-8" />';
      w.document.write('' + s + t + m
        + document.getElementById('status').innerHTML);
      break;
    default:
      // nothing
      break;
  }
}

// Handles onload
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {mode: 'derp'}, function(response){
      if(response.hasRows) {
        buildOutput(response);
        chrome.browserAction.setBadgeText({text: '' + response.rows,
          tabId: tabs[0].id });
      } else {
        gotNothing();
      }
    });
  });
});
