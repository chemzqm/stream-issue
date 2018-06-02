# stream-issue

Msgpack stream could be really slow when working with stream that emit small
chunks of data (8kb) from time to time.

It could take more than 30s for transfer a 7M large of data through socket and
then pipe to msgpack stream.

Msgpack stream works well with readable stream that have high `highWaterMark`,
but the socket in NodeJS (at least v10.3.0) have no way to change that value,
which means it always emit data no larger than 8kb.

The solution is use a transform stream in the middle, it holds the chunks if
chunk size bigger or equal to 8kb and emit the saved chunks once received
chunk is smalled than 8kb or after a timeout.

## Test

Clone this repo and run:

    npm install
    npm run start

## Result

    ❯ node -v
    v10.3.0
    ❯ node index.js
    Testing msgpack-lite stream with 2.2M data
    msgpack-lite time costed: 4473ms
    Testing msgpack5 stream with 2.2M data
    msgpack5 time costed: 11216ms
    Testing msgpack-lite with buffered stream with 2.2M data
    msgpack-lite with buffered time costed: 59ms

For a 7M large file, it could be more than 200 times faster by using the
buffered stream.
