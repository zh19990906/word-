import { stringify } from 'qs';
import request,{download,downloadJson} from '../utils/request';
const urlfs = 'http://localhost:9909/'
const url = ''
export {
  url
}
export async function queryCloudDiskFileList(params) {
  return request(`${urlfs}/cloud/getFileList?${stringify(params)}`);
}
export async function queryCloudDiskRecentFileList(params) {
  return request(`${urlfs}/cloud/workspace?${stringify(params)}`);
}

export async function downloadFile({fileId}) {
  return download(urlfs+'/files/download/'+fileId+'?asAttachment=true');
}
export async function downloadFileJson({fileId}) {

  return downloadJson(urlfs+'/download/'+fileId+'?asAttachment=true');
}

export async function getFile({id}) {
  return request(urlfs+'/getFile/?id='+id);
}
export async function getFiles() {
  return request(urlfs+'/getFiles');
}

export async function updateFile(params) {
  var formData = new FormData();
  formData.append('fileId',params.fileId);
  formData.append('file',params.file);
  return request(urlfs+'/cloud/updateFile',{method:'POST',body:formData});
}
export async function updateFileRecord({fileId}) {
  return request(urlfs+'/cloud/updateRecord?fileId='+fileId);
}
export async function uploadFile(params) {

  var formData = new FormData();
  formData.append('file',params.file);
  return request(urlfs+'/upload',{method:'POST',body:formData,headers:{'X-Requested-With':'XMLHttpRequest'}});
}

export async function uploadDocx() {

}

export async function addShortcut(params) {
  return request(`${urlfs}/cloud/updateShortcut?${stringify(params)}`);
}
export async function fetchShortcutList(params) {
  return request(`${urlfs}/cloud/queryShortcutList?${stringify(params)}`);
}
export async function login(params) {
  params.orgId = '5397c5a648644e3685fc7d91560483fc'
  return request(`${url}/login/check?${stringify(params)}`);
}

export async function orgTree(params) {
  return request(`${url}/user/getOrgUserTrees`);
}
export async function autoFolder() {
  return request(`${urlfs}/cloud/autoFolder`);
}
export async function addActors(params) {
  return request(`${urlfs}/cloud/updateActor?${stringify(params)}`);
}

export async function saveFolder(params) {

  return request(`${urlfs}/cloud/saveFolder?${stringify(params)}`);
}

export async function heart(params) {

  return request(`${urlfs}/cloud/heart?${stringify(params)}`);
}

export async function queryActorList(params) {
  return request(`${urlfs}/cloud/queryActorList?${stringify(params)}`);
}

export async function deleteFile({id}) {
  return request(`${urlfs}/cloud/delete/${id}`);
}

export async function heartList(params) {
  return request(`${urlfs}/cloud/heartList?${stringify(params)}`);
}


