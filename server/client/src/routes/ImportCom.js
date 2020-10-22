/**
 * Created by vxg on 2018/07/18.
 */
import {Link} from 'dva/router'
import {Tooltip} from 'antd'
function processFileSelected(props){

  const fileSelector = document.getElementById('fileSelector');
  var file = fileSelector.files[0]

  if(!file)
    return;

  fileSelector.value = ''
  props.dispatch({
    type:'Docx/uploadFile',
    data:{file}
  })


}
export default function (props) {
  return (
    <div>
      <Tooltip title="文件大小<=10M">
        <a onClick={()=>document.getElementById('fileSelector').click()}>上传DOCX文档</a></Tooltip>
      <input  style={{display:'none'}} type="file" id="fileSelector" accept=".docx" onChange={()=>processFileSelected(props)}/>
    </div>
  )
}
