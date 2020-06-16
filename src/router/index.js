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
      title: 'Home | Oasis Monitor',
    },
  },
  {
    path: '/blocks',
    name: 'blocks',
    component: () => import(/* webpackChunkName: "blocks" */ '../views/Blocks.vue'),
    meta: {
      title: 'Blocks | Oasis Monitor',
    },
  },
  {
    path: '/block/:id',
    name: 'block',
    meta: {
      title: 'Block | Oasis Monitor',
    },
    component: () => import(/* webpackChunkName: "block" */ '../views/Block.vue'),
    beforeEnter(from, to, next) {
      if (from.params.id) {
        document.title = `Block ${String(from.params.id).slice(0, 7)} | Oasis Monitor`;
      } else {
        document.title = 'Block | Oasis Monitor';
      }
      next();
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import(/* webpackChunkName: "transactions" */ '../views/Transactions.vue'),
    meta: {
      title: 'Transactions | Oasis Monitor',
    },
  },
  {
    path: '/transaction/:id',
    name: 'transaction',
    component: () => import(/* webpackChunkName: "transaction" */ '../views/Transaction.vue'),
    meta: {
      title: 'Transaction | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      if (from.params.id) {
        document.title = `Transaction ${String(from.params.id).slice(0, 7)} | Oasis Monitor`;
      } else {
        document.title = 'Transaction | Oasis Monitor';
      }
      next();
    },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import(/* webpackChunkName: "accounts" */ '../views/Accounts.vue'),
    meta: {
      title: 'Accounts | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      document.title = 'Accounts | Oasis Monitor';
      next();
    },
  },
  {
    path: '/account/:id',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue'),
    meta: {
      title: 'Account | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      if (from.params.id) {
        document.title = `Account ${from.params.id.slice(0, 7)} | Oasis Monitor`;
      } else {
        document.title = 'Account | Oasis Monitor';
      }
      next();
    },
  },
  {
    path: '/validators',
    name: 'validators',
    component: () => import(/* webpackChunkName: "validators" */ '../views/Validators.vue'),
    meta: {
      title: 'Validators | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      document.title = 'Validators | Oasis Monitor';
      next();
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import(/* webpackChunkName: "stats" */ '../views/Stats.vue'),
    meta: {
      title: 'Stats | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      document.title = 'Stats | Oasis Monitor';
      next();
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/NotFound.vue'),
    meta: {
      title: '404 | Oasis Monitor',
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
