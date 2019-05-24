#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE uaa OWNER postgres;
    \connect uaa;
    CREATE SCHEMA IF NOT EXISTS xm;
    CREATE DATABASE dashboard OWNER postgres;
    \connect dashboard;
    CREATE SCHEMA IF NOT EXISTS xm;
    CREATE DATABASE entity OWNER postgres;
    \connect entity; 
    CREATE SCHEMA IF NOT EXISTS xm;
    CREATE DATABASE balance OWNER postgres;
    \connect balance;
    CREATE SCHEMA IF NOT EXISTS xm;
    CREATE DATABASE timeline OWNER postgres;
    \connect timeline;
    CREATE SCHEMA IF NOT EXISTS xm;
EOSQL
