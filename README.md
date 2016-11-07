OpenSesame
==========

A Backbone.js and GeneHive based implementation of Boston University's openSESAME. 
It's severely dependent on GeneHive's REST API and won’t do much but look pretty without it.
Stay tuned for the GeneHive release and more updates

1) Create the opens sesame job via curl:  
`curl -T sesame.sh "http://localhost:18080/hive/JobTypes/sesame-2.0` with the json body  
2) Add the R helper files:  
   `curl -T step1.R "http://localhost:18080/hive/JobTypes/sesame-0.4/Helpers/step1.R" -uroot:qwor -v`  
   `curl -T step2.R "http://localhost:18080/hive/JobTypes/sesame-0.4/Helpers/step2.R" -uroot:qwor -v`  
3) Add the python helper file:   
   `curl -T to_json.py "http://localhost:18080/hive/JobTypes/sesame-0.4/Helpers/to_json.py" -uroot:qwor -v`  
