const regie = require('.')
const scooter = require('./scooter')

const initialState = {
  navigation: { status: { value:2 }, somethingelse: {value: 'mehmet'}},
  permission: { location: false },
  scooter: scooter.state
}

const { state, actions, observe } = regie({ 
    initialState,
    actions: {
      ...scooter.actions
    },
    mutations: {
      ...scooter.mutations,
    }
  }, 
  { deep: true }
  )

// observe('navigation.status.value', (newValue, change) => {
//   console.log('ust', 'nv', newValue, 'c', change.newValue, '====')
// })

// observe('navigation.status', (newValue, change) => {
//   console.log('alt', 'nv', newValue, 'c', change.newValue, '===')
// })

// observe('navigation', (navigation, change) => {
//   console.log('alt', 'nv', navigation, 'c', change.property, change.newValue, '===')
// })

observe('navigation', ({ status, somethingelse }, change) => {
  console.log('alt', 'nv', status, somethingelse, 'c', change.property, change.newValue, '===')
})
         

observe('scooter', (scooter, change) => {
  console.log('scooter observe change property', change.property)
  // console.log('scooter availability', scooter.availability)
  // console.log('scooter batteries', scooter.batteries)
})

// observe('scooter', ({ availability, batteries, currentMode }, change) => {
//   console.log('scooter availability observe change property', change.property)
//   // console.log('scooter availability', availability)
//   // console.log('scooter batteries', batteries)
//   // console.log('scooter currentMode', currentMode)
// })

// const scooterData = {"_id":"5c9b9a130f7517001695b2b6","vin":"WUNURBL30KL000110","online":false,"mode":"on","batteries":[{"charge":43,"connected":true,"isActive":false,"lastSeen":"2019-12-16T17:10:49.980Z","serialNumber":"0","temperature":[]},{"charge":56,"connected":true,"isActive":false,"lastSeen":"2019-12-16T17:10:49.980Z","serialNumber":"1","temperature":[]}],"auxiliaryBattery":{"charge":0},"hardwareState":{"kickstandOpen":false},"fleet":{"rid":"fleet:unu:ownerapp-test","key":"unu:ownerapp-test","type":"private"},"lastSeen":"2019-12-18T10:43:05.400Z","lastCommand":{"email":"mihri@unumotors.com","profile":{"firstName":"Mihriban","lastName":"Minaz","fullName":"Mihriban Minaz"},"sentAt":"2019-12-18T10:24:10.135Z","requestId":"f3a3719c-c76e-4bda-bd9c-a873a937f785"},"rid":"vehicle:unu:ownerapp-test:WUNURBL30KL000110","id":"5c9b9a130f7517001695b2b6","conditions":[]}
// actions.setCurrentScooter(scooterData)
// 
const scotoerData2 = {"_id":"5c9b9a130f7517001695b2b6","vin":"WUNURBL30KL000110","online":true,"mode":"on","batteries":[{"charge":55,"connected":true,"isActive":false,"lastSeen":"2019-12-16T17:10:49.980Z","serialNumber":"0","temperature":[]},{"charge":90,"connected":true,"isActive":false,"lastSeen":"2019-12-16T17:10:49.980Z","serialNumber":"1","temperature":[]}],"auxiliaryBattery":{"charge":0},"hardwareState":{"kickstandOpen":false},"fleet":{"rid":"fleet:unu:ownerapp-test","key":"unu:ownerapp-test","type":"private"},"lastSeen":"2019-12-18T10:43:05.400Z","lastCommand":{"email":"mihri@unumotors.com","profile":{"firstName":"Mihriban","lastName":"Minaz","fullName":"Mihriban Minaz"},"sentAt":"2019-12-18T10:24:10.135Z","requestId":"f3a3719c-c76e-4bda-bd9c-a873a937f785"},"rid":"vehicle:unu:ownerapp-test:WUNURBL30KL000110","id":"5c9b9a130f7517001695b2b6","conditions":[]}
actions.updateCurrentScooter(scotoerData2)

// state.scooter.availability = true

// state.permission.location = true
// state.permission.location = false
// state.navigation.status = { value:3 }
// state.navigation.status = { value:4 }
// state.navigation.status.value = 9
// state.navigation.somethingelse.value = 'ayse'
// state.permission.location = false

// state.permission = {location: false}

