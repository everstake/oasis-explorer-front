import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home | Oasis Explorer',
    },
  },
  {
    path: '/blocks',
    name: 'blocks',
    component: () => import(/* webpackChunkName: "blocks" */ '../views/Blocks.vue'),
    meta: {
      title: 'Blocks | Oasis Explorer',
    },
  },
  {
    path: '/block/:id',
    name: 'block',
    meta: {
      title: 'Block | Oasis Explorer',
    },
    component: () => import(/* webpackChunkName: "block" */ '../views/Block.vue'),
    beforeEnter(from, to, next) {
      if (from.params.level) {
        document.title = `Block ${String(from.params.level).slice(0, 7)} | Oasis Explorer`;
      } else {
        document.title = 'Block | Oasis Explorer';
      }
      next();
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import(/* webpackChunkName: "transactions" */ '../views/Transactions.vue'),
    meta: {
      title: 'Transactions | Oasis Explorer',
    },
  },
  {
    path: '/transaction/:id',
    name: 'transaction',
    component: () => import(/* webpackChunkName: "transaction" */ '../views/Transaction.vue'),
    meta: {
      title: 'Transaction | Oasis Explorer',
    },
    beforeEnter(from, to, next) {
      if (from.params.hash) {
        document.title = `Transaction ${String(from.params.id).slice(0, 7)} | Oasis Explorer`;
      } else {
        document.title = 'Transaction | Oasis Explorer';
      }
      next();
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/NotFound.vue'),
    meta: {
      title: '404 | Oasis Explorer',
    },
  },
  {
    path: '*',
    redirect: {
      name: '404',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 }),
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;

  next();
});

export default router;
