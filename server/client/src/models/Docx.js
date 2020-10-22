/**
 * Created by vxg on 2018/05/08.
 */
import {updateFile,downloadFile,getFile,uploadFile,updateFileRecord,downloadFileJson,uploadDocx,getFiles} from '../services/api'
import {routerRedux} from 'dva/router'
import {message} from 'antd'

export default {
  namespace: 'Docx',

  state: {
    file:{},
    fileInfo:{},
    recordList:[],
    fileList:[]
  },

  effects: {
    *uploadFile({data},{call,put}){
      const result = yield call(uploadFile,data);
      if(result.hasOwnProperty("data")&&result.data.succeed==true){
        message.info("上传成功")
        yield put(routerRedux.push('/editor/'+result.data.data.id))
      }else{
        message.error('上传失败')
      }
    },
    *getFiles(_,{call,put}){
      const data = yield call(getFiles)
      yield put({
        type:'receiveFiles',
        data
      })
    },
    *getFile({id},{call,put}){
      const data = yield call(getFile,{id});

      const fileInfo = yield call(downloadFileJson,{fileId:data.data.jsonId});

      yield put({
        type: 'downloadFile',
        payload: fileInfo.data,
        fileInfo:data.data
      });
    },
    *fetchUpdateRecord({fileId},{call,put}){
      yield put({
        type:'fileRecord',
        payload:{data:{rows:[]}}
      })
      const data = yield call(updateFileRecord,{fileId});
      if('data' in data){
        yield put({
          type:'fileRecord',
          payload:data
        })
      }else{
        yield put({
          type:'fileRecord',
          payload:{data:{rows:[]}}
        })
      }
    },
    *updateDocx({fileId,file,superId}, { call, put }) {

      if(!fileId){
        const data = yield call(uploadFile,{file,memo:'',newFlag:true,persistent:true,superId,id:'',filename:file.name})
        const item = data.data;
        if(item.extName=='xlsx') {
          yield put(routerRedux.replace(`/excel/edit/${item.id}`));
        }else if(item.extName=='docx'){
          yield put(routerRedux.replace(`/docx/edit/${item.id}`));
        }
        else if(item.extName=='doc'){
          window.open("/fs/index?type=word&id="+item.id)
        }else if(item.extName=='pdf'){
          window.open("/fs/index?type=pdf&id="+item.id)
        }else if(item.extName=='ppt'||item.extName=='pptx'){
          window.open("/fs/index?type=ppt&id="+item.id)
        }else{
          alert('不支持的文件格式')
        }
        yield put({
          type:'bCloudDisk/fetchFiles',
          superId:superId
        });
      }else {
        const data = yield call(updateFile, {fileId, file});
      }
      message.info('文件已更新成功');
      yield put({
        type: 'updateFile'
      });
    },
    *downloadExcel({fileId},{call,put}) {

      const fileInfo = yield call(downloadFile,{fileId});

      yield put({
        type: 'downloadFile',
        payload: fileInfo.data,
      });
    }
  },

  reducers: {

    updateFile(state, { payload}) {

      return {
        ...state,

      };
    },
    receiveFiles(state,{data}){
      if(data.hasOwnProperty('data')&&data.data.succeed==true){

        return {
          ...state,
          fileList:data.data.data
        }
      }else{
        return {
          ...state,
          fileList:[]
        }
      }
    },
    fileRecord(state,{payload}){
      return {
        ...state,
        recordList:payload.data.rows
      }
    },
    downloadFile(state, { payload,fileInfo}) {

      return {
        ...state,
        file: payload,
        fileInfo:fileInfo
      };
    },
    removeFile(state,_){
      return {
        ...state,
        file:null,
        fileInfo:{}
      }
    }

  },


};
