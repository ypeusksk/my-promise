import Promise from './promise'

const log = console.log

new Promise((resolve, reject) => {
  resolve()
}).then(() => {
  return new Promise(function(resolve, reject) {
    resolve(888)
  })
}).then(value => log(value), error => {
  log(error)
})

new Promise((resolve, reject) => {
  resolve('resolve')
}).then(null, error => {}).then(value => {
  log(value)
})

new Promise((resolve, reject) => {
  reject('reject')
}).catch(value => {
  log('error:', value)
}).then(() => {log('end')})
