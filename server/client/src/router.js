import React from 'react';
import { Router, Route, Switch ,Redirect} from 'dva/router';
import DocxEdit from './routes/docx/DocxEdit';
import IndexPage from './routes/IndexPage'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/editor/:fileId" exact component={DocxEdit}/>
        <Route path="/" exact component={IndexPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
