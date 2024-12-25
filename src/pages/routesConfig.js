import routeList from './routes';
import { Route } from 'react-router';
const domArr = [];
for(let i=0;i<routeList.length;i++){
  const rt = routeList[i];
    domArr.push(
      <Route
          key={i}
          path={rt.path}
          element={rt.main}
          />
    )
}

export default domArr;
