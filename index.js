const slim = require('observable-slim')
const EventEmitter = require('events')
const get = require('lodash.get')
const register = require('./lib/register')

module.exports = ({ initialState = {}, actions = {}, mutations = {} } = {}) => {
  const bus = new EventEmitter()

  const state = slim.create(initialState, false, (changes) => {
    changes.forEach(change => {
      if (change.type == 'update' &&
      change.property == 'length' &&
      Array.isArray(change.target) &&
      change.target.length == change.newValue) {
        return
      }

      const paths = change.currentPath.split('.')
      while (paths.length) {
        const path = paths.join('.')
        if (path in bus._events) {
          bus.emit(path, get(state, path), change)
        }

        paths.pop()
      }

      bus.emit('root', state, change)
    })
  })

  function observeLater (mapper, handler) {
    let off

    function observer (value, change) {
      let val
      try {
        val = mapper(state)
      } catch (e) {
        // a previously known and watched value (and its parent) is probably deleted
        // so call the handler with value undefined and update lastValue to undefined.
        if (typeof mapper.lastValue != 'undefined') handler(undefined, change)
        mapper.lastValue = undefined
        return
      }

      if (typeof val != 'undefined' && val.__getPath) {
        bus.removeListener('root', observer)
        handler(mapper(state), change)
        off = observe(mapper, handler)
      } else if (typeof val != 'undefined') {
        if (typeof mapper.lastValue == 'undefined' || mapper.lastValue != val) {
          handler(val, change)
        }

        mapper.lastValue = val
      } else if (typeof mapper.lastValue != 'undefined' && typeof val == 'undefined') {
        handler(undefined, change)
        mapper.lastValue = undefined
      }
    }

    bus.on('root', observer)
    off = () => bus.removeListener('root', observer)
    return () => off()
  }

  function observe (mapper, handler) {
    let mapperFn = mapper
    if (typeof mapper != 'function' && typeof mapper != 'string') mapperFn = () => mapper

    if (typeof mapper == 'string') {
      mapperFn = () => get(state, mapper)
    }

    let val

    try {
      val = mapperFn()
    } catch (e) {
      return observeLater(mapperFn, handler)
    }

    mapperFn.lastValue = val

    if (typeof val != 'undefined' && val.__getPath) {
      bus.on(val.__getPath, handler)
      return () => bus.removeListener(val.__getPath, handler)
    }

    return observeLater(mapperFn, handler)
  }

  const boundRegister = register(observe)
  const boundActions = {}
  const boundMutations = {}

  const store = {
    state,
    observe,
    actions: boundActions,
    mutations: boundMutations
  }

  Object.keys(actions).forEach(key => {
    boundActions[key] = actions[key].bind(store, { actions: boundActions, mutations: boundMutations, state })
  })

  Object.keys(mutations).forEach(key => {
    boundMutations[key] = mutations[key].bind(store, { mutations: boundMutations, state })
  })

  return {
    ...store,
    $$register: boundRegister
  }
}
