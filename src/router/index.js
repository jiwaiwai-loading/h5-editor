import {
    createRouter,
    createWebHistory
} from 'vue-router'

const Index = () => import('@/views/Index.vue')
const NotFound = () => import('@/views/404.vue')

const defaultRouter = [{
    path: '/',
    name: 'H5编辑器',
    component: Index,
    children: []
}, {
    path: '/404',
    name: '404',
    component: NotFound,
    children: []
}];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: defaultRouter
});

router.beforeEach((to, from) => {

});

const addRouter = function (menu, path) {

}
export default router
