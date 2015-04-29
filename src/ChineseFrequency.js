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
 * ChineseFrequency.js
 *  + Counts Chinese text. Creates a list of frequency counts.
 *
 * @version 0.1
 * @license http://unlicense.org/ The Unlicense
 * @updated 2015-04-29
 * @author  https://github.com/pffy/ The Pffy Authors
 * @link    https://github.com/pffy/javascript-chinese-frequency
 *
 */
var ChineseFrequency = function() {

  // CONSTANTS
  var LABEL_PADSIZE = 20,
      FREQ_PADSIZE = 5,
      CRLF = '\r\n',
      MULTIBYTE_SPACE = '　'; // not an ASCII space

  var HEADER_ROW_CSV = 'hz,py,freq';

  // inputs and outputs
  var _hpdx = IdxHanyuPinyinMicro,
      _xpdx = IdxExtraPinyin,
      _isListAvailable = false,
      _metaTotal = 0,
      _metaRemoved = 0,
      _metaHanzi = 0,
      _metaUnique = 0,
      _metaProcessed = 0,
      _csvList = '',
      _summary = '',
      _dataRange = [],
      _input = '',
      _output = '';


  // returns cleaned text input
  function _cleanInput(str) {

    // removes multi-byte punctuation
    for(var x in _xpdx) {
      str = _replaceAll(x, '', str);
    }

    // FIXME: works for ASCII regex, not for UTF-8
    // removes single-btye
    str = str.replace(/\w|(\|)|(\–)|(\\)|(\[|\])|\s|["'+\.,-\/#!$%\^&\*;:{}=\-_`~()<>?]/gi, '');

    return str;
  }

  // returns array of unique values
  function _unique(arr) {
    var obj = {};
    for(var a in arr) {
      obj[arr[a]] = 'derp';
    }
    return Object.keys(obj);
  }

  // Solution found here:
  // http://stackoverflow.com/questions/1144783
  function _replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'gi'), replace);
  }

  // pads summary
  function _padSummary(str) {
    var pad = '####################';
    var ans = pad.substring('#', pad.length - str.length) + str;
    return _replaceAll('#', ' ', ans) + ': ';
  }

  // TODO: fix this to do up to 4 places
  function _padZero(str) {
    var pad = '####';
    var ans = pad.substring('#', pad.length - str.length) + str;
    return _replaceAll('#', ' ', ans);
  }

  // COMPARE: order by freq, ascending
  function _asc(a,b) {
    if (a.freq < b.freq)
      return -1;
    if (a.freq > b.freq)
      return 1;
    return 0;
  }

  // COMPARE: order by freq, descending
  function _desc(a,b) {
    if (a.freq > b.freq)
      return -1;
    if (a.freq < b.freq)
      return 1;
    return 0;
  }

  return {

    // Returns string representation of this object
    toString: function() {
      return this.getCountSummary();
    },

    // Returns CSV list
    getCsvList: function () {
      return _csvList;
    },

    // Returns 2D array (data range)
    getDataRange: function () {
      return _dataRange;
    },

    // Returns total number of characters input.
    getTotalInput: function () {
      return _metaTotal;
    },

    // Returns total number of characters removed.
    getTotalRemoved: function () {
      return _metaRemoved;
    },

    // Returns number of Hanzi (Chinese characters) in text input.
    getTotalHanzi: function () {
      return _metaHanzi;
    },

    // Returns number of unique Hanzi in text input.
    getTotalUnique: function () {
      return _metaUnique;
    },

    // Returns number of characters recognized and processed.
    getTotalProcessed: function () {
      return _metaProcessed;
    },

    // Returns count summary text
    getCountSummary: function () {
      return _summary;
    },

    // Returns "cleaned" input.
    getInput: function() {
      return _input;
    },

    hasList: function() {
      return _isListAvailable;
    },

    // Returns this object. Sets the text input.
    setInput: function(str) {

      _metaTotal = str.length;

      str = _cleanInput(str);
      _input = str ? str : '';
      _metaHanzi = str.length;

      _metaRemoved = _metaTotal - _metaHanzi;

      if(_metaHanzi > 0) {
        _isListAvailable = true;
      } else {
        // nothing to list
        _metaUnique = 0;
        _metaProcessed = 0;
        return false;
      }

      var arr = _input.split('');
      arr = _unique(arr);
      _metaUnique = arr.length;

      var bigc = [];
      var numProcessed = 0;

      var aHanzi = '',
        aPinyin = '',
        aFreq = 0;

      // array of wide 'w' characters
      for(var w in arr) {
        if(bigc.indexOf(arr[w]) < 0) {

          aHanzi = arr[w];
          if(_hpdx[aHanzi]) {
            aPinyin = _hpdx[aHanzi];
          } else {
            // do not process unknown characters
            continue;
          }

          aFreq = _input.match(new RegExp('' + aHanzi, 'gi')).length;

          bigc.push({
            hz: aHanzi,
            py: aPinyin,
            freq: aFreq
          });

          numProcessed++;
        }
      }

      _metaProcessed = numProcessed;

      bigc.sort(_desc);

      _summary = ''
        + CRLF + _padSummary('Total Characters' + MULTIBYTE_SPACE) + _padZero(_metaTotal)
        + CRLF + _padSummary('~ Removed' + MULTIBYTE_SPACE) + _padZero(_metaRemoved)
        + CRLF + _padSummary('Chinese Characters' + MULTIBYTE_SPACE) + _padZero(_metaHanzi)
        + CRLF + _padSummary('~ Unique' + MULTIBYTE_SPACE) + _padZero(_metaUnique)
        + CRLF + _padSummary('~ Processed' + MULTIBYTE_SPACE) + _padZero(_metaProcessed);


      var dataRange = [];
      var csv = HEADER_ROW_CSV;

      for (var i = 0; i < bigc.length; i++) {

        var row = []; // new row

        // adds data to row
        row.push(bigc[i].hz);
        row.push(bigc[i].py);
        row.push(bigc[i].freq);

        // adds row to data range
        dataRange.push(row);

        // adds row to CSV list
        csv += CRLF + bigc[i].hz + ',' + bigc[i].py
          + ',' + bigc[i].freq;
      }

      _dataRange = dataRange;
      _csvList = csv;

      return this;
    }

  };
};
