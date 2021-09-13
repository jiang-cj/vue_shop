import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login =()=>import('@/pages/Login')
const Home =()=>import('@/pages/Home')
const Welcome =()=>import('@/pages/Welcome')
const Users = ()=>import('@/pages/Users/Users')
const Rights = ()=>import('@/pages/rights/Rights')
const Roles = ()=>import('@/pages/rights/Roles')
const Goods = ()=>import('@/pages/goods/Goods')
const Params = ()=>import('@/pages/goods/Params')
const Categories = ()=>import('@/pages/goods/Categories')
const Orders = ()=>import('@/pages/orders/Orders')
const Reports = ()=>import('@/pages/reports/Reports')
const Add = ()=>import('@/pages/goods/Add')

const routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path: '/login',
        component:Login
    },
    {
        path: '/home',
        component:Home,
        redirect: '/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path: '/users',
                component:Users
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path: '/rights',
                component:Rights
            },
            {
                path:'/goods',
                component:Goods
            },
            {
                path: '/params',
                component:Params
            },
            {
                path: '/categories',
                component:Categories
            },
            {
                path: '/orders',
                component:Orders
            },
            {
                path: '/reports',
                component:Reports
            },
            {
                path:'/goods/add',
                component:Add
            }
        ]
    }
]

export default new VueRouter({
    routes,
    mode:'history'
})