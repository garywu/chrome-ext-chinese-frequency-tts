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
 * ext.js (content script to access ChineseFrequency object and shared DOM)
 *
 * @version 5.1 (pffy.cloud.tortellini)
 * @license http://unlicense.org/ The Unlicense
 * @updated 2015-04-30
 * @author  https://github.com/pffy/ The Pffy Authors
 * @link    https://github.com/pffy/chrome-chinese-frequency-tts
 *
 */
var obj = {};

var c = new ChineseFrequency();
c.setInput(document.body.innerText);

obj = {
  total: c.getTotalInput(),
  removed: c.getTotalRemoved(),
  hanzi: c.getTotalHanzi(),
  uniq: c.getTotalUnique(),
  rows: c.getTotalRows(),
  hasRows: c.hasRows(),
  data: c.getDataRange()
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse(obj);
  });

