#!/bin/bash

reglas=$(ufw status | grep "DENY");

for regla in $reglas; do
    if [[ $regla =~ ([0-9]*)\.([0-9]*)\.([0-9]*)\.([0-9]*) ]]; then
        ufw delete deny from $regla;
    fi
done