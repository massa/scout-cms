import Vue from 'vue'
import Router from 'vue-router'
import menuModule from 'vuex-store/modules/menu'

import auth from '../auth'

Vue.use(Router)

// Menu should have 2 levels.
const generateRoutesFromMenu = (menu = [], routes = []) => {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}

const appRouter = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'Auth',
      path: '/auth',
      component: require('../views/Auth')
    },
    {
      name: 'Home',
      path: '/',
      component: require('../views/Home')
    },
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: '/'
    }
  ]
})

appRouter.beforeEach((to, from, next) => {
  // If not authenticated and trying to see anything but auth, deny it.
  if (to.name !== 'Auth' && !auth.user.authenticated) {
    next({ path: '/auth' })
  // And if authenticated, don't show the auth page
  } else if (to.name === 'Auth' && auth.user.authenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default appRouter
