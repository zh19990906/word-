/**
 * Created by vxg on 2018/06/29.
 */
import React from 'react'
import { Editor,getEventTransfer } from 'slate-react'
import { Value } from 'slate'
import { isKeyHotkey } from 'is-hotkey'
import {Spin} from 'antd'
import style from './DocxEdit.css'
import * as Api from '../../services/api'
import {connect}  from 'dva'

export default class Test extends React.Component{
  render(){
    const _ = {...style}
    return(
      <div className="test">
        <span>22333</span>
      </div>
    )
  }
}
