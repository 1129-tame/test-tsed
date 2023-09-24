#!/bin/sh
# Wait for MongoDB to be ready
until nc -z mongotest 27017; do
    echo "Waiting for MongoDB 1..."
    sleep 1
done

# Run MongoDB initialization
echo "Initializing MongoDB replica set..."
mongo --host mongotest:27018 --eval 'rs.initiate({_id: "mongo-rs", members: [{_id: 0, host: "mongotest:27018"}]});'
