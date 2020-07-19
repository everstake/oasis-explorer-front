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
    path: '/operations',
    name: 'operations',
    component: () => import(/* webpackChunkName: "operations" */ '../views/Operations.vue'),
    meta: {
      title: 'Operations | Oasis Monitor',
    },
  },
  {
    path: '/operation/:id',
    name: 'operation',
    component: () => import(/* webpackChunkName: "operation" */ '../views/Operation.vue'),
    meta: {
      title: 'Operation | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      if (from.params.id) {
        document.title = `Operation ${String(from.params.id).slice(0, 7)} | Oasis Monitor`;
      } else {
        document.title = 'Operation | Oasis Monitor';
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
    path: '/validator/:id',
    name: 'validator',
    component: () => import(/* webpackChunkName: "validator" */ '../views/Validator.vue'),
    meta: {
      title: 'Validator | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      if (from.params.id) {
        document.title = `Validator ${from.params.id.slice(0, 7)} | Oasis Monitor`;
      } else {
        document.title = 'Validator | Oasis Monitor';
      }
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
    path: '/resources',
    name: 'resources',
    component: () => import(/* webpackChunkName: "stats" */ '../views/Resources.vue'),
    meta: {
      title: 'Resources | Oasis Monitor',
    },
    beforeEnter(from, to, next) {
      document.title = 'Resources | Oasis Monitor';
      next();
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/Error.vue'),
    meta: {
      errorStatus: 404,
      title: '404 | Oasis Monitor',
    },
  },
  {
    path: '/503',
    name: '503',
    component: () => import(/* webpackChunkName: "503" */ '../views/Error.vue'),
    meta: {
      errorStatus: 503,
      title: '503 | Oasis Monitor',
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
