#!/bin/bash
dirs=( opername refermd refuabmd icd9 clinstg typeins surgloc surgmd mdoncloc medoncmd radonloc radoncmd plsurloc plsurgmd bmtloc bmtmd dentloc dentmd othloc othmd txplan uabprtcl )

for i in "${dirs[@]}"
do
    mkdir views/autofill_$i
    echo "function(doc){if(doc.type === 'data_management_form' && !doc.deleted && doc.$i){emit(doc.$i, null);}}" > views/autofill_$i/map.js
    echo "_count" > views/autofill_$i/reduce.js
done
