//eslint-disable-line
import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, convertOptions(options))
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      if(data.hasOwnProperty("success")){
        data.succeed = data.success;
      }
      return {data} })
    .catch(err => ({ err }));
}

export function download(url,options) {
  return fetch(url,convertOptions(options))
    .then(response=>response.blob())
    .then(blob => {
      return {data:blobToFile(blob,'测试文件.xlsx')}
    }).catch(err=>{err})
}

export function downloadJson(url,options) {
  return fetch(url,convertOptions(options))
    .then(response=>response.json())
    .then(json => {

      return {data:json}
    }).catch(err=>{err})
}


function blobToFile(theBlob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function convertOptions(options) {
  if(!options){
    options = {}
  }
  options.mode = 'cors';
  options.credentials = 'include'
  return options;
}
