#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE uaa OWNER postgres;
    CREATE DATABASE dashboard OWNER postgres;
    CREATE DATABASE entity OWNER postgres;
    CREATE DATABASE balance OWNER postgres;
    CREATE DATABASE timeline OWNER postgres;
EOSQL
