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
 * eventpage.js (a non-persistent background page)
 *
 * @version 5.1 (pffy.cloud.tortellini)
 * @license http://unlicense.org/ The Unlicense
 * @updated 2015-04-30
 * @author  https://github.com/pffy/ The Pffy Authors
 * @link    https://github.com/pffy/chrome-chinese-frequency-tts
 *
 */
chrome.browserAction.disable();

chrome.tabs.onUpdated.addListener(function(aTabId, changeInfo, tab) {
  chrome.tabs.sendMessage(aTabId, {mode: 'derp'}, function(response){

    if(!isUriAllowed(tab.url)) {

      chrome.browserAction.setTitle({title: 'Taking a break. Nothing to do.',
        tabId: tab.id});
      chrome.browserAction.setBadgeText({text: '--',
        tabId: tab.id});

      chrome.browserAction.disable({tabId: tab.id});

    } else {


      switch(changeInfo.status) {
        case 'loading':
          chrome.browserAction.setTitle({ title: 'Please wait. Page is loading...',
            tabId: tab.id});
          break;
        case 'complete':
          var obj = chrome.runtime.getManifest();
          chrome.browserAction.setTitle({title: '' + obj['name'],
            tabId: tab.id});
          break;
        default:
          // nothing
          break;
      }

      if(response.hasRows) {
        chrome.browserAction.setBadgeText({text: '' + response.rows,
          tabId: tab.id});
        chrome.browserAction.enable();
      }
    }
  });
});

// This appears to fix the corner case that causes problems (See Issue #1)
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if(!isUriAllowed(tabs[0].url)) {
    chrome.browserAction.setTitle({title: 'Taking a break. Nothing to do.',
      tabId: tabs[0].id});
    chrome.browserAction.setBadgeText({text: '--',
      tabId: tabs[0].id});
    chrome.browserAction.disable({tabId: tabs[0].id});
  }
});

// Helper methods

// Returns true if URI is peachy keen; otherwise, false.
function isUriAllowed(str) {

  if(str.substring(0,5) == "http:") {
    return true;
  }

  if(str.substring(0,6) == "https:") {
    return true;
  }

  return false;
}


function getExtensionName() {
  var mnfst = chrome.runtime.getManifest();
  return mnfst['name'];
}