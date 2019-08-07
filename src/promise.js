const toString = Object.prototype.toString
const isFunction = func => toString.call(func) === '[object Function]'
const isPromise = obj => obj instanceof Promise
const PENDING = Symbol('pending'), FULFILLED = Symbol('fulfilled'), REJECTED = Symbol('rejected')

const Promise = function () {
  this.status = PENDING
  // 状态变更时留下的value
  this.value = null
  this.thens = []
}

Promise.prototype.then = function (successFunc, errorFunc) {
  const nextPromise = new Promise()
  this.thens.push({successFunc, errorFunc, nextPromise})
  this.status !== PENDING && this.notify(this.status, this.value)
  return nextPromise
}

Promise.prototype.catch = function (errorFunc) {
  return this.then(null, errorFunc)
}

Promise.prototype.finally = function (func) {
  return this.then(func, func)
}

Promise.prototype.notify = function (status, value) {
  if (status === PENDING) return
  const { thens } = this
  
  setTimeout(function () {
    while (thens.length) {
      const { successFunc, errorFunc, nextPromise } = thens.shift()
      const targetFunc = status === FULFILLED ? successFunc : errorFunc
      const isResolveOrReject = status === FULFILLED ? resolve : reject
      
      if (isFunction(targetFunc)) {
        const res = targetFunc(value)
        if (isPromise(res)) {
          res.then(v1 => {
            resolve.call(nextPromise, v1)
          }, v2 => {
            reject.call(nextPromise, v2)
          })
        } else if (res instanceof Error) {
          reject.call(nextPromise, res)
        } else {
          resolve.call(nextPromise, res)
        }
      } else {
        isResolveOrReject.call(nextPromise, value)
      }
    }
  }, 0)
}

const resolve = function (value) {
  let target = this instanceof Promise ? this : new Promise()
  if (target.status !== PENDING) return target;
  target.status = FULFILLED
  target.value = value
  target.thens.length && target.notify(target.status, target.value)
  return target
}

const reject = function (value) {
  let target = this instanceof Promise ? this : new Promise()
  if (target.status !== PENDING) return target
  target.status = REJECTED
  target.value = value
  target.thens.length && target.notify(target.status, target.value)
  return target
}

const WrapPromise = function (func) {
  const promise = new Promise()
  func(resolve.bind(promise), reject.bind(promise))
  return promise
}

WrapPromise.resolve = resolve
WrapPromise.reject = reject

export default WrapPromise
