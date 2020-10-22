/**
 * Created by vxg on 2018/06/28.
 */
//eslint-disable-line
import React, {PureComponent} from 'react'
import { Editor,getEventTransfer } from 'slate-react'
import { Value,Block } from 'slate'
import styled from 'styled-components'
import { isKeyHotkey } from 'is-hotkey'
import {Spin,Tooltip} from 'antd'
import style from './DocxEdit.css'
import DocxUtils from '../../utils/excel/Utils'
import {connect}  from 'dva'
import { LAST_CHILD_TYPE_INVALID } from 'slate-schema-violations'
import tablesJson from './tables.json'
import HoverMenu from './HoverMenu'
import {url} from '../../services/api'


const initialValue = {
  "document": {
    "nodes": [
      {
        "nodes":[
          {
            "nodes":[
              {

                  "text":"",


                "object":"text"
              }
            ],
            "data":{
              "style":"",
              "class":"a0 "
            },
            "type":"span",
            "object":"inline"
          }
        ],
        "data":{
          "class":"a3 a DocDefaults "
        },
        "type":"p",
        "object":"block"
      }
    ]
  }
}
const imgBaseUri = url+'/'
const EMOJIS = [
  '😃',
  '😬',
  '😂',
  '😅',
  '😆',
  '😍',
  '😱',
  '👋',
  '👏',
  '👍',
  '🙌',
  '👌',
  '🙏',
  '👻',
  '🍔',
  '🍑',
  '🍆',
  '🔑',
]
/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = 'paragraph'

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')
/**
 * A change helper to standardize wrapping links.
 *
 * @param {Change} change
 * @param {String} href
 */

function wrapLink(change, href) {
  change.wrapInline({
    type: 'link',
    data: { href },
  })

  change.collapseToEnd()
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Change} change
 */

function unwrapLink(change) {
  change.unwrapInline('link')
}
/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Range} target
 */

function insertImage(change, src, target) {
  if (target) {
    change.select(target)

  }

  change.insertBlock({
    type:'image',
    object:'block',
    isVoid:true,
    data:{src}
  })
}
function insertTable(change, target) {
  if (target) {
    change.select(target)
  }

  change.insertBlock(tablesJson)
}
/**
 * A styled image block component.
 *
 * @type {Component}
 */

const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
const Tbl = styled('table')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
const schema = {
  document: {
    last: { types: ['paragraph'] },
    normalize: (change, reason, { node, child }) => {
      switch (reason) {
        case LAST_CHILD_TYPE_INVALID: {
          const paragraph = Block.create('paragraph')
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
}
@connect(({Docx,loading})=>({
  loading:loading.models.Docx,
  file:Docx.file,
  fileInfo:Docx.fileInfo,
}))
export default class DocxEdit extends PureComponent {

  // 构造
  constructor(props) {
    super(props);


  }

  componentDidMount() {

    let params = this.props.match.params
    if(params.fileId && params.fileId!='new'){//eslint-disable-line
      // var head = document.getElementsByTagName('HEAD').item(0);
      // if(head.lastChild.nodeName!='LINK'){
      //   var style = document.createElement('link');
      //
      //   style.href = "http://192.168.1.127:9001/fs/cloud/loadcss/"+params.fileId;
      //   style.rel = 'stylesheet';
      //   style.type = 'text/css';
      //   head.appendChild(style);
      // }else
      // {
      //   head.lastChild.href = "http://192.168.1.127:9001/fs/cloud/loadcss/"+params.fileId;
      // }
      this.props.dispatch({
        type:'Docx/getFile',
        id:params.fileId
      })
    }
    this.updateMenu()

  }
  componentDidUpdate(){

    this.updateMenu()
  }
  componentWillUnmount() {
    this.props.dispatch({
      type:'Docx/removeFile',
    })
  }
  componentWillReceiveProps(nextProps) {

    if(nextProps.file != this.props.file){//eslint-disable-line

      this.setState({value:Value.fromJSON(nextProps.file)})
    }
  }
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const { value } = this.state
    const menu = this.menu
    if (!menu) return
    if (value.isBlurred || value.isEmpty) {
      menu.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`

    menu.style.left = `${rect.left +
    window.pageXOffset -
    menu.offsetWidth / 2 +
    rect.width / 2}px`
  }
  /**
   * On clicking the image button, prompt for an image and insert it.
   *
   * @param {Event} event
   */

  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return

    const change = this.state.value.change().call(insertImage, src)

    this.onChange(change)
  }
  onClickTable=event=>{
    event.preventDefault()


    const change = this.state.value.change().call(insertTable)

    this.onChange(change)
  }
  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = type => {
    const { value } = this.state
    const {history} = value
    if(type=='undo'){//eslint-disable-line

      return history.undos.size>0
    }
    if(type=='redo'){//eslint-disable-line

      return history.redos.size>0
    }
    return value.activeMarks.some(mark => mark.type == type)//eslint-disable-line
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    if(type=='link'){//eslint-disable-line


      return value.inlines.some(node=>node.type==type)//eslint-disable-line
    }

    if(type=='table'){//eslint-disable-line

      return value.blocks.some(node => node.type == 'table-cell')//eslint-disable-line
    }

    return value.blocks.some(node => node.type == type)//eslint-disable-line
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {

    this.setState({ value })
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Change} change
   * @return {Change}
   */

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return
    }

    event.preventDefault()
    change.toggleMark(mark)
    return true
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    if(type=='undo'){//eslint-disable-line
        change.undo()
    }
    else if(type=='redo'){//eslint-disable-line
      change.redo()
    }
    else {
      change.toggleMark(type);
    }
    this.onChange(change)
  }

  saveFile = ()=>{

    DocxUtils.exportDocx(this.state.value.toJSON(),'新建文件'+new Date().getTime(),(file)=>{
      if(file) {
        this.props.dispatch({
          type:'Docx/updateDocx',
          file,
          fileId:this.props.fileInfo.id,
          superId:this.props.superId
        })
      }
    })

  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    if(type=='clear'){//eslint-disable-line
      this.setState({value:Value.fromJSON(initialValue)})
      return
    }

    // Handle everything but list buttons.
    if(type=='image'||type=='table'){//eslint-disable-line
      type=='image'?this.onClickImage(event):this.onClickTable(event)//eslint-disable-line
      return;
    }
    if(type=='save'){//eslint-disable-line
      this.saveFile()

      return
    }
    if(type=='link'){//eslint-disable-line
      const hasLinks = this.hasBlock('link');
      if (hasLinks) {
        change.call(unwrapLink)
      } else if (value.isExpanded) {
        const href = window.prompt('Enter the URL of the link:')
        if(href && href.length>0)
        change.call(wrapLink, href)
      } else {
        const href = window.prompt('Enter the URL of the link:')
        const text = window.prompt('Enter the text for the link:')
        if(href &&text&&href.length>0&&text.length>0)
        change
          .insertText(text)
          .extend(0 - text.length)
          .call(wrapLink, href)
      }

    }
    else if (type != 'bulleted-list' && type != 'numbered-list') {//eslint-disable-line
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)//eslint-disable-line
      })

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'//eslint-disable-line
          )
          .wrapBlock(type)
      } else {
        change.setBlocks('list-item').wrapBlock(type)
      }
    }

    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div style={{margin:10}} className="test">
        <HoverMenu
          innerRef={menu => (this.menu = menu)}
          value={this.state.value}
          onChange={this.onChange}
        />
        {this.renderToolbar()}
        {this.props.loading?<Spin size="large" />:this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {

    return (
      <div className={[style.menu,style['toolbar-menu']].join(" ")}>
        {this.renderMarkButton('undo', 'undo','撤销')}
        {this.renderMarkButton('redo', 'redo','重做')}
        {this.renderMarkButton('bold', 'format_bold','粗体')}
        {this.renderMarkButton('italic', 'format_italic','斜体')}
        {this.renderMarkButton('underlined', 'format_underlined','下划线')}

        {this.renderBlockButton('h1', 'looks_one','标题一')}
        {this.renderBlockButton('h2', 'looks_two','标题二')}
        {this.renderBlockButton('h3', 'looks_3','标题三')}
        {this.renderBlockButton('h4', 'looks_4','标题四')}
        {this.renderBlockButton('h5', 'looks_5','标题五')}
        {this.renderBlockButton('h6', 'looks_6','标题六')}

        {this.renderBlockButton('numbered-list', 'format_list_numbered','有序列表')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted','无序列表')}
        {this.renderBlockButton('link', 'link','超链接')}
        {this.renderBlockButton('image', 'image','图片')}
        {this.renderBlockButton('table', 'table','表格')}
        {this.renderBlockButton('clear', 'clear','清空')}

        {this.renderBlockButton('save','save','保存')}

      </div>
    )
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton = (type, icon,tip='') => {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (

      <Tooltip title={tip}>
      <span className={style.button} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
      </Tooltip>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon,tip='') => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.state

      const parent = value.document.getParent(value.blocks.first().key)
      isActive = this.hasBlock('list-item') && parent && parent.type === type
    }

    const onMouseDown = event => this.onClickBlock(event, type)

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <Tooltip title={tip}>
      <span className={style.button} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
      </Tooltip>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some rich text..."
          value={this.state.value}
          schema={schema}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          autoFocus
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node, isSelected } = props
    const map = node.data.toJSON();
    delete map['style']
    switch (node.type) {
      case 'div':

        return <div className={node.class} style={node.style} {...attributes}>{children}</div>
      case 'p':
        const P = styled.p`${node.data.get('style')}`


        return <P className={node.data.get('class')} {...attributes}>{children}</P>;
      case 'span':
        const SPAN = styled.span`${node.data.get('style')}`
        return <SPAN className={node.data.get('class')} {...attributes}>{children}</SPAN>;
      case 'table':
        const TABLE = styled.table`${node.data.get('style')}`
        return <TABLE className={node.data.get('class')} {...attributes}>{children}</TABLE>;
      case 'colgroup':
        const COLGROUP = styled.colgroup`${node.data.get('style')}`

        return <COLGROUP className={node.data.get('class')} {...attributes}>{children}</COLGROUP>;
      case 'col':
        const COL = styled.col`${node.data.get('style')}`

        return <COL className={node.data.get('class')} {...attributes}></COL>;
      case 'tbody':

        const TBODY = styled.tbody`${node.data.get('style')}`
        return <TBODY className={node.data.get('class')} {...attributes}>{children}</TBODY>;
      case 'tr':
        const TR = styled.tr`${node.data.get('style')}`
        return <TR className={node.data.get('class')} {...attributes}>{children}</TR>;
      case 'td':
        const TD = styled.td`${node.data.get('style')}`
        if(map.hasOwnProperty("rowspan")){
          map.rowSpan = map.rowspan
        }
        if(map.hasOwnProperty("colspan")){
          map.colSpan = map.colspan
        }
        return <TD {...map} {...attributes}>{children}</TD>;
      case 'th':
        const TH = styled.th`${node.data.get('style')}`

        return <TH className={node.data.get('class')} {...attributes}>{children}</TH>;
      case 'thead':
        const THEAD = styled.thead`${node.data.get('style')}`

        return <THEAD className={node.data.get('class')} {...attributes}>{children}</THEAD>;
      case 'blockquote':
        const BLOCKQUOTE = styled.blockquote`${node.data.get('style')}`
        return <BLOCKQUOTE className={node.data.get('class')} {...attributes}>{children}</BLOCKQUOTE>

      case 'ul':
        const UL = styled.ul`${node.data.get('style')}`
        return <UL className={node.data.get('class')} {...attributes}>{children}</UL>
      case 'h1':
        const H1 = styled.h1`${node.data.get('style')}`
        return <H1 className={node.data.get('class')} {...attributes}>{children}</H1>
      case 'h2':
        const H2 = styled.h2`${node.data.get('style')}`
        return <H2 className={node.data.get('class')} {...attributes}>{children}</H2>
      case 'h3':
        const H3 = styled.h3`${node.data.get('style')}`
        return <H3 className={node.data.get('class')} {...attributes}>{children}</H3>
      case 'h4':
        const H4 = styled.h4`${node.data.get('style')}`
        return <H4 className={node.data.get('class')} {...attributes}>{children}</H4>
      case 'h5':
        const H5 = styled.h5`${node.data.get('style')}`
        return <H5 className={node.data.get('class')} {...attributes}>{children}</H5>
      case 'h6':
        const H6 = styled.h6`${node.data.get('style')}`
        return <H6 className={node.data.get('class')} {...attributes}>{children}</H6>
      case 'li':
        const LI = styled.li`${node.data.get('style')}`
        return <LI className={node.data.get('class')} {...attributes}>{children}</LI>
      case 'ol':
        const OL = styled.ol`${node.data.get('style')}`
        return <OL className={node.data.get('class')} {...attributes}>{children}</OL>
      case 'a': {
        const { data } = node
        const A = styled.a`${data.get('style')}`
        return <A {...map} {...attributes}>{children}</A>
      }
      case 'img': {

        const {data} = node
        const src = data.get('src')


        const IMG = styled.img`${data.get('style')}`
        return <IMG {...map} src={imgBaseUri + src} className={data.get('class')} {...attributes}/>
      }
      case 'image':
        const {data} = node
        const src = data.get('src')



        return <Image src={src} selected={isSelected} {...attributes} />
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'link': {
        const { data } = node
        const href = data.get('href')
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        )
      }
      case 'tbl':
        return (
          <table selected={true}>
            <tbody style={{boxShadow:isSelected?'0 0 0 2px blue':'none'}} {...attributes}>{children}</tbody>
          </table>
        )
      case 'table-row':
        return <tr {...attributes}>{children}</tr>
      case 'table-cell':
        return <td {...attributes}>{children}</td>

    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark, attributes } = props
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
    }
  }
}
