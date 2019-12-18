const state = {
  vin: 'WUNURBL30KL000110',
  rid: 'vehicle:unu:ownerapp-test:WUNURBL30KL000110',
  currentMode: 'off', // off, off-locked, off-unlocked, on, locking, unlocking, driving, updating, restarting
  modeStatus: 'idle', // idle, pending
  availability: false, // false, true
  batteries: [{ charge: undefined, serialNumber: 0 }],
  location: undefined,
  modeTimeout: 0,
  scooterDisconnected: false,
  navigation: {
    status: {
      value: 'idle', // 'idle', 'en-route', 'arrived'
      updatedAt: ''
    },
    profile: {
      value: 'driving', // 'driving', 'driving-traffic', 'cycling' - will be used for mapbox route
      updatedAt: ''
    },
    destination: {
      location: [], //[13.4296183671398, 52.555823536469966]
      address: '',
      updatedAt: ''
    }
  }
}

const actions = {

  async setCurrentScooter({ actions, mutations }, scooterData = {}) {
    // some namings for app's scooter's properties are different than scooterData's
    scooterData.currentMode = scooterData.mode
    delete scooterData.mode
    scooterData.location = scooterData.loc
    delete scooterData.loc

    const availabilityIsValid = typeof (scooterData.online != 'undefined')
    if (availabilityIsValid) {
      scooterData.availability = scooterData.online
      delete scooterData.online
    }

    mutations.SET_SCOOTER({ ...scooterData })
  },

  async updateCurrentScooter({ mutations, state }, scooterData = {}) {
    console.log('aaaaaa', state.scooter.vin)
    console.log('aaaaaa', scooterData.vin)
    if (state.scooter && state.scooter.vin == scooterData.vin) {
      console.log('helloooo')
      // Only update if the value is there
      scooterData.mode && mutations.SET_CURRENT_MODE(scooterData.mode)
      scooterData.modeStatus && mutations.SET_MODE_STATUS(scooterData.modeStatus)
      typeof (scooterData.online != 'undefined') && mutations.SET_AVAILABILITY(scooterData.online)
      scooterData.batteries && mutations.SET_BATTERY_CHARGE_ARRAY(scooterData.batteries)
      scooterData.loc && mutations.SET_LOCATION(scooterData.loc)

      if (scooterData.navigation) {
        const { status, profile, destination } = scooterData.navigation
        status && mutations.SET_NAVIGATION_STATUS(status)
        profile && mutations.SET_NAVIGATION_PROFILE(profile)
        destination && mutations.SET_NAVIGATION_DESTINATION(destination)
      }
    }
  },

  async setCurrentMode({ mutations }, targetMode) {
    mutations.SET_CURRENT_MODE(targetMode)
  },

  setModeStatus({ mutations }, modeStatus) {
    mutations.SET_MODE_STATUS(modeStatus)
  },

  setAvailability({ mutations }, availability) {
    mutations.SET_AVAILABILITY(availability)
  }
}

const mutations = {
  SET_SCOOTER({ state }, scooter) {
    state.scooter = scooter
  },
  SET_BATTERY_CHARGE_ARRAY({ state }, batteries) {
    const oldChargeArray = state.scooter.batteries.map(({ charge, serialNumber }) => `${charge}-${serialNumber}`)
    const newChargeArray = batteries.map(({ charge, serialNumber }) => `${charge}-${serialNumber}`)

    // do not assign if the battery values didn't change
    // regie thinks array changed
    if (oldChargeArray.join('-') == newChargeArray.join('-')) return
    state.scooter.batteries = batteries
  },
  SET_CURRENT_MODE({ state }, currentMode) {
    state.scooter.currentMode = currentMode
  },
  SET_MODE_STATUS({ state }, modeStatus) {
    state.scooter.modeStatus = modeStatus
  },
  SET_AVAILABILITY({ state }, availability) {
    console.log('SET_AVAILABILITY from: ', state.scooter.availability, ' to: ', availability)
    state.scooter.availability = availability
  },
  SET_LOCATION({ state }, location) {
    state.scooter.location = location
  },
  SET_NAVIGATION({ state }, navigation) {
    state.scooter.navigation = navigation
  },
  SET_NAVIGATION_STATUS({ state }, navigationStatus) {
    state.scooter.navigation.status = navigationStatus
  },
  SET_NAVIGATION_DESTINATION({ state }, navigationDestination) {
    state.scooter.navigation.destination = navigationDestination
  },
  SET_NAVIGATION_PROFILE({ state }, navigationProfile) {
    state.scooter.navigation.profile = navigationProfile
  }
}

module.exports = {
  state,
  actions,
  mutations
}
