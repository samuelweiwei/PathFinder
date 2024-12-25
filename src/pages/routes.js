/* eslint-disable import/no-anonymous-default-export */
import {lazy} from 'react';
import FormLogin from './login';
import Layout from '../Layout';
// import RoutesWithDistances from './graphesWithDistance';
const Login = lazy(()=>import('./login'));
const MainContent = lazy(()=>import('.'));
const StopsSequence = lazy(()=>import('./graphes/stops'));
const ShortestPath = lazy(()=>import('./graphes/shortestpath'));
const PathDistances = lazy(()=>import('./graphes/distances'));
const RoutesWithDistances = lazy(()=>import('./graphes/graphesWithDistance'));
// const Auth = lazy(()=>import(''));
const routeList = [
{
    path: '/home',
    main: <Layout />
},
{
    path: '/stopsequence',
    main: <StopsSequence />
},
{
    path: '/shortestpath',
    main: <ShortestPath />
},
{
    path:'/distances',
    main: <PathDistances />
},
{
    path: '/routeswithdistances',
    main: <RoutesWithDistances />
},
{
    path: '/login',
    main: <FormLogin />
}
]

export default routeList;