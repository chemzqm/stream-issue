const msgpack = require('msgpack-lite')
const fs = require('fs')
const net = require('net')
const path = require('path')
const socketPath = '/tmp/msgpack-lite'
try {
  fs.unlinkSync(socketPath)
} catch (e) {}

const file = path.join(__dirname, 'data.msp')
const readStream = fs.createReadStream(file, {
  highWaterMark: 1024*1024
});

const server = net.createServer(conn => {
  readStream.pipe(conn)
})

server.on('error', err => {
  throw err
})

server.listen({path:socketPath})

module.exports = function () {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({
      path:socketPath
    })

    const decodeStream = msgpack.createDecodeStream({
      objectMode: true
    })

    console.log('Testing msgpack-lite stream with 2.2M data')
    let ts = Date.now()
    client.pipe(decodeStream)
    client.on('end', () => {
      server.close()
      resolve()
    })
    client.on('error', reject)
    decodeStream.on('data', obj => {
      console.log(`msgpack-lite time costed: ${Date.now() - ts}ms`)
    })
  })
}
