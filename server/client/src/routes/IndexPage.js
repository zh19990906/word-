import React,{PureComponent} from 'react';
import { connect } from 'dva';
import {Card,List,Avatar} from 'antd'
import {Link} from 'dva/router'
import ImpCom from './ImportCom'


class IndexPage extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type:'Docx/getFiles'
    })
  }
  render() {
    return (
      <Card loading={this.props.loading} title="文档列表" extra={<ImpCom dispatch={this.props.dispatch}/>}>
        <List
          bordered
          itemLayout="horizontal"
          dataSource={this.props.files}
          renderItem={item => (
            <Link to={'/editor/'+item.id}>
            <List.Item >

              <List.Item.Meta
                avatar={<Avatar src={require('../assets/doxc.png')}/>}
                title={<span>{item.fileName}</span>}

              />
              <div><span style={{color: 'darkgray', fontSize: 12}}>更新时间：{item.createTime}</span></div>
            </List.Item>
            </Link>

          )}
        />
      </Card>
    );
  }
}

export default connect(({Docx,loading})=>({
  loading:loading.models.Docx,
  files:Docx.fileList
}))(IndexPage);
