
const msgpackLite = require('./msgpack-lite')

const msgpack5 = require('./msgpack5')

const buffered = require('./buffered')

async function run() {
  await msgpackLite()
  await msgpack5()
  await buffered()
}

run().catch(err => {
  console.error(err)
})
