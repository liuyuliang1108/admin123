import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 * @param purview
 */
function hasPermission(roles, route, purview) {
  if (route.meta && route.meta.code) {
    return purview.indexOf(route.meta.code) + 1
  } else {
    if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta.roles.includes(role))
    } else {
      return true
    }
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 * @param purview
 */

export function filterAsyncRoutes(routes, roles, purview) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp, purview)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, purview)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {

  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      let accessedRoutes
      const { roles, purview } = data
      const purview_arr = purview.split(',')
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, purview_arr)

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
